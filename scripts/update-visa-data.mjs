#!/usr/bin/env node
/**
 * 외교부_국가·지역별 입국허가요건 (ODcloud 파일데이터 API) → TS 스냅샷 생성.
 *
 * 실행: node --env-file=.env scripts/update-visa-data.mjs
 * 갱신 주기 권장: 1~2개월.
 * 데이터 출처: 공공데이터포털 dataset 15076574 (외교부_국가·지역별 입국허가요건_20250120)
 */

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const API_KEY = process.env.VITE_DATA_GO_KR_API_KEY;
if (!API_KEY) {
  console.error(
    "[update-visa-data] VITE_DATA_GO_KR_API_KEY 환경변수가 필요합니다.",
  );
  process.exit(1);
}

const ENDPOINT =
  "https://api.odcloud.kr/api/15076574/v1/uddi:85aee122-3529-4cfe-b790-ae6ceae0fd50";
const OUT_PATH = resolve("src/shared/data/visaRequirements.generated.ts");
const REGIONS_PATH = resolve("src/shared/data/regions.ts");

// regions.ts 의 `countries: Country[] = [...]` 섹션만 안전하게 파싱.
// Country 항목 형태: `{ id: "...", name: "...", englishName: "...", code: "XX", flag: "...", regions: [...] }`
function buildNameToCodeMap() {
  const src = readFileSync(REGIONS_PATH, "utf8");
  const startIdx = src.indexOf("countries: Country[]");
  if (startIdx < 0) throw new Error("regions.ts countries 배열을 찾지 못함");
  const countrySection = src.slice(startIdx);
  const map = new Map();
  const re =
    /id:\s*"[^"]+",\s*name:\s*"([^"]+)",\s*englishName:\s*"[^"]+",\s*code:\s*"([A-Z]{2})"/g;
  let m;
  while ((m = re.exec(countrySection)) !== null) {
    map.set(m[1], m[2]);
  }
  return map;
}

// 외교부 공공데이터 국가명 ↔ regions.ts 국가명 정합 보정.
// key: 외교부에서 쓰는 이름, value: ISO alpha-2.
const NAME_ALIASES = {
  미국: "US",
  미합중국: "US",
  영국: "GB",
  그레이트브리튼북아일랜드연합왕국: "GB",
  러시아: "RU",
  러시아연방: "RU",
  튀르키예: "TR",
  튀르키예공화국: "TR",
  네팔: "NP",
  네팔연방: "NP",
  키르기스스탄: "KG",
  키르기즈공화국: "KG",
  뉴질랜드: "NZ",
  마카오: "MO",
  이란: "IR",
  시리아: "SY",
};

function buildUrl(page, perPage) {
  return `${ENDPOINT}?page=${page}&perPage=${perPage}&serviceKey=${API_KEY}`;
}

async function fetchPage(page, perPage = 1000) {
  const res = await fetch(buildUrl(page, perPage));
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `HTTP ${res.status} ${res.statusText}\n응답 앞부분: ${body.slice(0, 500)}`,
    );
  }
  return res.json();
}

/**
 * 비고/근거 텍스트에서 일반여권 부분만 추출.
 */
function extractOrdinaryPassportNote(rawNote) {
  if (!rawNote) return null;
  const text = String(rawNote).trim();
  if (!text) return null;

  // "일반여권 소지자 :" 또는 "일반여권소지자 :" 마커 이후만 추출
  const marker = text.match(/일반\s*여권\s*소지자\s*[:：]\s*/);
  if (marker) {
    const after = text.slice(marker.index + marker[0].length).trim();
    // 선행 불릿/기호 제거
    const cleaned = after.replace(/^[·•・\-\s]+/, "").trim();
    return cleaned || null;
  }

  // 외교관/관용 마커만 있고 일반 마커가 없으면 우리에겐 무관 → null
  if (/외교관\s*여권|관용\s*여권/.test(text)) return null;

  return text;
}

/**
 * 외교부 공공데이터 필드 semantic (샘플로 검증됨):
 *   - 여부=Y & 기간="N일" (단독) → 무사증 N일 가능 → required=false
 *   - 여부=Y & 기간="X"         → 사증 취득 후 입국 → required=true
 *   - 여부=Y & 기간=긴 설명문   → 조건부 무사증(예: 中 하이난) → 보수적으로 required=true
 *   - 여부=N                    → 입국 제한 → required=true
 */
function parseVisaRequirement(entryFlag, periodRaw) {
  const rawText = periodRaw == null ? "" : String(periodRaw).trim();

  if (entryFlag === "N") return { required: true, stayDays: null, rawText };
  if (entryFlag !== "Y") return { required: null, stayDays: null, rawText };

  if (rawText === "" || rawText === "X" || rawText === "-") {
    return { required: true, stayDays: null, rawText };
  }

  // 짧은 "N일/N개월/N년" 형식 → 무사증 기간으로 인정.
  // 뒤에 쉼표+꼬리말("일방", "상호주의" 등)이 붙어도 허용.
  // 한글은 JS regex \b 동작 안 하므로 [^\d]*$ 로 trailing 검사.
  // ex: "90일", "6개월", "365일, 일방", "1년"
  const shortPeriodMatch = rawText.match(
    /^\s*(?:무사증\s*)?(\d+)\s*(일|개월|달|년)[^\d]*$/,
  );
  if (shortPeriodMatch) {
    const n = parseInt(shortPeriodMatch[1], 10);
    const unit = shortPeriodMatch[2];
    const stayDays = unit === "일" ? n : unit === "년" ? n * 365 : n * 30; // 개월/달
    return { required: false, stayDays, rawText };
  }

  // 긴 조건부 텍스트는 비자 필요로 취급
  return { required: true, stayDays: null, rawText };
}

async function main() {
  console.log("[update-visa-data] 한글명→ISO 매핑 로드...");
  const nameToCode = buildNameToCodeMap();
  for (const [k, v] of Object.entries(NAME_ALIASES)) nameToCode.set(k, v);
  console.log(`  ${nameToCode.size}개 국가 매핑 확보`);

  console.log("[update-visa-data] 첫 페이지 조회...");
  const first = await fetchPage(1, 1000);
  const items = Array.isArray(first?.data) ? first.data : [];
  if (items.length === 0) {
    console.error("[update-visa-data] data[] 비어있음. 원본:");
    console.error(JSON.stringify(first, null, 2).slice(0, 2000));
    process.exit(1);
  }

  const totalCount = first.totalCount ?? items.length;
  const perPage = 1000;
  const totalPages = Math.max(1, Math.ceil(Number(totalCount) / perPage));
  const all = [...items];
  for (let p = 2; p <= totalPages; p++) {
    const payload = await fetchPage(p, perPage);
    all.push(...(Array.isArray(payload?.data) ? payload.data : []));
  }
  console.log(`  수집 ${all.length}건 (totalCount=${totalCount})`);

  // 핵심 국가 semantic 검증용 로그
  const verifyNames = [
    "일본",
    "대만",
    "베트남",
    "태국",
    "중국",
    "가나",
    "미국",
    "프랑스",
  ];
  console.log("\n[update-visa-data] semantic 검증용 샘플:");
  for (const name of verifyNames) {
    const row = all.find((x) => x["국가"] === name);
    if (row) {
      console.log(
        `  ${name}: 여부=${row["일반여권소지자 - 입국가능여부"]}, 기간=${row["일반여권소지자 - 입국가능기간"]}, 비고=${row["비고"] ?? "-"}`,
      );
    }
  }
  console.log("");

  const records = {};
  const unmapped = [];
  for (const item of all) {
    const koreanName = String(item["국가"] ?? "").trim();
    const code = nameToCode.get(koreanName);
    if (!code) {
      unmapped.push(koreanName);
      continue;
    }
    const entryFlag = item["일반여권소지자 - 입국가능여부"];
    const periodRaw = item["일반여권소지자 - 입국가능기간"];
    const parsed = parseVisaRequirement(entryFlag, periodRaw);

    // 비고/근거 텍스트에서 일반여권 부분만 추출 (외교관/관용여권 제거)
    const rawNote =
      (item["비고"] ? String(item["비고"]).trim() : "") ||
      (item["무비자 입국 근거"] ? String(item["무비자 입국 근거"]).trim() : "");
    const note = extractOrdinaryPassportNote(rawNote);

    records[code] = {
      required: parsed.required,
      stayDays: parsed.stayDays,
      rawText: parsed.rawText,
      note,
    };
  }

  console.log(
    `[update-visa-data] ${Object.keys(records).length}개 국가 매핑 성공`,
  );

  // regions.ts 에 있지만 API 데이터에선 매칭 안된 국가 → alias 필요 후보
  const apiNames = new Set(all.map((x) => String(x["국가"] ?? "").trim()));
  const missingFromApi = [];
  for (const [koreanName, code] of nameToCode.entries()) {
    if (code === "KR") continue;
    if (!records[code] && !apiNames.has(koreanName)) {
      missingFromApi.push(`${koreanName}(${code})`);
    }
  }
  if (missingFromApi.length > 0) {
    console.warn(
      `\n[update-visa-data] regions.ts 엔 있지만 API 데이터에 없는 국가 ${missingFromApi.length}건 (alias 필요):`,
    );
    console.warn("  " + missingFromApi.join(", "));

    // 각 누락 국가별로 외교부 API 국가명 후보(첫 글자 기준 fuzzy) 제안
    console.warn("\n[update-visa-data] 외교부 API 국가명 후보(첫 글자 기준):");
    const firstChars = new Set(
      missingFromApi.map((s) => s.match(/^(.)/)?.[1]).filter(Boolean),
    );
    const sorted = [...all]
      .map((x) => String(x["국가"] ?? "").trim())
      .filter(Boolean)
      .sort();
    for (const ch of firstChars) {
      const candidates = sorted.filter((n) => n.startsWith(ch));
      if (candidates.length > 0) {
        console.warn(`  '${ch}'로 시작: ${candidates.join(", ")}`);
      }
    }
  }

  const fetchedAt = new Date().toISOString();
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, renderTsFile(records, fetchedAt), "utf8");
  console.log(`[update-visa-data] → ${OUT_PATH}`);
}

function renderTsFile(records, fetchedAt) {
  const sorted = Object.keys(records).sort();
  const entries = sorted
    .map((code) => `  ${code}: ${JSON.stringify(records[code])},`)
    .join("\n");

  return `// AUTO-GENERATED by scripts/update-visa-data.mjs — 수동 편집 금지.
// 수동 보강은 visaRequirements.ts 에서 관리.
// 출처: 공공데이터포털 - 외교부_국가·지역별 입국허가요건 (dataset 15076574)
// Fetched at: ${fetchedAt}

export interface VisaRequirement {
  /** 일반여권 기준 비자 필요 여부. null = 판정 불가 */
  required: boolean | null;
  /** 무사증 체류 가능 일수. null = 해당 없음 */
  stayDays: number | null;
  /** 외교부 원문(일반여권소지자 - 입국가능기간) */
  rawText: string;
  /** 비고 또는 무비자 입국 근거 (일반여권 부분만) */
  note: string | null;
}

export const GENERATED_VISA_REQUIREMENTS: Record<string, VisaRequirement> = {
${entries}
};

export const VISA_DATA_FETCHED_AT = "${fetchedAt}";
`;
}

main().catch((err) => {
  console.error("[update-visa-data] 실패:", err);
  process.exit(1);
});

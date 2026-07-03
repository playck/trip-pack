// 공공데이터포털(data.go.kr) 공용 클라이언트 — 항공편·주차장 등 인천공항(B551177) API가 공유
const API_KEY = import.meta.env.VITE_DATA_GO_KR_API_KEY || "";

interface DataGoKrHeader {
  resultCode: string;
  resultMsg: string;
}

interface DataGoKrEnvelope<TBody> {
  response?: {
    header?: DataGoKrHeader;
    body: TBody;
  };
  // 일부 게이트웨이(신형 GW)는 response 래퍼 없이 header/body를 바로 반환
  header?: DataGoKrHeader;
  body?: TBody;
}

interface FetchOptions {
  label?: string;
  signal?: AbortSignal;
}

// 게이트웨이는 키 오류·쿼터 초과 시 type=json을 요청해도 HTTP 200 + XML(OpenAPI_ServiceResponse)을
// 반환하므로, JSON 파싱과 envelope 접근을 모두 방어적으로 처리한다.
export const fetchDataGoKr = async <TBody>(
  baseUrl: string,
  params: Record<string, string | number>,
  { label = "공공데이터", signal }: FetchOptions = {},
): Promise<TBody> => {
  if (!API_KEY) {
    throw new Error(
      "공공데이터 API 키가 설정되지 않았습니다. VITE_DATA_GO_KR_API_KEY를 확인해주세요.",
    );
  }

  // serviceKey는 이미 URL 인코딩된 값이므로 직접 쿼리스트링을 조합
  const queryParts = [
    `serviceKey=${API_KEY}`,
    "type=json",
    ...Object.entries(params).map(
      ([key, value]) => `${key}=${encodeURIComponent(String(value))}`,
    ),
  ];
  const url = `${baseUrl}?${queryParts.join("&")}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`${label} 조회 실패: ${res.status}`);
  }

  const text = await res.text();

  let data: DataGoKrEnvelope<TBody>;
  try {
    data = JSON.parse(text);
  } catch {
    const gatewayMsg = text.match(
      /<returnAuthMsg>([^<]*)<\/returnAuthMsg>/,
    )?.[1];
    throw new Error(
      `${label} 게이트웨이 오류: ${gatewayMsg || "응답이 JSON 형식이 아닙니다"}`,
    );
  }

  const response =
    data.response ??
    (data.header
      ? { header: data.header, body: data.body as TBody }
      : undefined);

  if (!response?.header) {
    throw new Error(`${label} 응답 형식이 올바르지 않습니다`);
  }

  if (response.header.resultCode !== "00") {
    throw new Error(`API 오류: ${response.header.resultMsg}`);
  }

  return response.body;
};

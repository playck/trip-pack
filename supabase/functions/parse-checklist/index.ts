const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const KNOWN_CATEGORIES = [
  "필수 준비물",
  "전자제품",
  "의류",
  "세면용품",
  "화장품",
  "상비약",
  "기타용품",
  "유아용품",
  "반려동물용품",
  "운동",
  "수영",
  "출장",
  "관광",
  "자연",
  "액티비티",
  "휴양",
  "문화",
  "쇼핑",
  "미식",
  "캠핑",
  "등산",
  "귀중품",
  "안전용품",
  "여름 준비물",
  "겨울 준비물",
  "우기/장마 대비",
];

const SYSTEM_PROMPT = `당신은 여행 준비물 텍스트를 구조화된 체크리스트로 변환하는 도우미입니다.

사용자가 입력한 자유 형식 텍스트를 분석해서 카테고리별로 아이템을 분류하세요.

사용 가능한 카테고리 목록:
${KNOWN_CATEGORIES.join(", ")}

규칙:
1. 위 카테고리 중 가장 적합한 것에 배치하세요.
2. 어디에도 맞지 않으면 "기타용품"에 넣으세요.
3. 아이템 이름은 간결하게 정리하세요 (예: "충전기 꼭 챙기기!!" → "충전기").
4. 수량이나 메모가 있으면 notes 필드에 넣으세요 (예: "양말 5켤레" → name: "양말", notes: "5켤레").
5. 빈 줄, 구분선, 제목 등 아이템이 아닌 텍스트는 무시하세요.
6. 중복 아이템은 제거하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{"categories": [{"categoryName": "카테고리명", "items": [{"name": "아이템명", "notes": "메모(선택)"}]}]}`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ParsedItem {
  name: string;
  notes?: string;
}

interface ParsedCategory {
  categoryName: string;
  items: ParsedItem[];
}

interface ParseResult {
  categories: ParsedCategory[];
}

function validateResult(data: unknown): data is ParseResult {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.categories)) return false;
  return obj.categories.every(
    (cat: unknown) =>
      typeof cat === "object" &&
      cat !== null &&
      typeof (cat as Record<string, unknown>).categoryName === "string" &&
      Array.isArray((cat as Record<string, unknown>).items),
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "텍스트를 입력해주세요." }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    if (text.length > 3000) {
      return new Response(
        JSON.stringify({
          error: "텍스트가 너무 깁니다. 3000자 이하로 입력해주세요.",
        }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return new Response(
        JSON.stringify({ error: "AI 처리 중 오류가 발생했습니다." }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("JSON parse failed:", rawText.slice(0, 500));
      return new Response(
        JSON.stringify({
          error: "텍스트를 분석할 수 없습니다. 다시 시도해주세요.",
        }),
        {
          status: 422,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    if (!validateResult(parsed)) {
      console.error("Schema validation failed:", JSON.stringify(parsed));
      return new Response(
        JSON.stringify({
          error: "텍스트를 분석할 수 없습니다. 다시 시도해주세요.",
        }),
        {
          status: 422,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    const result: ParseResult = {
      categories: (parsed as ParseResult).categories
        .map((cat) => ({
          categoryName: cat.categoryName,
          items: cat.items
            .filter((item) => item.name && item.name.trim().length > 0)
            .map((item) => ({
              name: item.name.trim(),
              ...(item.notes ? { notes: item.notes.trim() } : {}),
            })),
        }))
        .filter((cat) => cat.items.length > 0),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "서버 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});

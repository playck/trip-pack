import { supabase } from "@/shared/service/supabase/cilent";

export interface ParsedChecklistItem {
  name: string;
  notes?: string;
}

export interface ParsedChecklistCategory {
  categoryName: string;
  items: ParsedChecklistItem[];
}

export interface ParseChecklistResponse {
  categories: ParsedChecklistCategory[];
}

export async function parseChecklistText(
  text: string,
): Promise<ParseChecklistResponse> {
  const { data, error } = await supabase.functions.invoke("parse-checklist", {
    body: { text },
  });

  if (error) {
    throw new Error(error.message || "체크리스트 변환에 실패했습니다.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ParseChecklistResponse;
}

// FUTURE: 정규식 파서(utils/parseChecklistText)로 처리 안 되는 자유 형식 텍스트를
// LLM(Gemini Edge Function)으로 폴백 처리하기 위한 훅. 현재 미사용.
import { useMutation } from "@tanstack/react-query";
import {
  parseChecklistText,
  type ParseChecklistResponse,
} from "../services/parseChecklistApi";

export function useParseChecklistText() {
  return useMutation<ParseChecklistResponse, Error, string>({
    mutationFn: parseChecklistText,
  });
}

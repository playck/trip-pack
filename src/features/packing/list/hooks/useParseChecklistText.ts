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

import { supabase } from "@/shared/service/supabase/cilent";
import type { TablesInsert } from "@/shared/types/database.type";

export const getChecklistTemplate = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`인증 오류: ${authError.message}`);
  }

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabase
    .from("checklist_templates")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`체크리스트 템플릿 조회 실패: ${error.message}`);
  }

  return data;
};

export const createChecklistTemplate = async (
  template: TablesInsert<"checklist_templates">
) => {
  const { data, error } = await supabase
    .from("checklist_templates")
    .insert(template);

  if (error) {
    throw new Error(`체크리스트 템플릿 생성 실패: ${error.message}`);
  }

  return data;
};

export const deleteChecklistTemplate = async (id: string) => {
  const { error } = await supabase
    .from("checklist_templates")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`체크리스트 템플릿 삭제 실패: ${error.message}`);
  }
};

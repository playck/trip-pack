import { useEffect, useRef } from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { ErrorMessage } from "@/shared/components";
import { useInvitationInfo, useAcceptInvitation } from "./hooks/useInvitation";

export default function InviteAcceptPage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams({ from: "/invite/$inviteCode" });
  const { user, loading: authLoading } = useAuth();
  const hasAccepted = useRef(false);

  const {
    data: invitation,
    isLoading: inviteLoading,
    error: inviteError,
  } = useInvitationInfo(inviteCode);

  const acceptMutation = useAcceptInvitation();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate({
        to: "/auth/login",
        search: { returnTo: `/invite/${inviteCode}` },
      });
      return;
    }

    if (!invitation || hasAccepted.current) return;
    hasAccepted.current = true;

    acceptMutation.mutate(inviteCode, {
      onSuccess: (tripId) => {
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
        });
      },
      onError: () => {
        setTimeout(() => navigate({ to: "/main" }), 2000);
      },
    });
  }, [authLoading, user, invitation, inviteCode, acceptMutation, navigate]);

  if (authLoading || inviteLoading) {
    return (
      <VStack justify="center" h="60vh" gap={4}>
        <Spinner size="lg" />
        <Text color="gray.500">초대 정보를 확인하고 있어요...</Text>
      </VStack>
    );
  }

  if (inviteError) {
    return (
      <VStack justify="center" h="60vh">
        <ErrorMessage
          title="초대 링크 오류"
          message="유효하지 않거나 만료된 초대 링크입니다."
          centered
        />
      </VStack>
    );
  }

  if (acceptMutation.isError) {
    return (
      <VStack justify="center" h="60vh">
        <ErrorMessage
          title="참가 실패"
          message="여행에 참가할 수 없습니다. 잠시 후 다시 시도해주세요."
          centered
        />
      </VStack>
    );
  }

  return (
    <VStack justify="center" h="60vh" gap={4}>
      <Spinner size="lg" />
      <Text color="gray.600" fontWeight="medium">
        {invitation?.trips?.title ?? "여행"}에 참가하고 있어요...
      </Text>
    </VStack>
  );
}

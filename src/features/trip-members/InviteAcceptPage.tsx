import { useEffect, useRef, useState } from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { ErrorMessage } from "@/shared/components";
import { useAcceptInvitation } from "./hooks/useInvitation";

const SAFE_PATH_REGEX = /^[a-zA-Z0-9-]+$/;

export default function InviteAcceptPage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams({ from: "/invite/$inviteCode" });
  const { user, loading: authLoading } = useAuth();
  const hasAccepted = useRef(false);
  const [tripTitle, setTripTitle] = useState<string | null>(null);

  const acceptMutation = useAcceptInvitation();
  const acceptMutationRef = useRef(acceptMutation);
  acceptMutationRef.current = acceptMutation;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate({
        to: "/auth/login",
        search: {
          returnTo: SAFE_PATH_REGEX.test(inviteCode)
            ? `/invite/${inviteCode}`
            : "/main",
        },
      });
      return;
    }

    if (hasAccepted.current) return;
    hasAccepted.current = true;

    acceptMutationRef.current.mutate(inviteCode, {
      onSuccess: ({ tripId, tripTitle: title }) => {
        setTripTitle(title);
        if (!SAFE_PATH_REGEX.test(tripId)) {
          navigate({ to: "/main" });
          return;
        }
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, inviteCode]);

  if (authLoading) {
    return (
      <VStack justify="center" h="60vh" gap={4}>
        <Spinner size="lg" />
        <Text color="gray.500">초대 정보를 확인하고 있어요...</Text>
      </VStack>
    );
  }

  if (acceptMutation.isError) {
    return (
      <VStack justify="center" h="60vh">
        <ErrorMessage
          title="초대 링크 오류"
          message={acceptMutation.error.message}
          centered
        />
      </VStack>
    );
  }

  return (
    <VStack justify="center" h="60vh" gap={4}>
      <Spinner size="lg" />
      <Text color="gray.600" fontWeight="medium">
        {tripTitle ?? "여행"}에 참가하고 있어요...
      </Text>
    </VStack>
  );
}

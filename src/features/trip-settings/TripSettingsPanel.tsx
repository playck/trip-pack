import { useMemo, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useHistoryBack } from "@/shared/hooks";
import { useAuth } from "@/shared/hooks/useAuth";
import { TripSettingsDrawer } from "@/shared/components/trip-settings";
import { TripEditModal } from "@/shared/components/trip-action/TripEditModal";
import { TripDateEditModal } from "@/shared/components/trip-action/TripDateEditModal";
import { DeleteTripModal } from "@/shared/components/trip-action/DeleteTripModal";
import { useDeleteTrip } from "@/shared/service/trip/useDeleteTrip";
import { useUpdateTripImage } from "@/shared/service/trip/useUpdateTripImage";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import TripMemoSheet from "@/shared/components/trip-settings/TripMemoSheet";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";
import InviteSheet from "@/features/trip-members/components/InviteSheet";
import MemberListSheet from "@/features/trip-members/components/MemberListSheet";
import FlightSheet from "@/features/flight/FlightSheet";

interface TripSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export default function TripSettingsPanel({
  isOpen,
  onClose,
  tripId,
}: TripSettingsPanelProps) {
  useHistoryBack(isOpen, onClose);

  const { user } = useAuth();
  const { data: tripInfo } = useTripInfo(tripId);
  const { data: members, refetch: refetchMembers } = useTripMembers(tripId);
  // 제목·기간·이미지·삭제는 방장만 가능하다(DB 에서 강제). 일반 멤버에게는 항목 자체를 감춘다.
  const isOwner = useMemo(
    () => members?.find((m) => m.user_id === user?.id)?.role === "owner",
    [members, user?.id],
  );
  const { mutate: deleteTripMutate, isPending: isDeletePending } =
    useDeleteTrip();
  const { mutate: updateImageMutate, isPending: isImageUploading } =
    useUpdateTripImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editTitle = useDisclosure();
  const editDate = useDisclosure();
  const deleteTrip = useDisclosure();
  const membersSheet = useDisclosure();
  const invite = useDisclosure();
  const flightSheet = useDisclosure();
  const memoSheet = useDisclosure();
  // 삭제 모달의 '방장 넘기고 나가기'로 일행 목록을 열 때 새 방장 선택 단계부터 시작
  const [startTransferAndLeave, setStartTransferAndLeave] = useState(false);

  const openMembers = () => {
    setStartTransferAndLeave(false);
    membersSheet.onOpen();
  };

  // 삭제 가능 여부가 일행 수로 갈리므로, 5분 캐시가 아닌 최신 멤버 수로 판단한다
  const openDeleteTrip = () => {
    refetchMembers();
    deleteTrip.onOpen();
  };

  const handleTransferAndLeave = () => {
    deleteTrip.onClose();
    setStartTransferAndLeave(true);
    membersSheet.onOpen();
  };

  const handleDeleteTrip = () => {
    deleteTripMutate(tripId);
  };

  const handleOpenFlight = () => {
    flightSheet.onOpen();
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    updateImageMutate({
      tripId,
      userId: user.id,
      file,
      currentImageUrl: tripInfo?.imageUrl,
    });

    e.target.value = "";
  };

  return (
    <>
      <TripSettingsDrawer
        isOpen={isOpen}
        onClose={onClose}
        onOpenMembers={openMembers}
        onOpenInvite={invite.onOpen}
        onOpenEditTitle={editTitle.onOpen}
        onOpenEditDate={editDate.onOpen}
        isOwner={isOwner}
        onOpenDeleteTrip={openDeleteTrip}
        onOpenFlight={handleOpenFlight}
        onOpenMemo={memoSheet.onOpen}
        onChangeImage={handleChangeImage}
        isUploadingImage={isImageUploading}
        tripInfo={
          tripInfo
            ? {
                id: tripId,
                title: tripInfo.title || "여행",
                regionName: tripInfo.regionName,
                countryCode: tripInfo.countryCode,
                startDate: tripInfo.startDate,
                endDate: tripInfo.endDate,
                imageUrl: tripInfo.imageUrl,
              }
            : undefined
        }
        memberCount={members?.length ?? 0}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <TripEditModal
        isOpen={editTitle.open}
        onClose={editTitle.onClose}
        tripId={tripId}
        currentTitle={tripInfo?.title || "여행"}
      />

      <TripDateEditModal
        isOpen={editDate.open}
        onClose={editDate.onClose}
        tripId={tripId}
        tripTitle={tripInfo?.title || "여행"}
        currentStartDate={tripInfo?.startDate || ""}
        currentEndDate={tripInfo?.endDate || ""}
      />

      <DeleteTripModal
        isOpen={deleteTrip.open}
        onClose={deleteTrip.onClose}
        tripTitle={tripInfo?.title || "여행"}
        onDeleteTrip={handleDeleteTrip}
        isLoading={isDeletePending}
        memberCount={members?.length ?? 1}
        onTransferAndLeave={handleTransferAndLeave}
      />

      <InviteSheet
        isOpen={invite.open}
        onClose={invite.onClose}
        tripId={tripId}
        tripTitle={tripInfo?.title || tripInfo?.regionName || "여행"}
        inviterName={
          members?.find((m) => m.user_id === user?.id)?.profiles?.username ||
          user?.user_metadata?.username
        }
      />

      <MemberListSheet
        isOpen={membersSheet.open}
        onClose={membersSheet.onClose}
        tripId={tripId}
        startWithTransferAndLeave={startTransferAndLeave}
      />

      <FlightSheet
        isOpen={flightSheet.open}
        onClose={flightSheet.onClose}
        tripId={tripId}
        startDate={tripInfo?.startDate || ""}
        endDate={tripInfo?.endDate || ""}
      />

      <TripMemoSheet
        isOpen={memoSheet.open}
        onClose={memoSheet.onClose}
        tripId={tripId}
        currentMemo={tripInfo?.memo ?? null}
      />
    </>
  );
}

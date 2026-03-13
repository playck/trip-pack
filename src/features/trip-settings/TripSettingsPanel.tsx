import { useRef } from "react";
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
  const { data: members } = useTripMembers(tripId);
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
        onOpenMembers={membersSheet.onOpen}
        onOpenInvite={invite.onOpen}
        onOpenEditTitle={editTitle.onOpen}
        onOpenEditDate={editDate.onOpen}
        onOpenDeleteTrip={deleteTrip.onOpen}
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
      />

      <InviteSheet
        isOpen={invite.open}
        onClose={invite.onClose}
        tripId={tripId}
      />

      <MemberListSheet
        isOpen={membersSheet.open}
        onClose={membersSheet.onClose}
        tripId={tripId}
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

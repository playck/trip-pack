import { useDisclosure } from "@chakra-ui/react";
import { useHistoryBack } from "@/shared/hooks";
import { TripSettingsDrawer } from "@/shared/components/trip-settings";
import { TripEditModal } from "@/shared/components/trip-action/TripEditModal";
import { TripDateEditModal } from "@/shared/components/trip-action/TripDateEditModal";
import { DeleteTripModal } from "@/shared/components/trip-action/DeleteTripModal";
import { useDeleteTrip } from "@/shared/service/trip/useDeleteTrip";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";
import InviteSheet from "@/features/trip-members/components/InviteSheet";
import MemberListSheet from "@/features/trip-members/components/MemberListSheet";

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

  const { data: tripInfo } = useTripInfo(tripId);
  const { data: members } = useTripMembers(tripId);
  const { mutate: deleteTripMutate, isPending: isDeletePending } =
    useDeleteTrip();

  const editTitle = useDisclosure();
  const editDate = useDisclosure();
  const deleteTrip = useDisclosure();
  const membersSheet = useDisclosure();
  const invite = useDisclosure();

  const handleDeleteTrip = () => {
    deleteTripMutate(tripId);
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
        tripInfo={
          tripInfo
            ? {
                title: tripInfo.title || "여행",
                regionName: tripInfo.regionName,
                startDate: tripInfo.startDate,
                endDate: tripInfo.endDate,
              }
            : undefined
        }
        memberCount={members?.length ?? 0}
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
    </>
  );
}

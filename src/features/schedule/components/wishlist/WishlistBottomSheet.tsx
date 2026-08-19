import { useState } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";

import BottomSheet from "@/shared/components/BottomSheet";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { toaster } from "@/shared/components/ui/toaster";
import { textColors } from "@/shared/constants/colors";
import WishlistItem from "./WishlistItem";
import PlaceActionSheet from "../modals/PlaceActionSheet";
import PlaceDetailEditSheet from "../modals/PlaceDetailEditSheet";
import PlaceSearchSheet from "../modals/PlaceSearchSheet";
import MoveDateBottomSheet from "../modals/MoveDateBottomSheet";
import { useTripWishlists } from "../../services/useTripWishlists";
import { useCreateWishlist } from "../../services/useCreateWishlist";
import { useUpdateWishlist } from "../../services/useUpdateWishlist";
import { useDeleteWishlist } from "../../services/useDeleteWishlist";
import { useConvertWishlistToSchedule } from "../../services/useConvertWishlistToSchedule";
import { mapGoogleTypesToIconKey } from "../../memoIcons";
import type { PlaceResult } from "../../hooks";
import type { Wishlist } from "../../types";

interface WishlistBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripStartDate: string;
  tripEndDate: string;
  countryCode?: string;
}

export default function WishlistBottomSheet({
  isOpen,
  onClose,
  tripId,
  tripStartDate,
  tripEndDate,
  countryCode,
}: WishlistBottomSheetProps) {
  const { data: wishlists = [] } = useTripWishlists(
    isOpen ? tripId : undefined,
  );

  const [selected, setSelected] = useState<Wishlist | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createMutation = useCreateWishlist(tripId);
  const updateMutation = useUpdateWishlist(tripId);
  const deleteMutation = useDeleteWishlist(tripId, {
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelected(null);
    },
  });
  const convertMutation = useConvertWishlistToSchedule(tripId, tripStartDate, {
    onSuccess: () => {
      setIsMoveOpen(false);
      setSelected(null);
    },
  });

  const handleAddPlace = (place: PlaceResult) => {
    if (wishlists.some((w) => w.place_id === place.placeId)) {
      toaster.create({
        title: "이미 담긴 곳이에요",
        type: "info",
        duration: 1500,
      });
      return;
    }

    createMutation.mutate({
      tripId,
      placeId: place.placeId,
      placeName: place.name,
      placeAddress: place.address,
      latitude: place.location?.lat,
      longitude: place.location?.lng,
      category: mapGoogleTypesToIconKey(place.types),
    });
  };

  // 행 본문 탭 — 주 액션: 일차 선택으로 바로 진입
  const handleSelectForPlacement = (wishlist: Wishlist) => {
    setSelected(wishlist);
    setIsMoveOpen(true);
  };

  // ⋮ — 관리 액션(수정·삭제)
  const handleOpenAction = (wishlist: Wishlist) => {
    setSelected(wishlist);
    setIsActionOpen(true);
  };

  const handleSaveEdit = (values: {
    placeName: string;
    notes: string;
    category: string;
  }) => {
    if (!selected) return;
    updateMutation.mutate({ wishlistId: selected.id, ...values });
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="가고 싶은 곳"
        height="90vh"
        primaryButton={{
          text: "가고 싶은 곳 담기",
          onClick: () => setIsSearchOpen(true),
        }}
      >
        <VStack align="stretch" gap={0} px={2} pb={4}>
          {wishlists.length === 0 ? (
            <Box p={6} textAlign="center">
              <Text fontSize="sm" color={textColors.subtle}>
                아직 담아둔 곳이 없어요
                <br />
                일정이 정해지면 원하는 일차로 옮길 수 있어요
              </Text>
            </Box>
          ) : (
            <>
              <Box px={3} pb={1.5} textAlign="right">
                <Text fontSize="xs" color={textColors.tertiary}>
                  장소를 선택하면 원하는 일차의 일정으로 추가돼요
                </Text>
              </Box>
              {wishlists.map((wishlist) => (
                <WishlistItem
                  key={wishlist.id}
                  wishlist={wishlist}
                  onClick={handleSelectForPlacement}
                  onOpenAction={handleOpenAction}
                />
              ))}
            </>
          )}
        </VStack>
      </BottomSheet>

      {/* 장소 검색해서 담기 */}
      <PlaceSearchSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tripId={tripId}
        onSelectPlace={handleAddPlace}
        countryCode={countryCode}
      />

      {selected && (
        <>
          <PlaceActionSheet
            isOpen={isActionOpen}
            onClose={() => setIsActionOpen(false)}
            placeName={selected.place_name}
            placeAddress={selected.place_address ?? undefined}
            actions={[
              {
                icon: Edit2,
                label: "수정하기",
                onClick: () => setIsEditOpen(true),
              },
              {
                icon: Trash2,
                label: "삭제하기",
                onClick: () => setIsDeleteOpen(true),
                isDangerous: true,
              },
            ]}
          />

          <MoveDateBottomSheet
            isOpen={isMoveOpen}
            onClose={() => {
              setIsMoveOpen(false);
              setSelected(null);
            }}
            title={`"${selected.place_name}" 언제 갈까요?`}
            currentDayNumber={0}
            tripStartDate={tripStartDate}
            tripEndDate={tripEndDate}
            onSelectDay={(dayNumber) =>
              convertMutation.mutate({ wishlistId: selected.id, dayNumber })
            }
            isLoading={convertMutation.isPending}
          />

          <PlaceDetailEditSheet
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setSelected(null);
            }}
            title="가고 싶은 곳 수정"
            initialPlaceName={selected.place_name}
            initialNotes={selected.notes}
            initialCategory={selected.category}
            onSave={handleSaveEdit}
          />

          <ConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelected(null);
            }}
            title="가고 싶은 곳 삭제"
            confirmLabel="삭제"
            isDangerous
            onConfirm={() => deleteMutation.mutate(selected.id)}
            isLoading={deleteMutation.isPending}
          >
            <Text>
              <Text as="span" fontWeight="bold">
                "{selected.place_name}"
              </Text>
              <br />
              가고 싶은 곳에서 삭제하시겠습니까?
            </Text>
          </ConfirmDialog>
        </>
      )}
    </>
  );
}

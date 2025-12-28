import { useRef } from "react";
import {
  IconButton,
  Box,
  VStack,
  Text,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Settings, Edit3, Trash2 } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

import { useDeleteTrip } from "@/shared/service/trip/useDeleteTrip";
import { DeleteTripModal } from "./DeleteTripModal";
import { TripEditModal } from "./TripEditModal";

interface TripActionMenuProps {
  tripId: string;
  tripTitle: string;
}

export default function TripActionMenu({
  tripId,
  tripTitle,
}: TripActionMenuProps) {
  const { open: isOpen, onToggle, onClose } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, onClose);

  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    open: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const deleteTripMutation = useDeleteTrip();

  const handleDeleteTrip = () => {
    deleteTripMutation.mutate(tripId);
    onDeleteModalClose();
  };

  const openEditModal = () => {
    onClose();
    onEditModalOpen();
  };

  const openDeleteModal = () => {
    onClose();
    onDeleteModalOpen();
  };

  return (
    <Box position="relative" ref={containerRef}>
      <IconButton
        aria-label="여행 설정"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        color="gray.600"
      >
        <Settings size={20} />
      </IconButton>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={2}
          py={1}
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
          minW="160px"
          zIndex={1000}
        >
          <VStack align="stretch" gap={0}>
            <Box
              as="button"
              px={4}
              py={2}
              _hover={{ bg: "gray.50" }}
              onClick={openEditModal}
              textAlign="left"
              w="full"
            >
              <HStack gap={3}>
                <Edit3 size={16} />
                <Text fontSize="sm">여행 제목 수정</Text>
              </HStack>
            </Box>
            <Box
              as="button"
              px={4}
              py={2}
              _hover={{ bg: "gray.50" }}
              onClick={openDeleteModal}
              textAlign="left"
              w="full"
              color="red.500"
            >
              <HStack gap={3}>
                <Trash2 size={16} />
                <Text fontSize="sm">여행 삭제</Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      )}

      <TripEditModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        tripId={tripId}
        currentTitle={tripTitle}
      />

      <DeleteTripModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        tripTitle={tripTitle}
        onDeleteTrip={handleDeleteTrip}
        isLoading={deleteTripMutation.isPending}
      />
    </Box>
  );
}

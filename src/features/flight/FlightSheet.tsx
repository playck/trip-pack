import { useState } from "react";
import { VStack, Text, Box, HStack, Center, Button } from "@chakra-ui/react";
import { Plus, Plane } from "lucide-react";

import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useTripFlights, useDeleteFlight } from "./services/useFlightQueries";
import { FlightStatusCard, AddFlightSheet } from "./components";

interface FlightSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  startDate: string;
  endDate: string;
}

export default function FlightSheet({
  isOpen,
  onClose,
  tripId,
  startDate,
  endDate,
}: FlightSheetProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: flights = [], isLoading } = useTripFlights(tripId);
  const deleteFlight = useDeleteFlight(tripId);

  const departureFlight = flights.find((f) => f.flight_type === "departure");
  const returnFlight = flights.find((f) => f.flight_type === "return");

  const handleDelete = (flightId: string) => {
    deleteFlight.mutate(flightId);
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="항공편 현황"
        minHeight="95vh"
      >
        <VStack px={4} gap={3} align="stretch">
          {/* 안내 문구 */}
          <Box bg="blue.50" px={3} py={2} borderRadius="lg">
            <HStack gap={2}>
              <Plane size={16} color="#3182CE" />
              <Text fontSize="xs" color="blue.700">
                항공 운항 현황은 5분마다 자동으로 갱신됩니다.
              </Text>
            </HStack>
          </Box>

          {isLoading && (
            <Center py={8}>
              <Text fontSize="sm" color="gray.400">
                항공편 정보 로딩중...
              </Text>
            </Center>
          )}

          {/* 등록된 항공편이 없는 경우 */}
          {!isLoading && flights.length === 0 && (
            <Center py={8}>
              <VStack gap={4}>
                <Box color="gray.300">
                  <Plane size={48} />
                </Box>
                <VStack gap={2.5}>
                  <Text fontSize="md" fontWeight="medium" color="gray.700">
                    등록된 항공편이 없습니다
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    출발편과 리턴편을 등록해보세요
                  </Text>
                </VStack>
                <Button
                  colorPalette={colors.primary.palette}
                  size="md"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus size={16} />
                  <Text>항공편 등록</Text>
                </Button>
              </VStack>
            </Center>
          )}

          {/* 출발편 */}
          {departureFlight && (
            <FlightStatusCard
              flight={departureFlight}
              onDelete={handleDelete}
              isDeleting={deleteFlight.isPending}
            />
          )}

          {/* 리턴편 */}
          {returnFlight && (
            <FlightStatusCard
              flight={returnFlight}
              onDelete={handleDelete}
              isDeleting={deleteFlight.isPending}
            />
          )}

          {/* 항공편 추가 버튼 (2개 미만일 때) */}
          {!isLoading && flights.length > 0 && flights.length < 2 && (
            <Box
              as="button"
              w="full"
              py={4}
              borderRadius="xl"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="gray.300"
              cursor="pointer"
              _hover={{ borderColor: colors.primary.muted, bg: "gray.50" }}
              onClick={() => setIsAddOpen(true)}
            >
              <HStack justify="center" gap={2} color="gray.400">
                <Plus size={18} />
                <Text fontSize="sm" fontWeight="medium">
                  {!departureFlight ? "출발편 등록" : "리턴편 등록"}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </BottomSheet>

      <AddFlightSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        tripId={tripId}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
}

import { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Search, Plane, DollarSign, SquareParking } from "lucide-react";
import AirlineBaggagePolicySheet from "@/features/packing/list/components/AirlineBaggagePolicySheet";
import { ParkingLookupSheet } from "@/features/airport-parking/components";
import MenuItem from "../MenuItem";
import BaggageRuleSearchSheet from "./BaggageRuleSearch";
import ExchangeRateSheet from "./ExchangeRateSheet";

export default function TravelHelperSection() {
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [isAirlineSheetOpen, setIsAirlineSheetOpen] = useState(false);
  const [isExchangeRateSheetOpen, setIsExchangeRateSheetOpen] = useState(false);
  const [isParkingSheetOpen, setIsParkingSheetOpen] = useState(false);

  return (
    <>
      <Box>
        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
          여행 도우미
        </Text>

        <VStack
          gap={0}
          bg="white"
          borderRadius="xl"
          px={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <MenuItem
            icon={Search}
            label="수하물 규정 검색"
            onClick={() => setIsSearchSheetOpen(true)}
          />
          <MenuItem
            icon={Plane}
            label="항공사 수하물 규정 확인"
            onClick={() => setIsAirlineSheetOpen(true)}
          />
          <MenuItem
            icon={DollarSign}
            label="환율 조회"
            onClick={() => setIsExchangeRateSheetOpen(true)}
          />
          <MenuItem
            icon={SquareParking}
            label="공항 주차장 현황 보기"
            onClick={() => setIsParkingSheetOpen(true)}
          />
        </VStack>
      </Box>

      <BaggageRuleSearchSheet
        isOpen={isSearchSheetOpen}
        onClose={() => setIsSearchSheetOpen(false)}
      />
      <AirlineBaggagePolicySheet
        isOpen={isAirlineSheetOpen}
        onClose={() => setIsAirlineSheetOpen(false)}
      />
      <ExchangeRateSheet
        isOpen={isExchangeRateSheetOpen}
        onClose={() => setIsExchangeRateSheetOpen(false)}
      />
      <ParkingLookupSheet
        isOpen={isParkingSheetOpen}
        onClose={() => setIsParkingSheetOpen(false)}
      />
    </>
  );
}

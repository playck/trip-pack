import { Box, Text, VStack, HStack, Spinner } from "@chakra-ui/react";
import { MapPin, CalendarDays, Users } from "lucide-react";
import { getTripBackgroundImage } from "@/shared/utiles/tripImage";
import { formatTripDateRange, getDuration } from "@/shared/utiles/date";

interface TripImageCardProps {
  tripId: string;
  title: string;
  regionName: string | null;
  countryCode: string | null;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  memberCount: number;
  isUploading?: boolean;
}

export default function TripImageCard({
  tripId,
  title,
  regionName,
  countryCode,
  startDate,
  endDate,
  imageUrl,
  memberCount,
  isUploading = false,
}: TripImageCardProps) {
  const backgroundImage = getTripBackgroundImage({
    id: tripId,
    regionName,
    countryCode,
    imageUrl,
  });

  return (
    <Box
      position="relative"
      w="full"
      borderRadius="xl"
      aspectRatio="2.5 / 1"
      overflow="hidden"
      mb={4}
    >
      {/* 배경 이미지 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${backgroundImage})`}
        bgSize="cover"
        backgroundPosition="center"
      />
      {/* 오버레이 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"
      />

      {/* 업로드 로딩 오버레이 */}
      {isUploading && (
        <VStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={3}
          justify="center"
          bg="blackAlpha.600"
        >
          <Spinner size="lg" color="white" />
          <Text fontSize="xs" color="white" fontWeight="medium">
            이미지 변경 중...
          </Text>
        </VStack>
      )}

      {/* 텍스트 콘텐츠 */}
      <VStack
        position="relative"
        zIndex={1}
        h="full"
        justify="end"
        align="start"
        p={4}
        gap={1}
      >
        <Text
          fontSize="md"
          fontWeight="bold"
          color="white"
          lineClamp={1}
          lineHeight="1.3"
        >
          {title}
        </Text>
        <VStack align="start" gap={0.5}>
          {regionName && (
            <HStack gap={1.5} color="whiteAlpha.900">
              <MapPin size={13} />
              <Text fontSize="xs">{regionName}</Text>
            </HStack>
          )}
          <HStack gap={1.5} color="whiteAlpha.900">
            <CalendarDays size={13} />
            <Text fontSize="xs">
              {formatTripDateRange(startDate, endDate)} (
              {getDuration(startDate, endDate)})
            </Text>
          </HStack>
          <HStack gap={1.5} color="whiteAlpha.900">
            <Users size={13} />
            <Text fontSize="xs">{memberCount}명</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}

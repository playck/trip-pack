import dayjs from "dayjs";
import "dayjs/locale/ko";
import {
  Box,
  Text,
  VStack,
  Grid,
  GridItem,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import { useTripWeather, getWeatherEmoji } from "./useTripWeahter";
import { colorCombinations } from "../../constants/colors";

dayjs.locale("ko");

interface WeatherCardProps {
  cityName: string;
  startDate: string;
  endDate: string;
}

export default function WeatherCard({
  cityName,
  startDate,
  endDate,
}: WeatherCardProps) {
  const {
    data: tripWeather,
    isLoading,
    error,
  } = useTripWeather({
    cityName,
    startDate,
    endDate,
  });

  if (error) {
    return (
      <Box
        p={3}
        bg={colorCombinations.defaultCard.background}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={colorCombinations.defaultCard.border}
      >
        <Text color="gray.500" textAlign="center" fontSize="sm">
          날씨 정보를 불러올 수 없습니다
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        p={3}
        bg={colorCombinations.defaultCard.background}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={colorCombinations.defaultCard.border}
      >
        <VStack gap={2} align="stretch">
          <Skeleton height="20px" width="150px" />
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {[...Array(4)].map((_, index) => (
              <GridItem key={index}>
                <Skeleton height="50px" borderRadius="md" />
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Box>
    );
  }

  if (!tripWeather) {
    return null;
  }

  return (
    <Box
      p={2}
      bg={colorCombinations.defaultCard.background}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={colorCombinations.defaultCard.border}
    >
      <VStack gap={2} align="stretch">
        {/* 헤더 */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {tripWeather.cityName} 날씨
          </Text>
        </Box>

        <Grid
          templateColumns={`repeat(${Math.min(tripWeather.forecast.length, 4)}, 1fr)`}
          gap={2}
        >
          {tripWeather.forecast.slice(0, 4).map((day, index) => (
            <GridItem key={day.date}>
              <Box
                p={2}
                bg={day.isToday ? "green.50" : "gray.50"}
                borderRadius="md"
                borderWidth="1px"
                borderColor={day.isToday ? "green.200" : "gray.200"}
                textAlign="center"
                minH="50px"
              >
                <VStack gap={2}>
                  <Text
                    fontSize="xs"
                    fontWeight={day.isToday ? "bold" : "medium"}
                    color={day.isToday ? "green.700" : "gray.600"}
                    lineHeight="1"
                  >
                    {index === 0 && day.isToday
                      ? "오늘"
                      : dayjs(day.date).format("M / D")}
                  </Text>

                  <Flex alignItems="center" gap={1.5}>
                    <Text fontSize="lg" lineHeight="1">
                      {getWeatherEmoji(day.icon)}
                    </Text>

                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={day.isToday ? "green.700" : "gray.700"}
                      lineHeight="1"
                    >
                      {day.avgTemp}°
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
}

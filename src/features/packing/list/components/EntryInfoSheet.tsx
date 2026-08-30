import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Text, VStack, HStack, Badge, Link } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

import BottomSheet from "@/shared/components/BottomSheet";
import { Info } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { getEntryDeclaration } from "@/shared/data/entryDeclarations";
import { countries } from "@/shared/data/regions";
import { travelAlerts, type AlertLevel } from "@/shared/data/travelAlert";
import {
  COMMON_ENTRY_INFO,
  COUNTRY_ENTRY_HIGHLIGHTS,
} from "@/shared/data/entryInfo";
import {
  getVisaRule,
  getVisaNote,
} from "@/features/packing/create/utils/visaRules";

interface EntryInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode?: string | null;
  regionId?: string | null;
}

const ALERT_META: Record<AlertLevel, { label: string }> = {
  1: { label: "여행유의" },
  2: { label: "여행자제" },
  3: { label: "출국권고" },
  4: { label: "여행금지" },
};

const MOFA_URL = "https://www.0404.go.kr";

const primary = colors.primary.palette;

/** 국가 특이점(teal) + 공통 안내(gray) 불릿 렌더 */
function Bullets({
  items,
  tone,
}: {
  items: readonly string[];
  tone: "country" | "common";
}) {
  return (
    <>
      {items.map((text, i) => (
        <HStack key={i} gap={2} align="start">
          <Box
            mt="7px"
            w="4px"
            h="4px"
            borderRadius="full"
            flexShrink={0}
            bg={tone === "country" ? "teal.400" : "gray.300"}
          />
          <Text
            fontSize="xs"
            lineHeight="1.6"
            color={tone === "country" ? "gray.700" : "gray.500"}
          >
            {text}
          </Text>
        </HStack>
      ))}
    </>
  );
}

export default function EntryInfoSheet({
  isOpen,
  onClose,
  countryCode,
  regionId,
}: EntryInfoSheetProps) {
  const code = countryCode?.toUpperCase();
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(["visa"]),
  );

  const country = useMemo(
    () => countries.find((c) => c.code === code),
    [code],
  );
  const rule = useMemo(
    () => getVisaRule(code, regionId ?? undefined),
    [code, regionId],
  );
  const highlight = code ? COUNTRY_ENTRY_HIGHLIGHTS[code] : undefined;
  // 체크리스트에 입국신고 아이템이 없는 기존 여행에서도 기한·공식 링크에 닿을 수 있게 고정 노출
  const declaration = useMemo(() => getEntryDeclaration(code), [code]);

  const alert = useMemo(() => {
    if (!code) return null;
    return (
      travelAlerts
        .filter((a) => a.countryCode === code)
        .sort((a, b) => b.level - a.level)[0] ?? null
    );
  }, [code]);

  const status = rule.isUnknown
    ? { label: "확인 필요", palette: "gray" }
    : rule.required
      ? { label: "비자 필요", palette: "orange" }
      : { label: "무비자 입국", palette: "green" };

  const info = rule.info;
  const detailNote = rule.overrideNote || info?.note || null;
  const rawText = info?.rawText && info.rawText !== "X" ? info.rawText : null;

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const bulletBody = (
    country?: readonly string[],
    common?: readonly string[],
  ) => (
    <VStack align="stretch" gap={1.5}>
      {country && <Bullets items={country} tone="country" />}
      {common && <Bullets items={common} tone="common" />}
    </VStack>
  );

  type Section = {
    key: string;
    title: string;
    hint?: string;
    body: ReactNode;
  };

  const visaHint = rule.isUnknown
    ? undefined
    : rule.required
      ? "비자 필요"
      : info?.stayDays
        ? `무비자 ${info.stayDays}일`
        : "무비자";

  const rawSections: Array<Section | false | undefined> = [
    {
      key: "visa",
      title: "비자·여권",
      hint: visaHint,
      body: (
        <VStack align="stretch" gap={1.5}>
          <Text fontSize="sm" color="gray.700" fontWeight="medium">
            {getVisaNote(rule)}
          </Text>
          {info?.stayDays != null && (
            <Text fontSize="xs" color="gray.600">
              무사증 최대 체류 {info.stayDays}일
            </Text>
          )}
          {detailNote && (
            <Text fontSize="xs" color="gray.600">
              참고 · {detailNote}
            </Text>
          )}
          {rawText && (
            <Text fontSize="2xs" color="gray.400">
              외교부 원문(일반여권 입국가능기간): {rawText}
            </Text>
          )}
        </VStack>
      ),
    },
    highlight?.entry && {
      key: "entry",
      title: "입국 절차·서류",
      body: bulletBody(highlight.entry),
    },
    {
      key: "customs",
      title: "세관·면세",
      body: bulletBody(highlight?.dutyFree, COMMON_ENTRY_INFO.customs),
    },
    {
      key: "prohibited",
      title: "금지·제한 물품",
      body: bulletBody(highlight?.prohibited, COMMON_ENTRY_INFO.prohibited),
    },
    {
      key: "declaration",
      title: "세관신고",
      body: bulletBody(highlight?.customsDecl, COMMON_ENTRY_INFO.declaration),
    },
    highlight?.quarantine && {
      key: "quarantine",
      title: "검역(동식물)",
      body: bulletBody(highlight.quarantine),
    },
    highlight?.vaccination && {
      key: "vaccination",
      title: "예방접종",
      body: bulletBody(highlight.vaccination),
    },
    highlight?.caution && {
      key: "caution",
      title: "주의사항",
      body: bulletBody(highlight.caution),
    },
    highlight?.minors && {
      key: "minors",
      title: "동반 미성년자",
      body: bulletBody(highlight.minors),
    },
    {
      key: "before",
      title: "출국 전 체크",
      body: bulletBody(undefined, COMMON_ENTRY_INFO.beforeDeparture),
    },
  ];

  const sections = rawSections.filter((s): s is Section => Boolean(s));

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="비자·입국 정보" size="max">
      <VStack align="stretch" gap={0} h="calc(90vh - 60px)">
        {/* 고정 헤더: 국가 + 비자 상태 + 여행경보 */}
        <Box px={4} pt={1} pb={2} flexShrink={0}>
          <HStack justify="space-between" align="center">
            <HStack gap={2}>
              {country?.flag && <Text fontSize="2xl">{country.flag}</Text>}
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {country?.name ?? "해외"}
              </Text>
            </HStack>
            <Badge
              colorPalette={status.palette}
              variant="subtle"
              fontWeight="bold"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              {status.label}
            </Badge>
          </HStack>

          {alert && (
            <Info colorScheme="orange" mt={2}>
              <HStack gap={2} align="start">
                <Box color="orange.500" mt={0.5}>
                  <AlertTriangle size={15} />
                </Box>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" fontWeight="bold" color="orange.700">
                    외교부 여행경보 {ALERT_META[alert.level].label}
                    {!alert.nationwide && " (일부 지역)"}
                  </Text>
                  <Text fontSize="xs" color="orange.600">
                    {alert.reason}
                  </Text>
                </VStack>
              </HStack>
            </Info>
          )}

          {declaration && (
            <Box
              mt={2}
              bg={`${primary}.50`}
              borderWidth="1px"
              borderColor={`${primary}.200`}
              borderRadius="lg"
              px={3}
              py={2.5}
            >
              <HStack justify="space-between" align="center" gap={2}>
                <Text fontSize="xs" fontWeight="bold" color={`${primary}.700`}>
                  {declaration.name}
                </Text>
                <Badge
                  colorPalette={declaration.required ? primary : "gray"}
                  variant="subtle"
                  fontSize="2xs"
                  flexShrink={0}
                >
                  {declaration.required ? "필수" : "권장"}
                </Badge>
              </HStack>
              <Text fontSize="2xs" color={`${primary}.700`} mt={1} lineHeight="1.6">
                {declaration.deadline}
                {declaration.note ? ` · ${declaration.note}` : ""}
              </Text>
              {declaration.url ? (
                <Link
                  href={declaration.url}
                  target="_blank"
                  rel="noreferrer"
                  mt={1.5}
                  fontSize="xs"
                  fontWeight="semibold"
                  color={`${primary}.600`}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  공식 사이트에서 작성하기
                  <ExternalLink size={12} />
                </Link>
              ) : (
                <Text fontSize="2xs" color={`${primary}.600`} mt={1.5}>
                  작성처가 수시로 바뀌는 국가입니다. 항공사 안내나 현지 대사관
                  공지에서 공식 접수처를 확인하세요.
                </Text>
              )}
            </Box>
          )}
        </Box>

        {/* 스크롤 영역: 섹션 아코디언 */}
        <Box flex={1} overflowY="auto" px={4} pb={6}>
          <VStack align="stretch" gap={2}>
            {sections.map((section) => {
              const isExpanded = openKeys.has(section.key);
              return (
                <Box
                  key={section.key}
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <HStack
                    as="button"
                    w="full"
                    px={3}
                    py={2.5}
                    justify="space-between"
                    cursor="pointer"
                    onClick={() => toggle(section.key)}
                  >
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {section.title}
                    </Text>
                    <HStack gap={1.5}>
                      {section.hint && !isExpanded && (
                        <Text fontSize="2xs" color="gray.400">
                          {section.hint}
                        </Text>
                      )}
                      <Box color="gray.400">
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Box>
                    </HStack>
                  </HStack>
                  {isExpanded && (
                    <Box
                      px={3}
                      pb={3}
                      pt={2}
                      borderTopWidth="1px"
                      borderColor="gray.100"
                    >
                      {section.body}
                    </Box>
                  )}
                </Box>
              );
            })}
          </VStack>

          {/* 출처 + 면책 */}
          <Box
            bg="gray.50"
            borderRadius="lg"
            px={3}
            py={2.5}
            mt={3}
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Text fontSize="2xs" color="gray.500" lineHeight="1.6">
              비자 정보 출처: 외교부 국가·지역별 입국허가요건(공공데이터). 세관·금지물품
              등은 일반 안내이며 국가별로 다를 수 있습니다. 입국 규정은 수시로 바뀌므로
              여행 전 반드시 최신 정보를 확인하세요.
            </Text>
            <Link
              href={MOFA_URL}
              target="_blank"
              rel="noreferrer"
              mt={1.5}
              fontSize="xs"
              fontWeight="semibold"
              color="teal.600"
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              외교부 해외안전여행에서 확인
              <ExternalLink size={12} />
            </Link>
          </Box>
        </Box>
      </VStack>
    </BottomSheet>
  );
}

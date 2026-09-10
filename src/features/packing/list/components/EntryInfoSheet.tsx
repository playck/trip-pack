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

/**
 * 국가 특이점 vs 공통 안내 불릿.
 */
function Bullets({
  items,
  tone,
}: {
  items: readonly string[];
  tone: "country" | "common";
}) {
  const isCountry = tone === "country";

  return (
    <>
      {items.map((text, i) => (
        <HStack key={i} gap={2} align="start">
          <Box
            mt={isCountry ? "8px" : "7px"}
            w={isCountry ? "5px" : "4px"}
            h={isCountry ? "5px" : "4px"}
            borderRadius="full"
            flexShrink={0}
            bg={isCountry ? `${primary}.500` : "gray.300"}
          />
          <Text
            fontSize={isCountry ? "sm" : "xs"}
            fontWeight={isCountry ? "medium" : "normal"}
            lineHeight="1.6"
            color={isCountry ? "gray.800" : "gray.500"}
          >
            {text}
          </Text>
        </HStack>
      ))}
    </>
  );
}

/** 특이점·공통을 나누는 그룹 라벨 (둘 다 있을 때만 노출) */
function GroupLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      color="gray.500"
      letterSpacing="0.02em"
    >
      {children}
    </Text>
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

  const country = useMemo(() => countries.find((c) => c.code === code), [code]);
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

  // 색 규칙은 짐 목록 리드아웃과 동일 — 조치가 필요할 때만 주황, 아니면 무채색
  const status = rule.isUnknown
    ? { label: "확인 필요", palette: "orange" }
    : rule.required
      ? { label: "비자 필요", palette: "orange" }
      : { label: "무비자 입국", palette: "gray" };

  // 여행경보는 "위험", 입국신고는 "할 일" — 등급 3(출국권고) 이상은 빨강으로 분리
  const alertPalette = alert && alert.level >= 3 ? "red" : "orange";
  // 필수 신고만 조치색, 권장이면 무채색
  const declarationPalette = declaration?.required ? "orange" : "gray";

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

  const countryLabel = `${country?.name ?? "현지"} 특이사항`;

  const bulletBody = (
    countryItems?: readonly string[],
    commonItems?: readonly string[],
  ) => {
    const hasCountry = Boolean(countryItems?.length);
    const hasCommon = Boolean(commonItems?.length);
    // 라벨은 둘 다 있을 때만 — 한쪽뿐이면 라벨이 노이즈가 된다
    const showLabels = hasCountry && hasCommon;

    return (
      <VStack align="stretch" gap={showLabels ? 3.5 : 1.5}>
        {hasCountry && (
          <VStack align="stretch" gap={1.5}>
            {showLabels && <GroupLabel>{countryLabel}</GroupLabel>}
            <Bullets items={countryItems!} tone="country" />
          </VStack>
        )}
        {hasCommon && (
          <VStack align="stretch" gap={1.5}>
            {showLabels && <GroupLabel>어디서나 공통</GroupLabel>}
            <Bullets items={commonItems!} tone="common" />
          </VStack>
        )}
      </VStack>
    );
  };

  /** 접힌 상태에서 "이 안에 이 나라 얘기가 있나"를 알려주는 힌트 */
  const countryHint = (countryItems?: readonly string[]) =>
    countryItems?.length ? `특이사항 ${countryItems.length}` : undefined;

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
            <Text fontSize="xs" color="gray.500">
              외교부 원문(일반여권 입국가능기간): {rawText}
            </Text>
          )}
        </VStack>
      ),
    },
    highlight?.entry && {
      key: "entry",
      title: "입국 절차·서류",
      hint: countryHint(highlight.entry),
      body: bulletBody(highlight.entry),
    },
    {
      key: "customs",
      title: "세관·면세",
      hint: countryHint(highlight?.dutyFree),
      body: bulletBody(highlight?.dutyFree, COMMON_ENTRY_INFO.customs),
    },
    {
      key: "prohibited",
      title: "금지·제한 물품",
      hint: countryHint(highlight?.prohibited),
      body: bulletBody(highlight?.prohibited, COMMON_ENTRY_INFO.prohibited),
    },
    {
      key: "declaration",
      title: "세관신고",
      hint: countryHint(highlight?.customsDecl),
      body: bulletBody(highlight?.customsDecl, COMMON_ENTRY_INFO.declaration),
    },
    highlight?.quarantine && {
      key: "quarantine",
      title: "검역(동식물)",
      hint: countryHint(highlight.quarantine),
      body: bulletBody(highlight.quarantine),
    },
    highlight?.vaccination && {
      key: "vaccination",
      title: "예방접종",
      hint: countryHint(highlight.vaccination),
      body: bulletBody(highlight.vaccination),
    },
    highlight?.caution && {
      key: "caution",
      title: "주의사항",
      hint: countryHint(highlight.caution),
      body: bulletBody(highlight.caution),
    },
    highlight?.minors && {
      key: "minors",
      title: "동반 미성년자",
      hint: countryHint(highlight.minors),
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
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="비자·입국 정보"
      size="max"
    >
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
            <Box
              mt={2}
              bg={`${alertPalette}.50`}
              borderWidth="1px"
              borderColor={`${alertPalette}.200`}
              borderRadius="lg"
              px={3}
              py={2.5}
            >
              <HStack gap={2} align="start">
                <Box color={`${alertPalette}.500`} mt={0.5}>
                  <AlertTriangle size={15} />
                </Box>
                <VStack align="start" gap={0.5}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={`${alertPalette}.700`}
                  >
                    외교부 여행경보 {ALERT_META[alert.level].label}
                    {!alert.nationwide && " (일부 지역)"}
                  </Text>
                  {/* 600은 50 배경 위에서 3.4:1 — AA 미달이라 700으로 */}
                  <Text
                    fontSize="xs"
                    color={`${alertPalette}.700`}
                    lineHeight="1.5"
                  >
                    {alert.reason}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}

          {declaration && (
            <Box
              mt={2}
              bg={`${declarationPalette}.50`}
              borderWidth="1px"
              borderColor={`${declarationPalette}.200`}
              borderRadius="lg"
              px={3}
              py={2.5}
            >
              <HStack justify="space-between" align="center" gap={2}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={`${declarationPalette}.700`}
                >
                  {declaration.name}
                </Text>
                <Badge
                  colorPalette={declarationPalette}
                  variant="subtle"
                  fontSize="xs"
                  flexShrink={0}
                >
                  {declaration.required ? "필수" : "권장"}
                </Badge>
              </HStack>
              <Text
                fontSize="xs"
                color={`${declarationPalette}.700`}
                mt={1}
                lineHeight="1.6"
              >
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
                  color={`${declarationPalette}.700`}
                  textDecoration="underline"
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  공식 사이트에서 작성하기
                  <ExternalLink size={12} />
                </Link>
              ) : (
                <Text
                  fontSize="xs"
                  color={`${declarationPalette}.700`}
                  mt={1.5}
                  lineHeight="1.5"
                >
                  작성처가 수시로 바뀌는 국가입니다. 항공사 안내나 현지 대사관
                  공지에서 공식 접수처를 확인하세요.
                </Text>
              )}
            </Box>
          )}
        </Box>

        {/* 스크롤 영역: 섹션 아코디언 */}
        <Box flex={1} overflowY="auto" px={4} pb={6}>
          {/* 개별 카드 8장 대신 하나의 문서 — 헤어라인으로만 구분 */}
          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
          >
            {sections.map((section) => {
              const isExpanded = openKeys.has(section.key);
              return (
                <Box
                  key={section.key}
                  _notFirst={{
                    borderTopWidth: "1px",
                    borderTopColor: "gray.100",
                  }}
                >
                  <HStack
                    as="button"
                    w="full"
                    px={3}
                    py={3}
                    justify="space-between"
                    cursor="pointer"
                    transition="background 0.12s ease"
                    _active={{ bg: "gray.100" }}
                    _focusVisible={{
                      outline: "2px solid",
                      outlineColor: `${primary}.500`,
                      outlineOffset: "-2px",
                    }}
                    onClick={() => toggle(section.key)}
                  >
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                      {section.title}
                    </Text>
                    <HStack gap={1.5}>
                      {section.hint && !isExpanded && (
                        <Text fontSize="xs" color="gray.500">
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
                    <Box px={3} pb={3.5} pt={0.5}>
                      {section.body}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

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
            <Text fontSize="xs" color="gray.600" lineHeight="1.6">
              비자 정보 출처: 외교부 국가·지역별 입국허가요건(공공데이터).
              세관·금지물품 등은 일반 안내이며 국가별로 다를 수 있습니다. 입국
              규정은 수시로 바뀌므로 여행 전 반드시 최신 정보를 확인하세요.
            </Text>
            <Link
              href={MOFA_URL}
              target="_blank"
              rel="noreferrer"
              mt={1.5}
              fontSize="xs"
              fontWeight="semibold"
              color={`${primary}.700`}
              textDecoration="underline"
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

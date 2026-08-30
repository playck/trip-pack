import { useEffect, useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Badge, Link } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  Lightbulb,
  ListChecks,
} from "lucide-react";

import BottomSheet from "@/shared/components/BottomSheet";
import { colors, statusColors } from "@/shared/constants/colors";
import { getEntryDeclaration } from "@/shared/data/entryDeclarations";
import { findEssentialGuide } from "@/shared/data/essentialItemGuides";
import { countries } from "@/shared/data/regions";
import type { ChecklistItem } from "../../type";

interface EssentialItemGuideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: ChecklistItem | null;
  /** 입국신고 가이드일 때 국가별 요건(기한·공식 링크)을 함께 보여주기 위한 국가 코드 */
  countryCode?: string | null;
  onToggleCheck?: (itemId: string, isChecked: boolean) => void;
}

const primary = colors.primary.palette;
const warning = statusColors.warning.palette;

function Bullets({
  items,
  dotColor = `${primary}.400`,
  textColor = "gray.700",
}: {
  items: readonly string[];
  dotColor?: string;
  textColor?: string;
}) {
  return (
    <VStack align="stretch" gap={1.5}>
      {items.map((text, i) => (
        <HStack key={i} gap={2} align="start">
          <Box
            mt="7px"
            w="4px"
            h="4px"
            borderRadius="full"
            flexShrink={0}
            bg={dotColor}
          />
          <Text fontSize="xs" lineHeight="1.6" color={textColor}>
            {text}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

export default function EssentialItemGuideSheet({
  isOpen,
  onClose,
  item,
  countryCode,
  onToggleCheck,
}: EssentialItemGuideSheetProps) {
  const guide = useMemo(
    () => (item ? findEssentialGuide(item.name) : null),
    [item],
  );

  // 입국신고 가이드에는 해당 국가의 요건(기한·공식 링크)을 상단에 함께 노출
  const declaration = useMemo(
    () =>
      guide?.key === "entry-declaration"
        ? getEntryDeclaration(countryCode)
        : null,
    [guide, countryCode],
  );
  const country = useMemo(() => {
    const code = countryCode?.toUpperCase();
    return code ? (countries.find((c) => c.code === code) ?? null) : null;
  }, [countryCode]);
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(["basics"]),
  );

  // 아이템이 바뀌어 다시 열릴 때 아코디언 상태 초기화
  useEffect(() => {
    if (isOpen) setOpenKeys(new Set(["basics"]));
  }, [isOpen, item?.id]);

  if (!item || !guide) return null;

  const isChecked = !!item.is_checked;

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const sections = [
    {
      key: "basics",
      title: "기본 체크포인트",
      icon: ListChecks,
      items: guide.basics,
    },
    ...(guide.tips?.length
      ? [{ key: "tips", title: "준비 팁", icon: Lightbulb, items: guide.tips }]
      : []),
  ];

  const handleCheckToggle = () => {
    if (item.id) onToggleCheck?.(item.id, !isChecked);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={guide.title}
      primaryButton={
        onToggleCheck
          ? {
              text: isChecked ? "체크 해제하기" : "챙겼어요, 체크하기",
              onClick: handleCheckToggle,
            }
          : undefined
      }
    >
      <VStack align="stretch" gap={3} px={4} pb={4}>
        {/* 요약 + 체크 상태 */}
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600">
            {guide.subtitle}
          </Text>
          <Badge
            colorPalette={isChecked ? primary : "gray"}
            variant="subtle"
            fontSize="2xs"
            flexShrink={0}
          >
            {isChecked ? "챙김" : "미체크"}
          </Badge>
        </HStack>

        {/* 해당 국가의 신고 요건 + 공식 작성 링크 */}
        {declaration && (
          <Box
            bg={`${primary}.50`}
            borderWidth="1px"
            borderColor={`${primary}.200`}
            borderRadius="lg"
            px={3}
            py={2.5}
          >
            <HStack gap={1.5} align="center">
              {country?.flag && <Text fontSize="md">{country.flag}</Text>}
              <Text fontSize="sm" fontWeight="bold" color={`${primary}.700`}>
                {country?.name ? `${country.name} · ` : ""}
                {declaration.name}
              </Text>
            </HStack>
            <Text fontSize="xs" color={`${primary}.700`} mt={1} lineHeight="1.6">
              {declaration.deadline}
              {declaration.note ? ` · ${declaration.note}` : ""}
            </Text>
            {declaration.url && (
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
            )}
            {!declaration.url && (
              <Text fontSize="xs" color={`${primary}.600`} mt={1.5}>
                작성처가 수시로 바뀌는 국가입니다. 항공사 안내나 현지 대사관
                공지에서 공식 접수처를 확인하세요.
              </Text>
            )}
          </Box>
        )}

        {/* 기본 체크포인트 / 준비 팁 아코디언 */}
        <VStack align="stretch" gap={2}>
          {sections.map((section) => {
            const isExpanded = openKeys.has(section.key);
            const SectionIcon = section.icon;
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
                  <HStack gap={2}>
                    <Box color={`${primary}.500`}>
                      <SectionIcon size={15} />
                    </Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      {section.title}
                    </Text>
                  </HStack>
                  <Box color="gray.400">
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Box>
                </HStack>
                {isExpanded && (
                  <Box
                    px={3}
                    pb={3}
                    pt={2}
                    borderTopWidth="1px"
                    borderColor="gray.100"
                  >
                    <Bullets items={section.items} />
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>

        {/* 상황별 대처 */}
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
            이런 상황이라면?
          </Text>
          {guide.troubles.map((trouble) => (
            <Box
              key={trouble.situation}
              bg={`${warning}.50`}
              borderWidth="1px"
              borderColor={`${warning}.200`}
              borderRadius="lg"
              px={3}
              py={2.5}
            >
              <HStack gap={1.5} align="center" mb={1.5}>
                <Box color={`${warning}.500`} flexShrink={0}>
                  <CircleAlert size={14} />
                </Box>
                <Text fontSize="xs" fontWeight="bold" color={`${warning}.700`}>
                  {trouble.situation}
                </Text>
              </HStack>
              <Bullets
                items={trouble.solutions}
                dotColor={`${warning}.400`}
                textColor={`${warning}.800`}
              />
            </Box>
          ))}
        </VStack>

        {/* 공식 링크 + 면책 */}
        <Box
          bg="gray.50"
          borderRadius="lg"
          px={3}
          py={2.5}
          borderWidth="1px"
          borderColor="gray.100"
        >
          {guide.links?.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              mb={1.5}
              fontSize="xs"
              fontWeight="semibold"
              color={`${primary}.600`}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              {link.label}
              <ExternalLink size={12} />
            </Link>
          ))}
          <Text fontSize="2xs" color="gray.500" lineHeight="1.6">
            수수료·운영시간 등 세부 규정은 수시로 변경될 수 있습니다. 출국 전
            공식 채널에서 최신 정보를 확인하세요.
          </Text>
        </Box>
      </VStack>
    </BottomSheet>
  );
}

import { SimpleGrid, chakra } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { ScheduleIconOption } from "../memoIcons";

interface IconPickerProps {
  options: ScheduleIconOption[];
  value: string;
  onChange: (key: string) => void;
  columns?: number;
}

export default function IconPicker({
  options,
  value,
  onChange,
  columns = 5,
}: IconPickerProps) {
  return (
    <SimpleGrid columns={columns} gap={2} w="full">
      {options.map(({ key, icon: Icon, label }) => {
        const selected = key === value;
        return (
          <chakra.button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            aria-label={label}
            aria-pressed={selected}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2.5}
            border="2px"
            borderRadius="xl"
            borderColor={selected ? `${colors.primary.palette}.500` : "gray.200"}
            bg={selected ? `${colors.primary.palette}.50` : "gray.50"}
            outline={selected ? `2px solid ${colors.primary.hex[500]}` : undefined}
            outlineOffset={selected ? "2px" : undefined}
            transition="all 0.15s ease"
          >
            <Icon
              size={22}
              color={
                selected ? colors.primary.hex[500] : colors.neutral.hex[500]
              }
            />
          </chakra.button>
        );
      })}
    </SimpleGrid>
  );
}

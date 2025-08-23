import { SimpleGrid } from "@chakra-ui/react";
import { Package } from "lucide-react";

import CategoryBox from "./CategoryBox";
import { CATEGORY_ICONS } from "../constants/category";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";

export type CustomCategory = {
  categoryName: string;
  iconKey: string;
  items: unknown[];
};

export type CombinedCategory = GeneratedCheckList | CustomCategory;

interface GridViewProps {
  categories: CombinedCategory[];
}

export default function GridView({ categories }: GridViewProps) {
  return (
    <SimpleGrid columns={3} gap={4} w="full">
      {categories.map((category) => {
        // 사용자 정의 카테고리인 경우 iconKey 사용, 아니면 categoryName으로 매핑
        const iconKey =
          "iconKey" in category ? category.iconKey : category.categoryName;
        const icon = CATEGORY_ICONS[iconKey] || Package;

        return (
          <CategoryBox
            key={category.categoryName}
            category={category}
            icon={icon}
          />
        );
      })}
    </SimpleGrid>
  );
}

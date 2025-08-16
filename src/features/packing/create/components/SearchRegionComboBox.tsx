import { useMemo, useState, useCallback, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { Combobox, Portal, createListCollection } from "@chakra-ui/react";
import { regionsList, type Region } from "@/shared/data/regions";

import { searchRegions } from "../hooks/useSearchRegions";
import RegionOptionRow from "./RegionOptionRow";

export interface RegionItem {
  label: string;
  value: string;
  region: Region;
}

export interface SearchRegionComboBoxProps {
  placeholder?: string;
  width?: string | number;
  size?: Combobox.RootProps["size"];
  variant?: Combobox.RootProps["variant"];
  valueId?: string;
  defaultValueId?: string;
  onChange?: (region: Region | null) => void;
  contentMaxHeight?: string | number;
}

const DEFAULT_MAX_RESULTS = 100;

export default function SearchRegionComboBox(props: SearchRegionComboBoxProps) {
  const {
    placeholder = "지역명을 입력하세요 (예: 서울, Tokyo, 다낭)",
    width = "100%",
    size = "md",
    variant = "outline",
    valueId,
    defaultValueId,
    onChange,
    contentMaxHeight = "320px",
  } = props;

  const [inputValue, setInputValue] = useState("");
  const setInputValueDebounced = useDebounceCallback(setInputValue, 250);
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState<
    string | null
  >(defaultValueId ?? null);

  const isControlled = valueId !== undefined;
  const selectedId = isControlled ? (valueId ?? null) : uncontrolledSelectedId;
  const comboboxValue = !selectedId ? ([] as string[]) : [selectedId];

  const items: RegionItem[] = useMemo(() => {
    const query = inputValue.trim();
    const matchedRegions = query ? searchRegions(query) : regionsList;
    const limitedRegions = query
      ? matchedRegions
      : matchedRegions.slice(0, DEFAULT_MAX_RESULTS);

    return limitedRegions.map(toRegionItem);
  }, [inputValue]);

  const collection = useMemo(
    () => createListCollection<RegionItem>({ items }),
    [items]
  );

  useEffect(() => {
    if (!isControlled && defaultValueId) {
      const initialRegion =
        regionsList.find((r) => r.id === defaultValueId) || null;
      onChange?.(initialRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValueChange = useCallback(
    (details: Combobox.ValueChangeDetails) => {
      const first = Array.isArray(details.value) ? details.value[0] : undefined;
      const nextRegion =
        items.find((item) => item.value === first)?.region ?? null;

      if (!isControlled) {
        setUncontrolledSelectedId(nextRegion?.id ?? null);
      }
      onChange?.(nextRegion);
    },
    [isControlled, items, onChange]
  );

  const handleInputValueChange = useCallback(
    (e: Combobox.InputValueChangeDetails) => {
      setInputValueDebounced(e.inputValue);
    },
    [setInputValueDebounced]
  );

  return (
    <Combobox.Root
      size={size}
      variant={variant}
      width={width}
      collection={collection}
      onInputValueChange={handleInputValueChange}
      value={comboboxValue}
      onValueChange={handleValueChange}
      multiple={false}
    >
      <Combobox.Control>
        <Combobox.Input placeholder={placeholder} />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content maxH={contentMaxHeight} overflowY="auto">
            <Combobox.Empty>검색 결과가 없습니다</Combobox.Empty>
            {collection.items.map((item: RegionItem) => (
              <Combobox.Item key={item.value} item={item}>
                <RegionOptionRow item={item} />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}

function toRegionItem(r: Region): RegionItem {
  return {
    label: r.englishName ? `${r.name} (${r.englishName})` : r.name,
    value: r.id,
    region: r,
  };
}

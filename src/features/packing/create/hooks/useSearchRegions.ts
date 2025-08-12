import type { Region } from "@/shared/data/regions";
import { regionsList } from "@/shared/data/regions";

const searchIndex = {
  byName: new Map<string, Region>(),
  byKeyword: new Map<string, Region[]>(),
  byCountry: new Map<string, Region[]>(),
};

let initialized = false;
function initializeRegionsSearchIndex() {
  if (initialized) return;
  searchIndex.byName.clear();
  searchIndex.byKeyword.clear();
  searchIndex.byCountry.clear();

  regionsList.forEach((region) => {
    // 이름 인덱스
    searchIndex.byName.set(region.name.toLowerCase(), region);
    if (region.englishName) {
      searchIndex.byName.set(region.englishName.toLowerCase(), region);
    }
    // 국가 인덱스
    const countryKey = region.country.toLowerCase();
    if (!searchIndex.byCountry.has(countryKey)) {
      searchIndex.byCountry.set(countryKey, []);
    }
    searchIndex.byCountry.get(countryKey)!.push(region);
    // 키워드 인덱스
    region.searchKeywords.forEach((kw) => {
      const k = kw.toLowerCase();
      if (!searchIndex.byKeyword.has(k)) {
        searchIndex.byKeyword.set(k, []);
      }
      searchIndex.byKeyword.get(k)!.push(region);
    });
  });

  initialized = true;
}

export function searchRegions(query: string): Region[] {
  initializeRegionsSearchIndex();
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results = new Set<Region>();

  const exact = searchIndex.byName.get(q);
  if (exact) results.add(exact);

  searchIndex.byKeyword.forEach((regions, k) => {
    if (k.includes(q) || q.includes(k)) regions.forEach((r) => results.add(r));
  });

  regionsList.forEach((r) => {
    if (
      r.name.toLowerCase().includes(q) ||
      r.englishName?.toLowerCase().includes(q)
    ) {
      results.add(r);
    }
  });

  return Array.from(results);
}

export function searchByCountry(countryName: string): Region[] {
  initializeRegionsSearchIndex();
  return searchIndex.byCountry.get(countryName.toLowerCase()) || [];
}

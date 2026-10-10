export interface MapPlace {
  place_name: string;
  place_id: string;
  place_address: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** 구글 지도 길찾기. 장소 ID로 찾아 한국어 장소명이어도 정확하다(국내는 자동차 길찾기 미지원) */
export const googleMapsUrl = (place: MapPlace) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.place_name)}&destination_place_id=${place.place_id}`;

/**
 * 국내 지도 앱 길찾기 URL.
 * - 카카오: https 링크라 앱이 없으면 웹으로 열린다
 * - 네이버: 공식 길찾기 링크가 앱 스킴(nmap://)뿐이라 앱이 없으면 열리지 않는다
 */
export function domesticMapLinks(place: MapPlace) {
  const name = encodeURIComponent(place.place_name);
  const hasCoords = place.latitude != null && place.longitude != null;
  const query = encodeURIComponent(
    [place.place_name, place.place_address].filter(Boolean).join(" "),
  );

  return {
    google: googleMapsUrl(place),
    naver: hasCoords
      ? `nmap://route/public?dlat=${place.latitude}&dlng=${place.longitude}&dname=${name}&appname=io.trippack.app`
      : `nmap://search?query=${query}&appname=io.trippack.app`,
    kakao: hasCoords
      ? // 카카오 링크는 쉼표가 구분자라 이름의 쉼표를 뺀다
        `https://map.kakao.com/link/to/${encodeURIComponent(place.place_name.replace(/,/g, ""))},${place.latitude},${place.longitude}`
      : `https://map.kakao.com/link/search/${query}`,
  };
}

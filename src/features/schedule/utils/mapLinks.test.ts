import { describe, expect, it } from "vitest";
import { domesticMapLinks, googleMapsUrl } from "./mapLinks";

const place = {
  place_name: "이치란 라멘, 도톤보리점",
  place_id: "ChIJ123",
  place_address: "일본 오사카",
  latitude: 34.6687,
  longitude: 135.5013,
};
const encodedName = encodeURIComponent(place.place_name);

describe("googleMapsUrl", () => {
  it("장소 ID로 길찾기를 연다", () => {
    expect(googleMapsUrl(place)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedName}&destination_place_id=ChIJ123`,
    );
  });
});

describe("domesticMapLinks", () => {
  it("네이버는 좌표 길찾기, 카카오는 이름의 쉼표를 구분자와 겹치지 않게 뺀다", () => {
    const links = domesticMapLinks(place);
    expect(links.google).toBe(googleMapsUrl(place));
    expect(links.naver).toBe(
      `nmap://route/public?dlat=34.6687&dlng=135.5013&dname=${encodedName}&appname=io.trippack.app`,
    );
    expect(links.kakao).toBe(
      `https://map.kakao.com/link/to/${encodeURIComponent("이치란 라멘 도톤보리점")},34.6687,135.5013`,
    );
  });

  it("좌표가 없으면 이름과 주소로 찾는다", () => {
    const links = domesticMapLinks({
      ...place,
      latitude: null,
      longitude: null,
    });
    const query = encodeURIComponent("이치란 라멘, 도톤보리점 일본 오사카");
    expect(links.naver).toBe(
      `nmap://search?query=${query}&appname=io.trippack.app`,
    );
    expect(links.kakao).toBe(`https://map.kakao.com/link/search/${query}`);
  });
});

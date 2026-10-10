import { Image } from "@chakra-ui/react";
import { openExternalUrl } from "@/shared/utils/nativeMessage";
// App Store 공개 아이콘(84px = 28px의 3배)
import googleMapsIcon from "@/assets/map-apps/google-maps.png";
import naverMapIcon from "@/assets/map-apps/naver-map.png";
import kakaoMapIcon from "@/assets/map-apps/kakao-map.png";
import { domesticMapLinks, type MapPlace } from "../../utils/mapLinks";
import PlaceActionSheet from "./PlaceActionSheet";

/** 실제 앱 아이콘 — 사용자가 홈 화면에서 보던 모양 그대로 */
const appIcon = (src: string) =>
  function AppIcon() {
    return <Image src={src} alt="" boxSize="28px" borderRadius="7px" />;
  };

const GoogleMapsIcon = appIcon(googleMapsIcon);
const NaverMapIcon = appIcon(naverMapIcon);
const KakaoMapIcon = appIcon(kakaoMapIcon);

interface OpenInMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  place: MapPlace;
}

/**
 * 국내 장소를 지도 앱 길찾기로 연다 — 국내는 쓰는 앱이 사람마다 달라 고르게 한다.
 * 해외는 구글 지도 하나라 시트 없이 바로 연다(호출부).
 */
export default function OpenInMapSheet({
  isOpen,
  onClose,
  place,
}: OpenInMapSheetProps) {
  const links = domesticMapLinks(place);

  return (
    <PlaceActionSheet
      isOpen={isOpen}
      onClose={onClose}
      placeName="어느 지도 앱으로 길을 찾을까요?"
      actions={[
        {
          icon: GoogleMapsIcon,
          label: "구글 지도",
          onClick: () => openExternalUrl(links.google),
        },
        {
          icon: NaverMapIcon,
          label: "네이버 지도",
          onClick: () => openExternalUrl(links.naver),
        },
        {
          icon: KakaoMapIcon,
          label: "카카오맵",
          onClick: () => openExternalUrl(links.kakao),
        },
      ]}
    />
  );
}

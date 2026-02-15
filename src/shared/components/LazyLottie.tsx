import { lazy, Suspense } from "react";
import { Box } from "@chakra-ui/react";
import type { CSSProperties } from "react";

const Lottie = lazy(() => import("lottie-react"));

interface LazyLottieProps {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
}

export default function LazyLottie(props: LazyLottieProps) {
  return (
    <Suspense fallback={<Box w="100%" h="100%" />}>
      <Lottie {...props} />
    </Suspense>
  );
}

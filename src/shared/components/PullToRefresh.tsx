import { useState, useRef, useCallback, type ReactNode } from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useHaptic } from "@/shared/hooks/useHaptic";

const MotionBox = motion.create(Box);

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

const THRESHOLD = 60;
const MAX_PULL = 100;

export default function PullToRefresh({
  onRefresh,
  children,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const { haptic } = useHaptic();

  const isAtTop = () => {
    return window.scrollY <= 0;
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAtTop()) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      if (!isAtTop()) {
        isPulling.current = false;
        setPullDistance(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        const dampened = Math.min(diff * 0.4, MAX_PULL);
        setPullDistance(dampened);
      }
    },
    [isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      haptic("medium");

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing, onRefresh, haptic]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <MotionBox
        initial={false}
        animate={{ height: pullDistance > 0 || isRefreshing ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        overflow="hidden"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box py={2}>
          {isRefreshing ? (
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Text fontSize="lg">↻</Text>
            </MotionBox>
          ) : (
            <MotionBox animate={{ rotate: progress * 180, opacity: progress }}>
              <Text fontSize="lg" color="gray.400">
                ↓
              </Text>
            </MotionBox>
          )}
        </Box>
      </MotionBox>
      {children}
    </Box>
  );
}

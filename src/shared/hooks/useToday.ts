import { useEffect, useState } from "react";
import dayjs from "dayjs";

const todayString = () => dayjs().format("YYYY-MM-DD");

/**
 * 오늘 날짜(YYYY-MM-DD). 앱을 켜 둔 채 날이 바뀌어도
 * 앱·탭으로 돌아오면 다시 계산한다(네이티브는 탭 재진입 시 native:tab-focus 주입).
 */
export function useToday() {
  const [today, setToday] = useState(todayString);

  useEffect(() => {
    const update = () => setToday(todayString());
    window.addEventListener("native:tab-focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("native:tab-focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return today;
}

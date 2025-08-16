/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface TravelDates {
  startDate: Date | null;
  endDate: Date | null;
}

interface CalendarProps {
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (dates: TravelDates) => void;
}

export default function Calendar({
  startDate = null,
  endDate = null,
  minDate = new Date(),
  maxDate,
  onChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // 같은 날짜 선택 시 초기화
    if (start && end && dayjs(start).isSame(dayjs(end), "day")) {
      onChange?.({ startDate: null, endDate: null });
      return;
    }

    onChange?.({ startDate: start, endDate: end });
  };

  // 과거 날짜 필터링 함수
  const filterDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const renderHeader = useCallback(
    (props: ReactDatePickerCustomHeaderProps) => {
      const date = dayjs(props.date);
      const dayNames = [
        { text: "일", idx: 0 },
        { text: "월", idx: 1 },
        { text: "화", idx: 2 },
        { text: "수", idx: 3 },
        { text: "목", idx: 4 },
        { text: "금", idx: 5 },
        { text: "토", idx: 6 },
      ];

      const handleClickPrevMonth = () => {
        if (props.date < new Date()) return;
        props.decreaseMonth();
        setCurrentDate(
          dayjs(props?.date).subtract(1, "month").format("YYYY-MM")
        );
      };

      const handleClickNextMonth = () => {
        props.increaseMonth();
        setCurrentDate(dayjs(props?.date).add(1, "month").format("YYYY-MM"));
      };

      return (
        <div className="react-datepicker__header">
          <div className="date__name-wrap">
            <div
              style={{ transform: "rotate(180deg)", cursor: "pointer" }}
              onClick={handleClickPrevMonth}
            >
              <ChevronRight size={21} />
            </div>

            <div className="date__name">
              {date.year()}년 {date.month() + 1}월
            </div>

            <div style={{ cursor: "pointer" }} onClick={handleClickNextMonth}>
              <ChevronRight size={21} />
            </div>
          </div>

          <div className="react-datepicker__day-names__custom">
            {dayNames.map((day) => {
              return (
                <div
                  key={day.idx}
                  className={`day-name ${
                    day.idx === 0
                      ? "is-sunday"
                      : day.idx === 6
                        ? "is-satday"
                        : ""
                  }`}
                >
                  <span>{day.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
    [setCurrentDate]
  );

  const renderDay = useCallback(
    (dayOfMonth: number, date: Date) => {
      const isSunday = new Date(date).getDay() === 0;
      const isSatday = new Date(date).getDay() === 6;
      const isAfterDate = dayjs(currentDate).isBefore(date, "month");
      const isShowStartCss =
        startDate &&
        dayjs(date).isSame(dayjs(startDate).format("YYYY-MM-DD")) &&
        !endDate;

      return (
        <div
          className={`react-datepicker-day ${
            isShowStartCss ? "react-datepicker-range-start" : ""
          }`}
        >
          <div
            className={`day-text  ${isSunday ? "day-text-sun" : ""} ${
              isSatday ? "day-text-sat" : ""
            } ${isAfterDate ? "day-text-after-month" : ""}`}
            style={{ zIndex: 10 }}
          >
            {dayOfMonth}
          </div>
        </div>
      );
    },
    [currentDate, startDate, endDate]
  );

  return (
    <div style={{ maxWidth: "500px", width: "100%", marginTop: "10px" }}>
      <div css={CalendarStyle("#319795")}>
        <DatePicker
          renderCustomHeader={renderHeader}
          renderDayContents={renderDay}
          startDate={startDate}
          endDate={endDate}
          selected={startDate}
          minDate={minDate}
          maxDate={maxDate}
          filterDate={filterDate}
          selectsRange
          inline
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

const CalendarStyle = (selectedDateColor: string) => css`
  width: 100%;

  // Reset
  .react-datepicker__day--selected {
    border-radius: unset;
    background-color: unset;
  }

  .react-datepicker__day--keyboard-selected {
    border-radius: unset;
    background-color: unset;
  }

  .react-datepicker__day--in-range {
    border-radius: unset;
    background-color: unset;
  }

  .react-datepicker__day--outside-month,
  .react-datepicker__day--disabled {
    pointer-events: none !important;

    .day-text,
    .day-text-sun,
    .day-text-sat {
      color: var(--chakra-colors-fg-muted) !important;
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }

    // 호버 및 선택 효과 비활성화
    &:hover {
      background: none !important;
    }

    .day-text {
      background: transparent !important;
    }
  }

  .react-datepicker__day--outside-month {
    pointer-events: none;
    .day-text {
      user-select: none;
      color: transparent !important;
    }
  }

  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    background: none !important;
    color: white;
  }

  // Custom
  .react-datepicker {
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 0;
    padding: 0;
  }

  .react-datepicker__month-container {
    float: none;
    width: 100%;
  }

  .react-datepicker__header {
    padding-top: 0;
    padding-bottom: 0;
    background-color: var(--chakra-colors-bg);
    border-bottom: none;

    .date__name-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 5px;
    }

    .date__name {
      display: flex;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 0px !important;
    }

    .react-datepicker__day-names__custom {
      display: flex;
      justify-content: space-between;
      .day-name {
        flex: 1;
        width: 48px;
        padding: 14px 0;
      }

      .is-sunday {
        color: var(--chakra-colors-red-fg);
      }
      .is-satday {
        color: var(--chakra-colors-blue-fg);
      }
    }
  }

  .react-datepicker__day-names {
    display: none;
  }

  .react-datepicker__month {
    display: flex;
    flex-direction: column;
    margin: 0;
    text-align: unset;
    row-gap: 0 !important;

    .react-datepicker__week {
      display: flex;
      align-content: center;
      justify-content: space-between;

      .react-datepicker__day {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin: 0;
        color: var(--chakra-colors-fg);

        &:focus {
          outline: none;
        }
        &:hover {
          background: none;
        }

        .day-text {
          display: flex;
          justify-content: center;
          align-content: center;
          flex-wrap: wrap;
          margin: 0 auto;
          width: 48px;
          height: 48px;
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
        }

        .day-text-sun {
          color: var(--chakra-colors-red-fg);
        }
        .day-text-sat {
          color: var(--chakra-colors-blue-fg);
        }
        .day-text-after-month {
          display: none;
        }
      }
    }
  }

  // Range custom (원본 스타일 복원)
  .react-datepicker-day {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .react-datepicker__day--in-range:not(.react-datepicker__day--outside-month),
  .react-datepicker__day:not(.react-datepicker__day--outside-month)
    > .react-datepicker-range-start {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: auto;
      height: 48px;
      background-color: ${selectedDateColor};
      opacity: 0.3;
      z-index: 1;
    }
    .day-text {
      border-radius: 50%;
      background: transparent;
      color: var(--chakra-colors-fg);
      z-index: 1;
    }
  }

  .react-datepicker__day--range-start:not(
    .react-datepicker__day--outside-month
  ),
  .react-datepicker__day--range-end:not(.react-datepicker__day--outside-month),
  .react-datepicker__day:not(.react-datepicker__day--outside-month)
    > .react-datepicker-range-start {
    .day-text {
      background: ${selectedDateColor};
      color: white !important;
      z-index: 10;
    }
  }

  .react-datepicker__day--range-start:not(
    .react-datepicker__day--outside-month
  ),
  .react-datepicker__day:not(.react-datepicker__day--outside-month)
    > .react-datepicker-range-start {
    &:after {
      left: 50%;
    }
  }

  .react-datepicker__day--range-end:not(.react-datepicker__day--outside-month) {
    &:after {
      right: 50%;
    }
  }

  @media screen and (max-width: 500px) {
    .react-datepicker__header {
      .date__name {
        margin-bottom: 10px;
        justify-content: flex-start;
      }
    }
  }
`;

/**
 * 유료 상품(강연·모임) 화면 공용 표기 헬퍼.
 * 모임 일시는 DB 에 UTC 로 저장되고, 표기는 항상 한국 시간(Asia/Seoul) 기준이다.
 * 서버·클라이언트 어디서든 쓸 수 있는 순수 모듈이다.
 */

const KST_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

interface EventDateParts {
  year: number;
  month: number;
  day: number;
  /** '일' ~ '토' */
  weekday: string;
  hour: number;
  minute: number;
}

function toEventDateParts(eventAt: string): EventDateParts {
  const parts = KST_FORMATTER.formatToParts(new Date(eventAt));
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    year: Number(read('year')),
    month: Number(read('month')),
    day: Number(read('day')),
    weekday: read('weekday'),
    hour: Number(read('hour')),
    minute: Number(read('minute')),
  };
}

const pad = (value: number) => String(value).padStart(2, '0');

export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/** 상세 정보 행 — '2026년 8월 8일 (토) · 오전 10시' (정각이 아니면 '오전 10시 30분') */
export function eventDateLabel(eventAt: string): string {
  const { year, month, day, weekday, hour, minute } = toEventDateParts(eventAt);
  const meridiem = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const time = minute === 0 ? `${meridiem} ${hour12}시` : `${meridiem} ${hour12}시 ${minute}분`;

  return `${year}년 ${month}월 ${day}일 (${weekday}) · ${time}`;
}

/** 결제 완료 영수증 — '2026. 08. 08 (토) 10:00' */
export function eventScheduleLabel(eventAt: string): string {
  const { year, month, day, weekday, hour, minute } = toEventDateParts(eventAt);
  return `${year}. ${pad(month)}. ${pad(day)} (${weekday}) ${pad(hour)}:${pad(minute)}`;
}

/** 메인 배너 캡션의 날짜 조각 — '8.8 (토)' */
export function eventShortDateLabel(eventAt: string): string {
  const { month, day, weekday } = toEventDateParts(eventAt);
  return `${month}.${day} (${weekday})`;
}

/** 결제 완료 안내 첫 줄에 쓰는 '8월 8일' */
export function eventMonthDayLabel(eventAt: string): string {
  const { month, day } = toEventDateParts(eventAt);
  return `${month}월 ${day}일`;
}

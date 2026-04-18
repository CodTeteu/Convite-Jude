import { calendarEvent } from "@/config/invite";

function encode(value: string) {
  return encodeURIComponent(value);
}

export function buildGoogleCalendarUrl() {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encode(
    calendarEvent.title,
  )}&details=${encode(calendarEvent.details)}&location=${encode(
    calendarEvent.location,
  )}&dates=${calendarEvent.startDateTime}/${calendarEvent.endDateTime}`;
}

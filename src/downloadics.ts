import dayjs from "dayjs";
import { ICalendar } from "datebook";

type iCalendarEvent = {
  start: Date;
  end: Date;
  title: string;
  location?: string;
};

// Generate Date based on day and time scraped from page
const generateICSDate = (
  date: dayjs.Dayjs,
  hour: string,
  minutes: string
): Date => date.hour(Number(hour)).minute(Number(minutes)).toDate();

// Generate Calendar object from list of events
const generateCalendar = (
  calendarEvents: iCalendarEvent[]
): ICalendar | null => {
  let calendar: ICalendar | null = null;
  for (const calendarEvent of calendarEvents) {
    const eventCalendarObject = new ICalendar(calendarEvent);
    if (calendar === null) {
      calendar = eventCalendarObject;
    } else {
      calendar.addEvent(eventCalendarObject);
    }
  }
  return calendar;
};

// Retrieve the location from the page
const getLocationName = (): string | null => {
  const locationContainer = document.querySelector(".page-title header h3");
  const location = locationContainer?.textContent;
  if (location) {
    return location.replace(/\(.*\)/g, "");
  }
  return null;
};

// Retrieve the employee name from the page
const getEmployeeName = (): string | null => {
  const selector = document.querySelector(
    "ctrl-select[valuemember=employeeId]"
  );
  if (selector) {
    const employeeId = selector.getAttribute("value");
    const employeeOption = selector.querySelector(
      `option[value='${employeeId}']`
    );
    if (employeeOption?.textContent) {
      return employeeOption.textContent;
    }
  }
  return null;
};

// Generate filename from page variables
const generateFilename = (
  date: dayjs.Dayjs,
  location: string | null
): string => {
  let filename = `Weekrooster ${date.format("DD MMM")}`;

  const employeeName = getEmployeeName();
  if (employeeName) {
    filename += ` - ${employeeName}`;
  }

  if (location) {
    filename += ` @ ${location}`;
  }
  return `${filename}.ics`;
};

try {
  // Check if we are on the correct page with all the elements
  const dateSelector = document.querySelector("ctrl-calendar[type='week']");
  const schedule = document.querySelector(
    "ctrl-schedule.mobile-ready .sch-content"
  );
  if (!dateSelector || !schedule) {
    throw new Error(
      'Could not find schedule! Make sure you are on page: "Weekrooster werknemer"'
    );
  }

  // Retrieve the starting date from the page
  const dateSelectorValue = dateSelector.getAttribute("value");
  if (!dateSelectorValue) {
    console.error(dateSelectorValue);
    throw new Error("Dates could not be found!");
  }
  const firstDate = dayjs(dateSelectorValue);
  let currentDate = firstDate;

  // Read events from the schedule
  const location = getLocationName();
  const icsEvents: iCalendarEvent[] = [];
  for (const scheduleRow of schedule.querySelectorAll("t-row ol.schedule")) {
    // Get each schedule item
    for (const { textContent } of scheduleRow.querySelectorAll(
      ".schedule-item .ctrl-text"
    )) {
      if (textContent) {
        // Parse text to time numbers
        const [startHour, startMinutes] = textContent
          .substring(0, 5)
          .split(":");
        const [endHour, endMinutes] = textContent.substring(8, 13).split(":");

        // Create ICS event objects for the found schedule items
        const icsEvent: iCalendarEvent = {
          start: generateICSDate(currentDate, startHour, startMinutes),
          end: generateICSDate(currentDate, endHour, endMinutes),
          title: `Werk ${location ? `@ ${location}` : ""}`,
        };
        if (location) {
          icsEvent.location = location;
        }
        icsEvents.push(icsEvent);
      }
    }
    currentDate = currentDate.add(1, "day");
  }

  const calendar = generateCalendar(icsEvents);
  if (!calendar) {
    throw new Error("No events found on schedule!");
  }
  calendar.download(generateFilename(firstDate, location));
} catch (err) {
  console.error(err);
  alert(err.message);
}

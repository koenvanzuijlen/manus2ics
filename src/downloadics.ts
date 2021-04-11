import dayjs from "dayjs";

const generateICSTime = (
  date: dayjs.Dayjs,
  hour: string,
  minutes: string
): number[] => {
  return [
    date.year(),
    date.month() + 1,
    date.date(),
    Number(hour),
    Number(minutes),
  ];
};

try {
  // Check if we are on the correct page with all the elements
  const dateSelector = document.querySelector("ctrl-calendar");
  const schedule = document.querySelector(
    "ctrl-schedule.mobile-ready .sch-content"
  );
  if (!dateSelector || !schedule) {
    throw new Error(
      "Weekrooster werknemer niet gevonden! Controleer of je op de juiste pagina zit"
    );
  }

  // Retrieve the starting date from the page
  const dateSelectorValue = dateSelector.getAttribute("value");
  if (!dateSelectorValue) {
    console.error(dateSelectorValue);
    throw new Error("Datums niet gevonden");
  }
  let currentDate = dayjs(dateSelectorValue);

  // Read event times from the schedule
  const icsEvents = [];
  for (const scheduleRow of schedule.querySelectorAll("t-row ol.schedule")) {
    for (const { textContent } of scheduleRow.querySelectorAll(
      ".schedule-item .ctrl-text"
    )) {
      if (textContent) {
        // Parse hour text to numbers
        const [startHour, startMinutes] = textContent
          .substring(0, 5)
          .split(":");
        const [endHour, endMinutes] = textContent.substring(8, 13).split(":");

        // Create ICS event objects for the found schedule items
        icsEvents.push({
          start: generateICSTime(currentDate, startHour, startMinutes),
          end: generateICSTime(currentDate, endHour, endMinutes),
        });
      }
    }
    currentDate = currentDate.add(1, "day");
  }

  console.dir(icsEvents);
} catch (err) {
  console.error(err);
  alert(err.message);
}

export function convertToEthiopianDateTime(dateString, timeString) {
  // Handle cases where only date or time is provided
  if (!dateString) {
    dateString = new Date().toISOString().slice(0, 10); // Get current date
  }
  if (!timeString) {
    timeString = "00:00:00";
  }

  // Parse the date and time components
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(5, 7), 10) - 1; // Months are 0-indexed
  const day = parseInt(dateString.slice(8, 10), 10);
  let hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(3, 5), 10);

  // Define Ethiopian New Year in the Gregorian calendar
  const ethiopianNewYearGregorian = new Date(year, 8, 11); // Ethiopian New Year starts on September 11 in Gregorian calendar

  // Calculate the difference between the given date and Ethiopian New Year
  const differenceInMillis = new Date(year, month, day) - ethiopianNewYearGregorian;
  const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

  // Calculate Ethiopian year
  const ethiopianYear = year - 8 + (differenceInDays >= 0 ? 1 : 0); // Adjust for Ethiopian New Year

  // Calculate Ethiopian day and month
  let remainingDays = differenceInDays >= 0 ? differenceInDays : differenceInDays + 365; // Adjust for leap years
  const ethiopianMonth = Math.floor(remainingDays / 30) + 1;
  const ethiopianDay = remainingDays % 30 + 1;

  // Convert time to Ethiopian format
  let ethiopianHours = (hours + 6) % 12;
  if (ethiopianHours === 0) ethiopianHours = 12;
  const period = hours >= 6 && hours < 18 ? "ቀን" : "ምሽት";

  // Format the Ethiopian date and time
  const formattedEthiopianDate = `${ethiopianYear}-${ethiopianMonth.toString().padStart(2, "0")}-${ethiopianDay.toString().padStart(2, "0")}`;
  const formattedEthiopianTime = `${ethiopianHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;

  if (dateString && timeString !== '00:00:00') {
    return `${formattedEthiopianDate} ፡ ${formattedEthiopianTime}`;
  } else if (dateString) {
    return formattedEthiopianDate;
  } else {
    return formattedEthiopianTime;
  }
}

// // Example usage
// const dateString = "2024-05-24";
// const timeString = "10:15:00";
// const ethiopianDateTime = convertToEthiopianDateTime(dateString, timeString);
// console.log(ethiopianDateTime);
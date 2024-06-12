

export const times = [{ '1:00 (ከጠዋቱ)': '7:00 AM' }, { '2:00 (ከጠዋቱ)': '2:00 AM' }, { '3:00 (ከጠዋቱ)': '9:00 AM' }, { '4:00 (ከረፋዱ)': '10:00 AM' }, { '5:00 (ከረፋዱ)': '11:00 AM' }, { '6:00 (ከቀኑ)': '12:00 AM' }, { '7:00 (ከቀኑ)': '1:00 PM' }, { '8:00 (ከቀኑ)': '2:00 PM' }, { '9:00 (ከቀኑ)': '3:00 PM' }, { '10:00 (ከቀኑ)': '4:00 PM' }, { '11:00 (ከአመሻሹ)': '5:00 PM' }, { '12:00 (ከአመሻሹ)': '6:00 PM' }, { '1:00 (ከምሽቱ)': '7:00 PM' }, { '2:00 (ከምሽቱ)': '8:00 PM' }, { '3:00 (ከምሽቱ)': '9:00 PM' }, { '4:00 (ከምሽቱ)': '10:00 PM' }, { '5:00 (ከምሽቱ)': '11:00 PM' }, { '6:00 (ከለሊቱ)': '12:00 PM' }, { '7:00 (ከለሊቱ)': '1:00 AM' }, { '8:00 (ከለሊቱ)': '2:00 AM' }, { '9:00 (ከለሊቱ)': '3:00 AM' }, { '10:00 (ከለሊቱ)': '4:00 AM' }, { '11:00 (ከለሊቱ)': '5:00 AM' }, { '12:00 (ክጥዋቱ)': '6:00 AM' }];

export function convertTo24HourFormat(time12h) {
  var [time, period] = time12h.split(' ');
  var [hours, minutes] = time.split(':');
  var seconds = '00'; // Adding seconds part

  if (period === 'PM' && hours !== '12') {
    hours = String(Number(hours) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours}:${minutes}:${seconds}`;
}



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
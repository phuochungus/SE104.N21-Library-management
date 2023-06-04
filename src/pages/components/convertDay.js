export default function millisecondsToDays(milliseconds) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const days = Math.floor(milliseconds / millisecondsPerDay);
    return days;
}
export default function calAge(date) {
    const birth = new Date(date)
    const diff_ms = Date.now() - birth.getTime();
    const age_dt = new Date(diff_ms);
    const age = Math.abs(age_dt.getUTCFullYear() - 1970)
    return age
}
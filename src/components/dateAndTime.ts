export function timeSince(date: number)
{
    var seconds = Math.floor((new Date().getTime() - date) / 1000);

    var interval = seconds / 31536000;

    interval = seconds / 86400;
    if (interval > 1)
    {
        const day = Math.floor(interval);
        return day + " days"
    }

    interval = seconds / 3600;
    if (interval > 1)
        return Math.floor(interval) + " hours";

    interval = seconds / 60;
    if (interval > 1)
        return Math.floor(interval) + " mins";

    return Math.floor(seconds) + " seconds";
}
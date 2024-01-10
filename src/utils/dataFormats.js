export function dateTimeFormat(dbDateTime) {
    const presentDateTime = new Date();
    const dateTime = new Date(dbDateTime);

    const timeDifference = presentDateTime - dateTime;
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        const plural = years === 1 ? '' : 's';
        return `${years} year${plural} ago`;
    } else if (months > 0) {
        const plural = months === 1 ? '' : 's';
        return `${months} month${plural} ago`;
    } else if (days > 0) {
        const plural = days === 1 ? '' : 's';
        return `${days} day${plural} ago`;
    } else if (hours > 0) {
        const plural = hours === 1 ? '' : 's';
        return `${hours} hour${plural} ago`;
    } else if (minutes > 0) {
        const plural = minutes === 1 ? '' : 's';
        return `${minutes} minute${plural} ago`;
    } else {
        return 'just now';
    }
}





console.log(dateTimeFormat("2021-01-12T00:30:30.452Z"))
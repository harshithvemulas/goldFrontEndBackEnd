import { DateTime } from 'luxon';
export const compareDate = (dateTime, days = 7) => {
    const now = DateTime.now();
    const createdDate = DateTime.fromISO(dateTime.toFormat('yyyy-MM-dd'));
    const daysAgo = now.minus({ days });
    return createdDate >= daysAgo && createdDate <= now;
};
//# sourceMappingURL=compare_date_time.js.map
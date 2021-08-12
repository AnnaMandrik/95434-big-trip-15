import dayjs from 'dayjs';

const getDateFormat = ((date) => dayjs(date).format('DD/MM/YY HH:mm'));
const getDateISO = ((date) => dayjs(date).format('YYYY-MM-DDTHH:mm'));
const getDateHoursMinutes = ((date) => dayjs(date).format('HH:mm'));
const getDateMonthDay = ((date) => dayjs(date).format('MMM DD'));


export {getDateFormat, getDateISO, getDateHoursMinutes, getDateMonthDay};


import { Range } from 'Controls/dateUtils';
import { RecordSet } from 'Types/collection';
import { date as formatDate } from 'Types/formatter';


// Сделаем выходными каждый понедельник, субботу и воскресение
const getMonthData = (value: Date) => {
    const result = {};
    const id = dateToId(value);
    const daysInMonth = new Date(value.getFullYear(), value.getMonth() + 1, value.getDate() - 1).getDate();
    result.id = id;
    result.holidaysData = [];
    for (let i = 0; i < daysInMonth; i++) {
        const dayOfWeek = (value.getDay() + i) % 7;
        result.holidaysData.push(dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 6);
    }
    return result;
};

const dateToId = (date: Date) => {
    return formatDate(date, 'YYYY-MM-DD');
};

export default class HolidaysGetter {
    getHolidays(startValue, endValue) {
        const resultArray = [];
        const periodLength = Range.getPeriodLengthInMonths(startValue, endValue);
        for (let i = 0; i < periodLength; i++) {
            const value = new Date(startValue.getFullYear(), startValue.getMonth() + i);
            const result = getMonthData(value);
            resultArray.push(result);
        }

        const resultRecord = new RecordSet({
            rawData: resultArray,
            keyProperty: 'id'
        });
        return Promise.resolve(resultRecord);
    }
}
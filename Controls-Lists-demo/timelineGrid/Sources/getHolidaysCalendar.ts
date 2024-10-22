import { Model } from 'Types/entity';
import { Query } from 'Types/source';
import { date as formatDate } from 'Types/formatter';
import { Base as BaseDateUtils } from 'Controls/dateUtils';
import { IHolidaysConfig, Quantum, IHoliday, DateType } from 'Controls-Lists/timelineGrid';

import { isWeekend, shiftDate } from 'Controls-Lists-demo/timelineGrid/WI/Utils/common';
import { RecordSet } from 'Types/collection';

export function getHolidayConfig(): IHolidaysConfig {
    return {
        calendarProperty: 'holidaysData',
        dateProperty: 'date',
        dayTypeProperty: 'type',
        holidaysProperty: 'holidays',
    };
}

export function getHolidays(): RecordSet {
    const data = [
        {
            date: '2023-01-07',
            type: DateType.Holiday,
            holidays: [
                {
                    Name: 'Рождество Христово',
                    Description: 'Основной календарь',
                },
            ],
        },
        {
            date: '2023-01-11',
            type: DateType.Holiday,
            holidays: [
                {
                    Name: 'Праздник 1',
                    Description: 'Основной календарь',
                },
                {
                    Name: 'Праздник 2',
                    Description: 'Основной календарь',
                },
            ] as IHoliday[],
        },
        {
            date: '2023-01-12',
            type: DateType.WorkDay,
            holidays: [
                {
                    Name: 'Праздник 1',
                    Description: 'Праздник, но не выходной день',
                },
            ] as IHoliday[],
        },
    ];

    return new RecordSet({
        rawData: data,
        keyProperty: 'date',
    });
}

export default function generateHolidaysCalendar(startDate: Date | number) {
    let startPosition = new Date(startDate);
    startPosition = BaseDateUtils.getStartOfYear(startPosition);
    const endPosition = BaseDateUtils.getEndOfYear(startPosition);

    const dates = getHolidays();

    const currentDate = new Date(startPosition);
    while (currentDate.getTime() !== endPosition.getTime()) {
        if (isWeekend(currentDate)) {
            const newWeekendItem = new Model({
                rawData: {
                    date: formatDate(currentDate, 'YYYY-MM-DD'),
                    type: 1,
                },
                keyProperty: 'date',
            });
            dates.add(newWeekendItem);
        }
        shiftDate(currentDate, 'forward', Quantum.Day);
    }
    return dates;
}

export function generateMetaData(
    query: Query,
    colsCursorProperty: string = 'dynamicColumnsData'
): { holidaysData: RecordSet } {
    const filter = query.getWhere();
    const columnsFilterRecord = filter[colsCursorProperty];
    const dates = generateHolidaysCalendar(new Date(columnsFilterRecord.get('position')));

    return {
        holidaysData: dates,
    };
}

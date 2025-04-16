import { IHolidaysConfig } from 'Controls-Lists/timelineGrid';
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
            type: 2,
            holidays: [{ Name: 'Рождество Христово', Description: 'Основной календарь' }],
        },
        {
            date: '2023-01-11',
            type: 2,
            holidays: [
                { Name: 'Праздник 1', Description: 'Основной календарь' },
                {
                    Name: 'Праздник 2',
                    Description: 'Основной календарь',
                },
            ],
        },
        {
            date: '2023-01-12',
            type: 0,
            holidays: [{ Name: 'Праздник 1', Description: 'Праздник, но не выходной день' }],
        },
    ];

    return new RecordSet({
        rawData: data,
        keyProperty: 'date',
    });
}

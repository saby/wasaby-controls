import { RecordSet } from 'Types/collection';
import { DateAndTime } from './CellTemplates/DateAndTime';
import { Name } from './CellTemplates/Name';

export function getData() {
    return [
        {
            key: 1,
            date: '01 мая',
            time: '06:02',
            name: 'Колесов В.',
        },
        {
            key: 3,
            date: '01 мая',
            time: '06:02',
            name: 'Авраменко А.',
        },
        {
            key: 30,
            date: '01 мая',
            time: '06:02',
            name: 'Панихин К.',
        },
        {
            key: 31,
            date: '01 мая',
            time: '08:25',
            name: 'Авраменко А.',
        },
        {
            key: 32,
            date: '01 мая',
            time: '08:25',
            name: 'Панихин К.',
        },
        {
            key: 33,
            date: '01 мая',
            time: '08:33',
            name: 'Авраменко А.',
        },
        {
            key: 34,
            date: '01 мая',
            time: '08:33',
            name: 'Панихин К.',
        },
        {
            key: 35,
            date: '01 мая',
            time: '08:33',
            name: 'Колесов В.',
        },
        {
            key: 5,
            date: '02 мая',
            time: '07:41',
            name: 'Колесов В.',
        },
        {
            key: 51,
            date: '02 мая',
            time: '07:41',
            name: 'Авраменко А.',
        },
        {
            key: 6,
            date: '02 мая',
            time: '08:25',
            name: 'Авраменко А.',
        },
        {
            key: 61,
            date: '02 мая',
            time: '08:25',
            name: 'Панихин К.',
        },
        {
            key: 8,
            date: '03 мая',
            time: '09:41',
            name: 'Колесов В.',
        },
        {
            key: 81,
            date: '03 мая',
            time: '09:41',
            name: 'Колесов В.',
        },
        {
            key: 82,
            date: '03 мая',
            time: '09:41',
            name: 'Авраменко А.',
        },
        {
            key: 9,
            date: '03 мая',
            time: '09:55',
            name: 'Колесов В.',
        },
        {
            key: 91,
            date: '03 мая',
            time: '09:55',
            name: 'Авраменко А.',
        },
        {
            key: 11,
            date: '04 мая',
            time: '06:02',
            name: 'Колесов В.',
        },
        {
            key: 12,
            date: '04 мая',
            time: '06:02',
            name: 'Авраменко А.',
        },
        {
            key: 13,
            date: '04 мая',
            time: '08:25',
            name: 'Авраменко А.',
        },
        {
            key: 14,
            date: '04 мая',
            time: '08:25',
            name: 'Колесов В.',
        },
        {
            key: 141,
            date: '04 мая',
            time: '08:41',
            name: 'Колесов В.',
        },
        {
            key: 142,
            date: '04 мая',
            time: '08:41',
            name: 'Колесов В.',
        },
        {
            key: 15,
            date: '06 мая',
            time: '07:41',
            name: 'Колесов В.',
        },
        {
            key: 17,
            date: '06 мая',
            time: '07:41',
            name: 'Колесов В.',
        },
        {
            key: 18,
            date: '06 мая',
            time: '09:41',
            name: 'Колесов В.',
        },
        {
            key: 19,
            date: '06 мая',
            time: '09:41',
            name: 'Колесов В.',
        },
    ];
}

export function getColumns() {
    return [
        {
            displayProperty: 'dateTime',
            render: <DateAndTime />,
            width: '125px',
            stickyProperty: ['date', 'time'],
        },
        {
            displayProperty: 'name',
            render: <Name />,
            width: '300px',
        },
    ];
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}

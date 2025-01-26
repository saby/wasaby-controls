import { Images } from 'Controls-Lists-demo/timelineGrid/Sources/Images';
import { IStaff } from 'Controls-Lists-demo/timelineGrid/Sources/Data';

export const STAFF_STRUCTURE = {
    key: 'number',
    name: 'string',
    position: 'string',
    image: 'string',
    parent: 'number',
    type: 'string',
    startWorkDate: 'dateTZ',
    dynamicColumnsData: 'recordSet',
    EventRS: 'recordSet',
};

export const START_DATE = Date.parse('2023-01-01 00:00:00+03');

export const STAFF: IStaff[] = [
    {
        key: 0,
        name: 'Калинина Ника',
        position: 'Инженер-программист (3 категории)',
        parent: null,
        type: null,
        image: Images[0],
        startWorkDate: new Date(2022, 0, 0),
    },
    {
        key: 1,
        name: 'Яковлева Софья',
        position: 'Инженер-программист (3+ категории)',
        parent: null,
        type: null,
        image: Images[1],
        startWorkDate: new Date(2022, 0, 0),
    },
    {
        key: 2,
        name: 'Сидорова Алиса',
        position: 'Инженер-программист (2 категории)',
        parent: null,
        type: null,
        image: Images[2],
        startWorkDate: new Date(2022, 0, 0),
    },
    {
        key: 3,
        name: 'Антонова Валерия',
        position: 'Инженер-программист (2+ категории)',
        parent: null,
        type: null,
        image: Images[3],
        startWorkDate: new Date(2022, 0, 0),
    },
];

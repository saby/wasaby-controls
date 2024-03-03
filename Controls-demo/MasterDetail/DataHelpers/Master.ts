import { IColumn, IHeaderCell } from 'Controls/grid';

interface IData {
    id: string;
    name: string;
    counter: string;
    'Раздел@': boolean;
    Раздел: number;
    group: string;
    sourceType: string;
}

export const Master = {
    getData(): IData[] {
        return [
            {
                id: '0',
                name: 'Входящие',
                counter: '5',
                'Раздел@': true,
                Раздел: null,
                sourceType: 'incoming',
                group: 'CONTROLS_HIDDEN_GROUP',
            },
            {
                id: '3',
                'Раздел@': false,
                Раздел: 0,
                name: 'Входящие задачи',
                counter: '16',
                sourceType: 'incomingTasks',
                group: 'CONTROLS_HIDDEN_GROUP',
            },
            {
                id: '2',
                'Раздел@': null,
                Раздел: 0,
                name: 'Планы',
                counter: '3',
                sourceType: 'plans',
                group: 'CONTROLS_HIDDEN_GROUP',
            },
            {
                id: '10',
                'Раздел@': null,
                Раздел: null,
                name: 'Критические ошибки',
                counter: '2',
                sourceType: 'criticalBugs',
                group: '21.3201',
            },
            {
                id: '14',
                'Раздел@': null,
                Раздел: null,
                name: 'Срочные задачи',
                counter: '5',
                sourceType: 'hotTasks',
                group: '21.3201',
            },
            {
                id: '4',
                'Раздел@': null,
                Раздел: null,
                name: 'Задачи от Андрея Б.',
                counter: '84',
                sourceType: 'andrewBTasks',
                group: '21.4100',
            },
            {
                id: '6',
                'Раздел@': null,
                Раздел: null,
                name: 'Задачи от Дмитрия К.',
                counter: '5',
                sourceType: 'dmitriyKTasks',
                group: '21.4100',
            },
            {
                id: '9',
                'Раздел@': null,
                Раздел: null,
                name: 'Повышение',
                counter: '4',
                sourceType: 'levelUp',
                group: '21.4100',
            },
            {
                id: '1',
                name: 'Поручения',
                counter: '2',
                'Раздел@': false,
                Раздел: null,
                sourceType: 'instructions',
                group: '21.5100',
            },
            {
                id: '5',
                'Раздел@': null,
                Раздел: null,
                name: 'Задачи от Андрея С.',
                counter: '1',
                sourceType: 'andrewSTasks',
                group: '21.5100',
            },
            {
                id: '7',
                'Раздел@': null,
                Раздел: null,
                name: 'Задачи от Александра Г.',
                counter: undefined,
                sourceType: 'alexGTasks',
                group: '21.5100',
            },
            {
                id: '8',
                'Раздел@': null,
                Раздел: null,
                name: 'Отложенные',
                counter: '99',
                sourceType: 'postponed',
                group: '21.5100',
            },
            {
                id: '11',
                'Раздел@': null,
                Раздел: null,
                name: 'Задачи вынесенные из вехи',
                counter: '74',
                sourceType: 'postponedTasks',
                group: '21.5100',
            },
            {
                id: '12',
                'Раздел@': null,
                Раздел: null,
                name: '3.18.710',
                counter: '5',
                sourceType: '3.18.710',
                group: '21.5100',
            },
            {
                id: '13',
                'Раздел@': null,
                Раздел: null,
                name: 'TODO',
                counter: '5',
                sourceType: 'todoTasks',
                group: '21.5100',
            },

            {
                id: '15',
                'Раздел@': null,
                Раздел: null,
                name: 'Прочие',
                counter: '5',
                sourceType: 'otherTasks',
                group: 'Без вехи',
            },
        ];
    },
    getHeader(): IHeaderCell[] {
        return [
            {
                caption: undefined, // Иначе не будет кнопки "Назад"
            },
            {
                caption: 'Итого',
            },
        ];
    },
    getColumns(): IColumn[] {
        return [
            {
                displayProperty: 'name',
                width: 'auto',
            },
            {
                displayProperty: 'counter',
                width: 'auto',
            },
        ];
    },
};

import { RecordSet } from 'Types/collection';
import { LadderTasksPhoto } from './CellTemplates/LadderTasksPhoto';
import { LadderTasksDescription } from './CellTemplates/LadderTasksDescription';
import { LadderTasksReceived } from './CellTemplates/LadderTasksReceived';

export interface IData {
    key: number;
    message?: string;
    fullName?: string;
    photo?: Images;
    date?: string;
    state?: string;
    group?: string;
}

export enum Images {
    Green = 'green',
    Red = 'red',
    Yellow = 'yellow',
    Blue = 'blue',
}

export function getData(): IData[] {
    return [
        {
            key: 1,
            message:
                'Регламент: Ошибка в разработку. Автор: Дубенец Д.А. Описание: (reg-chrome-presto) 3.18.150 controls - Поехала верстка кнопок когда они задизейблены prestocarry',
            fullName: 'Крайнов Дмитрий',
            photo: Images.Green,
            date: '6 мар',
            state: 'Review кода (нач. отдела)',
            group: 'CONTROLS_HIDDEN_GROUP',
        },
        {
            key: 2,
            message:
                'Регламент: Ошибка в разработку. Автор: Волчихина Л.С. Описание: Отображение колонок. При снятии галки с колонки неверная всплывающая подсказка',
            fullName: 'Крайнов Дмитрий',
            photo: Images.Green,
            date: '6 мар',
            state: 'Review кода (нач. отдела)',
            group: 'CONTROLS_HIDDEN_GROUP',
        },
        {
            key: 3,
            message: 'Смотри надошибку. Нужно сделать тесты, чтобы так в будущем не разваливалось',
            fullName: 'Крайнов Дмитрий',
            photo: Images.Green,
            date: '6 мар',
            state: 'Выполнение',
            group: 'CONTROLS_HIDDEN_GROUP',
        },
        {
            key: 4,
            message:
                'Регламент: Ошибка в разработку. Автор: Оборевич К.А. Описание: Розница. Замечания к шрифтам в окнах Что сохранить в PDF/Excel и Что напечатать',
            fullName: 'Крайнов Дмитрий',
            photo: Images.Green,
            date: '12 ноя',
            state: 'Review кода (нач. отдела)',
            group: 'Крайнов Дмитрий',
        },
        {
            key: 5,
            message:
                'Пустая строка при сканировании в упаковку Тест-онлайн adonis1/adonis123 1) Создать документ списания 2) отсканировать в него наименование/открыть РР/+Упаковка 3) Заполнить данные по упаковке/отсканировать еще 2 марки',
            fullName: 'Корбут Антон',
            photo: Images.Red,
            date: '5 мар',
            state: 'Выполнение',
            group: 'Корбут Антон',
        },
        {
            key: 6,
            message:
                'Разобраться с getViewModel - либо наследование, либо создавать модель прямо в TreeControl и передавать в BaseControl, либо ещё какой то вариант придумать.',
            fullName: 'Кесарева Дарья',
            photo: Images.Yellow,
            date: '12 сен',
            state: 'Выполнение',
            group: 'Кесарева Дарья',
        },
        {
            key: 7,
            message:
                'Научить reload обновлять табличное представление VDOM с сохранением набранных данных (например загруженных по кнопке "еще"). В данный момент есть deepReload, но он не сохраняет набранные данные.',
            fullName: 'Кесарева Дарья',
            photo: Images.Yellow,
            date: '12 сен',
            state: 'Выполнение',
            group: 'Кесарева Дарья',
        },
        {
            key: 8,
            message:
                'Лесенка на VDOM. Перевести алгоритм на предварительный расчет в модели. Сделать демку.',
            fullName: 'Кесарева Дарья',
            photo: Images.Yellow,
            date: '12 сен',
            state: 'Выполнение',
            group: 'Кесарева Дарья',
        },
        {
            key: 9,
            message:
                'Прошу сделать возможность отключения: 1) ховера на айтемах  у Controls/List, 2) курсор: поинтер',
            fullName: 'Кесарева Дарья',
            photo: Images.Yellow,
            date: '12 сен',
            state: 'Выполнение',
            group: 'Кесарева Дарья',
        },
        {
            key: 10,
            message:
                'через шаблон ячейки должна быть возможность управлять colspan (или rowspan) отдельной ячейки. <ws:partial template="standartCellTemplate" colspan="2"> типа такого если я напишу, то у меня будет ячейка на две колонки',
            fullName: 'Кесарева Дарья',
            photo: Images.Yellow,
            date: '12 сен',
            state: 'Выполнение',
            group: 'Кесарева Дарья',
        },
        {
            key: 11,
            message:
                'Не работают хлебные крошки и навигация по' +
                'ним если идентификатор записи равен 0 Как повторить',
            fullName: 'Догадкин Владимир',
            photo: Images.Blue,
            date: '28 фев',
            state: 'Выполнение',
            group: 'Догадкин Владимир',
        },
        {
            key: 12,
            message:
                'Не работает collapse в группировке в дереве test-online.sbis.ru сталин/Сталин123',
            fullName: 'Догадкин Владимир',
            photo: Images.Blue,
            date: '26 фев',
            state: 'Выполнение',
            group: 'Догадкин Владимир',
        },
    ];
}

export function getColumns() {
    return [
        {
            displayProperty: 'photo',
            render: <LadderTasksPhoto />,
            width: '98px',
            stickyProperty: 'photo',
        },
        {
            displayProperty: 'description',
            render: <LadderTasksDescription />,
            width: '1fr',
        },
        {
            displayProperty: 'date',
            render: <LadderTasksReceived />,
            width: '200px',
            stickyProperty: 'date',
        },
    ];
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}

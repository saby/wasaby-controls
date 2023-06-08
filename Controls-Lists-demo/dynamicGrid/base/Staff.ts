import { RecordSet } from 'Types/collection';
import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';

export const STAFF_LIST = [
    'Калинина Ника',
    'Яковлева Софья',
    'Сидорова Алиса',
    'Антонова Валерия',
    'Карпова Полина',
    'Некрасов Михаил',
    'Ильин Матвей',
    'Виноградов Алексей',
    'Ткачева София',
    'Степанова Милана',
    'Казакова Варвара',
    'Любимова Юлия',
    'Попов Алексей',
    'Афанасьева Мадина',
    'Беляев Данил',
    'Прокофьев Даниил',
    'Третьяков Илья',
    'Соболев Алексей',
    'Аникин Максим',
    'Лукина София',
    'Цветкова София',
    'Сазонов Арсений',
    'Воронин Виктор',
    'Дубровина Виктория',
    'Короткова Арина',
    'Захарова Мария',
    'Власова Полина',
    'Семенова София',
    'Алешина Малика',
    'Михайлова Анна',
    'Семенова Виктория',
    'Петрова Ника',
    'Соловьев Камиль',
    'Колосова Ксения',
    'Белоусова София',
    'Фролова Мария',
    'Соколова Арина',
    'Исаев Леонид',
    'Кузина Маргарита',
    'Островская Ольга',
    'Никитин Лев',
    'Соколов Марат',
    'Соболев Лука',
    'Калинин Артемий',
    'Малахова Елизавета',
    'Захаров Кирилл',
    'Никулина Алиса',
    'Гуров Герман',
    'Фадеев Илья',
    'Данилов Матвей',
    'Казанцева Мария',
    'Парамонова Валерия',
    'Егорова Арина',
    'Орехова Милана',
    'Алексеев Артём',
    'Поляков Егор',
    'Фокин Даниил',
    'Тимофеева Диана',
    'Ларина Алиса',
    'Зайцев Елисей',
    'Дмитриев Михаил',
    'Прокофьев Максим',
    'Фомина Екатерина',
    'Дмитриева Полина',
    'Кузин Григорий',
    'Завьялов Арсений',
    'Леонов Илья',
    'Горбачев Глеб',
    'Семенова Таисия',
    'Платонова Татьяна',
    'Белов Ярослав',
    'Козлов Илья',
    'Сафронова Евгения',
    'Петров Гордей',
    'Голубева Виктория',
    'Агафонов Кирилл',
    'Лебедева Вера',
    'Глебова Василиса',
    'Егоров Илья',
    'Родина Алиса',
    'Уткин Сергей',
    'Щербакова Софья',
    'Дорохов Иван',
    'Сомова Александра',
    'Матвеева Елизавета',
    'Яшина Айлин',
    'Шевелева Екатерина',
    'Игнатов Андрей',
    'Потапов Святослав',
    'Медведев Юрий',
    'Ильин Артём',
    'Маслова Пелагея',
    'Елисеева Мария',
    'Наумова Анна',
    'Васильев Никита',
    'Крылов Константин',
    'Егорова Екатерина',
    'Зимин Марк',
    'Чернышев Степан',
    'Андрианова Василиса',
];

const JOBS_LIST = [
    'Инженер-программист (3 категории)',
    'Инженер-программист (3+ категории)',
    'Инженер-программист (2 категории)',
    'Инженер-программист (2+ категории)',
    'Инженер-программист (1 категории)',
    'Ведущий инженер-программист (3 категории)',
    'Ведущий инженер-программист (3+ категории)',
    'Ведущий инженер-программист (2 категории)',
    'Ведущий инженер-программист (2+ категории)',
    'Ведущий инженер-программист (1 категории)',
];

const DATE = Date.parse('2023-01-01 00:00:00+03');
const StartDateOffset = [
    18, 13, 11, 13, 5, 6, 18, 6, 22, 10, 23, 12, 7, 24, 20, 23, 20, 20, 8, 19, 20, 19, 17, 18, 24,
    5, 24, 16, 10, 9, 14, 7, 11, 21, 16, 6, 7, 12, 21, 18, 24, 17, 14, 23, 24, 19, 16, 15, 12, 13,
    18, 22, 10, 18, 7, 23, 10, 18, 10, 11, 21, 6, 16, 13, 7, 17, 20, 15, 17, 24, 21, 5, 5, 14, 19,
    24, 9, 23, 23, 19, 14, 15, 21, 20, 5, 12, 6, 20, 13, 11, 13, 6, 9, 8, 10, 9, 17, 13, 5, 10,
];
const EndDateOffset = [
    11, 2, 6, 7, 4, 8, 1, 1, 13, 2, 1, 12, 4, 9, 11, 11, 3, 1, 1, 8, 13, 10, 5, 7, 2, 14, 7, 12, 10,
    8, 10, 1, 5, 3, 1, 5, 4, 3, 7, 12, 14, 13, 7, 9, 14, 2, 14, 6, 8, 14, 4, 13, 11, 12, 9, 12, 5,
    4, 6, 10, 5, 1, 8, 7, 1, 7, 11, 3, 3, 4, 1, 8, 7, 4, 1, 4, 9, 13, 3, 6, 6, 10, 12, 8, 12, 2, 5,
    3, 1, 11, 9, 8, 7, 3, 5, 2, 2, 9, 12, 13,
];

export function resolveJobByNumber(number: number): string {
    return JOBS_LIST[Number(String(number).slice(-1))];
}

function createVacation(adapter: EntityAdapter.IAdapter, number): Record[] {
    const startDate = new Date(DATE);
    startDate.setDate(startDate.getDate() + StartDateOffset[number]);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + EndDateOffset[number]);
    let interval = `${startDate.getDate().toString().padStart(2, '0')}.${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    interval += ` - ${endDate.getDate().toString().padStart(2, '0')}.${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

    const vacation = new Record({ adapter });

    vacation.addField(new EntityFormat.StringField({ name: 'eventId' }), null, 'vacation');
    vacation.addField(new EntityFormat.StringField({ name: 'interval' }), null, interval);
    vacation.addField(new EntityFormat.StringField({ name: 'eventType' }), null, 'Отпуск');
    vacation.addField(new EntityFormat.DateTimeField({ name: 'DTStart' }), null, startDate);
    vacation.addField(new EntityFormat.DateTimeField({ name: 'DTEnd' }), null, endDate);

    return [vacation];
}

function createWorkEvents(adapter: EntityAdapter.IAdapter, number): Record[] {
    const events = [];
    for (let i = 0; i < 30; i++) {
        const startDate = new Date(DATE);
        startDate.setDate(startDate.getDate() + i);
        startDate.setHours(StartDateOffset[number + i] || 10);
        const endDate = new Date(DATE);
        endDate.setDate(endDate.getDate() + i);
        endDate.setHours(startDate.getHours() + (EndDateOffset[number + i] || 3));
        endDate.setMinutes(30 * (i % 2));

        const event = new Record({ adapter });

        event.addField(new EntityFormat.StringField({ name: 'eventId' }), null, 'work-' + i);
        event.addField(new EntityFormat.StringField({ name: 'interval' }), null, null);
        event.addField(new EntityFormat.StringField({ name: 'eventType' }), null, 'Работа');
        event.addField(new EntityFormat.DateTimeField({ name: 'DTStart' }), null, startDate);
        event.addField(new EntityFormat.DateTimeField({ name: 'DTEnd' }), null, endDate);
        events.push(event);
    }
    return events;
}

export function getEventsByNumber(adapter: EntityAdapter.IAdapter, number: number): RecordSet {
    const events = new RecordSet({ adapter, keyProperty: 'eventId' });
    events.addField(new EntityFormat.StringField({ name: 'eventId' }));
    events.addField(new EntityFormat.StringField({ name: 'interval' }));
    events.addField(new EntityFormat.StringField({ name: 'eventType' }));
    events.addField(new EntityFormat.DateTimeField({ name: 'DTStart' }));
    events.addField(new EntityFormat.DateTimeField({ name: 'DTEnd' }));
    const vacation = createVacation(adapter, number);
    vacation.forEach((v) => events.add(v));
    const workEvents = createWorkEvents(adapter, number);
    workEvents.forEach((ev) => events.add(ev));
    return events;
}

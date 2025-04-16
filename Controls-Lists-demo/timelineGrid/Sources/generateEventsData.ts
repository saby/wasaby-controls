import { adapter as EntityAdapter, Record as EntityRecord } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { factory } from 'Types/chain';
import { RecordSet } from 'Types/collection';
import { ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';
import { START_DATE } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import { addFields } from './utils';

interface IRawEvent {
    startDay: number;
    startHour?: number;
    endHour?: number;
    endDay?: number;
    startMinutes?: number;
    endMinutes?: number;
}

export interface IEvent {
    eventId?: CrudEntityKey;
    interval?: string;
    eventType?: string;
    DTStart?: Date;
    DTEnd?: Date;
}

interface INestingEvent extends IEvent {
    lunchList?: IEvent[];
    startRow?: number;
    endRow?: number;
}

export const EVENTS_STRUCTURE = {
    eventId: 'string',
    interval: 'string',
    eventType: 'string',
    DTStart: 'dateTZ',
    DTEnd: 'dateTZ',
    lunchList: 'array',
    startRow: 'number',
    endRow: 'number',
};

/// Рабочие события для генератора данных в демке
export const JOB_EVENTS: { [p: number]: IRawEvent[] } = {
    0: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 7,
            startMinutes: 30,
        },
        {
            startDay: 1,
            startHour: 9,
            endHour: 10,
            startMinutes: 30,
        },
        {
            startDay: 1,
            startHour: 10,
            endHour: 12,
            startMinutes: 30,
        },
        {
            startDay: 1,
            startHour: 13,
            endHour: 17,
            startMinutes: 30,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 5,
            startMinutes: 15,
            endMinutes: 30,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 10,
            startMinutes: 45,
        },
        {
            startDay: 2,
            startHour: 6,
            endHour: 12,
            startMinutes: 0,
        },
        {
            startDay: 3,
            startHour: 7,
            endHour: 7,
            startMinutes: 45,
            endMinutes: 59,
        },
        {
            startDay: 3,
            startHour: 8,
            endHour: 11,
            startMinutes: 0,
        },
        {
            startDay: 3,
            startHour: 11,
            endHour: 13,
            startMinutes: 15,
        },
        {
            startDay: 3,
            startHour: 13,
            endHour: 18,
            startMinutes: 0,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 12,
            startMinutes: 11,
        },
        {
            startDay: 4,
            startHour: 12,
            endHour: 13,
            startMinutes: 0,
        },
        {
            startDay: 4,
            startHour: 14,
            endHour: 17,
            startMinutes: 0,
        },
        {
            startDay: 4,
            startHour: 18,
            endHour: 19,
            startMinutes: 0,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 7,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 9,
            endHour: 10,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 10,
            endHour: 12,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 13,
            endHour: 17,
            startMinutes: 30,
        },
    ],
    1: [
        {
            startDay: 1,
            startHour: 8,
            endHour: 9,
            startMinutes: 0,
        },
        {
            startDay: 1,
            startHour: 10,
            endHour: 11,
            startMinutes: 0,
        },
        {
            startDay: 1,
            startHour: 12,
            endHour: 17,
            startMinutes: 0,
        },
        {
            startDay: 2,
            startHour: 6,
            endHour: 6,
            startMinutes: 30,
            endMinutes: 50,
        },
        {
            startDay: 2,
            startHour: 6,
            endHour: 8,
            startMinutes: 50,
        },
        {
            startDay: 2,
            startHour: 8,
            endHour: 15,
            startMinutes: 0,
        },
        {
            startDay: 3,
            startHour: 9,
            endHour: 19,
            startMinutes: 45,
        },
        {
            startDay: 4,
            startHour: 7,
            endHour: 11,
            startMinutes: 10,
        },
        {
            startDay: 5,
            startHour: 8,
            endHour: 9,
            startMinutes: 0,
        },
        {
            startDay: 5,
            startHour: 10,
            endHour: 11,
            startMinutes: 0,
        },
        {
            startDay: 5,
            startHour: 12,
            endHour: 17,
            startMinutes: 0,
        },
    ],
    2: [
        {
            startDay: 1,
            startHour: 9,
            endHour: 19,
            startMinutes: 15,
        },
        {
            startDay: 2,
            startHour: 10,
            endHour: 22,
            startMinutes: 5,
        },
        {
            startDay: 3,
            startHour: 9,
            endHour: 19,
            startMinutes: 30,
        },
        {
            startDay: 4,
            startHour: 11,
            endHour: 22,
            startMinutes: 45,
        },
        {
            startDay: 5,
            startHour: 9,
            endHour: 19,
            startMinutes: 15,
        },
    ],
    3: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 17,
            startMinutes: 30,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 12,
            startMinutes: 15,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 19,
            startMinutes: 11,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 17,
            startMinutes: 30,
        },
    ],
    4: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 17,
            startMinutes: 30,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 12,
            startMinutes: 15,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 19,
            startMinutes: 11,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 7,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 9,
            endHour: 10,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 10,
            endHour: 12,
            startMinutes: 30,
        },
        {
            startDay: 5,
            startHour: 13,
            endHour: 17,
            startMinutes: 30,
        },
    ],
};

/// Смены для генератора данных в демке
export const SHIFT_EVENTS: { [p: number]: IRawEvent[] } = {
    0: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 18,
        },
        {
            startDay: 2,
            startHour: 4,
            endHour: 13,
        },
        {
            startDay: 3,
            startHour: 6,
            endHour: 20,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 19,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 18,
        },
    ],
    1: [
        {
            startDay: 1,
            startHour: 8,
            endHour: 17,
        },
        {
            startDay: 2,
            startHour: 6,
            endHour: 15,
        },
        {
            startDay: 3,
            startHour: 9,
            endHour: 19,
        },
        {
            startDay: 4,
            startHour: 7,
            endHour: 11,
        },
        {
            startDay: 5,
            startHour: 8,
            endHour: 17,
        },
    ],
    2: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 19,
        },
        {
            startDay: 2,
            startHour: 6,
            endHour: 22,
        },
        {
            startDay: 3,
            startHour: 6,
            endHour: 19,
        },
        {
            startDay: 4,
            startHour: 6,
            endHour: 22,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 19,
        },
    ],
    3: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 17,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 12,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 19,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 17,
        },
    ],
    4: [
        {
            startDay: 1,
            startHour: 6,
            endHour: 17,
        },
        {
            startDay: 2,
            startHour: 5,
            endHour: 12,
        },
        {
            startDay: 4,
            startHour: 8,
            endHour: 19,
        },
        {
            startDay: 5,
            startHour: 6,
            endHour: 18,
        },
    ],
};

export const VACATION_EVENTS: { [p: number]: IRawEvent[] } = {
    0: [
        {
            startDay: 5,
            endDay: 15,
        },
    ],
    1: [
        {
            startDay: 6,
            endDay: 20,
        },
    ],
    2: [
        {
            startDay: 20,
            endDay: 30,
        },
    ],
    3: [
        {
            startDay: 15,
            endDay: 25,
        },
    ],
    4: [
        {
            startDay: 5,
            endDay: 7,
        },
    ],
};

// Генерирует событие из сырых данных для демки
function generateEventRecord(
    adapter: EntityAdapter.IAdapter,
    initialDate: Date | number,
    event: IRawEvent,
    prefix: string,
    index: number,
    name: string
): EntityRecord | null {
    if (!event) {
        return null;
    }
    const startDate = new Date(
        typeof initialDate === 'number' ? initialDate : initialDate.getTime()
    );
    startDate.setDate(event.startDay);
    if (event.startHour) {
        startDate.setHours(event.startHour);
    }
    if (event.startMinutes) {
        startDate.setMinutes(event.startMinutes);
    }

    const endDate = new Date(typeof initialDate === 'number' ? initialDate : initialDate.getTime());
    endDate.setDate(event.endDay || event.startDay);
    if (event.endHour) {
        endDate.setHours(event.endHour);
    }
    if (event.endMinutes) {
        endDate.setMinutes(event.endMinutes);
    }

    const result = new EntityRecord({ adapter });
    addFields<IEvent>(result, EVENTS_STRUCTURE, {
        eventId: prefix + '-' + index,
        interval: null,
        eventType: name,
        DTStart: startDate,
        DTEnd: endDate,
    });
    return result;
}

// Генерирует бед ровно посередине работы, если работа более 2х часов.
function getLunchForJob(key: CrudEntityKey, jobRecord: EntityRecord): { [p: string]: Date }[] {
    const startDate = jobRecord.get('DTStart').getTime();
    const endDate = jobRecord.get('DTEnd').getTime();
    const duration = endDate - startDate;
    const oneHour = 1000 * 60 * 60;
    if (duration < 2 * oneHour) {
        return [];
    }
    const start = startDate + (duration / 2 - oneHour / 2);
    return [
        {
            DTStart: new Date(start),
            DTEnd: new Date(start + oneHour),
        },
    ];
}

function calcEventsIntersection(
    event: { start: Date; end: Date },
    prevEvent: { start: Date; end: Date }
): boolean {
    return (
        (event.start.getTime() > prevEvent.start.getTime() &&
            event.start.getTime() < prevEvent.end.getTime()) ||
        (event.end.getTime() > prevEvent.start.getTime() &&
            event.end.getTime() < prevEvent.end.getTime()) ||
        (prevEvent.start.getTime() > event.start.getTime() &&
            prevEvent.start.getTime() < event.end.getTime())
    );
}

// Генерирует рабочие (часовые) события для сотрудников.
function getOneWeekJobs(adapter: EntityAdapter.IAdapter, key: CrudEntityKey): EntityRecord[] {
    return JOB_EVENTS[key as number].map((e, index) => {
        const record = generateEventRecord(adapter, START_DATE, e, 'work', index, 'work');
        if (!record) {
            addFields<INestingEvent>(
                record,
                { lunchList: 'array' },
                {
                    lunchList: getLunchForJob(key, record),
                }
            );
        }
        return record;
    });
}

export function updateWorkIntersections(events: RecordSet): void {
    const resultEvents: EntityRecord[] = factory(events).toArray();
    let maxEventEndRow: number = 1;
    // Все рабочие события в выборке.
    const workEvents = resultEvents.filter((eventRecord) => {
        return eventRecord.get('eventType') === 'work';
    });
    const nonIntersectingEvents: EntityRecord[] = [];
    // Ищем пересечения рабочих событий.
    workEvents.forEach((eventRecord) => {
        const intersectingEvents = workEvents.filter((_eventRecord) => {
            return calcEventsIntersection(
                {
                    start: eventRecord.get('DTStart'),
                    end: eventRecord.get('DTEnd'),
                },
                { start: _eventRecord.get('DTStart'), end: _eventRecord.get('DTEnd') }
            );
        });
        // Помечаем пересекающиеся события
        if (intersectingEvents.length) {
            if (eventRecord.get('startRow') === undefined) {
                eventRecord.set({
                    startRow: 1,
                    endRow: 2,
                });
            }
            intersectingEvents.forEach((intersectingEventRecord, i) => {
                if (intersectingEventRecord.get('startRow') !== undefined) {
                    return;
                }
                const startRow = i + 2;
                const endRow = startRow + 1;
                // Работам делаем объединение по индексу.
                intersectingEventRecord.set({
                    startRow,
                    endRow,
                });
                if (maxEventEndRow < endRow) {
                    maxEventEndRow = endRow;
                }
            });
        } else {
            nonIntersectingEvents.push(eventRecord);
        }
    });
    // Любым непресекающимся рабочим событиям делаем максимальное объединение.
    nonIntersectingEvents.forEach((eventRecord) => {
        eventRecord.set({
            startRow: 1,
            endRow: maxEventEndRow,
        });
    });
    // Сменам делаем максимальное объединение.
    resultEvents
        .filter((eventRecord) => {
            return eventRecord.get('eventType') === 'shift';
        })
        .forEach((eventRecord) => {
            eventRecord.set({
                startRow: 1,
                endRow: maxEventEndRow,
            });
        });
}

// Генерирует события-смены для сотрудников.
// Смены отображаются только при сменном графике.
function getOneWeekShifts(adapter: EntityAdapter.IAdapter, key: CrudEntityKey): EntityRecord[] {
    return SHIFT_EVENTS[key].map((e, index) => {
        return generateEventRecord(adapter, START_DATE, e, 'shift', index, 'shift');
    });
}

// создаёт отпуска
function createVacation(adapter: EntityAdapter.IAdapter, key: CrudEntityKey): EntityRecord[] {
    return VACATION_EVENTS[key].map((e, index) => {
        return generateEventRecord(adapter, START_DATE, e, 'vacation', index, 'Ежегодный отпуск');
    });
}

// Генреирует RecordSet с событиями для сотрудника по его ключу
export default function generateEventsData(
    adapter: EntityAdapter.IAdapter,
    dynamicColumnsFilter: ITimelineColumnsFilter,
    key: CrudEntityKey
): RecordSet {
    const events = new RecordSet({
        adapter,
        keyProperty: 'eventId',
    });
    addFields<IEvent>(events, EVENTS_STRUCTURE);
    const vacation = createVacation(adapter, key);
    vacation.forEach((v) => events.add(v));
    const shiftEvents = getOneWeekShifts(adapter, key);
    shiftEvents.forEach((ev) => events.add(ev));
    const workEvents = getOneWeekJobs(adapter, key);
    workEvents.forEach((ev) => events.add(ev));
    return events;
}

import { adapter as EntityAdapter, Record, Record as EntityRecord } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
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

export const EVENTS_STRUCTURE = {
    eventId: 'string',
    interval: 'string',
    eventType: 'string',
    DTStart: 'dateTZ',
    DTEnd: 'dateTZ',
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
): EntityRecord {
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

// Генерирует рабочие (часовые) события для сотрудников.
function getOneWeekJobs(adapter: EntityAdapter.IAdapter, key: CrudEntityKey): EntityRecord[] {
    return JOB_EVENTS[key].map((e, index) => {
        return generateEventRecord(adapter, START_DATE, e, 'work', index, 'work');
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
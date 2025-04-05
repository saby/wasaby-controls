import { adapter as EntityAdapter, Record as EntityRecord } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';
import { START_DATE } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import { addFields } from '../../Sources/utils';

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
    lunchList: 'array',
    startRow: 'number',
    endRow: 'number',
};

export const VACATION_EVENTS: { [p: number]: IRawEvent[] } = {
    0: [
        {
            startDay: 25,
            endDay: 50,
        },
    ],
    1: [
        {
            startDay: 100,
            endDay: 300,
        },
    ],
    2: [],
    3: [
        {
            startDay: 150,
            endDay: 250,
        },
    ],
    4: [],
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

// создаёт отпуска
function createVacation(adapter: EntityAdapter.IAdapter, key: CrudEntityKey): EntityRecord[] {
    return VACATION_EVENTS[key].map((e, index) => {
        return generateEventRecord(
            adapter,
            START_DATE,
            e,
            'vacation',
            key,
            'Проект рассчитанный на'
        );
    });
}

// Генреирует RecordSet с событиями для сотрудника по его ключу
export default function generateEvents(
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
    return events;
}

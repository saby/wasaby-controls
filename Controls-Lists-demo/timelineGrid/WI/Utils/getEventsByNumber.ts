import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const DATE = Date.parse('2023-01-01 00:00:00+03');
const StartDateOffset = [
    18, 13, 11, 13, 5, 6, 18, 6, 22, 10, 23, 12, 7, 24, 20, 23, 20, 20, 8, 19, 20, 19, 17, 18, 24,
    5, 24, 16, 10, 9, 14, 7, 11, 21, 16, 6, 7, 12, 21, 18, 24, 17, 14, 23, 24, 19, 16, 15, 12, 13,
];
const EndDateOffset = [
    11, 2, 6, 7, 4, 8, 1, 1, 13, 2, 1, 12, 4, 9, 11, 11, 3, 1, 1, 8, 13, 10, 5, 7, 2, 14, 7, 12, 10,
    8, 10, 1, 5, 3, 1, 5, 4, 3, 7, 12, 14, 13, 7, 9, 14, 2, 14, 6, 8, 14, 4, 13, 11, 12, 9, 12, 5,
];

interface IEvent {
    eventId: string;
    interval: string;
    eventType: string;
    DTStart: Date;
    DTEnd: Date;
}

function createEvent(adapter: EntityAdapter.IAdapter, rawData: IEvent): Record {
    const event = new Record({ adapter });

    event.addField(new EntityFormat.StringField({ name: 'eventId' }), null, rawData.eventId);
    event.addField(new EntityFormat.StringField({ name: 'interval' }), null, rawData.interval);
    event.addField(new EntityFormat.StringField({ name: 'eventType' }), null, rawData.eventType);
    event.addField(new EntityFormat.DateTimeField({ name: 'DTStart' }), null, rawData.DTStart);
    event.addField(new EntityFormat.DateTimeField({ name: 'DTEnd' }), null, rawData.DTEnd);

    return event;
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

    const vacation = createEvent(adapter, {
        eventId: 'vacation',
        interval,
        eventType: 'Отпуск',
        DTStart: startDate,
        DTEnd: endDate,
    });
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
        const event = createEvent(adapter, {
            eventId: 'work-' + i,
            interval: null,
            eventType: 'Работа',
            DTStart: startDate,
            DTEnd: endDate,
        });
        events.push(event);
    }
    return events;
}

export default function getEventsByNumber(
    adapter: EntityAdapter.IAdapter,
    number: number
): RecordSet {
    const events = new RecordSet({
        adapter,
        keyProperty: 'eventId',
    });
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

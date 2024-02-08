import { format as EntityFormat, FormattableMixin } from 'Types/entity';
import { TNavigationDirection } from 'Controls/interface';
import { Quantum } from 'Controls-Lists/timelineGrid';

export function addFields<T = Record<string, string>>(
    result: FormattableMixin,
    structure: Record<string, string>,
    rawData?: T
) {
    Object.keys(structure).forEach((name) => {
        if (rawData && rawData[name] === undefined) {
            return;
        }
        switch (structure[name]) {
            case 'number':
                result.addField(
                    new EntityFormat.IntegerField({
                        name,
                        defaultValue: rawData?.[name],
                    })
                );
                break;
            case 'dateTZ':
                result.addField(
                    new EntityFormat.DateTimeField({
                        name,
                        defaultValue: rawData?.[name],
                    })
                );
                break;
            case 'date':
                result.addField(
                    new EntityFormat.DateTimeField({
                        name,
                        defaultValue: rawData?.[name],
                        withoutTimeZone: true,
                    })
                );
                break;
            case 'recordSet':
                result.addField(
                    new EntityFormat.RecordSetField({
                        name,
                        defaultValue: rawData?.[name],
                    })
                );
                break;
            case 'string':
            case 'boolean':
            default:
                result.addField(
                    new EntityFormat.StringField({
                        name,
                        defaultValue: rawData?.[name],
                    })
                );
                break;
        }
    });
}

export function shiftDate(date: Date, direction: TNavigationDirection, quantum: Quantum): void {
    const shiftSize = direction === 'backward' ? -1 : 1;
    switch (quantum) {
        case Quantum.Hour:
            date.setHours(date.getHours() + shiftSize);
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
    }
}

export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    const SATURDAY = 6;
    const SUNDAY = 0;
    return day === SATURDAY || day === SUNDAY;
}

import { compare } from 'Types/entity';

export class Validator {
    static dateRange(value: Date[]): boolean | string {
        const maxDaysCount = 5;
        return compare.dateDifference(
            value[0],
            value[1],
            compare.DateUnits.Day
        ) > maxDaysCount
            ? 'Заданный период не должен быть больше пяти дней!'
            : true;
    }
}

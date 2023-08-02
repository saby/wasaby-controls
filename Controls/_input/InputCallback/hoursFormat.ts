/**
 * @kaizen_zone 69682cc6-ee87-46d1-a4a1-782347094234
 */
import { ICallback, ICallbackData, IFieldData } from 'Controls/_input/interface/IValue';
import { TimeInterval } from 'Types/entity';

/**
 * @name Controls/_input/InputCallback/hoursFormat
 * @function
 * Ограничивает ввод времени с 0:00 до 24:00.
 * @remark
 * Использовать нужно как значение опции inputCallback в {@link Controls.input:TimeInterval поле ввода интервала}
 * c {@link Controls.input:TimeInterval#mask} маской HH:MM.
 * @demo Controls-demo/Input/InputCallback/Index
 */
const hoursFormat: ICallback<TimeInterval> = (data: ICallbackData<TimeInterval>): IFieldData => {
    const hours = Math.min(data.value.getTotalHours(), 24);
    const minutes = hours === 24 ? 0 : data.value.getMinutes();
    return {
        displayValue: `${toFormat(hours, 'hours')}:${toFormat(minutes, 'minutes')}`,
        position: data.position,
    };
};

function toFormat(original: number, type: string): string {
    const space = ' ';
    const formatTime = () => {
        if (type === 'hours') {
            return `${space}${original}`;
        } else {
            return `0${original}`;
        }
    };
    return original < 10 ? formatTime() : original.toString();
}

export default hoursFormat;

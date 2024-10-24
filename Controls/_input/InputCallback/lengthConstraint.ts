/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { splitIntoTriads, NUMBER_DIGITS_TRIAD } from 'Controls/baseDecorator';

const charOfIntegerPart: RegExp = /[-0-9]/;

function getCountTriads(valueLength: number): number {
    return Math.max(0, Math.floor((valueLength - 1) / NUMBER_DIGITS_TRIAD));
}

interface IValue<T> {
    value: T;
}

interface IFieldData {
    position: number;
    displayValue: string;
}

export type ICallback<T> = (data: IValue<T> & IFieldData) => IFieldData;

/**
 * Get the function constraint the length of the number.
 * @name Controls/_input/InputCallback#lengthConstraint
 * @param {number} maxLength The maximum length of the integer part of the number including minus.
 * @param {boolean} useGrouping Determines whether to use grouping separators, such as thousands separators.
 * @return {ICallback}
 */
export default function lengthConstraint(
    maxLength: number,
    useGrouping: boolean = true
): ICallback<number> {
    return (data) => {
        let formattedDisplayValue: string = '';
        let relativePosition: number = data.position;
        let dotPosition: number = data.displayValue.length;

        for (let i = 0; i < data.displayValue.length; i++) {
            const char = data.displayValue[i];

            if (charOfIntegerPart.test(char)) {
                formattedDisplayValue += char;
            } else if (char === '.') {
                dotPosition = i;
                break;
            } else if (i < data.position) {
                relativePosition--;
            }
        }

        const needlessChars = Math.max(0, formattedDisplayValue.length - maxLength);

        if (needlessChars) {
            const removePosition = formattedDisplayValue.length - needlessChars;

            formattedDisplayValue = formattedDisplayValue.substring(0, removePosition);

            if (
                removePosition <= relativePosition &&
                relativePosition <= formattedDisplayValue.length
            ) {
                relativePosition = removePosition;
            } else if (formattedDisplayValue.length < relativePosition) {
                relativePosition -= needlessChars;
            }
        }

        if (useGrouping) {
            let integerLength: number = formattedDisplayValue.length;
            if (formattedDisplayValue.charAt(0) === '-') {
                integerLength--;
            }
            const countTriads = getCountTriads(integerLength);
            const countTriadsAfterCarriage = getCountTriads(integerLength - relativePosition);

            formattedDisplayValue = splitIntoTriads(formattedDisplayValue);
            relativePosition += countTriads - countTriadsAfterCarriage;
        }

        formattedDisplayValue += data.displayValue.substring(dotPosition);

        return {
            position: relativePosition,
            displayValue: formattedDisplayValue,
        };
    };
}

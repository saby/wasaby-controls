/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { decimalSplitters, decimalSplitter } from './NumberConstant';
import { controller } from 'I18n/i18n';

export interface IParsedNumber {
    negative: number;
    integer: string;
    fractional: string;
    hasSplitter: boolean;
}

export interface IOptions {
    onlyPositive?: boolean;
}

export function parse(value: string, options: IOptions = {}): IParsedNumber {
    const tokens: string[] = lexicalValidate(value, options.onlyPositive);
    const validValue: string = syntaxValidate(tokens);

    return calcParts(validValue);
}

function lexicalValidate(original: string, onlyPositive: boolean = false): string[] {
    const value: string = onlyPositive ? original.replace(minus, '') : original;
    const matchingValues: string[] | null = value.match(validValues);

    return matchingValues === null ? [] : matchingValues;
}

const minus: RegExp = /-/g;
/**
 * <Minus>|<Digits_sequence>|<Decimal_splitter>
 */
const validValues: RegExp = new RegExp(`^-|[0-9]+|[${decimalSplitters}]`, 'g');

function syntaxValidate(value: string[]): string {
    let foundFirstSplitter: boolean = false;
    let splitter = decimalSplitter;
    if (controller.currentLocale !== 'en' && controller.currentLocale !== 'en-US') {
        splitter = decimalSplitters;
    }

    return value
        .filter((item) => {
            if (splitter.includes(item)) {
                if (!foundFirstSplitter) {
                    foundFirstSplitter = true;

                    return true;
                }

                return false;
            }

            return true;
        })
        .join('');
}

function calcParts(value: string): IParsedNumber {
    const splitterPosition: number = calcSplitterPosition(value);

    const negative: number = +(value[0] === '-');
    const integer: string = value.substring(negative, splitterPosition);
    const fractional: string = value.substring(splitterPosition + 1);
    const hasSplitter = !!value[splitterPosition];

    return { negative, integer, fractional, hasSplitter };
}

function calcSplitterPosition(value: string): number {
    let position: number;

    for (let i = 0; i < decimalSplitters.length; i++) {
        const splitter = decimalSplitters[i];

        position = value.indexOf(splitter);

        if (position !== -1) {
            return position;
        }
    }

    return value.length;
}

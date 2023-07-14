/**
 * @kaizen_zone 8b1886ea-b987-4659-bc96-c96169eb1599
 */
import BaseViewModel from '../BaseViewModel';
import { InputType, ISplitValue } from '../resources/Types';
import { textBySplitValue } from '../resources/Util';
import { IText } from 'Controls/baseDecorator';

export interface IViewModelOptions {
    maxLength?: number;
    constraint?: string | RegExp;
    punycodeToUnicode?: (punycode: string) => string;
}

class ViewModel extends BaseViewModel<string, IViewModelOptions> {
    private _punycodeToUnicode(punycode: string): string {
        const start: number = ViewModel._indexPunycode(punycode);

        if (start === -1) {
            return punycode;
        }

        /**
         * При копировании URL из поисковой строки браузера, в буфер будет помещено значение http[s]://{Punycode}/.
         * Метод toUnicode взят из публичного ресурса, и не предназначен для преобразования такой строки. Поэтому
         * разбиваем строку так, чтобы можно было преобразовать только часть с Punycode.
         */
        const urlParts: string[] = punycode.match(ViewModel.URL);

        return `${urlParts[1]}${this._options.punycodeToUnicode(urlParts[2])}${urlParts[3]}`;
    }

    protected _convertToDisplayValue(value: string | null): string {
        return value === null ? '' : value;
    }

    protected _convertToValue(displayValue: string): string {
        return displayValue;
    }

    protected _createText(splitValue: ISplitValue, inputType: InputType): IText {
        if (inputType === 'insert') {
            if (this._options.punycodeToUnicode) {
                splitValue.insert = this._punycodeToUnicode(splitValue.insert);
            }
            if (this._options.constraint) {
                ViewModel._limitChars(splitValue, this._options.constraint);
            }
            if (this._options.maxLength) {
                ViewModel._limitLength(splitValue, this._options.maxLength);
            }
        }

        return textBySplitValue(splitValue);
    }

    private static URL: RegExp = /^(https?:\/\/|)([\s\S]*?)(\/|)$/;

    private static _limitChars(splitValue: ISplitValue, constraint: string | RegExp): void {
        let constraintRegExp: RegExp;
        if (constraint instanceof RegExp) {
            constraintRegExp = constraint;
        } else {
            constraintRegExp = new RegExp(constraint, 'g');
        }
        const match: RegExpMatchArray | null = splitValue.insert.match(constraintRegExp);

        splitValue.insert = match ? match.join('') : '';
    }

    private static _limitLength(splitValue: ISplitValue, maxLength: number): void {
        const maxInsertionLength: number =
            maxLength - Array.from(splitValue.before).length - Array.from(splitValue.after).length;
        splitValue.insert = Array.from(splitValue.insert).slice(0, maxInsertionLength).join('');
    }

    private static _indexPunycode(code: string): number {
        const punycodeStarts: string = 'xn--';
        return code.indexOf(punycodeStarts);
    }
}

export default ViewModel;

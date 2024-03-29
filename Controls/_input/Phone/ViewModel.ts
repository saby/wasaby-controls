/**
 * @kaizen_zone b91a6565-403a-4633-8f41-67959f54825e
 */
import { ViewModel as BaseViewModel } from 'Controls/_input/Base/ViewModel';
import InputProcessor = require('Controls/_input/Mask/InputProcessor');
import {
    FormatBuilder,
    Formatter,
    IFormat,
    phoneMask,
    getAreaCode,
    REPLACER,
    FORMAT_MASK_CHARS,
} from 'Controls/baseDecorator';
import { InputType, ISplitValue } from 'Controls/_input/resources/Types';
import { IInputConfig } from 'Controls/_input/Mask/InputProcessor';

/**
 * @class Controls/_input/Text/ViewModel
 * @private
 */
const NOT_PHONE_NUMBER_SYMBOLS_REGEXP = /[^0-9+]/g;
const RUSSIAN_PHONE_NUMBER_LENGTH = 11;

export class ViewModel extends BaseViewModel {
    protected _format: IFormat;

    private _updateFormat(value: string): void {
        const mask = phoneMask(value, this);
        this._format = FormatBuilder.getFormat(
            mask,
            FORMAT_MASK_CHARS,
            REPLACER
        );
        this._nextVersion();
    }

    private _prepareData(result: IInputConfig): ISplitValue {
        const position = result.position;
        return {
            before: result.value.substring(0, position),
            after: result.value.substring(position, result.value.length),
            insert: '',
            delete: '',
        };
    }

    protected _convertToValue(displayValue: string): string {
        this._updateFormat(displayValue);
        return Formatter.clearData(this._format, displayValue).value;
    }

    protected _convertToDisplayValue(value: string): string {
        const stringValue = value === null ? '' : value;
        this._updateFormat(stringValue);
        const data = Formatter.formatData(this._format, {
            value: stringValue,
            carriagePosition: 0,
        });
        if (data) {
            return data.value;
        }
        return '';
    }

    protected handleInput(
        splitValue: ISplitValue,
        inputType: InputType
    ): boolean {
        // Let the user past phone numbers from buffer in any format. Clear data from unnecessary characters.
        splitValue.insert = splitValue.insert.replace(
            NOT_PHONE_NUMBER_SYMBOLS_REGEXP,
            ''
        );
        const shouldInsertWholeValue = this._shouldInsertWholeValue(
            splitValue.insert
        );
        if (this._options?.onlyMobile) {
            if (inputType === 'delete' && !splitValue.before.includes('+')) {
                splitValue.delete = splitValue.delete.replace('+', '');
                splitValue.before = '+' + splitValue.before;
            } else if (
                inputType.includes('delete') &&
                splitValue.delete === '+'
            ) {
                return false;
            } else if (
                inputType === 'insert' &&
                !splitValue.before &&
                !shouldInsertWholeValue &&
                !splitValue.insert.includes('+')
            ) {
                splitValue.insert = '+' + splitValue.insert;
            }
        }
        /**
         * Если был удален разделитель через backspace или delete, то нужно удалить цифру стоящую
         * после него или перед соответственно. Для этого нужно очистить splitValue от разделителей, а
         * потом удалить цифру, в зависимости от способа(backspace или delete).
         */
        const clearSplitValue: ISplitValue = InputProcessor.getClearSplitValue(
            splitValue,
            Formatter.clearData(this._format, this._displayValue)
        );
        if (!clearSplitValue.delete) {
            switch (inputType) {
                case 'deleteForward':
                    clearSplitValue.after = clearSplitValue.after.substring(1);
                    break;
                case 'deleteBackward':
                    clearSplitValue.before = clearSplitValue.before.slice(
                        0,
                        -1
                    );
                    break;
                default:
                    break;
            }
        }
        let newValue;
        if (shouldInsertWholeValue) {
            splitValue.before = '';
            if (this._options?.onlyMobile) {
                if (splitValue.insert[0] === '8') {
                    splitValue.insert = splitValue.insert.replace('8', '+7');
                }

                if (
                    inputType === 'insert' &&
                    !splitValue.insert.includes('+')
                ) {
                    splitValue.insert = '+' + splitValue.insert;
                }
            }
            newValue = splitValue.insert;
            splitValue.after = '';
        } else {
            newValue =
                clearSplitValue.before +
                clearSplitValue.insert +
                clearSplitValue.after;
        }
        if (this._options?.onlyMobile && !newValue) {
            return false;
        }
        const newMask = phoneMask(newValue, this);
        const newFormat = FormatBuilder.getFormat(
            newMask,
            FORMAT_MASK_CHARS,
            REPLACER
        );
        const result: IInputConfig = InputProcessor.input(
            splitValue,
            inputType,
            REPLACER,
            this._format,
            newFormat,
            undefined,
            undefined
        );
        return super.handleInput.call(
            this,
            this._prepareData(result),
            inputType
        );
    }

    private _shouldInsertWholeValue(value: String): boolean {
        return (
            (value.length === RUSSIAN_PHONE_NUMBER_LENGTH &&
                (value[0] === '8' || value[0] === '7')) ||
            (value.length === RUSSIAN_PHONE_NUMBER_LENGTH + 1 &&
                value[0] + value[1] === '+7')
        );
    }

    protected isFilled(): boolean {
        const value = this._value === null ? '' : this._value;
        const mask = phoneMask(value, this);
        const keysRegExp = new RegExp(
            '[' + Object.keys(FORMAT_MASK_CHARS).join('|') + ']',
            'g'
        );
        const maskOfKeys = mask.match(keysRegExp);
        return value.length === maskOfKeys.length;
    }

    protected moveCarriageToEnd(): void {
        this.selection = this.displayValue.length;
        this._nextVersion();
        this._shouldBeChanged = true;
    }

    updateAreaCode(newAreaCode: string): void {
        const value = this._value.replace('+', '');
        const areaCode = getAreaCode(value || '', this);
        let newValue;
        if (areaCode) {
            newValue = value.replace(new RegExp(areaCode), newAreaCode);
        } else {
            newValue = newAreaCode + value;
        }
        if (!newValue.includes('+')) {
            newValue = '+' + newValue;
        }
        this.value = newValue;
    }
}

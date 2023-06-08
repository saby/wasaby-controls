/**
 * @kaizen_zone 65fef2fb-b3db-4b89-83f4-29bb8d85ff30
 */
import { ViewModel as BaseViewModel } from 'Controls/_input/Base/ViewModel';
import { InputType, ISplitValue } from '../resources/Types';
import { IPasswordOptions } from 'Controls/_input/Password';

/**
 * @class Controls/_input/Password/ViewModel
 * @extends Controls/_input/Base/ViewModel
 *
 * @private
 *
 */

export class ViewModel extends BaseViewModel {
    protected _value: string;
    protected _displayValue: string;

    private _replaceOnAsterisks(value: string): string {
        return '•'.repeat(value.length);
    }

    private _isReplaceWithAsterisks(options: IPasswordOptions): boolean | string {
        return !(options.autoComplete || options.passwordVisible) || options.readOnly;
    }

    private _adjustSplitValue(splitValue: ISplitValue, value: string): void {
        splitValue.before = value.substring(0, splitValue.before.length);
        splitValue.after = value.substring(value.length - splitValue.after.length);
    }

    private _calcDisplayValue(replaceWithAsterisks: string | boolean, value: string): string {
        return replaceWithAsterisks ? this._replaceOnAsterisks(value) : value;
    }

    protected _convertToDisplayValue(value: string | null): string {
        const curValue = super._convertToDisplayValue.call(this, value);
        const replaceWithAsterisks = this._isReplaceWithAsterisks(this._options);
        const displayValue = super._convertToDisplayValue.call(this, curValue);
        return this._calcDisplayValue(replaceWithAsterisks, displayValue);
    }

    protected handleInput(splitValue: ISplitValue, inputType: InputType): boolean {
        const replaceWithAsterisks = this._isReplaceWithAsterisks(this._options);
        if (replaceWithAsterisks) {
            this._adjustSplitValue(splitValue, this._value || '');
        }
        if (this._options.maxLength && inputType === 'insert') {
            ViewModel._limitLength(splitValue, this._options.maxLength);
        }
        const result = super.handleInput.call(this, splitValue, inputType);
        this._displayValue = this._calcDisplayValue(replaceWithAsterisks, this._value);
        this._nextVersion();
        return result;
    }

    private static _limitLength(splitValue: ISplitValue, maxLength: number): void {
        const maxInsertionLength: number =
            maxLength - Array.from(splitValue.before).length - Array.from(splitValue.after).length;
        splitValue.insert = Array.from(splitValue.insert).slice(0, maxInsertionLength).join('');
    }

    protected isValueChanged(oldDisplayValue: string, oldValue?: string): boolean {
        return oldValue !== this._value;
    }
}

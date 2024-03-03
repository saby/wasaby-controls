/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import merge = require('Core/core-merge');
import clone = require('Core/core-clone');
import { VersionableMixin } from 'Types/entity';
import { isEqual } from 'Types/object';
import { InputType, ISelection, ISplitValue } from '../resources/Types';
import { IBaseInputOptions } from 'Controls/_input/Base';

export class ViewModel extends VersionableMixin {
    protected _selection: ISelection;
    protected _oldSelection: ISelection;
    protected _options: IBaseInputOptions;
    protected _shouldBeChanged: boolean;
    protected _oldValue: string;
    protected _oldDisplayValue: string;
    protected _value: string;
    protected _displayValue: string;
    constructor(options: IBaseInputOptions, value: string) {
        super();
        this._selection = { start: null, end: null };
        this._oldSelection = { start: null, end: null };
        this._options = clone(options);
        this.value = value;
        this.changesHaveBeenApplied();
    }

    setVersionCallback(versionCallback) {
        this._$versionCallback = versionCallback;
    }

    protected _setValue(value: string): void {
        if (this._value !== value) {
            const oldValue = this._value;
            this._value = value;

            // если ничего не поменялось - не надо изменять версию
            if (oldValue !== value) {
                this._nextVersion();
            }

            this._shouldBeChanged = true;
        }
    }
    protected _setDisplayValue(displayValue: string): void {
        if (this._displayValue !== displayValue) {
            const oldValue = this._displayValue;
            this._displayValue = displayValue;
            if (typeof this.options.selectionStart !== 'undefined') {
                this.selection = this.options.selectionStart;
            } else {
                this.selection = this._getStartingPosition();
            }

            // если ничего не поменялось - не надо изменять версию
            if (oldValue !== displayValue) {
                this._nextVersion();
            }

            this._shouldBeChanged = true;
        }
    }
    protected _convertToValue(displayValue: string): string {
        return displayValue;
    }

    protected _convertToDisplayValue(value: string): string {
        return value === null ? '' : String(value);
    }

    protected _getStartingPosition(): number {
        return this.displayValue.length;
    }

    get shouldBeChanged(): boolean {
        return this._shouldBeChanged;
    }

    get oldValue(): string {
        return this._oldValue;
    }

    get oldDisplayValue(): string {
        return this._oldDisplayValue;
    }

    get oldSelection(): ISelection {
        return clone(this._oldSelection);
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        if (this._value !== value) {
            this._setValue(value);
            this._setDisplayValue(this._convertToDisplayValue(value));
        }
    }

    get displayValue(): string {
        return this._displayValue;
    }

    set displayValue(value: string) {
        if (this._displayValue !== value) {
            this._setValue(this._convertToValue(value));
            this._setDisplayValue(value);
        }
    }

    get selection(): ISelection {
        return clone(this._selection);
    }

    /**
     * @param {Controls/_input/Base/Types/Selection.typedef|Number} value
     */
    set selection(value: ISelection | number) {
        const newSelection =
            typeof value === 'number'
                ? {
                      start: value,
                      end: value,
                  }
                : value;

        if (!isEqual(this._selection, newSelection)) {
            merge(this._selection, newSelection);
            this._nextVersion();
            this._shouldBeChanged = true;
        }
    }

    get options(): IBaseInputOptions {
        return clone(this._options);
    }

    set options(value: IBaseInputOptions) {
        this._options = clone(value);
        this._setDisplayValue(this._convertToDisplayValue(this._value));
    }

    protected handleInput(splitValue: ISplitValue, inputType?: InputType): boolean {
        const position = splitValue.before.length + splitValue.insert.length;
        const displayValue = splitValue.before + splitValue.insert + splitValue.after;
        const hasChangedDisplayValue = this._displayValue !== displayValue;

        this._value = this._convertToValue(displayValue);
        this._displayValue = displayValue;

        // здесь нельзя добавлять проверку, иначе нельзя будет поставить точку в тексте.
        // Например Number.js пишем 123.456, вот когда будем писать точку,
        // число при этом не изменилось, но _nextVersion звать надо.
        this._nextVersion();

        this._selection.start = position;
        this._selection.end = position;

        this._shouldBeChanged = true;
        return hasChangedDisplayValue;
    }

    protected changesHaveBeenApplied(): void {
        this._oldValue = this._value;
        this._oldDisplayValue = this._displayValue;
        this._oldSelection = clone(this._selection);

        this._shouldBeChanged = false;
    }

    protected select(): void {
        this.selection = {
            start: 0,
            end: this.displayValue.length,
        };

        this._nextVersion();
        this._shouldBeChanged = true;
    }

    protected isValueChanged(oldDisplayValue: string, oldValue?: string): boolean {
        return oldDisplayValue !== this._displayValue;
    }
}

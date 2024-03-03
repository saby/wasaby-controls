/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { ObservableMixin } from 'Types/entity';
import { INPUT_MODE, IInputDisplayValueOptions } from 'Controls/input';
import StringValueConverter from 'Controls/_date/BaseInput/StringValueConverter';
import { Base as dateUtils } from 'Controls/dateUtils';
import { VersionableMixin } from 'Types/entity';
import { IDateConstructorOptions } from 'Controls/interface';
import { IMaskOptions } from 'Controls/baseDecorator';
import IValueOptions from 'Controls/_date/interface/IValue';
import { IExtendedTimeFormatOptions } from 'Controls/_date/interface/IExtendedTimeFormat';
import { mixin } from 'Types/util';

const ALL_SPACES_REGEXP = /[ ]/g;
const SPACE = ' ';
const VALID_PARTIAL_DATE_REGEXP = new RegExp(
    '/^[0 ' + SPACE + ']{2}.[0 ' + SPACE + '/s]{2}.d{2,4}$/'
);
const MONTH_DAY_PART_REGEXP = /^(.*)\.\d{2,4}$/;

interface IModelOptions
    extends IInputDisplayValueOptions,
        IMaskOptions,
        IExtendedTimeFormatOptions,
        IDateConstructorOptions,
        IValueOptions {}

/**
 * Модель для контрола {@link Controls/input:Date}.
 * @public
 */

/*
 * Model for 'Controls/input:Date' control.
 *
 * @class Controls/_date/BaseInput/Model
 *
 * @author Ковалев Г.Д.
 * @public
 */

export default class Model extends mixin<VersionableMixin, ObservableMixin>(
    VersionableMixin,
    ObservableMixin
) {
    private _textValue: string;
    private _value: Date;
    private _lastValue: Date;
    private _stringValueConverter: StringValueConverter;
    private _mask: string;
    private _inputMode: string;
    private _replacer: string = ' ';
    private _valueChangedCallback: Function;

    constructor(options: IModelOptions) {
        super(options);
        this._stringValueConverter = new StringValueConverter();
        this._stringValueConverter.update({
            replacer: this._replacer,
            mask: options.mask,
            dateConstructor: options.dateConstructor,
            extendedTimeFormat: options.extendedTimeFormat,
        });
        this._valueChangedCallback = options.valueChangedCallback;
        this._mask = options.mask;
        this._inputMode = options.inputMode;
        if (options.displayValue) {
            this._textValue = options.displayValue.replace(ALL_SPACES_REGEXP, this._replacer);
            this._value = this._stringValueConverter.getValueByString(this._textValue);
        } else {
            this._value = options.value;
            this._textValue = this._stringValueConverter.getStringByValue(options.value);
        }
        this._lastValue = this._value;
    }

    /**
     * Updates model fields.
     * @param options
     */
    update(options: IModelOptions): void {
        this._stringValueConverter.update({
            replacer: this._replacer,
            mask: options.mask,
            dateConstructor: options.dateConstructor,
            yearSeparatesCenturies: options._yearSeparatesCenturies,
            extendedTimeFormat: options.extendedTimeFormat,
        });
        if (this._mask !== options.mask || !dateUtils.isDatesEqual(this._value, options.value)) {
            this._mask = options.mask;
            if (options.displayValue) {
                this._updateDisplayValue(options.displayValue);
            } else {
                this._updateValue(options.value);
            }
        }
    }

    /**
     * Value as a Date object
     * @returns {Date}
     */
    get value() {
        return this._value;
    }

    set value(value: Date) {
        if (dateUtils.isDatesEqual(this._value, value)) {
            return;
        }
        this._updateValue(value);
        this._notify('valueChanged', [value, this.displayValue]);
        if (this._valueChangedCallback) {
            this._valueChangedCallback([value, this.displayValue]);
        }
    }

    /**
     * Value as a string.
     * @returns {String}
     */
    get textValue() {
        return this._textValue;
    }

    set textValue(value: string) {
        if (this._textValue === value) {
            return;
        }
        this._nextVersion();
        this._textValue = value;
        const newValue = this._stringValueConverter.getValueByString(value, this._lastValue);

        const valueChanged = !dateUtils.isDatesEqual(this._value, newValue);

        if (valueChanged) {
            this._value = newValue;
            this._nextVersion();

            this._updateLastValue();
        }

        if (valueChanged || this._inputMode === INPUT_MODE.partial) {
            this._notify('valueChanged', [this._value, this.displayValue]);
            if (this._valueChangedCallback) {
                this._valueChangedCallback([this._value, this.displayValue]);
            }
        }
    }

    get emptyMaskValue(): string {
        return this._mask.replace(/[A-Z]/g, this._replacer);
    }

    // Нужен метод, где будем менять текстовое значение без изменения значения даты
    setTextValue(value: string): void {
        this._textValue = value;
    }

    get displayValue(): string {
        return this._textValue.replace(RegExp(this._replacer, 'g'), ' ');
    }

    /**
     * Value as a string without delimiters.
     * @returns {String}
     */
    get clearTextValue() {
        return this._textValue.replace(/[ -.:]/g, '');
    }

    /**
     * Autocomplete not full text value.
     * @param textValue
     * @param autocompleteType
     */
    autocomplete(textValue: string, autocompleteType: string) {
        this._nextVersion();
        this._textValue = textValue;
        this.value = this._stringValueConverter.getValueByString(
            textValue,
            this._lastValue,
            autocompleteType,
            this._inputMode
        );
        if (dateUtils.isValidDate(this.value)) {
            this._textValue = this._stringValueConverter.getStringByValue(this.value);
        } else if (
            this._inputMode === INPUT_MODE.partial &&
            !!this._textValue.match(VALID_PARTIAL_DATE_REGEXP)
        ) {
            const monthDayPart = this._textValue.match(MONTH_DAY_PART_REGEXP);
            if (monthDayPart && monthDayPart[1].includes('0')) {
                this._textValue = this._textValue.replace(RegExp(this._replacer, 'g'), '0');
                this._notify('valueChanged', [this._value, this.displayValue]);
                if (this._valueChangedCallback) {
                    this._valueChangedCallback([this._value, this.displayValue]);
                }
            }
        }
    }
    setCurrentDate(): void {
        this.value = this._stringValueConverter.getCurrentDate(this._lastValue, this._mask);
    }

    private _updateLastValue(): void {
        if (dateUtils.isValidDate(this._value)) {
            this._lastValue = this._value;
        }
    }
    private _updateValue(value: Date): void {
        const oldValue = this._value;
        const oldTextValue = this._textValue;
        this._value = value;

        this._updateLastValue();
        // Не будем обновлять текст у невалидной даты
        if (dateUtils.isValidDate(value) || value === null) {
            this._textValue = this._stringValueConverter.getStringByValue(value);
        }

        // если ничего не поменялось - не надо изменять версию
        if (oldValue !== value || oldTextValue !== this._textValue) {
            this._nextVersion();
        }
    }
    private _updateDisplayValue(displayValue: string): void {
        const normalizedDisplayValue = displayValue.replace(ALL_SPACES_REGEXP, this._replacer);
        const oldTextValue = this._textValue;
        this._value = this._stringValueConverter.getValueByString(normalizedDisplayValue);
        this._textValue = normalizedDisplayValue;
        this._updateLastValue();
        if (oldTextValue !== this._textValue) {
            this._nextVersion();
        }
    }
}

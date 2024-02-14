/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { instanceOfModule } from 'Core/core-instance';
import { constants } from 'Env/Env';
import { DateTime } from 'Types/entity';
import { date as DateFormatter } from 'Types/formatter';
import { Range, Base as dateUtils } from 'Controls/dateUtils';
import { getMaskType, DATE_MASK_TYPE, DATE_TIME_MASK_TYPE, TIME_MASK_TYPE } from './Utils';
import { INPUT_MODE } from 'Controls/input';
import { IDateConstructorOptions } from 'Controls/interface';
import { IMaskOptions } from 'Controls/baseDecorator';
import { IExtendedTimeFormatOptions } from 'Controls/_date/interface/IExtendedTimeFormat';

const MASK_MAP = {
    YY: 'year',
    YYYY: 'year',
    MM: 'month',
    DD: 'date',
    HH: 'hours',
    mm: 'minutes',
    ss: 'seconds',
};

const MAX_MONTH = 11;
const MAX_HOURS = 23;
const MAX_MINUTES = 59;
const MAX_SECONDS = 59;

interface IValueModelItem {
    str: string;
    value: number;
    valid: boolean;
}

interface IValueModel {
    year: IValueModelItem;
    month: IValueModelItem;
    date: IValueModelItem;
    hours: IValueModelItem;
    minutes: IValueModelItem;
    seconds: IValueModelItem;
}

const RE_NUMBERS: RegExp = /\d/;
const RE_MASK: RegExp =
    /^(?:(\d{1,2})(?:[./](\d{1,2})(?:[./]((?:\d{2})|(?:\d{4})))?)?)?(?: ?(\d{2}):(\d{2})(?::(\d{2})(?:[./](\d{3}))?)?)?$/;

export interface IStringValueConverter
    extends IDateConstructorOptions,
        IMaskOptions,
        IExtendedTimeFormatOptions {
    yearSeparatesCenturies?: DateTime;
}

export default class StringValueConverter {
    private _mask: string;
    private _replacer: string;
    private _replacerRegExp: RegExp;
    private _replacerBetweenCharsRegExp: RegExp;
    private _dateConstructor: Function;
    private _yearSeparatesCenturies: DateTime;
    private _extendedTimeFormat: boolean;

    constructor(options?: IStringValueConverter) {
        this.update(options);
    }

    /**
     * Updates converter settings.
     * @param options
     */
    update(options: IStringValueConverter = {}): void {
        this._yearSeparatesCenturies = options.yearSeparatesCenturies;
        this._mask = options.mask;
        this._extendedTimeFormat = options.extendedTimeFormat;
        this._dateConstructor = options.dateConstructor || Date;
        if (this._replacer !== options.replacer) {
            this._replacer = options.replacer;
            this._replacerBetweenCharsRegExp = new RegExp(
                '[^' + this._replacer + ']+' + this._replacer + '[^' + this._replacer + ']+'
            );
            this._replacerRegExp = new RegExp(this._replacer, 'g');
        }
    }

    /**
     * Returns the text displayed value
     * @param value
     * @param mask
     * @returns {*}
     */
    getStringByValue(value: Date, mask?: string): string {
        let dateString: string = '';
        if (dateUtils.isValidDate(value)) {
            const actualMask: string = this._mask || mask;
            // Если дата имеет тип ДатаВремя, то при передачи на клиент она будет
            // сконвертирована в часовой пояс клиента.
            // На сервере отрендерим дату в том же часовом поясе.
            // По факту тут проврка на DateTime.
            // instanceOfModule(value, 'Types/entity:DateTime') не подходит т.к. Date и Time наследуются от DateTime,
            // и проверка на 'Types/entity:DateTime' возвращает true для всех этих типов.
            if (
                constants.isServerSide &&
                !(
                    instanceOfModule(value, 'Types/entity:Date') ||
                    instanceOfModule(value, 'Types/entity:Time')
                )
            ) {
                const tzOffset: number = DateTime.getClientTimezoneOffset();
                dateString = this._getFormatedStringByValue(value, actualMask, tzOffset);
            } else {
                dateString = this._getFormatedStringByValue(value, actualMask);
            }
        }
        return dateString;
    }

    private _getFormatedStringByValue(value: Date, mask: string, tzOffset?: number): string {
        let dateString = DateFormatter(value, mask, tzOffset);
        if (this._extendedTimeFormat) {
            // В расширенном режиме используются только часы и минуты и для значения '24:00' используется 23:59:59.
            // Проверим количество секунд, чтобы узнать что ввели 24:00
            const seconds = value.getSeconds();
            if (seconds === MAX_SECONDS) {
                dateString = '24:00';
            }
        }
        return dateString;
    }

    /**
     * Get the Date object by the String and the mask.
     * @param str Date in accordance with the mask.
     * @param baseValue The base date. Used to fill parts of the date that are not in the mask.
     * @param autoCompleteType Autocomplete mode.
     * @param inputType
     * @param required
     * @returns {Date} Date object
     */
    getValueByString(
        str: string,
        baseValue?: Date,
        autoCompleteType?: string,
        inputType?: string,
        required?: boolean
    ): DateTime | Date {
        if (this._isEmpty(str)) {
            return null;
        }

        const valueModel = this._parseString(str);
        if (!valueModel) {
            return new this._dateConstructor('Invalid');
        }
        this._fillFromBaseValue(valueModel, baseValue);

        if (
            this._isFilled(str) &&
            this._mask &&
            this._mask.indexOf('YYYY') !== -1 &&
            parseInt(valueModel.year.str, 10) < 1000
        ) {
            // Zero year and year < 1000 does not exist
            return new this._dateConstructor('Invalid');
        }
        if (autoCompleteType && !this._isValueModelFilled(valueModel) && !this._isEmpty(str)) {
            this._autocomplete(valueModel, autoCompleteType, inputType, required);
        }

        if (this._isValueModelFilled(valueModel)) {
            return this._createDate(
                valueModel.year.value,
                valueModel.month.value,
                valueModel.date.value,
                valueModel.hours.value,
                valueModel.minutes.value,
                valueModel.seconds.value,
                autoCompleteType,
                this._dateConstructor
            );
        }

        return new this._dateConstructor('Invalid');
    }

    getCurrentDate(baseValue: Date, mask: string): DateTime | Date {
        baseValue = dateUtils.isValidDate(baseValue) ? baseValue : new Date(new Date().getFullYear(), 0, 1);
        let year = baseValue.getFullYear();
        let month = baseValue.getMonth();
        let date = baseValue.getDate();
        let hours = baseValue.getHours();
        let minutes = baseValue.getMinutes();
        let seconds = baseValue.getSeconds();
        const now = new Date();
        if (mask.indexOf('YYYY') > -1) {
            year = now.getFullYear();
        } else if (mask.indexOf('YY') > -1) {
            year = now.getFullYear();
        }
        if (mask.indexOf('MM') > -1) {
            month = now.getMonth();
        }
        if (mask.indexOf('DD') > -1 || date > dateUtils.getEndOfMonth(now).getDate()) {
            date = now.getDate();
        }
        if (mask.indexOf('HH') > -1) {
            hours = now.getHours();
        }
        if (mask.indexOf('mm') > -1) {
            minutes = now.getMinutes();
        }
        if (mask.indexOf('ss') > -1) {
            seconds = now.getSeconds();
        }
        return new this._dateConstructor(year, month, date, hours, minutes, seconds);
    }

    private _isFilled(value: string): boolean {
        return value?.indexOf(this._replacer) === -1;
    }

    private _isEmpty(value: string): boolean {
        return !RE_NUMBERS.test(value);
    }

    private _isPartlyFilled(value: string): boolean {
        return value && RE_NUMBERS.test(value) && value.indexOf(this._replacer) > -1;
    }

    private _isValueModelFilled(valueModel: IValueModel): boolean {
        for (const value in valueModel) {
            if (valueModel.hasOwnProperty(value) && valueModel[value].valid === false) {
                return false;
            }
        }
        return true;
    }

    private _getFullYearBy2DigitsYear(valueYear: number): number {
        const curYear = new Date().getFullYear();
        const shortCurYear = curYear % 100;
        const curCentury = curYear - shortCurYear;

        // Если год задаётся двумя числами, то считаем что это текущий век
        // если год меньше или равен текущему году + 10, иначе это прошлый век.
        // Если в DateRange в первом поле задана дата и год больше, чем сформированный
        // год по правилу выше, то значит век возьмем текущий. Например, в первом поле
        // указан год 20, а во втором 35, то без этой правки во втором поле будет создан
        // 1935 год.
        const fullYear =
            valueYear <= shortCurYear + 10 ? curCentury + valueYear : curCentury - 100 + valueYear;
        if (this._yearSeparatesCenturies && fullYear < this._yearSeparatesCenturies.getFullYear()) {
            return valueYear + 2000;
        }
        return fullYear;
    }

    private _parseString(str: string): IValueModel {
        let valueModel = {
            year: { str: null, value: new Date().getFullYear(), valid: false },
            month: { str: null, value: 0, valid: false },
            date: { str: null, value: 1, valid: false },
            hours: { str: null, value: 0, valid: false },
            minutes: { str: null, value: 0, valid: false },
            seconds: { str: null, value: 0, valid: false },
        };
        if (this._mask) {
            valueModel = this._updateModelByMask(valueModel, str);
        } else {
            valueModel = this._updateModel(valueModel, str);
        }
        return valueModel;
    }

    private _updateModelByMask(valueModel: IValueModel, str: string): IValueModel {
        const maskItems = this._mask.split(/[.: /]/g);
        const strItems = str.split(/[.: /]/g);
        const fullYearLengthStr = 4;
        const shortYearLengthStr = 2;
        let i;
        let valueObject;

        for (i = 0; i < maskItems.length; i++) {
            valueObject = valueModel[MASK_MAP[maskItems[i]]];
            valueObject.str = strItems[i];
            if (this._isFilled(strItems[i])) {
                valueObject.valid = true;
                valueObject.value = parseInt(strItems[i], 10);
                if (
                    maskItems[i] === 'YY' &&
                    String(valueObject.value).length === fullYearLengthStr
                ) {
                    const shortStrYear = String(valueObject.value).slice(shortYearLengthStr);
                    valueObject.value = shortStrYear;
                    valueObject.str = shortStrYear;
                } else if (
                    maskItems[i] === 'YYYY' &&
                    String(valueObject.value).length === shortYearLengthStr
                ) {
                    const fullStringYear = String(
                        this._getFullYearBy2DigitsYear(valueObject.value)
                    );
                    valueObject.value = fullStringYear;
                    valueObject.str = fullStringYear;
                } else if (maskItems[i] === 'YY') {
                    valueObject.value = this._getFullYearBy2DigitsYear(valueObject.value);
                } else if (maskItems[i] === 'MM') {
                    valueObject.value -= 1;
                }
            }
        }
        return valueModel;
    }

    private _updateModel(valueModel: IValueModel, str: string): IValueModel {
        const map = {
            date: 1,
            month: 2,
            year: 3,
            hours: 4,
            minutes: 5,
            seconds: 6,
        };
        let i;
        let valueObject;

        const strItems = RE_MASK.exec(str);
        if (!strItems) {
            return;
        }
        for (i in map) {
            if (map.hasOwnProperty(i)) {
                valueObject = valueModel[i];
                valueObject.str = strItems[map[i]] || null;
                if (this._isFilled(valueObject.str)) {
                    valueObject.valid = true;
                    valueObject.value = parseInt(valueObject.str, 10);
                    if (i === 'year' && valueObject.value < 100) {
                        valueObject.value = this._getFullYearBy2DigitsYear(valueObject.value);
                    } else if (i === 'month') {
                        valueObject.value -= 1;
                    }
                }
            }
        }
        return valueModel;
    }

    private _fillFromBaseValue(valueModel: IValueModel, baseValue: Date): void {
        baseValue = dateUtils.isValidDate(baseValue) ? baseValue : new Date(new Date().getFullYear(), 0, 1);

        if (valueModel.year.str === null) {
            valueModel.year.value = baseValue.getFullYear();
        }
        if (valueModel.month.str === null) {
            valueModel.month.value = baseValue.getMonth();
        }
        if (valueModel.date.str === null && this._mask !== Range.dateMaskConstants.MM_YYYY) {
            // Для контрола с маской MM/YYYY не имеет смысла сохранять дату между вводом дат т.к. это приводит
            // к неожиданным результатам. Например, была программно установлена дата 31.12.2018.
            // меняем месяц на 11. 31.11 несуществует. Можно скорректировать на 30.11.2018. Теперь пользователь
            // вводит 12 в качесте месяца и мы получаем 30.12.2018...
            valueModel.date.value = baseValue.getDate();
        }
        if (valueModel.hours.str === null) {
            valueModel.hours.value = baseValue.getHours();
        }
        if (valueModel.minutes.str === null) {
            valueModel.minutes.value = baseValue.getMinutes();
        }
        if (valueModel.seconds.str === null) {
            valueModel.seconds.value = baseValue.getSeconds();
        }
        for (const value in valueModel) {
            if (valueModel.hasOwnProperty(value) && valueModel[value].str === null) {
                valueModel[value].valid = true;
            }
        }
    }

    private _autocomplete(
        valueModel: IValueModel,
        autocompleteType: string = 'default',
        inputType: string = 'default',
        required: boolean = false
    ): void {
        const now = new Date();
        const maskType = getMaskType(this._mask);
        let item;
        let itemValue;
        let isZeroAtBeginning;

        const getDate = (autocompleteDefaultDate?: number): number => {
            const defaultDate = autocompleteDefaultDate || now.getDate();
            if (autocompleteType === 'start') {
                return 1;
            } else if (autocompleteType === 'end') {
                return dateUtils
                    .getEndOfMonth(new Date(valueModel.year.value, valueModel.month.value))
                    .getDate();
            } else {
                return defaultDate;
            }
        };

        const setValue = (obj: object, value: number): void => {
            if (!obj.valid) {
                obj.value = value;
                obj.valid = true;
            }
        };

        // Autocomplete the year with the mask YYYY, if the year is entered, but not completely
        // https://online.sbis.ru/opendoc.html?guid=6384f217-208a-4ca6-a175-b2c8d0ee2f0e
        if (
            (this._mask.indexOf('YYYY') !== -1 || this._mask.indexOf('YY') !== -1) &&
            !valueModel.year.valid &&
            !this._isEmpty(valueModel.year.str)
        ) {
            // If there is a Replacer between the numbers, then the year is incorrect
            if (this._replacerBetweenCharsRegExp.test(valueModel.year.str)) {
                return;
            }

            itemValue = parseInt(valueModel.year.str.replace(this._replacerRegExp, ' '), 10);
             const valueLength = valueModel.year.str.trim().length;
            isZeroAtBeginning = valueModel.year.str.split(itemValue)[0].indexOf('0') === -1;
            if (!isNaN(itemValue) && (valueLength <= 2 || (itemValue < 100 && isZeroAtBeginning))) {
                setValue(valueModel.year, this._getFullYearBy2DigitsYear(itemValue));
            } else {
                return;
            }
        }

        for (item in valueModel) {
            if (valueModel.hasOwnProperty(item)) {
                if (!valueModel[item].valid) {
                    itemValue = valueModel[item].str;
                    if (getMaskType(item) === TIME_MASK_TYPE && this._isPartlyFilled(itemValue)) {
                        itemValue = itemValue.replace(this._replacerRegExp, '0');
                    }
                    itemValue = parseInt(itemValue, 10);
                    if (!isNaN(itemValue)) {
                        setValue(valueModel[item], itemValue);
                        if (item === 'month') {
                            valueModel[item].value -= 1;
                        }
                    }
                }
            }
        }

        // Автокомплитим только если пользователь частично заполнил поле, либо не заполнил, но поле обязательно
        // для заполнения. Не автокомплитим поля в периодах
        // if (isEmpty && (!required || autocompleteType === 'start' || autocompleteType === 'end')) {
        //    return null;
        // }

        if (maskType === DATE_MASK_TYPE || maskType === DATE_TIME_MASK_TYPE) {
            if (
                required &&
                !valueModel.year.valid &&
                valueModel.month.valid &&
                valueModel.date.valid
            ) {
                setValue(valueModel.year, now.getFullYear());
                setValue(valueModel.month, now.getMonth());
                setValue(valueModel.date, now.getDate());
            } else if (valueModel.year.valid) {
                if (valueModel.year.value === now.getFullYear()) {
                    if (valueModel.month.valid) {
                        if (valueModel.month.value === now.getMonth()) {
                            // Заполнен текущий год и месяц
                            setValue(valueModel.date, getDate());
                        } else {
                            setValue(valueModel.date, getDate(1));
                        }
                    } else {
                        // Current year is filled
                        if (
                            inputType !== INPUT_MODE.partial ||
                            (!valueModel.month.valid && valueModel.date.valid) ||
                            (valueModel.month.valid && !valueModel.date.valid)
                        ) {
                            setValue(valueModel.month, now.getMonth());
                            setValue(valueModel.date, getDate());
                        }
                    }
                } else {
                    // A year is different from the current one
                    if (inputType !== INPUT_MODE.partial || !valueModel.date.valid) {
                        if (autocompleteType === 'end') {
                            setValue(valueModel.month, 11);
                        } else {
                            setValue(valueModel.month, 0);
                        }
                    }
                    if (inputType !== INPUT_MODE.partial || !valueModel.month.valid) {
                        if (autocompleteType === 'end') {
                            setValue(valueModel.date, 31);
                        } else {
                            setValue(valueModel.date, 1);
                        }
                    }
                }
            } else if (valueModel.date.valid) {
                setValue(valueModel.month, now.getMonth());
                setValue(valueModel.year, now.getFullYear());
            }
        } else if (maskType === TIME_MASK_TYPE) {
            if (valueModel.hours.valid) {
                setValue(valueModel.minutes, 0);
                setValue(valueModel.seconds, 0);
            }
            if (valueModel.minutes.valid) {
                setValue(valueModel.seconds, 0);
                setValue(valueModel.hours, 0);
            }
        }
    }

    /**
     * Creates a date. Unlike the Date constructor, if the year is <100, it does not convert it to 19xx.
     * @param year
     * @param month
     * @param date
     * @param hours
     * @param minutes
     * @param seconds
     * @param autoCorrect If true, then corrects the date if the wrong values of its elements are passed,
     * otherwise it returns null. If a date greater than the maximum date in the current month is transmitted,
     * the maximum date will be set.
     * @param dateConstructor
     * @returns {Date}
     * @private
     */
    private _createDate(
        year: number,
        month: number,
        date: number,
        hours: number,
        minutes: number,
        seconds: number,
        autoCorrect: boolean,
        dateConstructor: Function
    ): DateTime | Date {
        let endDateOfMonth;
        if (this._extendedTimeFormat) {
            // В расширенном режиме используются только часы и минуты и для значения '24:00' используется 23:59:59.
            // Обнулим секунды на случай, если до этого ввели 24:00.
            seconds = 0;
        }

        if (autoCorrect) {
            const maxHours = this._extendedTimeFormat ? 24 : MAX_HOURS;
            if (month > MAX_MONTH) {
                month = MAX_MONTH;
            }
            endDateOfMonth = dateUtils.getEndOfMonth(new dateConstructor(year, month, 1)).getDate();
            if (date > endDateOfMonth) {
                date = endDateOfMonth;
            }
            if (hours > maxHours) {
                hours = maxHours;
            }
            if (minutes > MAX_MINUTES) {
                minutes = MAX_MINUTES;
            }
            if (seconds > MAX_SECONDS) {
                seconds = MAX_SECONDS;
            }
        }
        if (this._extendedTimeFormat) {
            if (hours === 24) {
                hours = 23;
                minutes = 59;
                seconds = 59;
            }
        }

        if (!this._isValidDate(year, month, date, hours, minutes, seconds)) {
            return new dateConstructor('Invalid');
        }

        return new dateConstructor(year, month, date, hours, minutes, seconds);
    }

    private _isValidDate(
        year: number,
        month: number,
        date: number,
        hours: number,
        minutes: number,
        seconds: number
    ): boolean {
        const lastMonthDay = dateUtils.getEndOfMonth(new Date(year, month)).getDate();
        return (
            seconds <= MAX_SECONDS &&
            minutes <= MAX_MINUTES &&
            hours <= MAX_HOURS &&
            month <= MAX_MONTH &&
            month >= 0 &&
            date <= lastMonthDay &&
            date > 0
        );
    }
}

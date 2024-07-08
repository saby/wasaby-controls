/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as rk from 'i18n!Controls';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ICaptionOptions } from 'Controls/date';
import { IFontColorStyleOptions } from 'Controls/interface';
import { isEqual } from 'Types/object';
import * as DateRangeTemplate from 'wml!Controls/filterDateRangeEditor';
import { EventUtils } from 'UI/Events';
import { executeSyncOrAsync } from 'UI/Deps';
import type { Controller, IValidateResult } from 'Controls/validate';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';
import { period as dateRangeFormatter, PeriodConfigurationType } from 'Types/formatter';
import { IPeriodsConfig, IUserPeriod } from 'Controls/filter';
type TEditorMode = 'Input' | 'Lite' | 'Selector';
type TAlignment = 'left' | 'right';
type TValidatorResultElement = string | boolean;

export interface IDateRangeEditorOptions
    extends IControlOptions,
        ICaptionOptions,
        IFontColorStyleOptions {
    type?: string;
    editorMode?: TEditorMode;
    resetValue: [Date | null, Date | null];
    prevArrowAlignment?: TAlignment;
    nextArrowAlignment?: TAlignment;
    validators?: string[];
    shouldPositionBelow?: boolean;
}

interface IDateRangeEditorValidatorArguments {
    validators: Function[];
    value: unknown;
}

/**
 * Контрол используют в качестве редактора для выбора периода дат на {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/base-settings/#step-3 панели фильтров}.
 * @remark
 * Подробнее о настройке объединенного фильтра с выбором периода читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/panel/types-editor-controls/ здесь}.
 * @class Controls/filterDateRangeEditor
 * @extends UI/Base:Control
 * @implements Controls/dateRange:ILinkView
 * @implements Controls/dateRange:IDateRange
 * @implements Controls/_date/interface/ICaption
 * @public
 *
 * @see Controls/filter:View
 *
 */
class DateRangeEditor extends Control<IDateRangeEditorOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _tmplNotify: Function = EventUtils.tmplNotify;
    protected _value: Date[];
    protected _datePopupType: string;
    protected _dateRangeModule: Record<string, any> = null;
    protected _dateModule: string = 'dateRange';
    protected _emptyCaption: string;
    protected _children: {
        dateRangeController: Controller;
    };

    protected _beforeMount(options: IDateRangeEditorOptions): Promise<void> | void {
        this._captionFormatter = this._captionFormatter.bind(this, options);
        this._value = options.value;
        const moduleDeps = ['Controls/dateRange'];
        if (options.type === 'date') {
            moduleDeps.push('Controls/date');
            this._dateModule = 'date';
        }
        this._datePopupType = this._getDatePopupType(options);
        return executeSyncOrAsync(['Controls/dateRange'], (dateRange) => {
            this._dateRangeModule = dateRange;
            if (options.emptyCaption) {
                this._emptyCaption = options.emptyCaption;
            } else if (options.resetValue) {
                this._emptyCaption = this.getCaption(options.resetValue[0], options.resetValue[1]);
            }
        });
    }

    protected _beforeUpdate(newOptions: IDateRangeEditorOptions): Promise<void> | void {
        if (newOptions.value !== this._options.value) {
            this._value = newOptions.value;
        }
        if (this._options.emptyCaption !== newOptions.emptyCaption) {
            this._emptyCaption = newOptions.emptyCaption;
        } else if (newOptions.resetValue !== this._options.resetValue && newOptions.resetValue) {
            this._emptyCaption = this.getCaption(
                newOptions.resetValue[0],
                newOptions.resetValue[1]
            );
        }
        this._datePopupType = this._getDatePopupType(newOptions);
    }

    protected _rangeChanged(
        event: SyntheticEvent<'rangeChanged'>,
        startValue: Date,
        endValue: Date
    ): void {
        event.stopPropagation();
        if (this._options.type === 'date') {
            this._value = startValue;
        } else {
            this._value = [startValue, endValue];
        }

        // Если редактор находится в filter:View сначала должна произойти валидация,
        // затем обновиться значение, если валидация пройдена
        // Если редактор в панели, стреляем событием об обновлении value, затем валидируем.
        // Иначе в функцию валидации придет старое значение
        const validateValueBeforeChange =
            this._options.validateValueBeforeChange || !this._options.validators;
        if (!validateValueBeforeChange) {
            this._notifyChanges(startValue, endValue);
        } else {
            this._dateChanged(event, startValue, endValue);
        }

        if (this._options.validators) {
            this._validate();
        }
    }

    protected _valueChanged(event: Event, value: Date): void {
        this._dateChanged(event, value);
        if (this._options.validators) {
            this._validate();
        }
    }

    private _validate(): Promise<IValidateResult | Error> {
        return this._children.dateRangeController.submit();
    }

    private _captionFormatter(
        options: IDateRangeEditorOptions,
        startValue: Date,
        endValue: Date,
        emptyCaption
    ) {
        return this.getCaption(startValue, endValue, options, emptyCaption);
    }

    private getCaption(
        startValue: Date,
        endValue: Date,
        options?: IDateRangeEditorOptions = this._options,
        emptyCaption?: string
    ): string {
        if (options.captionFormatter) {
            return options.captionFormatter(startValue, endValue);
        } else {
            if (!startValue && !endValue) {
                return emptyCaption || options.emptyCaption || '';
            }
            const currentYear = new Date().getFullYear();
            const configuration =
                (startValue || endValue)?.getFullYear() === currentYear
                    ? PeriodConfigurationType.WithoutYear
                    : PeriodConfigurationType.Default;
            return dateRangeFormatter(startValue, endValue, { configuration });
        }
    }

    private _getDatePopupType(options: IDateRangeEditorOptions): string {
        const editorMode = options.editorMode;
        if (options.editorTemplateName) {
            // для новых редакторов, попап настраивается через опцию
            return options.datePopupType;
        }
        if (editorMode === 'Selector') {
            return 'datePicker';
        } else {
            return options.type === 'date' ? 'compactDatePicker' : 'shortDatePicker';
        }
    }

    private _dateChanged(
        event: SyntheticEvent<'rangeChanged'>,
        startValue: Date,
        endValue?: Date
    ): void {
        if (this._options.validators?.length) {
            this._validate().then((result: IValidateResult) => {
                if (!result.hasErrors) {
                    this._notifyChanges(startValue, endValue);
                }
            });
        } else {
            this._notifyChanges(startValue, endValue);
        }
    }

    private _notifyChanges(startValue: Date, endValue?: Date): void {
        let valueIsReset: boolean;
        const isDateRange = this._options.type !== 'date';
        const caption = this.getCaption(startValue, isDateRange ? endValue : startValue);

        this._notify('textValueChanged', [caption]);

        if (isDateRange) {
            valueIsReset = isEqual([startValue, endValue], this._options.resetValue);
        } else {
            valueIsReset = isEqual(startValue, this._options.resetValue);
        }

        if ((!startValue && !endValue && this._options.resetValue) || valueIsReset) {
            const resetValue = isDateRange ? this._options.resetValue : [this._options.resetValue];
            this._notify('rangeChanged', resetValue);
        } else {
            this._notify('rangeChanged', [startValue, endValue]);
        }
    }

    static defaultProps: Partial<IDateRangeEditorOptions> = {
        editorMode: 'Lite',
        fontColorStyle: 'filterPanelItem',
        nextArrowAlignment: 'right',
        prevArrowAlignment: 'right',
        shouldPositionBelow: true,
    };

    static _prepareValidators(validators: (string | Function)[] = []): Promise<Function[]> {
        const resultValidators = [];
        const loadingValidators = [];
        validators.forEach((validator) => {
            if (typeof validator === 'string') {
                loadingValidators.push(loadAsync(validator));
            } else {
                resultValidators.push(validator);
            }
        });
        return Promise.all(loadingValidators).then((loadedValidators) => {
            return resultValidators.concat(loadedValidators);
        });
    }
}

export function startValidation({
    validators = [],
    value,
}: IDateRangeEditorValidatorArguments): Promise<TValidatorResultElement[] | boolean> | boolean {
    let validatorResult: Promise<TValidatorResultElement[] | boolean> | boolean = true;
    if (validators.length) {
        validatorResult = DateRangeEditor._prepareValidators(validators).then(
            (loadedValidators) => {
                const errors = [];
                loadedValidators.forEach((validatorFunc) => {
                    const localValidatorResult = validatorFunc(value);
                    if (typeof localValidatorResult === 'string') {
                        errors.push(localValidatorResult);
                    }
                });
                return errors;
            }
        );
    }
    return validatorResult;
}

/**
 * @name Controls/filterDateRangeEditor#nextArrowVisible
 * @cfg {Boolean} Отображает стрелку перехода к следующему периоду.
 * @default false
 */

/**
 * @name Controls/filterDateRangeEditor#prevArrowVisible
 * @cfg {Boolean} Отображает стрелку перехода к предыдущему периоду.
 * @default false
 */

/**
 * @name Controls/filterDateRangeEditor#nextArrowAlignment
 * @cfg {String} Выравнивание стрелки перехода к следующему периоду.
 * @variant left Стрелка отображается слева.
 * @variant right Стрелка отображается справа.
 * @default right
 * @demo Controls-ListEnv-demo/Filter/NotConnectedView/Editors/DateRange/Index
 * @see nextArrowVisible
 */

/**
 * @name Controls/filterDateRangeEditor#prevArrowAlignment
 * @cfg {String} Выравнивание стрелки перехода к предыдущему периоду.
 * @variant left Стрелка отображается слева.
 * @variant right Стрелка отображается справа.
 * @default right
 * @demo Controls-ListEnv-demo/Filter/NotConnectedView/Editors/DateRange/Index
 * @see prevArrowVisible
 */

/**
 * @event textValueChanged Происходит при изменении выбранного значения.
 * @name Controls/filterDateRangeEditor#textValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} caption Строковое представление периода дат.
 */

/**
 * @name Controls/filterDateRangeEditor#editorMode
 * @cfg {String} Режим отображения редактора.
 * @variant Selector В качестве редактора используется {@link Controls/dateRange:Selector}.
 * @variant Lite В качестве редактора используется {@link Controls/dateRange:Selector} с опцией datePopupType="shortDatePicker".
 * @default Lite
 */

/**
 * @name Controls/filterDateRangeEditor#validators
 * @cfg {Function} Массив функций валидации выбранного значения.
 * @remark В каждую функцию аргументом приходит выбранное значение value
 */
export default DateRangeEditor;

/**
 * @name Controls/filterDateRangeEditor#value
 * @cfg {Array<Date>} Массив из двух значений - дата "от" и дата "до".
 * @see resetValue
 */

export const BY_PERIOD_KEY = 'byPeriod';
export const BY_PERIOD_TITLE = rk('За период');
export const ON_DATE_TITLE = rk('На дату');

type TTimePeriods = 'minute' | '5minutes' | '30minutes' | 'hour';

const TIME_PERIODS = [
    {
        key: 'minute',
        title: rk('Минута'),
        timeInterval: rk('1 минута'),
        order: 2,
    },
    {
        key: '5minutes',
        title: rk('5 минут'),
        timeInterval: rk('5 минут'),
        order: 4,
    },
    {
        key: '30minutes',
        title: rk('30 минут'),
        timeInterval: rk('30 минут'),
        order: 6,
    },
    {
        key: 'hour',
        title: rk('Час'),
        timeInterval: rk('1 час'),
        order: 8,
    },
];

export const DEFAULT_PERIODS = [
    {
        key: 'today',
        title: rk('Сегодня'),
        order: 10,
    },
    {
        key: 'yesterday',
        title: rk('Вчера'),
        order: 20,
    },
    {
        key: 'week',
        title: rk('Неделя'),
        order: 30,
    },
    {
        key: 'month',
        title: rk('Месяц'),
        order: 40,
    },
    {
        key: 'quarter',
        title: rk('Квартал'),
        order: 50,
    },
    {
        key: 'year',
        title: rk('Год'),
        order: 60,
    },
];

export function getPeriodItems(props: IPeriodsConfig): RecordSet {
    let periodItems: IUserPeriod[] = [];
    DEFAULT_PERIODS.forEach((period) => {
        if (!props.excludedPeriods?.includes(period.key)) {
            periodItems.push(period);
        }
    });
    if (props.userPeriods) {
        periodItems = periodItems.concat(props.userPeriods);
    }
    if (props.timePeriods) {
        TIME_PERIODS.forEach((timePeriod) => {
            periodItems.push(timePeriod);
        });
    }
    periodItems.sort((i1, i2) => (i1.order ?? 1000) - (i2.order ?? 1000));
    if (props.customPeriod !== false) {
        periodItems.push({
            key: BY_PERIOD_KEY,
            title: props.selectionType === 'single' ? ON_DATE_TITLE : BY_PERIOD_TITLE,
        });
    }
    return new RecordSet({
        rawData: periodItems,
        keyProperty: 'key',
    });
}

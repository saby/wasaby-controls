/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ICaptionOptions } from 'Controls/date';
import { IFontColorStyleOptions } from 'Controls/interface';
import { isEqual } from 'Types/object';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/DateRange');
import { EventUtils } from 'UI/Events';
import { executeSyncOrAsync } from 'UI/Deps';
import type { Controller, IValidateResult } from 'Controls/validate';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

type TEditorMode = 'Input' | 'Lite' | 'Selector';
type TAlignment = 'left' | 'right';
type TValidatorResultElement = string | boolean;

interface IDateRangeEditorOptions
    extends IControlOptions,
        ICaptionOptions,
        IFontColorStyleOptions {
    type?: string;
    editorMode: TEditorMode;
    resetValue: [Date | null, Date | null];
    prevArrowAlignment: TAlignment;
    nextArrowAlignment: TAlignment;
    validators?: string[];
}

interface IDateRangeEditorValidatorArguments {
    validators: Function[];
    value: unknown;
}

/**
 * Контрол используют в качестве редактора для выбора периода дат на {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/base-settings/#step-3 панели фильтров}.
 * @remark
 * Подробнее о настройке объединенного фильтра с выбором периода читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/panel/types-editor-controls/ здесь}.
 * @class Controls/_filter/Editors/DateRange
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

    protected _beforeMount(
        options: IDateRangeEditorOptions
    ): Promise<void> | void {
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
                this._emptyCaption = this.getCaption(
                    options.resetValue[0],
                    options.resetValue[1]
                );
            }
        });
    }

    protected _beforeUpdate(
        newOptions: IDateRangeEditorOptions
    ): Promise<void> | void {
        if (newOptions.value !== this._options.value) {
            this._value = newOptions.value;
        }
        if (this._options.emptyCaption !== newOptions.emptyCaption) {
            this._emptyCaption = newOptions.emptyCaption;
        } else if (
            newOptions.resetValue !== this._options.resetValue &&
            newOptions.resetValue
        ) {
            this._emptyCaption = this.getCaption(
                newOptions.resetValue[0],
                newOptions.resetValue[1]
            );
        }
    }

    protected _rangeChanged(
        event: SyntheticEvent<'rangeChanged'>,
        startValue: Date,
        endValue: Date
    ): void {
        // Останавливаем событие из dateRange,чтобы событие не долетело до filter:View.
        // Сначала должна произойти валидация, затем обновиться значение, если валидация пройдена
        if (
            this._options.validateValueBeforeChange ||
            !this._options.validators
        ) {
            event.stopPropagation();
        }
        if (this._options.type === 'date') {
            this._value = startValue;
        } else {
            this._value = [startValue, endValue];
        }
        this._dateChanged(event, startValue, endValue);
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

    startValidation({
        validators = [],
        value,
    }: IDateRangeEditorValidatorArguments):
        | Promise<TValidatorResultElement[] | boolean>
        | boolean {
        let validatorResult:
            | Promise<TValidatorResultElement[] | boolean>
            | boolean = true;
        if (validators.length) {
            validatorResult = DateRangeEditor._prepareValidators(
                validators
            ).then((loadedValidators) => {
                const errors = [];
                loadedValidators.forEach((validatorFunc) => {
                    const localValidatorResult = validatorFunc(value);
                    if (typeof localValidatorResult === 'string') {
                        errors.push(localValidatorResult);
                    }
                });
                return errors;
            });
        }
        return validatorResult;
    }

    private getCaption(startValue: Date, endValue: Date): string {
        const captionFormatter =
            this._options.captionFormatter ||
            this._dateRangeModule.Utils.formatDateRangeCaption;
        return captionFormatter(
            startValue,
            endValue,
            this._options.emptyCaption
        );
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
            return options.type === 'date'
                ? 'compactDatePicker'
                : 'shortDatePicker';
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
        const caption = this.getCaption(
            startValue,
            isDateRange ? endValue : startValue
        );

        this._notify('textValueChanged', [caption]);

        if (isDateRange) {
            valueIsReset = isEqual(
                [startValue, endValue],
                this._options.resetValue
            );
        } else {
            valueIsReset = isEqual(startValue, this._options.resetValue);
        }

        if (
            (!startValue && !endValue && this._options.resetValue) ||
            valueIsReset
        ) {
            const resetValue = isDateRange
                ? this._options.resetValue
                : [this._options.resetValue];
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
    };

    private static _prepareValidators(
        validators: (string | Function)[] = []
    ): Promise<Function[]> {
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

/**
 * @name Controls/_filter/Editors/DateRange#nextArrowVisible
 * @cfg {Boolean} Отображает стрелку перехода к следующему периоду.
 * @default false
 */

/**
 * @name Controls/_filter/Editors/DateRange#prevArrowVisible
 * @cfg {Boolean} Отображает стрелку перехода к предыдущему периоду.
 * @default false
 */

/**
 * @name Controls/_filter/Editors/DateRange#nextArrowAlignment
 * @cfg {String} Выравнивание стрелки перехода к следующему периоду.
 * @variant left Стрелка отображается слева.
 * @variant right Стрелка отображается справа.
 * @default right
 * @demo Controls-demo/Filter_new/FilterView/ArrowVisible/Index
 * @see nextArrowVisible
 */

/**
 * @name Controls/_filter/Editors/DateRange#prevArrowAlignment
 * @cfg {String} Выравнивание стрелки перехода к предыдущему периоду.
 * @variant left Стрелка отображается слева.
 * @variant right Стрелка отображается справа.
 * @default right
 * @demo Controls-demo/Filter_new/FilterView/ArrowVisible/Index
 * @see prevArrowVisible
 */

/**
 * @event textValueChanged Происходит при изменении выбранного значения.
 * @name Controls/_filter/Editors/DateRange#textValueChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} caption Строковое представление периода дат.
 */

/**
 * @name Controls/_filter/Editors/DateRange#editorMode
 * @cfg {String} Режим отображения редактора.
 * @variant Selector В качестве редактора используется {@link Controls/dateRange:Selector}.
 * @variant Lite В качестве редактора используется {@link Controls/dateRange:Selector} с опцией datePopupType="shortDatePicker".
 * @default Lite
 */

/**
 * @name Controls/_filter/Editors/DateRange#validators
 * @cfg {Function} Массив функций валидации выбранного значения.
 * @remark В каждую функцию аргументом приходит выбранное значение value
 */

export default DateRangeEditor;

/**
 * @name Controls/_filter/Editors/DateRange#value
 * @cfg {Array<Date>} Массив из двух значений - дата "от" и дата "до".
 * @see resetValue
 */

/**
 * @kaizen_zone a6f7e3ef-ed43-410d-9cea-ff0ee79dcaee
 */
import * as React from 'react';
import { IControlProps, IDateMaskOptions, IDateRangeValidatorsOptions } from 'Controls/interface';
import { activate, focusNextElement } from 'UI/Focus';
import { IBaseInputMask, StringValueConverter, BaseInput } from 'Controls/date';
import { Range, Popup as PopupUtil } from 'Controls/dateUtils';
import { IDateRangeOptions } from './interfaces/IDateRange';
import {
    getDatePopupName,
    IDatePopupTypeOptions,
    ICalendarButtonVisibleOptions,
} from 'Controls/date';
import DateRangeModel from './DateRangeModel';
import { Logger } from 'UI/Utils';
import { Icon } from 'Controls/icon';
import { DependencyTimer, StickyOpener } from 'Controls/popup';
import { getWasabyContext } from 'UI/Contexts';
import { IBaseOptions } from 'Controls/input';
import { IDayAvailableOptions } from 'Controls/calendar';

export interface IDateRangeInputOptions
    extends IDateRangeValidatorsOptions,
        IDateRangeOptions,
        IDatePopupTypeOptions,
        ICalendarButtonVisibleOptions,
        IBaseOptions,
        IDateMaskOptions,
        IControlProps,
        IDayAvailableOptions {
    onStartValueChanged?: (startValue: Date, displayValue?: string) => void;
    onEndValueChanged?: (endValue: Date, displayValue?: string) => void;
}

/**
 * Поле ввода периода дат.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FdateRange%2FInput%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/date-time/date/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dateRange.less переменные тем оформления}
 * @class Controls/_dateRange/Input
 * @extends UI/Base:Control
 * @mixes Controls/input:IBase
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/dateRange:IInput
 * @implements Controls/dateRange:IDateRange
 * @mixes Controls/dateRange:IRangeInputTag
 * @implements Controls/dateRange:IDatePickerSelectors
 * @implements Controls/interface:IDayTemplate
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IDateMask
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/interface:IDateRangeValidators
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/date:ICalendarButtonVisible
 * @implements Controls/interface:IControl
 * @implements Controls/calendar:IDayAvailable
 * @implements Controls/calendar:IMonthListSource
 *
 * @public
 * @demo Controls-demo/dateRange/Index
 */
export default class Input extends React.Component<IDateRangeInputOptions> {
    // https://online.sbis.ru/opendoc.html?guid=e184361b-4a8c-4525-b7a7-a775ba663997&client=3
    get _container(): HTMLElement {
        return this._targetRef.current;
    }
    private _stickyOpener: StickyOpener = new StickyOpener({
        closeOnOutsideClick: true,
        actionOnScroll: 'close',
    });
    protected _rangeModel: DateRangeModel;
    private _dependenciesTimer: DependencyTimer = null;
    private _loadCalendarPopupPromise: Promise<unknown> = null;
    private _state: string;
    private _shouldValidate: {
        startValue: boolean;
        endValue: boolean;
    } = {
        startValue: false,
        endValue: false,
    };
    private _endValueFieldRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _startValueFieldRef: React.RefObject<HTMLDivElement> = React.createRef();
    private _targetRef: React.RefObject<HTMLDivElement> = React.createRef();
    protected _startValueValidators: Function[] = [];
    protected _endValueValidators: Function[] = [];

    private _startInputDisplayValue: string;
    private _endInputDisplayValue: string;

    private _shouldUpdatedPassed: Boolean = false;

    state: {};

    constructor(props: IDateRangeOptions) {
        super(props);
        this._rangeModel = new DateRangeModel({
            dateConstructor: props.dateConstructor,
        });
        this._rangeModel.update({
            ...props,
            startValueChangedCallback: this._startValueChangedCallback.bind(this),
            endValueChangedCallback: this._endValueChangedCallback.bind(this),
            rangeChangedCallback: this._rangeChangedCallback.bind(this),
        });
        this._updateValidators(props);
        this._stateChangedCallback = this._stateChangedCallback.bind(this);
        this.state = {
            startValue: this._rangeModel.startValue,
            endValue: this._rangeModel.endValue,
        };
    }

    shouldComponentUpdate(props: IDateRangeOptions): boolean {
        if (this.props.startValue !== props.startValue || this.props.endValue !== props.endValue) {
            this._shouldUpdatedPassed = true;
            this._rangeModel.update({
                ...props,
                startValueChangedCallback: this._startValueChangedCallback.bind(this),
                endValueChangedCallback: this._endValueChangedCallback.bind(this),
                rangeChangedCallback: this._rangeChangedCallback.bind(this),
            });
        }
        this._updateValidators(props);
        return true;
    }

    // TODO: https://online.sbis.ru/opendoc.html?guid=b22433bf-1310-4fcf-88f7-61f8209d3b09&client=3
    UNSAFE_componentWillUpdate(props: IDateRangeOptions) {
        if (!this._shouldUpdatedPassed) {
            if (
                this.props.startValue !== props.startValue ||
                this.props.endValue !== props.endValue
            ) {
                this._rangeModel.update({
                    ...props,
                    startValueChangedCallback: this._startValueChangedCallback.bind(this),
                    endValueChangedCallback: this._endValueChangedCallback.bind(this),
                    rangeChangedCallback: this._rangeChangedCallback.bind(this),
                });
            }
            this._updateValidators();
        }
        this._shouldUpdatedPassed = false;
    }

    componentDidUpdate(): void {
        if (this._shouldValidate.startValue) {
            this._startValueFieldRef.current.validate();
        }
        if (this._shouldValidate.endValue) {
            this._endValueFieldRef.current.validate();
        }
    }

    componentWillUnmount() {
        this._rangeModel.destroy();
        if (this._stickyOpener.isOpened()) {
            this._stickyOpener.close();
        }
    }

    openPopup(): void {
        const button = this._targetRef.current;
        let className = `controls_popupTemplate_theme-${this.props.theme} `;
        if (this.props.datePopupType === 'datePicker') {
            className += `controls-PeriodDialog__picker controls_datePicker_theme-${this.props.theme}`;
        } else {
            className += `controls-CompactDatePicker__selector-margin
            controls_compactDatePicker_theme-${this.props.theme}`;
        }
        const cfg = {
            ...PopupUtil.getCommonOptions(this),
            target: button,
            template: getDatePopupName(this.props.datePopupType),
            className,
            allowAdaptive: true,
            templateOptions: {
                ...PopupUtil.getDateRangeTemplateOptions(this),
                selectionType: this.props.selectionType,
                isDayAvailable: this.props.isDayAvailable,
                rightFieldTemplate: this.props.rightFieldTemplate,
                ranges: this.props.ranges,
                headerType: 'input',
                range: this.props.range,
            },
        };
        this._stickyOpener.open(cfg);
    }

    setValidationResult(validationResult): void {
        this._startValueFieldRef.current.setValidationResult(validationResult);
        this._endValueFieldRef.current.setValidationResult(validationResult);
    }

    private _onResult(startValue: Date, endValue: Date): void {
        let startDate = startValue;
        let endDate = endValue;
        if (this.props.dateConstructor) {
            if (startDate) {
                startDate = new this.props.dateConstructor(startValue);
            }
            if (endDate) {
                endDate = new this.props.dateConstructor(endValue);
            }
        }
        this._rangeModel.setRange(startDate, endDate);
        this._stickyOpener.close();
        this._notifyInputCompleted();
        /*
          Вызываем валидацию, т.к. при выборе периода из календаря не вызывается событие valueChanged
          Валидация срабатывает раньше, чем значение меняется, поэтому откладываем ее до _afterUpdate
         */
        this._shouldValidate.startValue = true;
        this._shouldValidate.endValue = true;
    }

    private _startValueChangedCallback(startValue: Date): void {
        this.setState({
            startValue,
        });
        if (this.props.onStartValueChanged) {
            this.props.onStartValueChanged(startValue, this._startInputDisplayValue);
        }
    }

    private _endValueChangedCallback(endValue: Date): void {
        this.setState({
            endValue,
        });
        if (this.props.onEndValueChanged) {
            this.props.onEndValueChanged(endValue, this._endInputDisplayValue);
        }
    }

    private _rangeChangedCallback(startValue: Date, endValue: Date) {
        if (this.props.onRangeChanged) {
            this.props.onRangeChanged(startValue, endValue);
        }
    }

    private _startValueChangedHandler(value: Date, displayValue: string): void {
        this._startInputDisplayValue = displayValue;
        this._rangeModel.startValue = value;
    }

    private _endValueChangedHandler(value: Date, displayValue: string): void {
        this._endInputDisplayValue = displayValue;
        this._rangeModel.endValue = value;
    }

    protected _startFieldInputControlHandler(_, value, displayValue, selection): void {
        if (selection.end === displayValue.length) {
            if (!this.props.rightFieldTemplate) {
                // Во втором поле может находится уже ранее введенное значение, у которого курсор стоит в конце
                // Выставим курсор в начало, когда заполнили первое поле.
                this._endValueFieldRef.current.setSelectionPosition(0);
                this._endValueFieldRef.current.activate({
                    enableScreenKeyboard: true,
                });
            } else {
                // В случае, если передали rightFieldTemplate, там может оказаться поле, на которое нужно перевести
                // фокус в первую очередь.
                focusNextElement();
            }
        }
        this._validateAfterInput('endValue');
    }

    protected _endFieldInputControlHandler(_, value, displayValue, selection): void {
        if (selection.end === displayValue.length && this.props.rightFieldTemplate) {
            // В случае, если передали rightFieldTemplate, переведем фокус на него
            focusNextElement();
        }

        this._validateAfterInput('startValue');
    }

    private _validateAfterInput(fieldName: string): void {
        // После смены значения в поле ввода сбрасывается результат валидации.
        // Проблема в том, что результат валидации не сбрасывается в другом поле. Из-за этого появляется инфобокс при
        // наведении https://online.sbis.ru/opendoc.html?guid=42046d94-7a30-491a-b8b6-1ce710bddbaa
        // Будем обнавлять другое поле сами.
        // Если устанолвена опция validateByFocusOut true, будем валидировать поле на afterUpdate, когда значение
        // поменяется. Если validateByFocusOut false, то просто сбросим результат валидации.
        const inputNameRef = fieldName + 'FieldRef';
        if (this.props.validateByFocusOut) {
            if (this._rangeModel[fieldName] !== null) {
                this._shouldValidate[fieldName] = true;
            }
        } else {
            this['_' + inputNameRef].current.setValidationResult(null);
        }
    }

    protected _inputCompletedStartValueHandler(value: Date): void {
        this._rangeModel.startValue = value;
        this._inputCompleted();
    }

    protected _inputCompletedEndValueHandler(value: Date): void {
        this._rangeModel.endValue = value;
        this._inputCompleted();
    }

    private _inputCompleted(): void {
        this._validateAfterInput('startValue');
        this._validateAfterInput('endValue');
        this._notifyInputCompleted();
    }

    private _notifyInputCompleted(): void {
        const converter = new StringValueConverter({
            mask: this.props.mask,
            replacer: this.props.replacer,
            dateConstructor: this.props.dateConstructor,
        });
        if (this.props.onInputCompleted) {
            this.props.onInputCompleted(
                this._rangeModel.startValue,
                this._rangeModel.endValue,
                converter.getStringByValue(this._rangeModel.startValue),
                converter.getStringByValue(this._rangeModel.endValue)
            );
        }
    }

    private _updateValidators(options?: IDateRangeInputOptions): void {
        this._updateStartValueValidators(options?.startValueValidators);
        this._updateEndValueValidators(options?.endValueValidators);
    }

    private _updateStartValueValidators(validators?: Function[]): void {
        const startValueValidators: Function[] = validators || this.props.startValueValidators;
        this._startValueValidators = Range.getRangeValueValidators(
            startValueValidators,
            this._rangeModel,
            this._rangeModel.startValue
        );
    }

    private _updateEndValueValidators(validators?: Function[]): void {
        const endValueValidators: Function[] = validators || this.props.endValueValidators;
        this._endValueValidators = Range.getRangeValueValidators(
            endValueValidators,
            this._rangeModel,
            this._rangeModel.endValue
        );
    }

    protected _inputMouseDownHandler(event: Event): void {
        if (!this.props.calendarButtonVisible) {
            this.openPopup();
            event.preventDefault();
        }
    }

    protected _clickHandler(event: Event): void {
        event.stopPropagation();
    }

    protected _mouseEnterHandler(): void {
        if (!this._dependenciesTimer) {
            this._dependenciesTimer = new DependencyTimer();
        }
        this._dependenciesTimer.start(this._loadDependencies);
    }

    protected _mouseLeaveHandler(): void {
        this._dependenciesTimer?.stop();
    }

    private _loadDependencies(): Promise<unknown> {
        try {
            if (!this._loadCalendarPopupPromise) {
                this._loadCalendarPopupPromise = import('Controls/datePopup').then((datePopup) => {
                    return datePopup.default.loadCSS();
                });
            }
            return this._loadCalendarPopupPromise;
        } catch (e) {
            Logger.error('shortDatePicker:', e);
        }
    }

    protected _stateChangedCallback(state: string): void {
        this._state = state;
    }

    private _getClassName(): string {
        let className = 'controls-Input-DateRange';
        if (this.props.className) {
            className += ` ${this.props.className}`;
        } else if (this.props.attrs?.className) {
            className += ` ${this.props.attrs.className}`;
        }
        return className;
    }

    private _getDashClassName(): string {
        const fontSize = this.props.fontSize || 'm';
        const size = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl'].includes(fontSize) ? '2xs' : 's';
        return `controls-Input-DateRange__dash controls-margin_right-${size} controls-margin_left-${size}`;
    }

    protected _getReadOnly(): boolean {
        return this.props.readOnly ?? this.context?.readOnly;
    }

    activate(): void {
        activate(this._targetRef.current);
    }

    render() {
        return (
            <div
                {...this.props.attrs}
                className={this._getClassName()}
                ref={this._targetRef}
                data-qa={
                    this.props['data-qa'] ||
                    this.props.attrs?.['data-qa'] ||
                    'controls-Input-DateRange'
                }
            >
                <div className="controls-Input-DateRange__inputs">
                    <BaseInput
                        readOnly={this._getReadOnly()}
                        disableValidators={this.props.disableValidators}
                        forwardedRef={this.props.forwardedRef}
                        ref={this._startValueFieldRef}
                        className="controls-Input-DateRange_startValue"
                        value={this._rangeModel.startValue}
                        mask={this.props.mask}
                        size={this.props.size}
                        fontStyle={this.props.fontStyle}
                        fontSize={this.props.fontSize}
                        fontColorStyle={this.props.fontColorStyle}
                        inlineHeight={this.props.inlineHeight}
                        contrastBackground={this.props.contrastBackground}
                        borderVisibility={this.props.borderVisibility}
                        tagStyle={this.props.startTagStyle}
                        selectOnClick={this.props.selectOnClick}
                        autoComplete={this.props.autoComplete}
                        validationStatus={
                            this.props.startValidationStatus || this.props.validationStatus
                        }
                        autocompleteType="start"
                        valueValidators={this._startValueValidators}
                        validateByFocusOut={this.props.validateByFocusOut}
                        calendarButtonVisible={this.props.calendarButtonVisible}
                        onValueChanged={this._startValueChangedHandler.bind(this)}
                        onFocus={(...args) => {
                            this.props.onFocus?.(...args, 'startValue');
                        }}
                        onBlur={(...args) => {
                            this.props.onBlur?.(...args, 'startValue');
                        }}
                        customEvents={[
                            'onMouseDown',
                            'onInputControl',
                            'onInputCompleted',
                            'onTagClick',
                            'onTagHover',
                        ]}
                        onMouseDown={this._inputMouseDownHandler.bind(this)}
                        onInputControl={this._startFieldInputControlHandler.bind(this)}
                        onInputCompleted={this._inputCompletedStartValueHandler.bind(this)}
                        onTagClick={this.props.onStartTagClick}
                        onTagHover={this.props.onStartTagHover}
                    ></BaseInput>
                    {this.props.rightFieldTemplate ? (
                        <this.props.rightFieldTemplate
                            value={this._rangeModel.startValue}
                            inputPosition={'left'}
                        />
                    ) : null}
                </div>
                <div className={this._getDashClassName()}></div>
                <div className="controls-Input-DateRange__inputs">
                    <BaseInput
                        readOnly={this._getReadOnly()}
                        disableValidators={this.props.disableValidators}
                        forwardedRef={this.props.forwardedRef}
                        ref={this._endValueFieldRef}
                        className="controls-Input-DateRange_endValue"
                        value={this._rangeModel.endValue}
                        mask={this.props.mask}
                        size={this.props.size}
                        fontStyle={this.props.fontStyle}
                        fontSize={this.props.fontSize}
                        fontColorStyle={this.props.fontColorStyle}
                        borderStyle={this.props.borderStyle}
                        inlineHeight={this.props.inlineHeight}
                        contrastBackground={this.props.contrastBackground}
                        borderVisibility={this.props.borderVisibility}
                        tagStyle={this.props.endTagStyle}
                        selectOnClick={this.props.selectOnClick}
                        autoComplete={this.props.autoComplete}
                        validationStatus={
                            this.props.endValidationStatus || this.props.validationStatus
                        }
                        _yearSeparatesCenturies={this._rangeModel.startValue}
                        autocompleteType="end"
                        valueValidators={this._endValueValidators}
                        validateByFocusOut={this.props.validateByFocusOut}
                        calendarButtonVisible={this.props.calendarButtonVisible}
                        onValueChanged={this._endValueChangedHandler.bind(this)}
                        onFocus={(...args) => {
                            this.props.onFocus?.(...args, 'endValue');
                        }}
                        onBlur={(...args) => {
                            this.props.onBlur?.(...args, 'endValue');
                        }}
                        customEvents={[
                            'onValueChanged',
                            'onMouseDown',
                            'onInputControl',
                            'onInputCompleted',
                            'onTagClick',
                            'onTagHover',
                        ]}
                        onMouseDown={this._inputMouseDownHandler.bind(this)}
                        onInputControl={this._endFieldInputControlHandler.bind(this)}
                        onInputCompleted={this._inputCompletedEndValueHandler.bind(this)}
                        onTagClick={this.props.onEndTagClick}
                        onTagHover={this.props.onEndTagHover}
                    ></BaseInput>
                    {this.props.rightFieldTemplate ? (
                        <this.props.rightFieldTemplate
                            value={this._rangeModel.endValue}
                            inputPosition={'right'}
                        />
                    ) : null}
                </div>
                {this.props.calendarButtonVisible ? (
                    <Icon
                        icon="icon-Calendar"
                        iconSize="s"
                        iconStyle="label"
                        tabIndex={-1}
                        className="controls-Input-DateRange__button"
                        onClick={this._clickHandler.bind(this)}
                        onMouseDown={this.openPopup.bind(this)}
                        onMouseEnter={this._mouseEnterHandler.bind(this)}
                        onMouseLeave={this._mouseLeaveHandler.bind(this)}
                    />
                ) : null}
            </div>
        );
    }

    static defaultProps: Partial<IDateRangeInputOptions> = {
        ...IBaseInputMask.getDefaultOptions(),
        startValueValidators: [],
        endValueValidators: [],
        validateByFocusOut: true,
        startValue: null,
        endValue: null,
        calendarButtonVisible: true,
        datePopupType: 'datePicker',
        borderVisibility: 'partial',
    };

    static contextType = getWasabyContext();
}

/**
 * @name Controls/_dateRange/Input#rightFieldTemplate
 * @cfg {String|TemplateFunction} Шаблон, который будет отображаться справа от поля ввода.
 * @remark
 * В опцию будут переданы поля:
 * * value - значение в поле ввода
 * * inputPosition - расположение инпута. В зависимости от расположения, значение может быть либо 'left' либо 'right'
 * @demo Controls-demo/dateRange/Input/RightFieldTemplate/Index
 */

/**
 * @name Controls/_dateRange/Input#fontSize
 * @cfg {String} Размер шрифта.
 * @demo Controls-demo/dateRange/Input/FontSize/Index
 */

/**
 * Функция обратного вызова, которая вызывается при изменении начального значения поля.
 * @function Controls/_dateRange/Input#onStartValueChanged
 * @param {Date} value Новое значение поля.
 * @param {String} displayValue Текстовое значение поля.
 */

/**
 * Функция обратного вызова, которая вызывается при изменении конечного значения поля.
 * @function Controls/_dateRange/Input#onEndValueChanged
 * @param {Date} value Новое значение поля.
 * @param {String} displayValue Текстовое значение поля.
 */

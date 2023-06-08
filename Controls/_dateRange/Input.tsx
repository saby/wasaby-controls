/**
 * @kaizen_zone a6f7e3ef-ed43-410d-9cea-ff0ee79dcaee
 */
import * as React from 'react';
import { IDateRangeValidatorsOptions } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { activate } from 'UI/Focus';
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

export interface IDateRangeInputOptions
    extends IDateRangeValidatorsOptions,
        IDateRangeOptions,
        IDatePopupTypeOptions,
        ICalendarButtonVisibleOptions {}

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
 * @implements Controls/dateRange:IDayTemplate
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IDateMask
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/interface:IDateRangeValidators
 * @implements Controls/dateRange:IDateRangeSelectable
 * @implements Controls/date:ICalendarButtonVisible
 *
 * @public
 * @demo Controls-demo/dateRange/Input/Default/Index
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
            this._rangeModel.update({
                ...props,
                startValueChangedCallback: this._startValueChangedCallback.bind(this),
                endValueChangedCallback: this._endValueChangedCallback.bind(this),
                rangeChangedCallback: this._rangeChangedCallback.bind(this),
            });
        }
        this._updateValidators();
        return true;
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
                calendarSource: this.props.calendarSource,
                rightFieldTemplate: this.props.rightFieldTemplate,
                ranges: this.props.ranges,
                headerType: 'input',
                range: this.props.range,
            },
        };
        this._stickyOpener.open(cfg);
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
        const event = new SyntheticEvent(null, {
            type: 'startValueChanged',
        });
        this.setState({
            startValue,
        });
        if (this.props.onStartvaluechanged) {
            this.props.onStartvaluechanged(event, startValue);
        }
    }

    private _endValueChangedCallback(endValue: Date): void {
        const event = new SyntheticEvent(null, {
            type: 'endValueChanged',
        });
        this.setState({
            endValue,
        });
        if (this.props.onEndvaluechanged) {
            this.props.onEndvaluechanged(event, endValue);
        }
    }

    private _rangeChangedCallback(startValue: Date, endValue: Date) {
        const event = new SyntheticEvent(null, {
            type: 'rangeChanged',
        });
        if (this.props.onRangechanged) {
            this.props.onRangechanged(event, startValue, endValue);
        }
    }

    private _startValueChangedHandler(event: Event, value: Date): void {
        this._rangeModel.startValue = value;
    }

    private _endValueChangedHandler(event: Event, value: Date): void {
        this._rangeModel.endValue = value;
    }

    protected _startFieldInputControlHandler(value, displayValue, selection): void {
        if (selection.end === displayValue.length) {
            this._endValueFieldRef.current.activate({
                enableScreenKeyboard: true,
            });
        }
        this._validateAfterInput('endValue');
    }

    protected _endFieldInputControlHandler(): void {
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

    protected _inputCompletedStartValueHandler(event: Event, value: Date): void {
        this._rangeModel.startValue = value;
        this._inputCompleted();
    }

    protected _inputCompletedEndValueHandler(event: Event, value: Date): void {
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
        if (this.props.onInputcompleted) {
            const event = new SyntheticEvent(null, {
                type: 'inputCompleted',
            });
            this.props.onInputcompleted(
                event,
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

    activate(): void {
        activate(this._targetRef.current);
    }

    render() {
        return (
            <div {...this.props.attrs} className={this._getClassName()} ref={this._targetRef}>
                <div className="controls-Input-DateRange__inputs">
                    <BaseInput
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
                        borderVisibility="partial"
                        tagStyle={this.props.startTagStyle}
                        selectOnClick={this.props.selectOnClick}
                        autoComplete={this.props.autoComplete}
                        style={this.props.style}
                        validationStatus={this.props.validationStatus}
                        autocompleteType="start"
                        valueValidators={this._startValueValidators}
                        validateByFocusOut={this.props.validateByFocusOut}
                        calendarButtonVisible={this.props.calendarButtonVisible}
                        onValueChanged={this._startValueChangedHandler.bind(this)}
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
                        onTagClick={this.props.onStarttagclick}
                        onTagHover={this.props.onStarttaghover}
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
                        borderVisibility="partial"
                        tagStyle={this.props.endTagStyle}
                        selectOnClick={this.props.selectOnClick}
                        autoComplete={this.props.autoComplete}
                        style={this.props.style}
                        validationStatus={this.props.validationStatus}
                        _yearSeparatesCenturies={this._rangeModel.startValue}
                        autocompleteType="end"
                        valueValidators={this._endValueValidators}
                        validateByFocusOut={this.props.validateByFocusOut}
                        calendarButtonVisible={this.props.calendarButtonVisible}
                        onValueChanged={this._endValueChangedHandler.bind(this)}
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
                        onTagClick={this.props.onEndtagclick}
                        onTagHover={this.props.onEndtaghover}
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
    };
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

/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { StickyOpener } from 'Controls/popup';
import { ICalendarButtonVisibleOptions } from 'Controls/_date/interface/ICalendarButtonVisible';
import { IDatePopupTypeOptions } from 'Controls/_date/interface/IDatePopupType';
import IValueOptions from 'Controls/_date/interface/IValue';
import { IMaskOptions } from 'Controls/baseDecorator';
import { IValueValidatorsOptions } from 'Controls/_date/interface/IValueValidators';
import { IDateConstructorOptions } from 'Controls/interface';
import { IDateLitePopupOptions } from 'Controls/shortDatePicker';
import { Popup as PopupUtil, Base as dateUtils } from 'Controls/dateUtils';
import getDatePopupName from 'Controls/_date/Utils/getPopupName';
import IBaseInputMask from 'Controls/_date/interface/IBaseInputMask';
import BaseInput from 'Controls/_date/BaseInput';
import StringValueConverter from 'Controls/_date/BaseInput/StringValueConverter';
import { Icon } from 'Controls/icon';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/input';
import 'css!Controls/CommonClasses';
import 'css!Controls/date';

export interface IDateInput
    extends ICalendarButtonVisibleOptions,
        IDatePopupTypeOptions,
        IValueOptions,
        IValueValidatorsOptions,
        IMaskOptions,
        IDateConstructorOptions,
        IDateLitePopupOptions {}

/**
 * Поле ввода даты. Поддерживает как ввод с клавиатуры, так и выбор даты из всплывающего календаря с помощью мыши. Не поддерживает ввод времени.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления input}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_datePicker.less переменные тем оформления dateRange}
 *
 * @class Controls/date:Input
 * @extends UI/Base:Control
 * @mixes Controls/_date/interface/IBaseInput
 * @implements Controls/interface:IDateMask
 * @implements Controls/interface:IInputTag
 * @mixes Controls/input:IBorderVisibility
 *
 * @implements Controls/dateRange:IDatePickerSelectors
 * @implements Controls/date:ICalendarButtonVisible
 * @implements Controls/date:IValue
 * @implements Controls/interface:IValidationStatus
 * @mixes Controls/input:IBase
 * @mixes Controls/date:IValueValidators
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/date:IDatePopupType
 * @implements Controls/date:IPlaceholder
 *
 * @public
 * @demo Controls-demo/Input/Date/Picker
 */
export default class Input extends React.Component<IDateInput> {
    // https://online.sbis.ru/opendoc.html?guid=e184361b-4a8c-4525-b7a7-a775ba663997&client=3
    get _container(): HTMLElement {
        return this._targetRef.current;
    }
    private _shouldValidate: boolean = false;
    private _stickyOpener: StickyOpener;
    private _state: string;
    private _datePickerValue: IDateInput['value'];
    private _isShortDatePicker: boolean = false;
    private _targetRef: React.RefObject<HTMLDivElement>;
    private _openerRef: React.RefObject<HTMLDivElement>;

    constructor(props: IDateInput) {
        super(props);
        this._targetRef = React.createRef();
        this._openerRef = React.createRef();
        this._setIsShortDatePicker(props.mask);
        this._datePickerValue = props.value;
        this._stateChangedCallback = this._stateChangedCallback.bind(this);
        this._stickyOpener = new StickyOpener({
            closeOnOutsideClick: true,
            actionOnScroll: 'close',
        });
    }

    shouldComponentUpdate(props: IDateInput) {
        this._setIsShortDatePicker(props.mask);
        if (this.props.value !== props.value) {
            this._datePickerValue = props.value;
            return true;
        }
        if (
            this.props.placeholder !== props.placeholder ||
            this.props.valueValidators !== props.valueValidators ||
            this.props.validationStatus !== props.validationStatus ||
            this.props.calendarButtonVisible !== props.calendarButtonVisible ||
            this.props.mask !== props.mask
        ) {
            return true;
        }
        return false;
    }

    // Если в маске указали только год, будем автоматически открывать БыстрыйВП с режими 'Только год'
    private _setIsShortDatePicker(mask: string) {
        if (mask === 'YYYY') {
            this._isShortDatePicker = true;
        }
    }

    protected _stateChangedCallback(state: string): void {
        this._state = state;
    }

    openPopup(): void {
        const value = PopupUtil.getFormattedSingleSelectionValue(
            this._datePickerValue
        );
        let className;
        if (this.props.datePopupType === 'compactDatePicker') {
            className =
                `controls_compactDatePicker_theme-${this.props.theme} ` +
                'controls-CompactDatePicker__selector-margin controls-CompactDatePicker__popup';
        } else if (this.props.datePopupType === 'datePicker') {
            className = `controls-PeriodDialog__picker controls_datePicker_theme-${this.props.theme}`;
        } else {
            className = `controls-CompactDatePicker__selector-margin
            controls_compactDatePicker_theme-${this.props.theme}`;
        }
        const cfg = {
            ...PopupUtil.getCommonOptions(this, this._openerRef.current),
            target: this._targetRef.current,
            template: this._getPopupType(),
            className,
            allowAdaptive: this.props.datePopupType === 'compactDatePicker' ||
                                                                         this.props.datePopupType === 'shortDatePicker',
            templateOptions: {
                ...PopupUtil.getTemplateOptions(this),
                ...value,
                selectionType: this.props.selectionType || 'single',
                headerType: 'input',
                ...this._getShortDatePickerConfig(),
                startValueValidators: this.props.valueValidators,
            },
        };
        this._stickyOpener.open(cfg);
    }

    private _getPopupType() {
        let datePopupType = this.props.datePopupType;
        if (this._isShortDatePicker) {
            datePopupType = 'shortDatePicker';
        }
        return getDatePopupName(datePopupType);
    }

    private _getShortDatePickerConfig() {
        if (this._isShortDatePicker) {
            return {
                chooseMonths: false,
                chooseQuarters: false,
                chooseHalfyears: false,
                chooseYears: true,
            };
        } else {
            return {
                chooseMonths: this.props.chooseMonths,
                chooseQuarters: this.props.chooseQuarters,
                chooseHalfyears: this.props.chooseHalfyears,
                chooseYears: this.props.chooseYears,
            };
        }
    }

    private _mouseDownHandler(event: Event): void {
        if (this.props.readOnly) {
            event.stopPropagation();
        }
        this.openPopup();
    }

    private _clickHandler(event: Event): void {
        event.stopPropagation();
        this.openPopup();
    }

    protected _onResult(startValue: Date): void {
        const stringValueConverter = new StringValueConverter({
            mask: this.props.mask,
            replacer: this.props.replacer,
            dateConstructor: this.props.dateConstructor,
        });
        let value = startValue;
        if (this.props.dateConstructor && dateUtils.isValidDate(value)) {
            value = new this.props.dateConstructor(value);
        }
        const textValue = stringValueConverter.getStringByValue(value);
        this._datePickerValue = startValue;
        const valueChangedEvent = new SyntheticEvent(null, {
            type: 'valueChanged',
        });
        if (this.props.onValuechanged) {
            this.props.onValuechanged(valueChangedEvent, value, textValue);
        }
        if (this.props.onValueChanged) {
            this.props.onValueChanged(valueChangedEvent, value, textValue);
        }
        this.closePopup();
        const inputCompletedEvent = new SyntheticEvent(null, {
            type: 'inputCompleted',
        });
        if (this.props.onInputcompleted) {
            this.props.onInputcompleted(inputCompletedEvent, value, textValue);
        }
        if (this.props.onInputCompleted) {
            this.props.onInputCompleted(inputCompletedEvent, value, textValue);
        }
        /*
          Вызываем валидацию, т.к. при выборе периода из календаря не вызывается событие valueChanged
          Валидация срабатывает раньше, чем значение меняется, поэтому откладываем ее до _afterUpdate
         */
        this._shouldValidate = true;
    }

    closePopup(): void {
        this._stickyOpener.close();
    }

    protected _textValueChangedHandler(event: Event, value: Date): void {
        // В datePicker нужно всегда иметь актуальное значение, даже если оно не валидное
        this._datePickerValue = value;
    }

    protected _inputMouseDownHandler(event: Event): void {
        if (!this.props.calendarButtonVisible) {
            this.openPopup();
            event.preventDefault();
        }
    }

    private _proxyEvent(event: Event, eventName: string) {
        const callCallback = (callbackName, props) => {
            if (this.props[callbackName]) {
                this.props[callbackName](
                    event,
                    ...Array.prototype.slice.call(props, 2)
                );
            }
        };
        const eventNameLowerCase = eventName.toLowerCase();
        const eventNameArr = eventNameLowerCase.split('');
        eventNameArr[0] = eventNameArr[0].toUpperCase();
        callCallback(`on${eventNameArr.join('')}`, arguments);
        callCallback(`on${eventName}`, arguments);
    }

    private _getClassName(): string {
        let className = 'controls-Input-DatePicker';
        if (this.props.className) {
            className += ` ${this.props.className}`;
        } else if (this.props.attrs?.className) {
            className += ` ${this.props.attrs.className}`;
        }
        return className;
    }

    private _setRefs(element: HTMLElement): void {
        this._targetRef.current = element;
        if (this.props.forwardedRef) {
            this.props.forwardedRef(element);
        }
    }

    activate(): void {
        this._openerRef.current.activate();
    }

    deactivate(): void {
        this._openerRef.current.deactivate();
    }

    render() {
        return (
            <div
                {...this.props.attrs}
                className={this._getClassName()}
                ref={this._setRefs.bind(this)}
            >
                <BaseInput
                    name="input"
                    ref={this._openerRef}
                    value={this._datePickerValue}
                    displayValue={this.props.displayValue}
                    inputMode={this.props.inputMode}
                    mask={this.props.mask}
                    size={this.props.size}
                    fontStyle={this.props.fontStyle}
                    fontSize={this.props.fontSize}
                    fontWeight={this.props.fontWeight}
                    fontColorStyle={this.props.fontColorStyle}
                    borderStyle={this.props.borderStyle}
                    borderVisibility={this.props.borderVisibility}
                    inlineHeight={this.props.inlineHeight}
                    contrastBackground={this.props.contrastBackground}
                    style={this.props.style}
                    tagStyle={this.props.tagStyle}
                    selectOnClick={this.props.selectOnClick}
                    placeholder={this.props.placeholder}
                    validationStatus={this.props.validationStatus}
                    tooltip={this.props.tooltip}
                    textAlign={this.props.textAlign}
                    dateConstructor={this.props.dateConstructor}
                    valueValidators={this.props.valueValidators}
                    validateByFocusOut={this.props.validateByFocusOut}
                    calendarButtonVisible={this.props.calendarButtonVisible}
                    errorTemplate={this.props.errorTemplate}
                    onMouseDown={this._inputMouseDownHandler.bind(this)}
                    onValidateFinished={(event, result) => {
                        this._proxyEvent(event, 'ValidateFinished', result);
                    }}
                    onValueChanged={(event, value, textValue) => {
                        this._proxyEvent(
                            event,
                            'ValueChanged',
                            value,
                            textValue
                        );
                    }}
                    onTextValueChanged={this._textValueChangedHandler.bind(
                        this
                    )}
                    onInputCompleted={(event, value, textValue) => {
                        this._proxyEvent(
                            event,
                            'InputCompleted',
                            value,
                            textValue
                        );
                    }}
                    onTagClick={(event) => {
                        this._proxyEvent(event, 'TagClick');
                    }}
                    onClick={(event) => {
                        this._proxyEvent(event, 'Click');
                    }}
                    onTagHover={(event) => {
                        this._proxyEvent(event, 'TagHover');
                    }}
                    onSelectionStartChanged={(event) => {
                        this._proxyEvent(event, 'SelectionStartChanged');
                    }}
                    onSelectionEndChanged={(event) => {
                        this._proxyEvent(event, 'SelectionEndChanged');
                    }}
                    customEvents={[
                        'onTextValueChanged',
                        'onValueChanged',
                        'onValidateFinished',
                        'onInputCompleted',
                        'onTagClick',
                        'onTagHover',
                        'onSelectionStartChanged',
                        'onSelectionEndChanged',
                        'onMouseDown',
                    ]}
                />
                {this.props.rightFieldTemplate ? (
                    <this.props.rightFieldTemplate value={this.props.value} />
                ) : null}
                {this.props.calendarButtonVisible ? (
                    <Icon
                        icon="icon-Calendar"
                        iconSize="s"
                        iconStyle="label"
                        tabIndex={-1}
                        className="controls-Input-DatePicker__button"
                        onClick={this._clickHandler.bind(this)}
                        onMouseDown={this._mouseDownHandler.bind(this)}
                    />
                ) : null}
            </div>
        );
    }
}

Input.defaultProps = {
    ...IBaseInputMask.getDefaultOptions(),
    valueValidators: [],
    datePopupType: 'datePicker',
    calendarButtonVisible: true,
};

/**
 * @name Controls/date:Input#rightFieldTemplate
 * @cfg {String|TemplateFunction} Шаблон, который будет отображаться справа от поля ввода.
 * @remark
 * В опцию будет передан value - значение в поле ввода
 * @demo Controls-demo/dateNew/RightFieldTemplate/Index
 */

/**
 * @event Controls/date:Input#validateFinished Происходит после заверешения валидации.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {null|Boolean|Array.<String>} validationResult Результат валидации.
 */

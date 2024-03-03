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
import { FocusRoot } from 'UI/Focus';
import 'css!Controls/input';
import 'css!Controls/CommonClasses';
import 'css!Controls/date';
import { getWasabyContext } from 'UI/Contexts';
import { IDayAvailableOptions } from 'Controls/calendar';

export interface IDateInput
    extends ICalendarButtonVisibleOptions,
        IDatePopupTypeOptions,
        IValueOptions,
        IValueValidatorsOptions,
        IMaskOptions,
        IDateConstructorOptions,
        IDateLitePopupOptions,
        IDayAvailableOptions {}

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
 * @implements Controls/date:ICalendarButtonVisible
 * @implements Controls/date:IValue
 * @implements Controls/calendar:IDayAvailable
 * @implements Controls/interface:IValidationStatus
 * @mixes Controls/input:IBase
 * @mixes Controls/date:IValueValidators
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/date:IDatePopupType
 * @implements Controls/date:IPlaceholder
 *
 * @public
 * @demo Controls-demo/dateNew/Index
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
    private _shouldUpdatedPassed: boolean = false;
    private _selectionPosition: number = 0;

    constructor(props: IDateInput) {
        super(props);
        this._targetRef = React.createRef();
        this._openerRef = React.createRef();
        this._setRefs = this._setRefs.bind(this);
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
            this._shouldUpdatedPassed = true;
            return true;
        }
        return (
            this.props.placeholder !== props.placeholder ||
            this.props.valueValidators !== props.valueValidators ||
            this.props.validationStatus !== props.validationStatus ||
            this.props.calendarButtonVisible !== props.calendarButtonVisible ||
            this.props.mask !== props.mask ||
            this.props.readOnly !== props.readOnly ||
            this.props.tagStyle !== props.tagStyle ||
            this.props.inlineHeight !== props.inlineHeight ||
            this.props.fontSize !== props.fontSize
        );
    }

    // TODO: https://online.sbis.ru/opendoc.html?guid=b22433bf-1310-4fcf-88f7-61f8209d3b09&client=3
    UNSAFE_componentWillUpdate(props: IDateInput) {
        if (!this._shouldUpdatedPassed) {
            if (this.props.value !== props.value) {
                this._datePickerValue = props.value;
            }
        }
        this._shouldUpdatedPassed = false;
    }

    componentDidUpdate(): void {
        if (this._shouldValidate) {
            this._shouldValidate = false;
            this._openerRef.current.validate();
        }
    }

    componentWillUnmount(): void {
        if (this._stickyOpener.isOpened()) {
            this._stickyOpener.close();
        }
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
        const value = PopupUtil.getFormattedSingleSelectionValue(this._datePickerValue);
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
            allowAdaptive: true,
            templateOptions: {
                ...PopupUtil.getTemplateOptions(this),
                ...value,
                isDayAvailable: this.props.isDayAvailable,
                selectionPosition: this._selectionPosition,
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

    setValidationResult(validationResult): void {
        this._openerRef.current.setValidationResult(validationResult);
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
        if (this._getReadOnly()) {
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

    protected _inputClickHandler(): void {
        if (!this.props.calendarButtonVisible) {
            this.openPopup();
        }
    }

    private _onSelectionStartChanged(_, selectionPosition: number): void {
        if (!this.props.calendarButtonVisible) {
            this._selectionPosition = selectionPosition;
        }
        this._proxyEvent(event, 'SelectionStartChanged');
    }

    private _proxyEvent(event: Event, callbackName: string) {
        if (this.props[callbackName]) {
            this.props[callbackName](event, ...Array.prototype.slice.call(arguments, 2));
        }
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

    protected _getReadOnly(): boolean {
        return this.props.readOnly ?? this.context?.readOnly;
    }

    activate(): void {
        this._openerRef.current.activate();
    }

    deactivate(): void {
        this._openerRef.current.deactivate();
    }

    validate(): void {
        this._openerRef.current.validate();
    }

    render() {
        return (
            <FocusRoot
                as="div"
                data-qa={this.props['data-qa'] || 'controls-Input-DatePicker'}
                {...this.props.attrs}
                style={{
                    ...this.props.attrs?.style,
                    ...this.props.style,
                }}
                className={this._getClassName()}
                ref={this._setRefs}
            >
                <BaseInput
                    name="input"
                    ref={this._openerRef}
                    disableValidators={this.props.disableValidators}
                    readOnly={this._getReadOnly()}
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
                    onSelectionStartChanged={this._onSelectionStartChanged.bind(this)}
                    onValidateFinished={(event, result) => {
                        this._proxyEvent(event, 'onValidateFinished', result);
                    }}
                    onValueChanged={(event, value, textValue) => {
                        this._proxyEvent(event, 'onValueChanged', value, textValue);
                    }}
                    onTextValueChanged={this._textValueChangedHandler.bind(this)}
                    onInputCompleted={(event, value, textValue) => {
                        this._proxyEvent(event, 'onInputCompleted', value, textValue);
                    }}
                    onTagClick={(event, tag) => {
                        this._proxyEvent(event, 'onTagClick', tag);
                    }}
                    onClick={(event) => {
                        this._inputClickHandler();
                        this._proxyEvent(event, 'onClick');
                    }}
                    onTagHover={(event) => {
                        this._proxyEvent(event, 'onTagHover');
                    }}
                    onSelectionEndChanged={(event) => {
                        this._proxyEvent(event, 'onSelectionEndChanged');
                    }}
                    onFocus={(event) => {
                        this._proxyEvent(event, 'onFocus');
                    }}
                    onBlur={(event) => {
                        this._proxyEvent(event, 'onBlur');
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
                        'onClick',
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
            </FocusRoot>
        );
    }

    static contextType = getWasabyContext();
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
 * @param {null|Array.<String>} validationResult Результат валидации. В случае прохождения валидации вернет null, в противном случае вернет массив из строк.
 */

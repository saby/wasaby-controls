/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import * as React from 'react';
import { date as DateFormatter } from 'Types/formatter';
import { isValidDate, Container, InputContainer, IValidator } from 'Controls/validate';
import { Date as WSDate, DateTime as WSDateTime, Time as WSTime } from 'Types/entity';
import Model from 'Controls/_date/BaseInput/Model';
import {
    DATE_MASK_TYPE,
    DATE_TIME_MASK_TYPE,
    getMaskType,
    TIME_MASK_TYPE,
} from './BaseInput/Utils';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants, detection } from 'Env/Env';
import {
    getDefaultOptions as getValueValidatorsDefaultOptions,
    IValueValidatorsOptions,
    TValueValidators,
} from 'Controls/_date/interface/IValueValidators';
import { AutoComplete, IBaseOptions, IInputDisplayValueOptions, INPUT_MODE } from 'Controls/input';
import { IBaseInputOptions } from 'Controls/_date/interface/BaseInput';
import IValueOptions from 'Controls/_date/interface/IValue';
import IBaseInputMask, { IBaseInputMaskOptions } from 'Controls/_date/interface/IBaseInputMask';
import { IInputDisplayValueOptions, INPUT_MODE } from 'Controls/input';
import { Base as dateUtils } from 'Controls/dateUtils';
import Mask from './BaseInput/Mask';
import { withWasabyEventObject } from 'UICore/Events';
import { getWasabyContext } from 'UI/Contexts';
import { checkWasabyEvent } from 'UI/Events';

const VALID_PARTIAL_DATE = /^(0{2}| {2})\.(0{2}| {2})\.\d{2,4}$/;

export interface IDateBaseOptions
    extends IBaseOptions,
        IBaseInputOptions,
        IBaseInputMaskOptions,
        IValueValidatorsOptions,
        IInputDisplayValueOptions,
        IValueOptions {
    autocompleteType: AutoComplete;
    onValueChanged: Function;
    onValuechanged: Function;
    onInputcompleted: Function;
    onInputCompleted: Function;
    onValidateFinished: Function;
}

/**
 * Базовое универсальное поле ввода даты и времени. Позволяет вводить дату и время одновременно или по отдельности. Данные вводятся только с помощью клавиатуры.
 * @remark
 * В зависимости от маски может использоваться для ввода:
 * <ol>
 *    <li>даты;</li>
 *    <li>времени;</li>
 *    <li>даты и времени.</li>
 * </ol>
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FInput%2FDateTime%2FDateTime демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/date/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @class Controls/date:BaseInput
 * @extends UI/Base:Control
 * @mixes Controls/_date/interface/IBaseInput
 *
 * @mixes Controls/_date/interface/IBaseInputMask
 * @implements Controls/interface:IInputTag
 * @mixes Controls/input:IBase
 * @mixes Controls/input:IBorderVisibility
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/date:IValue
 * @implements Controls/date:IExtendedTimeFormat
 * @mixes Controls/date:IValueValidators
 * @implements Controls/interface:IValidationStatus
 *
 *
 * @public
 * @demo Controls-demo/Input/DateTime/DateTime
 */
const BaseInputContent = React.forwardRef(function InputContent(props, ref): React.ReactElement {
    const inputRef = React.useRef();

    const getClassName = (): string => {
        let className = 'controls-Input-DatePicker__content ';
        if (props.contentClassName) {
            className += props.contentClassName;
        }
        if (props.attrs?.className) {
            className += ` ${props.attrs.className}`;
        }
        return className;
    };

    // {...props} - передавая таким образом пропсы дочерним контрола прокидываются ВСЕ опции
    // в том числе и все события, таким образом один и тот же колбэк будет регистрироваться
    // и на this._validationContainer и на Mask, работало раньше потому что в ядре была ошибка
    // надо передавать только нужные опции, а не кидать все скопом
    const newProps = { ...props };
    delete newProps.onValuechanged;
    delete newProps.onInputcompleted;

    // Если произошел автофокус на поле ввода с плейсхолдером, курсор встанет в самый конец
    // Будем выставлять его в начало сами
    if (newProps.shouldSetCursorToStart && !detection.isMac) {
        inputRef.current.setCursorPosition(0);
    }

    const onBlur = (): void => {
        // Управляем курсором сами только на десктопе, т.к. на мобильных устроствах при установке курсора срабатывает
        // фокус и открывается клавиатура
        if (!detection.isMobilePlatform && !detection.isMac && !detection.isIE11) {
            inputRef.current.setCursorPosition(0);
        }
        props.onBlur();
    };

    return (
        <Mask
            ref={inputRef}
            forwardedRef={ref}
            {...newProps}
            onBlur={onBlur}
            className={getClassName()}
            value={newProps.maskValue}
            validationStatus={newProps.getValidationStatus(newProps.validationStatus)}
        />
    );
});

function BaseInputStretcherTemplate(props): React.ReactElement {
    const getMask = (): string => {
        // Нужно явно указать значение, иначе значение будет постоянно меняться.
        // В качестве пасхалки берем дату основания Тензора
        return DateFormatter(new Date(1996, 5, 21), props.mask);
    };

    return (
        <div className="controls-BaseInput__stretcher__container">
            <div className="controls-InputBase__stretcher-block">{getMask()}</div>
            <div className="controls-InputBase__stretcher-block controls-BaseInput__stretcher-block">
                {props.placeholder}
            </div>
        </div>
    );
}

export default class BaseInput<T extends IDateBaseOptions> extends React.Component<T> {
    // https://online.sbis.ru/opendoc.html?guid=e184361b-4a8c-4525-b7a7-a775ba663997&client=3
    get _container(): HTMLElement {
        return this._ref.current?._container;
    }
    protected _model: Model;
    private _validationContainer: InputContainer | Container;
    private _dateConstructor: Date | WSDate;
    private _placeholder: string;
    protected _validators: TValueValidators = [];
    protected _controlName: string = 'DateBase';
    protected _isFocused: boolean = false;
    private _ref: React.RefObject<HTMLDivElement> = React.createRef();
    private _shouldUpdatedPassed: boolean = false;
    private _selectionPosition: number = 0;

    state: {
        value: string;
        shouldSetCursorToStart: boolean;
        placeholder: string;
    };
    protected _formatMaskChars: object = {
        D: '[0-9]',
        M: '[0-9]',
        Y: '[0-9]',
        H: '[0-9]',
        m: '[0-9]',
        s: '[0-9]',
        S: '[0-9]',
        U: '[0-9]',
    };
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            placeholder: props.placeholder,
        };
        this._getStretcherValue = this._getStretcherValue.bind(this);
        this._updateDateConstructor(props);
        this._updateValidationController(props);
        this._model = new Model({
            ...props,
            value: this._getValue(props.value),
            dateConstructor: this._dateConstructor,
            valueChangedCallback: this._valueChanged.bind(this),
        });
        this._updateValidators(
            props.valueValidators,
            props.inputMode,
            props.mask,
            props.disableValidators
        );
        this._placeholder = props.placeholder;
    }

    shouldComponentUpdate(props: T) {
        this._shouldUpdatedPassed = true;
        return this._updateProps(props);
    }

    // TODO: https://online.sbis.ru/opendoc.html?guid=b22433bf-1310-4fcf-88f7-61f8209d3b09&client=3
    UNSAFE_componentWillUpdate(props: T) {
        if (!this._shouldUpdatedPassed) {
            this._updateProps(props);
        }
        this._shouldUpdatedPassed = false;
    }

    private _updateProps(props: T): boolean {
        let changed = false;
        if (
            this.props.placeholder !== props.placeholder ||
            (!props.value && !this._placeholder && this._model.value !== props.value)
        ) {
            this._placeholder = props.placeholder;
            changed = true;
            if (this._isFocused) {
                this._placeholder = undefined;
            }
        }
        this._updateDateConstructor(props, this.props);
        if (this.props.validateByFocusOut !== props.validateByFocusOut) {
            this._updateValidationController(props);
            changed = true;
        }
        // Если значение поменялось из кода - сбрасываем валидацию
        // Нельзя передать value напрямую в валидатор, т.к. будет вызываться валидация при каждом изменении значения.
        // Из-за этого произайдет ошибка сразу после ввода первого символа.
        if (this._model.value !== props.value) {
            this.setValidationResult(null);
            changed = true;
        }

        if (
            props.value !== this.props.value ||
            props.displayValue !== this.props.displayValue ||
            props.mask !== this.props.mask
        ) {
            this._model.update({
                ...props,
                dateConstructor: this._dateConstructor,
            });
            changed = true;
        }
        if (
            this.props.valuevalidators !== props.valueValidators ||
            props.value !== this.props.value ||
            props.displayValue !== this.props.displayValue ||
            props.disableValidators !== this.props.disableValidators
        ) {
            this._updateValidators(
                props.valueValidators,
                props.inputMode,
                props.mask,
                props.disableValidators
            );
            changed = true;
        }
        return changed;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.placeholder && prevState.placeholder && !this.state.placeholder) {
            this.setState({
                shouldSetCursorToStart: true,
            });
        }
    }

    componentWillUnmount(): void {
        this._model.destroy();
    }

    protected _getValue(value: Date | string) {
        return value;
    }

    private _valueChanged(value: [Date, string]): void {
        const dateValue = value[0];
        if (dateUtils.isValidDate(dateValue) || dateValue === null) {
            if (this.props.onValueChanged) {
                this.props.onValueChanged(...value);
            }
            if (this.props.onValuechanged) {
                this.props.onValuechanged(...value);
            }
        }
        if (this.props.onTextValueChanged) {
            this.props.onTextValueChanged(...value);
        }
        if (this.props.onTextvaluechanged) {
            this.props.onTextvaluechanged(...value);
        }
        this._updateValidators();
    }

    protected _getFontColorStyle(): string {
        if (this.props.fontColorStyle) {
            return this.props.fontColorStyle;
        }
        if (!this._model.value && this._placeholder) {
            return 'DateInput__placeholder';
        }
    }

    protected _focusHandler(focus: boolean, event) {
        this._isFocused = focus;
        if (this.props.placeholder) {
            if (focus && this.props.calendarButtonVisible && !this._getReadOnly()) {
                this._placeholder = undefined;
            } else if (!this.props.value) {
                this._placeholder = this.props.placeholder;
            }
            this.setState({
                placeholder: this._placeholder,
            });
        }
        if (focus) {
            this._onFocus(event);
        } else {
            this._onBlur(event);
        }
    }

    protected _inputCompletedHandler(
        event: SyntheticEvent<KeyboardEvent>,
        value,
        stringValue: string
    ): void {
        let textValue = stringValue;
        if (typeof event === 'string') {
            textValue = value;
        }
        // TODO: https://online.sbis.ru/opendoc.html?guid=da59f42d-f3f7-4329-a455-d2f217fcd070&client=3
        if (typeof textValue !== 'string') {
            return;
        }
        event?.stopImmediatePropagation?.();
        this._model.autocomplete(textValue, this.props.autocompleteType, this.props.inputMode);
        if (this.props.onInputcompleted) {
            this.props.onInputcompleted(this._model.value, this._model.displayValue);
        }
        if (this.props.onInputCompleted) {
            this.props.onInputCompleted(this._model.value, this._model.displayValue);
        }
        this.setState({
            value: this._model.clearTextValue,
        });
    }

    protected _valueChangedHandler(
        event: SyntheticEvent<KeyboardEvent>,
        value,
        stringValue: string
    ): void {
        if (this.props.placeholder && this.state.shouldSetCursorToStart) {
            this.setState({
                shouldSetCursorToStart: false,
            });
        }
        let textValue = stringValue;
        if (typeof event === 'string') {
            textValue = value;
        }
        // Контроллер валидаторов на той же ноде стреляет таким же событием но без второго аргумента.
        if (textValue !== undefined) {
            this._model.textValue = textValue;
            this.setState({
                value: this._model.clearTextValue,
            });
        }
        event?.stopImmediatePropagation?.();
    }

    validate(): void {
        // Возвращаем результат валидации для совместимости со старыми формами.;
        return this._ref.current.validate();
    }

    setValidationResult(validationResult): void {
        this._ref.current.setValidationResult(validationResult);
    }

    protected _getValidationStatus(validationStatus: string): string {
        if (this.props.validationStatus && this.props.validationStatus !== 'valid') {
            return this.props.validationStatus;
        }
        return validationStatus || this.props.validationStatus;
    }

    protected _onKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        let shouldCallCallback = true;
        if (!this._getReadOnly()) {
            const key = event.nativeEvent.keyCode;
            if (
                key === constants.key.insert &&
                !event.nativeEvent.shiftKey &&
                !event.nativeEvent.ctrlKey
            ) {
                // on Insert button press current date should be inserted in field
                this._model.setCurrentDate();
                this.setState({
                    value: this._model.clearTextValue,
                });
                if (this.props.onInputcompleted) {
                    this.props.onInputcompleted(this._model.value, this._model.textValue);
                }
                if (this.props.onInputCompleted) {
                    this.props.onInputCompleted(this._model.value, this._model.textValue);
                }
                // В IE при нажатии на кнопку insert включается поведение, при котором впередистоящие символы начинают
                // перезаписываться при вводе. Из-за этого контрол не понимает какое действие произошло,
                // т.к. при обычном вводе числа, значение в инпуте меняется по другому (например, значение 12.12.12,
                // при вводе 1 станет 112.12.12). Отключим это поведение.
                event.preventDefault();
                shouldCallCallback = false;
            }
            if (key === constants.key.plus || key === constants.key.minus) {
                // on +/- buttons press date should be increased or decreased in field by one day if date is not empty
                if (this._model.value) {
                    const delta = key === constants.key.plus ? 1 : -1;
                    const localDate = new this._dateConstructor(this._model.value);
                    localDate.setDate(this._model.value.getDate() + delta);
                    this._model.value = localDate;
                    this.setState({
                        value: this._model.clearTextValue,
                    });
                    if (this.props.onInputcompleted) {
                        this.props.onInputcompleted(this._model.value, this._model.textValue);
                    }
                    if (this.props.onInputCompleted) {
                        this.props.onInputCompleted(this._model.value, this._model.textValue);
                    }
                }
            }
        }
        if (this.props.onKeyDown && shouldCallCallback) {
            this.props.onKeyDown(event);
        }
    }

    private _updateValidationController(props: { validateByFocusOut: boolean }): void {
        this._validationContainer = props.validateByFocusOut ? InputContainer : Container;
    }

    private _updateDateConstructor(props, oldProps?): void {
        if (!oldProps || props.mask !== oldProps.mask) {
            this._dateConstructor = props.dateConstructor || this._getDateConstructor(props.mask);
        }
    }

    private _getDateConstructor(mask: string): Function {
        const dateConstructorMap = {
            [DATE_MASK_TYPE]: WSDate,
            [DATE_TIME_MASK_TYPE]: WSDateTime,
            [TIME_MASK_TYPE]: WSTime,
        };
        return dateConstructorMap[getMaskType(mask)];
    }

    protected _updateValidators(
        validators?: TValueValidators,
        inputMode?: string,
        mask?: string,
        disableValidators?: boolean
    ): void {
        const iMode = inputMode || this.props.inputMode;
        const v: TValueValidators = validators || this.props.valueValidators;
        this._validators = [];

        const needValidateForPartialMode =
            getMaskType(mask) !== DATE_MASK_TYPE ||
            !this._model.displayValue.match(VALID_PARTIAL_DATE);

        if (iMode !== INPUT_MODE.partial || needValidateForPartialMode) {
            this._validators.push(
                isValidDate.bind(null, {
                    value: this._model.value,
                })
            );
        }
        if (!disableValidators) {
            this._validators = this._validators.concat(
                v.map((validator) => {
                    let _validator: Function;
                    let args: object;
                    if (typeof validator === 'function') {
                        _validator = validator;
                    } else {
                        _validator = validator.validator;
                        args = validator.arguments;
                    }
                    return _validator.bind(null, {
                        ...(args || {}),
                        value: this._model.value,
                    });
                })
            );
        }
    }

    private _getStretcherValue(stretcherValue: string): string {
        if (!this.props.placeholder) {
            return stretcherValue;
        }
        const value = new Date();
        // У поля ввода есть стретчер, который растягивает поле ввода по ширине символов в value.
        // Если передали placeholder - отдадим в стретчер дату в виде строки по маске, чтобы ширина не прыгала.
        return DateFormatter(value, this.props.mask);
    }

    private _onTagClick(): void {
        if (this.props.onTagClick) {
            this.props.onTagClick(...arguments);
        }
    }

    private _onTagHover(): void {
        if (this.props.onTagHover) {
            this.props.onTagHover(...arguments);
        }
    }

    private _onInputControl(): void {
        if (this.props.onInputControl) {
            this.props.onInputControl(...arguments);
        }
    }

    private _mouseDownHandler(event: Event): void {
        if (this.props.onMouseDown) {
            this.props.onMouseDown(event);
        }
    }

    private _onClick(event: Event): void {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    private _onValidateFinished(...eventArguments): void {
        if (checkWasabyEvent(this.props.onValidateFinished)) {
            this.props.onValidateFinished(...eventArguments);
        }
    }

    private _onSelectionStartChanged(position: number): void {
        let selectionPosition = position;
        // Если кликнули на placeholder, будем перемещать курсор в начало
        if (!this._model.clearTextValue) {
            selectionPosition = 0;
        }
        if (this.props.onSelectionStartChanged) {
            this.props.onSelectionStartChanged(selectionPosition);
        }
        this._selectionPosition = position;
    }

    private _getSelectionPosition(): number {
        if (typeof this.props.selectionPosition === 'number') {
            return this.props.selectionPosition;
        }
        return this._selectionPosition;
    }

    private _onFocus(event): void {
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    private _onBlur(event): void {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    activate(): void {
        this._ref.current.activate({ enableScreenKeyboard: true });
    }

    deactivate(): void {
        this._ref.current.deactivate();
    }

    private _getClassName(): string {
        let className = `controls-${this._controlName}`;
        if (!this.props.calendarButtonVisible) {
            className += ' controls-BaseInput_cursor-pointer';
        }
        if (this.props.className) {
            className += ` ${this.props.className}`;
        } else if (this.props.attrs?.className) {
            className += ` ${this.props.attrs.className}`;
        }
        return className;
    }

    protected _getReadOnly(): boolean {
        return this.props.readOnly ?? this.context?.readOnly;
    }

    getAutoFocus(): boolean {
        if (this.props.attrs) {
            return this.props.attrs['ws-autofocus'];
        }
    }

    render() {
        return (
            <this._validationContainer
                data-qa={
                    this.props['data-qa'] ||
                    this.props.attrs?.['data-qa'] ||
                    'controls-BaseInput-Date'
                }
                content={BaseInputContent}
                stretcherContentTemplate={
                    this.props.placeholder ? (
                        <BaseInputStretcherTemplate
                            placeholder={this.props.placeholder}
                            mask={this.props.mask}
                        />
                    ) : null
                }
                selectionPosition={this._getSelectionPosition()}
                getStretcherValueCallback={this._getStretcherValue}
                calendarButtonVisible={this.props.calendarButtonVisible}
                contrastBackground={this.props.contrastBackground}
                horizontalPadding={this.props.horizontalPadding}
                readOnly={this._getReadOnly()}
                rightFieldTemplate={this.props.rightFieldTemplate}
                attrs={{
                    ...this.props.attrs,
                    style: {
                        ...this.props.attrs?.style,
                        ...this.props.style,
                    },
                }}
                autoFocus={this.getAutoFocus()}
                contentClassName={this._getClassName()}
                maskValue={this._model.clearTextValue}
                replacer={this._model._replacer}
                mask={this.props.mask}
                size={this.props.size}
                fontStyle={this.props.fontStyle}
                fontSize={this.props.fontSize}
                fontWeight={this.props.fontWeight}
                fontColorStyle={this._getFontColorStyle()}
                borderStyle={this.props.borderStyle}
                borderVisibility={this.props.borderVisibility}
                inlineHeight={this.props.inlineHeight}
                selectOnClick={this.props.selectOnClick}
                placeholder={this._placeholder}
                shouldSetCursorToStart={this.state.shouldSetCursorToStart}
                tagStyle={this.props.tagStyle}
                getValidationStatus={this._getValidationStatus.bind(this)}
                tooltip={this.props.tooltip}
                formatMaskChars={this._formatMaskChars}
                onFocusin={(event) => {
                    this._focusHandler(true, event);
                }}
                onFocusout={(event) => {
                    this._focusHandler(false, event);
                }}
                onInputCompleted={withWasabyEventObject(this._inputCompletedHandler.bind(this))}
                onTagClick={withWasabyEventObject(this._onTagClick.bind(this))}
                onTagHover={withWasabyEventObject(this._onTagHover.bind(this))}
                onValueChanged={withWasabyEventObject(this._valueChangedHandler.bind(this))}
                onKeyDown={this._onKeyDown.bind(this)}
                onClick={this._onClick.bind(this)}
                onInputControl={this._onInputControl.bind(this)}
                onMouseDown={this._mouseDownHandler.bind(this)}
                onValidateFinished={this._onValidateFinished.bind(this)}
                onSelectionStartChanged={this._onSelectionStartChanged.bind(this)}
                inputCallback={(defaultConfig) => {
                    // Запретим выбор, если пытаются что-то ввести в поле без ручного ввода
                    if (!this.props.calendarButtonVisible) {
                        return {
                            value: this._model.clearTextValue,
                            displayValue: this._model.value
                                ? this._model.textValue
                                : this._model.emptyMaskValue,
                            position: 0,
                        };
                    }
                    return defaultConfig;
                }}
                customEvents={[
                    'onInputControl',
                    'onValueChanged',
                    'onFocusin',
                    'onFocusout',
                    'onInputCompleted',
                    'onTagHover',
                    'onTagClick',
                    'onValidateFinished',
                    'onSelectionStartChanged',
                ]}
                forwardedRef={this.props.forwardedRef}
                ref={this._ref}
                validators={this._validators}
                errorTemplate={this.props.errorTemplate}
            />
        );
    }

    static defaultProps = {
        ...IBaseInputMask.getDefaultOptions(),
        ...getValueValidatorsDefaultOptions(),
        autocompleteType: 'default',
        calendarButtonVisible: true,
        inputMode: INPUT_MODE.default,
        datePopupType: 'datePicker',
    };

    static contextType = getWasabyContext();
}

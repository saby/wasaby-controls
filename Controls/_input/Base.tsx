/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Component, createRef, MouseEvent, ReactElement } from 'react';
import { constants, detection } from 'Env/Env';
import { descriptor } from 'Types/entity';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ViewModel } from 'Controls/_input/Base/ViewModel';
import * as unEscapeASCII from 'Core/helpers/String/unEscapeASCII';
import { hasHorizontalScroll } from 'Controls/scroll';
import { processKeydownEvent } from 'Controls/_input/resources/Util';
import { ISelection } from 'Controls/_input/resources/Types';
import { IBaseOptions } from 'Controls/_input/interface/IBase';
import Field from 'Controls/_input/resources/Field';
import { IViewModelOptions } from 'Controls/_input/Text/ViewModel';
import { getWasabyContext } from 'UICore/Contexts';
import 'css!Controls/input';
import { getOptionBorderVisibilityTypes } from 'Controls/_input/interface/IBorderVisibility';
import { Logger } from 'UI/Utils';

import { getStateReceiver, getStore } from 'Application/Env';
import { ISerializableState } from 'Application/Interface';
import { default as Render } from 'Controls/_input/Render';
import { default as FieldTemplate } from 'Controls/_input/Base/Field';
import { default as Counter } from 'Controls/_input/Base/Counter';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { IValidationStatusOptions } from 'Controls/interface';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { __notifyFromReact } from 'UICore/Events';
import ReadOnlyFieldTemplate from 'Controls/_input/Base/ReadOnly';

interface IState {
    fieldName: string;
}

class ReceivedPageConfig implements ISerializableState {
    private _state: IState;

    getState(): IState {
        return this._state;
    }

    setState(data: IState): void {
        this._state = data;
    }
}

interface IInputCounterStore {
    value: number;
}

interface IFieldTemplate {
    template: string | TemplateFunction | ReactElement;
    scope: {
        emptySymbol?: string;
        controlName?: string;
        autoComplete?: boolean | string;
        ieVersion?: number | null;
        isFieldFocused?: () => boolean;

        value?: string;
        autoWidth?: boolean;
    };
}

enum PLACEHOLDER_VISIBILITY {
    EMPTY = 'empty',
    EDITABLE = 'editable',
    // Подробности установки данного значения в _beforeMount.
    HIDDEN = 'hidden',
}

export interface IBaseInputOptions extends IBaseOptions, IControlOptions, IValidationStatusOptions {
    inputMode?: string;

    maxLength?: number;
    counterVisibility?: boolean;
    value?: unknown;
    tagStyle?: string;
    borderStyle?: string;
    validationStatus?: string;
    horizontalPadding?: string;
    transliterate?: boolean;
    autoFocus?: boolean;

    selectionStart?: number;
    selectionEnd?: number;

    leftFieldTemplate?: ReactElement;
    rightFieldTemplate?: ReactElement;
    stretcherContentTemplate?: ReactElement;

    onValueChanged?: (value: unknown, displayValue: string) => void;
    valueChangedCallback?: (value: unknown, displayValue: string) => void;
    onInputCompleted?: (value: unknown, displayValue: string) => void;
    inputCompletedCallback?: (value: unknown, displayValue: string) => void;
    onTagClick?: (e: SyntheticEvent) => void;
    onTagHover?: (e: SyntheticEvent) => void;
    onInputControl: Function;
    onSelectionStartChanged: Function;
    onSelectionEndChanged: Function;

    onKeyUp?: (e: SyntheticEvent) => void;
    onKeyDown?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: SyntheticEvent) => void;
    onInput?: (e: SyntheticEvent) => void;
    onCut?: (e: SyntheticEvent) => void;
    onCopy?: (e: SyntheticEvent) => void;
    onPaste?: (e: SyntheticEvent) => void;
    onClick?: (e: SyntheticEvent) => void;
    onSelect?: (e: SyntheticEvent) => void;
    onFocus?: (e: SyntheticEvent) => void;
    onBlur?: (e: SyntheticEvent) => void;
    onMouseDown?: (e: SyntheticEvent) => void;
    onMouseEnter?: (e: SyntheticEvent) => void;
    onMouseLeave?: (e: SyntheticEvent) => void;
    onMouseMove?: (e: SyntheticEvent) => void;
    onTouchstart?: (e: SyntheticEvent) => void;
    onWheel?: (e: SyntheticEvent) => void;

    getStretcherValueCallback?: (result: string) => string;
}

interface IBaseInputState {
    modelVersion: number;
    localVersion: number;
}

/**
 * The width of the cursor in the field measured in pixels.
 * @type {Number}
 * @private
 */
const WIDTH_CURSOR: number = 1;

const MIN_IE_VERSION: number = 12;

const INPUT_COUNTER_STORAGE_ID: string = 'ws-input-counter';

let count = 0;

/**
 * Базовый класс для текстовых полей ввода.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * Ширина поля ввода может быть ограничена как с помощью css, при задании св-ва width на контейнер, так и с
 * помощью задания ширины под определенное кол-во символов.Для задания ширины под определенное кол-во символов сделаны
 * специальные классы controls-Input__width-Nch, где N - количество цифр от 1 до 12
 * Например, controls-Input__width-5ch, этот класс нужно повесить на корень контрола.
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IBorderStyle
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/input:IBase
 * @implements Controls/input:ITag
 * @implements Controls/input:IValue
 * @implements Controls/input:IBorderVisibility
 * @implements Controls/input:IPadding
 * @implements Controls/input:IBaseSelection
 * @implements Controls/input:IFieldTemplate
 * @implements Controls/interface:IInputPlaceholder
 * @public
 */
class Base<TBaseInputOptions extends IBaseInputOptions = {}> extends Component<
    TBaseInputOptions,
    IBaseInputState
> {
    protected _controlName: string;
    protected fieldNameRef = createRef<Field<string, IViewModelOptions>>();
    protected readonlyFieldRef = createRef<HTMLElement>();
    protected forCalcRef = createRef<HTMLElement>();
    protected containerRef = createRef<HTMLElement>();
    protected _instanceId = `input-base-inst-${count++}`;

    /**
     * Input field in edit mode.
     * @type {Controls/_input/Base/Types/DisplayingControl.typedef}
     * @private
     */
    protected _field: IFieldTemplate = null;

    protected _defaultValue: string | number = null;

    /**
     * Determines whether the control stretch over the content.
     * @type {Boolean}
     * @private
     */
    protected _autoWidth: boolean = false;

    /**
     * Input field in read mode.
     * @type {Controls/_input/Base/Types/DisplayingControl.typedef}
     * @private
     */
    protected _readOnlyField: IFieldTemplate = null;

    /**
     * The display model of the input field.
     * @type {Controls/_input/Base/ViewModel}
     * @private
     */
    protected _viewModel;

    protected _wasActionUser: boolean = true;

    /**
     * Text of the tooltip shown when the control is hovered over.
     * @type {String}
     * @private
     */
    protected _tooltip: string = '';

    /**
     * Value of the type attribute in the native field.
     * @type {String}
     * @remark
     * How an native field works varies considerably depending on the value of its {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types type attribute}.
     * @private
     */
    protected _type: string = 'text';

    /**
     * Значение атрибута inputmode в нативном поле ввода.
     * @private
     */
    protected _inputMode: string = 'text';

    /**
     * Value of the name attribute in the native field.
     * @type {String}
     * @private
     */
    protected _fieldName: string;

    /**
     * Determines whether the control is multiline.
     * @type {Boolean}
     * @private
     */
    protected _multiline: boolean = false;

    /**
     * Determines whether the control has a rounded border.
     * @type {Boolean}
     * @private
     */
    protected _roundBorder: boolean = false;

    /**
     * @type {Controls/_utils/sizeUtils/hasHorizontalScroll}
     * @private
     */
    protected _hasHorizontalScroll: Function = hasHorizontalScroll;

    /**
     * The version of IE browser in which the control is build.
     * @type {Number|null}
     * @private
     */
    protected _ieVersion: number = null;

    /**
     * Determines whether the control is building in the mobile Android environment.
     * @type {Boolean|null}
     * @private
     */
    protected _isMobileAndroid: boolean = null;

    protected _isIE: boolean = null;

    /**
     * Determines whether the control is building in the mobile IOS environment.
     * @type {Boolean|null}
     * @private
     */
    protected _isMobileIOS: boolean = null;

    protected _placeholderVisibility: PLACEHOLDER_VISIBILITY = null;
    protected _placeholderDisplay: string = null;
    /**
     * Determined whether to hide the placeholder using css.
     * @type {Boolean|null}
     * @private
     */
    protected _hidePlaceholderUsingCSS: boolean = null;

    /**
     * Determines whether the control is building in the Edge.
     * @type {Boolean|null}
     * @private
     */
    protected _isEdge: boolean = null;

    protected _receivedPageConfig: ReceivedPageConfig;

    /**
     * Содержит методы для исправления багов полей ввода связанных с нативным поведением в браузерах.
     * @private
     */
    protected _fixBugs: string = null;

    protected _autoComplete: string;
    protected _firstClick: boolean;
    protected _focusByMouseDown: boolean;
    protected _leftFieldWrapper: IFieldTemplate;
    protected _rightFieldWrapper: IFieldTemplate;
    private _isBrowserPlatform: boolean;
    protected _mounted: boolean = false;
    protected _timeOutId: number;

    protected _useEvent;

    protected _getDefaultValue() {
        return this._defaultValue;
    }

    constructor(props) {
        super(props);
        this._isIE = detection.isIE;
        this._ieVersion = detection.IEVersion;
        this._isMobileAndroid = detection.isMobileAndroid;
        this._isMobileIOS = detection.isMobileIOS;
        this._isEdge = detection.isIE12;
        this._isBrowserPlatform = constants.isBrowserPlatform;

        /*
         * Hide in chrome because it supports auto-completion of the field when hovering over an item
         * in the list of saved values. During this action no events are triggered and hide placeholder
         * using js is not possible.
         *
         * IMPORTANTLY: Cannot be used in IE. because the native placeholder will be used,
         * and with it the field behaves incorrectly. After the focus out, the input event will be called.
         * When this event is processed, the selection in the field is incorrect.
         * The start and end selection is equal to the length of the native placeholder. https://jsfiddle.net/e0uaczqw/1/
         * When processing input, we set a selection from the model if the value in the field is different
         * from the value in the model. And when you change the selection, the field starts to focus.
         * There is a situation that you can not withdraw focus from the field.
         */
        this._hidePlaceholderUsingCSS = detection.chrome;

        this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
        this._mouseDownHandler = this._mouseDownHandler.bind(this);
        this._deactivatedHandler = this._deactivatedHandler.bind(this);
        this._getContent = this._getContent.bind(this);
        this._setRef = this._setRef.bind(this);

        this._useEvent = {
            onCut: this._cutHandler.bind(this),
            onCopy: this._copyHandler.bind(this),
            onPaste: this.props.onPaste,
            onKeyUp: this._keyUpHandler.bind(this),
            onKeyDown: this._keyDownHandler.bind(this),
            onClick: this._clickHandler.bind(this),
            onInput: this._inputHandler.bind(this),
            onSelect: this._selectHandler.bind(this),
            onFocus: this._focusInHandler.bind(this),
            onBlur: this._focusOutHandler.bind(this),
            onMouseMove: this.props.onMouseMove,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            onTouchStart: this._touchStartHandler.bind(this),
            onInputControl: this.props.onInputControl,
            onSelectionStartChanged: this.props.onSelectionStartChanged,
            onSelectionEndChanged: this.props.onSelectionEndChanged,
            onFocusIn: this.props.onFocusIn,
            onFocusOut: this.props.onFocusOut,
            onValueChanged: this._notifyValueChanged.bind(this),
            onInputCompleted: this._notifyInputCompleted.bind(this),
            onDOMAutoComplete: this._domAutoCompleteHandler.bind(this),
        };

        this._autoComplete = this._compatAutoComplete(props.autoComplete);
        this._receivedPageConfig = new ReceivedPageConfig();
        if (props.inputMode) {
            this._inputMode = props.inputMode;
        } else {
            this._inputMode = this.getInputMode();
        }

        const storeValue =
            getStore<IInputCounterStore>(INPUT_COUNTER_STORAGE_ID)?.get('value') || 1;

        getStateReceiver().register(`ws-input_${storeValue}`, this._receivedPageConfig);
        const receivedState = this._receivedPageConfig.getState();
        const ctr = this._getViewModelConstructor();
        this._viewModel = new ctr(this._getViewModelOptions(props), this._getValue(props));
        this._updateSelectionByOptions(props);
        this._initProperties(props);
        this._fieldName =
            receivedState?.fieldName || `ws-input_${new Date().toISOString().split('T')[0]}`;
        if (this._autoComplete !== 'off') {
            /*
             * Browsers use auto-fill to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the <input> tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            if ('name' in props) {
                /*
                 * The value of the name option can be undefined.
                 * Should it be so unclear. https://online.sbis.ru/opendoc.html?guid=a32eb034-b2da-4718-903f-9c09949adb2f
                 */
                if (typeof props.name !== 'undefined') {
                    this._fieldName = props.name;
                }
            }
        }
        this._receivedPageConfig.setState({ fieldName: this._fieldName });
        getStore<IInputCounterStore>(INPUT_COUNTER_STORAGE_ID)?.set('value', storeValue + 1);
        /*
         * Placeholder is displayed in an empty field. To learn about the emptiness of the field
         * with AutoFill enabled is possible through css or the status value from <input>.
         * The state is not available until the control is mount to DOM. So hide the placeholder until then.
         */
        this._placeholderVisibility =
            this._autoComplete === 'off' || this._hidePlaceholderUsingCSS
                ? (props.placeholderVisibility as PLACEHOLDER_VISIBILITY)
                : PLACEHOLDER_VISIBILITY.HIDDEN;
        const isStringPlaceholder =
            typeof props.placeholder === 'string' || props.placeholder instanceof String;
        this._placeholderDisplay = isStringPlaceholder ? 'under' : 'above';

        // ??
        if (props.borderVisibility === 'visible') {
            Logger.warn(
                'Controls/input:Base Передано не поддерживаемое значение для опции borderVisibility. Удалите задание опции, либо передайте partial'
            );
        }
        if (this._viewModel.setVersionCallback) {
            this._viewModel.setVersionCallback(this._nextVersion.bind(this));
        } else {
            this._useEvent.onModelUpdate = this._nextVersion.bind(this);
        }
        this._beforeMount(props);
        this.state = {
            modelVersion: 0,
            localVersion: 0,
        };
    }

    get _options() {
        return this.props;
    }

    getInputMode() {
        return 'text';
    }

    protected _beforeMount(props: IBaseInputOptions) {}

    protected _afterMount(options: IBaseInputOptions) {}

    protected _beforeUpdate(options: IBaseInputOptions) {}

    protected _afterUpdate(options: IBaseInputOptions) {}

    protected _beforeUnmount() {}

    componentDidMount(): void {
        this._mounted = true;
        this._updatePlaceholderVisibility(this.props);
        this._afterMount(this.props);
    }

    shouldComponentUpdate(nextProps: IBaseInputOptions, nextState: IBaseInputState): boolean {
        const newViewModelOptions = this._getViewModelOptions(nextProps);
        this._viewModel.displayValueBeforeUpdate = this._viewModel.displayValue;
        this._updateViewModel(newViewModelOptions, this._getCorrectValue(this.props, nextProps));
        this._updateSelectionByOptions(nextProps);
        this._updatePlaceholderVisibility(nextProps);
        this._updatePlaceholderDisplay(nextProps);

        if (
            this.props.leftFieldTemplate !== nextProps.leftFieldTemplate ||
            this.props.rightFieldTemplate !== nextProps.rightFieldTemplate
        ) {
            this._initProperties(nextProps);
        }

        this._beforeUpdate(nextProps);
        return this.props !== nextProps || this.state !== nextState;
    }

    componentDidUpdate(prevProps: IBaseInputOptions): void {
        // как в shouldComponentUpdate, на случай если он не позовется (такое возможно в реакте)
        // todo возможно вообще нужно все обновления перенести сюда (и удалить там), чтобы они точно позвались
        const newViewModelOptions = this._getViewModelOptions(this.props);
        this._viewModel.displayValueBeforeUpdate = this._viewModel.displayValue;
        this._updateViewModel(newViewModelOptions, this._getCorrectValue(prevProps, this.props));

        this._afterUpdate(this.props);
    }

    componentWillUnmount(): void {
        this._beforeUnmount();
        if (this._timeOutId) {
            clearTimeout(this._timeOutId);
        }
    }

    /**
     * @type {Controls/_input/Render#style}
     * @private
     */
    protected _renderStyle(): string {
        return '';
    }

    protected _isCounterVisible(): boolean {
        return this.props.maxLength && this.props.counterVisibility;
    }

    private _updatePlaceholderDisplay(options: IBaseInputOptions): void {
        if (this.props.placeholder !== options.placeholder) {
            /*
             * Если в качестве placeholder передается строка, то отображаем подсказку под кареткой.
             * Иначе оставляем старое поведение, когда подсказка отображается над кареткой
             */
            const isStringPlaceholder =
                typeof options.placeholder === 'string' || options.placeholder instanceof String;
            this._placeholderDisplay = isStringPlaceholder ? 'under' : 'above';
        }
    }

    private _updatePlaceholderVisibility(options: IBaseInputOptions): void {
        if (this._placeholderVisibility !== options.placeholderVisibility) {
            this._placeholderVisibility = options.placeholderVisibility as PLACEHOLDER_VISIBILITY;
        }
    }

    /**
     * Event handler mouse enter.
     * @private
     */
    protected _mouseEnterHandler(event: MouseEvent<HTMLDivElement>): void {
        this._tooltip = this._getTooltip();
        this.props.onMouseEnter?.(event);
    }

    protected _cutHandler(event: SyntheticEvent<KeyboardEvent>): void {
        // redefinition
        this.props.onCut?.(event);
    }

    protected _copyHandler(event: SyntheticEvent<ClipboardEvent>): void {
        // redefinition
        this.props.onCopy?.(event);
    }

    protected _keyUpHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (this._getReadOnly()) {
            event.preventDefault();
            return;
        }
        this.props.onKeyUp?.(event);
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (this.props.readOnly) {
            if (!event.nativeEvent.ctrlKey) {
                event.preventDefault();
            }
            return;
        }
        if (this.props.bubbling) {
            return;
        }
        const additionalKeys = [];
        // Backspace поле ввода должно обработать и запревентить только если есть что удалять.
        // TODO: Удалить костыльную опцию
        // Всплытия событий keydown не должны останавливаться, что в текущих реалиях не реализовать
        if (this.props.value) {
            additionalKeys.push('Backspace');
        }
        processKeydownEvent(event, additionalKeys);
        if (!event?.isPropagationStopped?.()) {
            this.props.onKeyDown?.(event);
        }
    }

    protected _selectHandler(event): void {
        // redefinition
        this.props.onSelect?.(event);
    }

    protected _focusOutHandler(event): void {
        // redefinition
        this.props.onBlur?.(event);
    }

    protected _touchStartHandler(event): void {
        // redefinition
        this.props.onTouchstart?.(event);
    }

    /**
     * Event handler click in native field.
     * @private
     */
    protected _clickHandler(event: SyntheticEvent = null): void {
        this._firstClick = false;
        this.props.onClick?.(event);
    }

    protected _inputHandler(event: SyntheticEvent<KeyboardEvent>): void {
        // redefinition
        this.props.onInput?.(event);
    }

    protected _deactivatedHandler(): void {
        // redefinition
    }

    protected _placeholderClickHandler(): void {
        /*
         * Placeholder is positioned above the input field.
         * When clicking, the cursor should stand in the input field.
         * To do this, we ignore placeholder using the pointer-events property with none value.
         * The property is not supported in ie lower version 11.
         * In ie 11, you sometimes need to switch versions in emulation to work.
         * Therefore, we ourselves will activate the field on click.
         * https://caniuse.com/#search=pointer-events
         */
        if (this._ieVersion && this._ieVersion < MIN_IE_VERSION) {
            this._getField().focus();
        }
    }

    protected _focusInHandler(event: SyntheticEvent<FocusEvent>): void {
        if (this.props.selectOnClick) {
            this._viewModel.select();
            if (!detection.isMac) {
                // Есть проблема на mac, когда событие selected стреляет несколько раз.
                // Это происходит из-за того что в 1 раз мы сами установили каретку,
                // А во 2 раз долетает нативная смена каретки(при клике)
                // Из-за чего выделение не корректно, поэтому добавляем состояние, для понимания ручного ввода каретки
                // Можно сделать через requestAnimationFrame, но от этого могут вылезти другие проблемы и моргания
                // https://online.sbis.ru/opendoc.html?guid=ccaa3c54-e17b-4a6b-9854-a6c78d76ae97&client=3
                this._viewModel.customSelectorChanged = true;
            } else {
                // Есть проблема, когда при фокусе мы обновили selection, и была нажата кнопка клавиатуры
                // В таком случае контрол не всегда успевает перерисоваться, из-за чего selection сбрасывается
                // Поэтому сами записываем актуальное значение в поле ввода
                // https://online.sbis.ru/opendoc.html?guid=1531e3f2-13ad-4c5a-8d8d-9aa4b783fca1&client=3
                const inputField = this._getField()?._getField?.();
                if (inputField && inputField.selectionStart !== undefined) {
                    inputField.selectionStart = this._viewModel.selection.start;
                    inputField.selectionEnd = this._viewModel.selection.end;
                }
            }
            this.props.onFocus?.(event);
        }

        if (this._focusByMouseDown) {
            this._firstClick = true;
            this._focusByMouseDown = false;
        }
    }

    protected _mouseDownHandler(event): void {
        if (!this._isFieldFocused()) {
            this._focusByMouseDown = true;
        }
        this.props.onMouseDown?.(event);
    }

    protected _domAutoCompleteHandler(): void {
        /*
         * When the user selects a value from the auto-complete, the other fields associated with it are
         * automatically filled in. The logic of the control operation is based on displaying the value
         * according to its options. Therefore, the field value is updated during the synchronization cycle.
         *
         * In firefox, after the field is automatically filled in, you should immediately set the value
         * in the field without waiting for a synchronization cycle. Otherwise, the values will not be substituted
         * into other fields.
         *
         * About what happened auto-complete learn through the event DOMAutoComplete,
         * which is supported only in firefox. https://developer.mozilla.org/en-US/docs/Web/Events/DOMAutoComplete
         */

        this._calculateValueForTemplate();
    }

    /**
     *
     * @return {HTMLElement}
     * @private
     */
    private _getActiveElement(): Element {
        return document.activeElement;
    }

    protected _updateSelection(selection: ISelection): void {
        this._getField()?.setSelectionRange(selection.start, selection.end);
    }

    /**
     * @type {Controls/Utils/getTextWidth}
     * @private
     */
    private _getTextWidth(value: string): number {
        const element: HTMLElement = this.forCalcRef.current || null;

        /*
         * The element for calculations is available only at the moment of field focusing.
         * The reason is that the main call occurs during input when the field is in focus.
         * At other times, the element will be used very rarely. So for the rare cases
         * it is better to create it yourself.
         */
        return element
            ? this._getTextWidthByDOM(element, value)
            : this._getTextWidthThroughCreationElement(value);
    }

    /**
     * @param {Object} options Control options.
     * @private
     */
    protected _initProperties(options: IBaseInputOptions): void {
        /*
         * Init the name of the control and to pass it to the templates.
         * Depending on it, classes will be generated. An example of class is controls-{{controlsName}}...
         * With the override in the heirs, you can change the display of the control. To do this,
         * define styles for the class generated in the template.
         * This approach avoids creating new templates with static classes if the current one is not suitable.
         */
        const CONTROL_NAME: string = 'InputBase';

        this._field = {
            template: FieldTemplate,
            scope: {
                controlName: CONTROL_NAME,
                autoComplete: this._autoComplete,
                inputMode: this._inputMode,
                inputCallback: options.inputCallback,
                calculateValueForTemplate: this._calculateValueForTemplate.bind(this),
                getStretcherValue: this._getStretcherValue.bind(this),
                recalculateLocationVisibleArea: this._recalculateLocationVisibleArea.bind(this),
                isFieldFocused: this._isFieldFocused.bind(this),
            },
        };
        this._readOnlyField = {
            template: ReadOnlyFieldTemplate,
            scope: {
                controlName: CONTROL_NAME,
            },
        };
        this._leftFieldWrapper = {
            template: options.leftFieldTemplate,
            scope: {},
        };
        this._rightFieldWrapper = {
            template: options.rightFieldTemplate,
            scope: {},
        };

        /*
         * TODO: Remove after execution:
         * https://online.sbis.ru/opendoc.html?guid=6c755b9b-bbb8-4a7d-9b50-406ef7f087c3
         */
        const emptySymbol = unEscapeASCII('&#65279;');
        this._field.scope.emptySymbol = emptySymbol;
        this._readOnlyField.scope.emptySymbol = emptySymbol;
    }

    protected _notifyValueChanged(): void {
        if (this.props.onValuechanged) {
            const event = this._getCustomEvent('valueChanged');
            // todo временный костыль. Когда поле ввода в валидаторе, то приходит в таком регистре
            this.props.onValuechanged?.(event, this._viewModel.value, this._viewModel.displayValue);
        } else {
            this.props.onValueChanged?.(this._viewModel.value, this._viewModel.displayValue);
        }
        // TODO для использования в реакте
        if (this.props.valueChangedCallback) {
            this.props.valueChangedCallback(this._viewModel.value, this._viewModel.displayValue);
        }
    }

    protected _notifyInputCompleted(): void {
        if (this.props.onInputCompleted) {
            this.props.onInputCompleted?.(this._viewModel.value, this._viewModel.displayValue);
        } else if (this.props.onInputcompleted) {
            const event = this._getCustomEvent('inputCompleted');
            // todo временный костыль. Когда поле ввода в валидаторе, то приходит в таком регистре
            this.props.onInputcompleted?.(
                event,
                this._viewModel.value,
                this._viewModel.displayValue
            );
        }
        if (this.props.inputCompletedCallback) {
            this.props.inputCompletedCallback(this._viewModel.value, this._viewModel.displayValue);
        }
    }

    /**
     * Get the native field.
     * @return {Node}
     * @private
     */
    protected _getField(): Field<string, IViewModelOptions> {
        if (this.fieldNameRef.current) {
            return this.fieldNameRef.current;
        }
        return null;
    }

    protected _getReadOnlyField(): HTMLElement | void {
        if (this.readonlyFieldRef.current) {
            return this.readonlyFieldRef.current;
        }
    }

    /**
     * Get the options for the view model.
     * @return {Object} View model options.
     * @private
     */
    protected _getViewModelOptions(options: IBaseInputOptions): unknown {
        return {};
    }

    /**
     * Get the constructor for the view model.
     * @return {Controls/_input/Base/ViewModel} View model constructor.
     * @private
     */
    protected _getViewModelConstructor(): typeof ViewModel {
        return ViewModel;
    }

    /**
     * Get the tooltip for field.
     * If the displayed value fits in the field, the tooltip option is returned.
     * Otherwise the displayed value is returned.
     * @return {String} Tooltip.
     * @private
     */
    _getTooltip(): string {
        let hasFieldHorizontalScroll: boolean = false;
        let tooltip = this._viewModel.displayValue;
        const field = this._getField();
        const readOnlyField: HTMLElement | void = this._getReadOnlyField();

        if (field) {
            // Если ничего не введено в поле ввода, то вычисляем размеры placeholder, и если он
            // больше ширины поля ввода, добавляем tooltip
            // Сейчас нельзя использовать одинаковую логику для определения необходимости отображения tooltip,
            // так как при введенном значении, происходит поиск наличия скролла, а
            // для placeholder, текст обрезается через overflow
            if (
                !tooltip &&
                (typeof this.props.placeholder === 'string' ||
                    this.props.placeholder instanceof String)
            ) {
                if (field.getContainer?.() || field._container) {
                    tooltip = this.props.placeholder;
                    const tooltipWidth = this._getTextWidth(tooltip);
                    const computedStyle = getComputedStyle(field.getContainer());
                    hasFieldHorizontalScroll = parseFloat(computedStyle.width) < tooltipWidth;
                }
            } else {
                hasFieldHorizontalScroll = field.hasHorizontalScroll();
            }
        } else if (readOnlyField) {
            hasFieldHorizontalScroll = this._hasHorizontalScroll(readOnlyField);
        }

        const res = hasFieldHorizontalScroll ? tooltip : this.props.tooltip;
        if (res !== this._tooltip) {
            this._nextLocalVersion();
        }
        return res;
    }

    private _calculateValueForTemplate(): string {
        return this._viewModel.displayValue;
    }

    private _getStretcherValue(): string {
        // Заменяем все цифры и пробел на 0. На шрифте Tensor-font все цифры и пробел одинаковой ширины, так что нам не
        // важно какой символ стоит для растягивания поля ввода до нужного размера. У шрифта, который используется
        // в SabyGet немоноширинный шрифт, из-за этого поле ввода прыгает. Возьмем самый широкий символ, чтобы по по
        // максимуму растянуть инпут https://online.sbis.ru/opendoc.html?guid=9d278ed9-792c-4287-ad37-0f288fbf63e7
        let result = this._viewModel.displayValue.replace(/[0-9]/g, '0');
        const space = ' ';
        const regExp = new RegExp(space, 'g');
        result = result.replace(regExp, '0');
        if (this.props.getStretcherValueCallback) {
            result = this.props.getStretcherValueCallback(result);
        }
        return result;
    }

    /**
     * Изменение расположения видимой области поля так, чтобы отобразился курсор.
     * Если курсор виден, расположение не изменяется. В противном случае новое местоположение будет таким, что курсор отобразится в середине области.
     */
    private _recalculateLocationVisibleArea(
        field: HTMLInputElement,
        displayValue: string,
        selection: ISelection
    ): void {
        if (displayValue.length === selection.end) {
            /*
             * When the carriage is at the end, you need to set the maximum possible value of scrollLeft.
             *
             * Theoretically, the value is defined as the difference between scrollWidth and clientWidth.
             * In different browsers, this value is different. Because scrollWidth and clientWidth can be different,
             * or fractional and rounded in different directions. Therefore, this method can not be used.
             *
             * If you set a value higher than the maximum, the browser will automatically set the maximum.
             * The scrollWidth property is always greater than the maximum scrollLeft, so set it.
             */
            field.scrollLeft = field.scrollWidth;

            return;
        }

        if (displayValue.length < 2) {
            return;
        }

        const textWidthBeforeCursor = this._getTextWidth(displayValue.substring(0, selection.end));

        const positionCursor = textWidthBeforeCursor + WIDTH_CURSOR;
        const sizeVisibleArea = field.clientWidth;
        const beginningVisibleArea = field.scrollLeft;
        const endingVisibleArea = field.scrollLeft + sizeVisibleArea;

        /*
         * The cursor is visible if its position is between the beginning and the end of the visible area.
         */
        const hasVisibilityCursor =
            beginningVisibleArea < positionCursor && positionCursor < endingVisibleArea;

        if (!hasVisibilityCursor) {
            field.scrollLeft = positionCursor - sizeVisibleArea / 2;
        }
    }

    _isFieldFocused(): boolean {
        /*
         * A field in focus when it is the active element on the page.
         * The active element is only on the client. The field cannot be focused on the server.
         */
        if (this._isBrowserPlatform && this._mounted) {
            return this._getActiveElement() === this._getField();
        }

        return false;
    }

    private _getTextWidthByDOM(element: HTMLElement, value: string): number {
        element.innerHTML = value;
        const width = element.scrollWidth;
        element.innerHTML = '';

        return width;
    }

    private _getTextWidthThroughCreationElement(value: string): number {
        const element = document.createElement('div');
        element.classList.add('controls-InputBase__forCalc');
        element.innerHTML = value;

        document.body.appendChild(element);
        const width = element.scrollWidth;
        document.body.removeChild(element);

        return width;
    }

    private _compatAutoComplete(autoComplete: boolean | string): string {
        if (typeof autoComplete === 'boolean') {
            return autoComplete ? 'on' : 'off';
        }

        return autoComplete;
    }

    private _updateViewModel(newOptions: IBaseInputOptions, newValue: string): void {
        if (!isEqual(this._viewModel.options, newOptions)) {
            this._viewModel.options = newOptions;
        }

        if (this._viewModel.value !== newValue) {
            this._viewModel.value = newValue;
        }
        this._updateSelectionByOptions(newOptions);
    }
    protected _getCorrectValue(prevProps: IBaseInputOptions, nextProps: IBaseInputOptions): string {
        if (prevProps.value !== nextProps.value) {
            return this._getValue(nextProps);
        }
        if (this._viewModel) {
            return this._viewModel.value;
        }

        return this._getDefaultValue() as string;
    }

    protected _getValue(options: IBaseInputOptions): string {
        if (options.hasOwnProperty('value')) {
            return options.value === undefined ? this._getDefaultValue() : options.value;
        }

        if (this._viewModel) {
            return this._viewModel.value;
        }

        return this._getDefaultValue() as string;
    }

    private _updateSelectionByOptions(options: IBaseInputOptions): void {
        if (
            options.hasOwnProperty('selectionStart') &&
            options.hasOwnProperty('selectionEnd') &&
            (this.props.selectionStart !== options.selectionStart ||
                this.props.selectionEnd !== options.selectionEnd)
        ) {
            this._viewModel.selection = {
                start: options.selectionStart,
                end: options.selectionEnd,
            };
        }
    }

    protected _getCustomEvent(name): SyntheticEvent {
        return new SyntheticEvent(null, {
            type: name,
            target: this.containerRef.current,
        });
    }

    protected _nextVersion() {
        if (this._timeOutId) {
            clearTimeout(this._timeOutId);
        }
        // Сейчас ядро меняет состояния васабного компонента через requestAnimationFrame,
        // из-за чего компонент может перерисоваться до обновления props, что приводит к ошибкам.
        // Чтобы этого избежать, вызываем перерисовку по setTimeout и requestAnimationFrame внутри.
        this._timeOutId = setTimeout(() => {
            setTimeout(() => {
                if (this.state.modelVersion !== this._viewModel.getVersion()) {
                    this.setState({ modelVersion: this._viewModel.getVersion() });
                }
                this._timeOutId = null;
            });
        }, 0);
    }

    protected _nextLocalVersion() {
        this.setState({ localVersion: this.state.localVersion + 1 });
    }

    get _container() {
        return this.containerRef.current;
    }

    getInstanceId(): string {
        return this._instanceId;
    }

    protected _notify(name, args?: unknown[]) {
        __notifyFromReact(this.containerRef.current, name, args, true);
    }

    paste(text: string): void {
        this._getField().paste(text);
    }

    select(): void {
        this.activate();
        this._viewModel.select();
        if (this._viewModel.selection) {
            this._updateSelection(this._viewModel.selection);
        }
    }

    activate() {
        this._getField()?.activate?.();
    }

    protected _getReadOnly(): boolean {
        return this.props.readOnly ?? this.context?.readOnly;
    }

    protected _getTheme(): boolean {
        return this.props.theme ?? this.context?.theme;
    }

    protected _getContent(contentProps = {}) {
        const attrs = wasabyAttrsToReactDom(contentProps.attrs || {}) || {};
        return (
            <>
                {this._getReadOnly()
                    ? getContent(this._readOnlyField.template, {
                          ...attrs,
                          ...contentProps,
                          options: this.props,
                          ...this._readOnlyField.scope,
                          placeholderVisibility: this._placeholderVisibility,
                          value: this._viewModel.displayValue,
                          ref: this.readonlyFieldRef,
                      })
                    : getContent(this._field.template, {
                          ...attrs,
                          ...contentProps,
                          ...this._useEvent,
                          fieldNameRef: this.fieldNameRef,
                          forCalcRef: this.forCalcRef,
                          type: this._type,
                          model: this._viewModel,
                          options: this.props,
                          spellcheck: this.props,
                          ...this._field.scope,
                          autoWidth: this._autoWidth,
                          fieldName: this._fieldName,
                          wasActionUser: this._wasActionUser,
                          value: this._viewModel.displayValue,
                          placeholderVisibility: this._placeholderVisibility,
                          placeholderDisplay: this._placeholderDisplay,
                          hidePlaceholderUsingCSS: this._hidePlaceholderUsingCSS,
                          isBrowserPlatform: this._isBrowserPlatform,
                          readOnly: false,
                          inputKey: this._inputKey,
                          ieVersion: this._ieVersion,
                          isEdge: this._isEdge,
                      })}
                {this._isCounterVisible() ? (
                    <Counter
                        maxLength={this.props.maxLength}
                        currentLength={this._viewModel.displayValue.length}
                    />
                ) : null}
            </>
        );
    }

    protected _setRef(el): void {
        this.containerRef.current = el;
        const forwardedRef = this.props.forwardedRef || this.props.$wasabyRef;
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(el);
            } else {
                forwardedRef.current = el;
            }
        }
    }

    render() {
        const leftFieldWrapper = this._leftFieldWrapper.template
            ? getContent(this._leftFieldWrapper.template, {
                  options: this.props,
                  ...this._leftFieldWrapper.scope,
                  value: this._viewModel.value,
              })
            : null;
        const rightFieldWrapper = this._rightFieldWrapper.template
            ? getContent(this._rightFieldWrapper.template, {
                  options: this.props,
                  ...this._rightFieldWrapper.scope,
                  value: this._viewModel.value,
                  passwordVisible: this._passwordVisible,
              })
            : null;

        const attrs = wasabyAttrsToReactDom(this.props.attrs || {}) || {};
        if (this._tooltip) {
            attrs.title = this._tooltip;
        }

        return (
            <Render
                ref={(el) => {
                    this._setRef(el);
                }}
                leftFieldWrapper={leftFieldWrapper}
                rightFieldWrapper={rightFieldWrapper}
                data-qa={this.props.dataQa || this.props['data-qa']}
                attrs={attrs}
                style={this.props.style || attrs.style}
                className={`${
                    this._isCounterVisible() ? 'controls-margin_bottom-m' : ''
                } controls-${this._controlName} controls_${
                    this._controlName
                }_theme-${this._getTheme()}${
                    this.props.className
                        ? ` ${this.props.className}`
                        : attrs.className
                        ? ` ${attrs.className}`
                        : ''
                }`}
                borderVisibility={this.props.borderVisibility}
                stretcherContentTemplate={this.props.stretcherContentTemplate}
                сounterVisibility={this.props.counterVisibility}
                state={this._renderStyle()}
                viewModel={this._viewModel}
                multiline={this._multiline}
                roundBorder={this._roundBorder}
                tagStyle={this.props.tagStyle}
                textAlign={this.props.textAlign}
                placeholder={this.props.placeholder}
                fontSize={this._fontSize || this.props.fontSize}
                fontWeight={this.props.fontWeight}
                inlineHeight={this._inlineHeight || this.props.inlineHeight}
                fontColorStyle={this._fontColorStyle || this.props.fontColorStyle}
                borderStyle={this.props.borderStyle}
                validationStatus={this.props.validationStatus}
                wasActionByUser={this._wasActionUser}
                contrastBackground={this.props.contrastBackground}
                horizontalPadding={this.props.horizontalPadding}
                transliterate={this.props.transliterate}
                autoFocus={this.props.autoFocus}
                onKeyPress={this.props.onKeyPress}
                onMouseEnter={this._mouseEnterHandler}
                onMouseLeave={this.props.onMouseLeave}
                onMouseMove={this.props.onMouseMove}
                onMouseDown={this._mouseDownHandler}
                onTagClick={this.props.onTagClick}
                onTagHover={this.props.onTagHover}
                onFocus={this.props.onFocus}
                onWheel={this.props.onWheel}
                onDeactivated={this._deactivatedHandler}
                readOnly={this._getReadOnly()}
            >
                {this._getContent}
            </Render>
        );
    }

    static defaultProps: Partial<IBaseInputOptions> = {
        tooltip: '',
        inlineHeight: 'default',
        placeholder: '',
        textAlign: 'left',
        autoComplete: 'off',
        fontSize: 'm',
        fontColorStyle: 'default',
        spellCheck: true,
        selectOnClick: false,
        contrastBackground: false,
        placeholderVisibility: PLACEHOLDER_VISIBILITY.EDITABLE,
    };
    static contextType = getWasabyContext();

    static getDefaultOptions() {
        return Base.defaultProps;
    }

    static getOptionTypes(): object {
        return {
            ...getOptionBorderVisibilityTypes(),
            value: descriptor(String, null),
            selectionStart: descriptor(Number),
            selectionEnd: descriptor(Number),
            tooltip: descriptor(String),
            /* autoComplete: descriptor(String).oneOf([
             'on',
             'off',
             'username',
             'current-password'
             ]),*/
            spellCheck: descriptor(Boolean),
            selectOnClick: descriptor(Boolean),
            inputCallback: descriptor(Function),

            /*
             * Setting placeholder as HTML in wml, template engine converts it to an array.
             *
             * https://online.sbis.ru/opendoc.html?guid=af7e16d7-139f-4414-b7af-9e3a1a0dae05
             * placeholder: descriptor(String, Function, Array),
             */
            textAlign: descriptor(String).oneOf(['left', 'right', 'center']),
            placeholderVisibility: descriptor(String).oneOf([
                PLACEHOLDER_VISIBILITY.EDITABLE,
                PLACEHOLDER_VISIBILITY.EMPTY,
            ]),
        };
    }
}

export default Base;
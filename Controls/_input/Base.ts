/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { constants, detection } from 'Env/Env';
import { descriptor } from 'Types/entity';
import { EventUtils } from 'UI/Events';
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
import 'css!Controls/input';

import 'wml!Controls/_input/Base/Stretcher';
import 'wml!Controls/_input/Base/FixValueAttr';
import { getOptionBorderVisibilityTypes } from 'Controls/_input/interface/IBorderVisibility';
import { Logger } from 'UI/Utils';
import template = require('wml!Controls/_input/Base/Base');
import fieldTemplate = require('wml!Controls/_input/Base/Field');
import readOnlyFieldTemplate = require('wml!Controls/_input/Base/ReadOnly');

interface IFieldTemplate {
    template: string | TemplateFunction;
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

export interface IBaseInputOptions extends IBaseOptions, IControlOptions {}

/**
 * The width of the cursor in the field measured in pixels.
 * @type {Number}
 * @private
 */
const WIDTH_CURSOR: number = 1;

const MIN_IE_VERSION: number = 12;

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
 * @class Controls/_input/Base
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
 * @implements Controls/input:ISelection
 * @implements Controls/input:IFieldTemplate
 * @implements Controls/interface:IInputPlaceholder
 * @public
 */
class Base<TBaseInputOptions extends IBaseInputOptions = {}> extends Control<TBaseInputOptions> {
    /**
     * Control display template.
     * @type {Function}
     * @private
     */
    protected _template: TemplateFunction = template;

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
     * @type {Controls/Utils/tmplNotify}
     * @private
     */
    protected _notifyHandler: Function = EventUtils.tmplNotify;

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

    /**
     * Содержит методы для исправления багов полей ввода связанных с нативным поведением в браузерах.
     * @private
     */
    protected _fixBugs: string = null;

    protected _currentVersionModel: number;
    protected _autoComplete: string;
    protected _firstClick: boolean;
    protected _focusByMouseDown: boolean;
    protected _leftFieldWrapper: IFieldTemplate;
    protected _rightFieldWrapper: IFieldTemplate;
    private _isBrowserPlatform: boolean;

    constructor(...args: [IBaseInputOptions, object?]) {
        super(...args);

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
    }

    protected _beforeMount(options: IBaseInputOptions, context?: object): void {
        this._autoComplete = this._compatAutoComplete(options.autoComplete);
        if (options.inputMode) {
            this._inputMode = options.inputMode;
        }
        const ctr = this._getViewModelConstructor();
        this._viewModel = new ctr(this._getViewModelOptions(options), this._getValue(options));
        this._updateSelectionByOptions(options);
        this._initProperties(options);
        this._fieldName = `ws-input_${new Date().toISOString().split('T')[0]}`;
        if (this._autoComplete !== 'off') {
            /*
             * Browsers use auto-fill to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the <input> tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            if ('name' in options) {
                /*
                 * The value of the name option can be undefined.
                 * Should it be so unclear. https://online.sbis.ru/opendoc.html?guid=a32eb034-b2da-4718-903f-9c09949adb2f
                 */
                if (typeof options.name !== 'undefined') {
                    this._fieldName = options.name;
                }
            }
        }
        /*
         * Placeholder is displayed in an empty field. To learn about the emptiness of the field
         * with AutoFill enabled is possible through css or the status value from <input>.
         * The state is not available until the control is mount to DOM. So hide the placeholder until then.
         */
        this._placeholderVisibility =
            this._autoComplete === 'off' || this._hidePlaceholderUsingCSS
                ? options.placeholderVisibility
                : PLACEHOLDER_VISIBILITY.HIDDEN;
        this._updatePlaceholderDisplay(options);
        if (options.borderVisibility === 'visible') {
            Logger.warn(
                'Controls/input:Base Передано не поддерживаемое значение для опции borderVisibility. Удалите задание опции, либо передайте partial'
            );
        }
    }

    protected _afterMount(options: IBaseInputOptions): void {
        this._updatePlaceholderVisibility(options);
    }

    protected _beforeUpdate(newOptions: IBaseInputOptions): void {
        const newViewModelOptions = this._getViewModelOptions(newOptions);
        this._viewModel.displayValueBeforeUpdate = this._viewModel.displayValue;
        this._updateViewModel(newViewModelOptions, this._getValue(newOptions));
        this._updateSelectionByOptions(newOptions);
        this._updatePlaceholderVisibility(newOptions);
        this._updatePlaceholderDisplay(newOptions);
    }

    /**
     * @type {Controls/_input/Render#style}
     * @private
     */
    protected _renderStyle(): string {
        return '';
    }

    private _updatePlaceholderDisplay(options: IBaseInputOptions): void {
        if (this._options.placeholder !== options.placeholder) {
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
            this._placeholderVisibility = options.placeholderVisibility;
        }
    }

    /**
     * Event handler mouse enter.
     * @private
     */
    protected _mouseEnterHandler(event: SyntheticEvent<MouseEvent>): void {
        this._tooltip = this._getTooltip();
    }

    protected _cutHandler(event: SyntheticEvent<KeyboardEvent>): void {
        // redefinition
    }

    protected _copyHandler(event: SyntheticEvent<ClipboardEvent>): void {
        // redefinition
    }

    protected _keyUpHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (this._options.readOnly) {
            event.preventDefault();
            return;
        }
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (this._options.readOnly) {
            if (!event.nativeEvent.ctrlKey) {
                event.preventDefault();
            }
            return;
        }
        if (this._options.bubbling) {
            return;
        }
        const additionalKeys = [];
        // Backspace поле ввода должно обработать и запревентить только если есть что удалять.
        // TODO: Удалить костыльную опцию
        // Всплытия событий keydown не должны останавливаться, что в текущих реалиях не реализовать
        if (this._options.value) {
            additionalKeys.push('Backspace');
        }
        processKeydownEvent(event, additionalKeys);
    }

    protected _selectHandler(): void {
        // redefinition
    }

    protected _focusOutHandler(): void {
        // redefinition
    }

    protected _touchStartHandler(): void {
        // redefinition
    }

    /**
     * Event handler click in native field.
     * @private
     */
    protected _clickHandler(event: SyntheticEvent<MouseEvent>): void {
        this._firstClick = false;
    }

    protected _inputHandler(event: SyntheticEvent<KeyboardEvent>): void {
        // redefinition
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
        if (this._options.selectOnClick) {
            const setSelection = () => {
                this._viewModel.select();
                // Есть проблема, когда при фокусе мы обновили selection, и была нажата кнопка клавиатуры
                // В таком случае контрол не всегда успевает перерисоваться, из-за чего selection сбрасывается
                // Поэтому сами записываем актуальное значение в поле ввода
                // https://online.sbis.ru/opendoc.html?guid=1531e3f2-13ad-4c5a-8d8d-9aa4b783fca1&client=3
                const inputField = this._getField()?._getField?.();
                if (inputField && inputField.selectionStart !== undefined) {
                    inputField.selectionStart = this._viewModel.selection.start;
                    inputField.selectionEnd = this._viewModel.selection.end;
                }
            };
            // На Mac есть проблема с событиями, из-за чего сначала приходит событие select с новыми значениями,
            // и сразу за ним со старыми значениями(каретка там где нажали), поэтому выделяем текст через setTimeout
            // https://online.sbis.ru/opendoc.html?guid=7fd4241a-24ea-4484-8b06-d1dbd4925b51&client=3
            if (detection.isMac) {
                setTimeout(() => {
                    setSelection();
                }, 0);
            } else {
                setSelection();
            }
        }

        if (this._focusByMouseDown) {
            this._firstClick = true;
            this._focusByMouseDown = false;
        }
    }

    protected _mouseDownHandler(): void {
        if (!this._isFieldFocused()) {
            this._focusByMouseDown = true;
        }
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

    private _updateSelection(selection: ISelection): void {
        this._getField().setSelectionRange(selection.start, selection.end);
    }

    /**
     * @type {Controls/Utils/getTextWidth}
     * @private
     */
    private _getTextWidth(value: string): number {
        const element: HTMLElement = this._children.hasOwnProperty('forCalc')
            ? this._children.forCalc
            : null;

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
            template: fieldTemplate,
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
            template: readOnlyFieldTemplate,
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
        this._notify('valueChanged', [this._viewModel.value, this._viewModel.displayValue]);
        // TODO для использования в реакте
        if (this._options.valueChangedCallback) {
            this._options.valueChangedCallback(this._viewModel.value, this._viewModel.displayValue);
        }
    }

    protected _notifyInputCompleted(): void {
        this._notify('inputCompleted', [this._viewModel.value, this._viewModel.displayValue]);
        if (this._options.inputCompletedCallback) {
            this._options.inputCompletedCallback(
                this._viewModel.value,
                this._viewModel.displayValue
            );
        }
    }

    /**
     * Get the native field.
     * @return {Node}
     * @private
     */
    protected _getField(): Field<String, IViewModelOptions> {
        if (this._children.hasOwnProperty(this._fieldName)) {
            return this._children[this._fieldName] as Field<String, IViewModelOptions>;
        }
        return null;
    }

    protected _getReadOnlyField(): HTMLElement | void {
        if (this._children.hasOwnProperty('readOnlyField')) {
            return this._children.readOnlyField as HTMLElement;
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
                (typeof this._options.placeholder === 'string' ||
                    this._options.placeholder instanceof String)
            ) {
                if (field._container) {
                    tooltip = this._options.placeholder;
                    const tooltipWidth = this._getTextWidth(tooltip);
                    const computedStyle = getComputedStyle(field._container);
                    hasFieldHorizontalScroll = parseFloat(computedStyle.width) < tooltipWidth;
                }
            } else {
                hasFieldHorizontalScroll = field.hasHorizontalScroll();
            }
        } else if (readOnlyField) {
            hasFieldHorizontalScroll = this._hasHorizontalScroll(readOnlyField);
        }

        return hasFieldHorizontalScroll ? tooltip : this._options.tooltip;
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
        if (this._options.getStretcherValueCallback) {
            result = this._options.getStretcherValueCallback(result);
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

    protected _getValue(options: IBaseInputOptions): string {
        if (options.hasOwnProperty('value')) {
            return options.value === undefined ? this._defaultValue : options.value;
        }

        if (this._viewModel) {
            return this._viewModel.value;
        }

        return this._defaultValue as string;
    }

    private _updateSelectionByOptions(options: IBaseInputOptions): void {
        if (
            options.hasOwnProperty('selectionStart') &&
            options.hasOwnProperty('selectionEnd') &&
            (this._options.selectionStart !== options.selectionStart ||
                this._options.selectionEnd !== options.selectionEnd)
        ) {
            this._viewModel.selection = {
                start: options.selectionStart,
                end: options.selectionEnd,
            };
        }
    }

    paste(text: string): void {
        this._getField().paste(text);
    }

    select(): void {
        this.activate();
        this._viewModel.select();
    }

    static getDefaultOptions(): object {
        return {
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

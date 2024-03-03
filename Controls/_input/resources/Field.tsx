/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { TInternalProps, wasabyAttrsToReactDom } from 'UICore/Executor';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Component, createRef, LegacyRef } from 'react';
import { IText } from 'Controls/baseDecorator';
import { split } from 'Controls/_input/Base/InputUtil';
import { hasHorizontalScroll } from 'Controls/scroll';
import { delay as runDelayed } from 'Types/function';
import { IControlProps } from 'Controls/interface';
import { constants, detection } from 'Env/Env';
import { descriptor } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { isEqual } from 'Types/object';
import ChangeEventController, { IConfig as ChangeEventConfig } from './Field/ChangeEventController';
import { InputType, ISelection, ISplitValue, Tag } from './Types';
import { calculateInputType, splitValueForPasting } from './Util';
import { ICallback, IFieldData } from '../interface/IValue';
import { FixBugs } from '../FixBugs';
import transliterate from 'Controls/_input/resources/Transliterate';
import MobileFocusController from './MobileFocusController';
import WorkWithSelection from './Field/WorkWithSelection';
import BaseViewModel from '../BaseViewModel';
import 'css!Controls/input';
import { activate } from 'UI/Focus';

export type EventName =
    | 'valueChanged'
    | 'inputCompleted'
    | 'inputControl'
    | 'selectionStartChanged'
    | 'selectionEndChanged';
type ControllerName = 'changeEventController';

const EVENTS_PROPS_NAME = {
    valueChanged: 'onValueChanged',
    inputCompleted: 'onInputCompleted',
    inputControl: 'onInputControl',
    selectionStartChanged: 'onSelectionStartChanged',
    selectionEndChanged: 'onSelectionEndChanged',
};

interface IModelData<Value, Options> {
    value?: Value;
    options?: Options;
    selection?: ISelection;
}

interface IFieldEvents {
    onBlur: (event) => void;
    onInput: (event) => void;
    onKeyUp: (event) => void;
    onFocus: (event) => void;
    onClick: (event) => void;
    onSelect: (event) => void;
    onKeyDown: (event) => void;
    onMouseDown: (event) => void;
    onTouchStart: (event) => void;
    onKeyPress: (event) => void;
    onCopy: (event) => void;
    onCut: (event) => void;
    onPaste: (event) => void;
}

export interface IFieldOptions<Value, ModelOptions>
    extends IControlOptions,
        IControlProps,
        TInternalProps,
        IFieldEvents {
    tag: Tag;
    name: string;
    inputCallback?: ICallback<Value>;
    readOnlyTemplate: TemplateFunction;
    model: BaseViewModel<Value, ModelOptions>;
    transliterate?: boolean;
    highlightedOnFocus?: string;
    recalculateLocationVisibleArea?: (
        field: HTMLInputElement,
        value: string,
        selection: ISelection
    ) => void;
    fieldRef: unknown;
}

export interface IContentProps extends IControlProps, IFieldEvents {
    ref: LegacyRef<HTMLInputElement | HTMLTextAreaElement>;
    key?: string;
    defaultValue?: string;
    value?: string;
    tabIndex?: number;
    spellCheck?: boolean;
}

/**
 *
 *
 * @interface Controls/_input/resources/Field
 * @public
 */
export interface IField {
    readonly '[Controls/input:IField]': boolean;
}

const MINIMAL_ANDROID_VERSION = 7;

const PROCESSED_KEYS: string[] = [
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    // Поддержка значений key в IE
    'Left',
    'Right',
    'Up',
    'Down',
];

/**
 * Контрол-обертка над нативными полями ввода. Используется для реализации контролов с вводом данных.
 * Если требуется готовый контрол с вводом текста используйте {@link Controls/_input/Text Controls.input:Text}
 *
 *
 * @extends UI/Base:Control
 *
 * @public
 *
 */
class Field<Value extends string, ModelOptions>
    extends Component<IFieldOptions<Value, ModelOptions>>
    implements IField
{
    private _currentVersionModel: number;
    private _changeEventController: ChangeEventController<Value, ModelOptions>;
    private _workWithSelection: WorkWithSelection<void> = new WorkWithSelection<void>();

    protected _model: BaseViewModel<Value, ModelOptions>;
    protected _isBrowserPlatform: boolean = constants.isBrowserPlatform;
    protected _inputKey: string;
    protected _selectTimeOut: number;
    protected _fieldRef = createRef<HTMLInputElement>();
    private _fixBugs: FixBugs;
    private _destroyed: boolean = false;
    private _mounted: boolean = false;

    // См. _selectHandler
    private _selectionChangedByFocus: boolean;

    readonly '[Controls/input:IField]': boolean = true;

    constructor(props: IFieldOptions<Value, ModelOptions>) {
        super(props);

        this._selectionFromFieldToModel = this._selectionFromFieldToModel.bind(this);

        this._blurHandler = this._blurHandler.bind(this);
        this._inputHandler = this._inputHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._focusHandler = this._focusHandler.bind(this);
        this._clickHandler = this._clickHandler.bind(this);
        this._selectHandler = this._selectHandler.bind(this);
        this._mouseDownHandler = this._mouseDownHandler.bind(this);
        this._touchStartHandler = this._touchStartHandler.bind(this);
        this._setRef = this._setRef.bind(this);

        this._model = props.model;
        this.state = {
            currentVersionModel: this._model.getVersion(),
        };
        this._currentVersionModel = this._model.getVersion();
        this._changeEventController = new ChangeEventController(
            this._model.displayValue,
            this._notifyEvent.bind(this, 'inputCompleted')
        );
        this._fixBugs = new FixBugs(
            {
                updatePositionCallback: () => {
                    const result = this.setSelectionRange(
                        this._model.selection.start,
                        this._model.selection.end
                    );
                    this._selectionChangedByFocus = true;
                    return result;
                },
            },
            this
        );
        this._fixBugs.beforeMount();
        if (this._isBrowserPlatform) {
            this._inputKey = '_inputKey_' + Date.now();
        }
    }

    componentDidMount(): void {
        this._mounted = true;
        const field: HTMLInputElement = this._getField();
        if (this._hasAutoFillField()) {
            if (this._getFieldValue(field)) {
                this._model.displayValue = this._getFieldValue(field);
            }
            this._notifyEvent('valueChanged');
        }
        this._fixBugs.afterMount();
        if (field && field.getAttribute?.('contenteditable') !== 'true') {
            // Есть проблема, когда программно меняют значение в value, то никакие события не стреляются
            // По\тому сами добавляем сеттер, и стреляем событие
            // https://online.sbis.ru/opendoc.html?guid=1166bfd5-cbdb-4db2-be1a-1fdb0e5b2ec7&client=3
            const defProperty = Object.getOwnPropertyDescriptor(
                field.constructor.prototype,
                'value'
            );
            Object.defineProperty(field, 'value', {
                configurable: true,
                get: () => {
                    return defProperty.get.call(field);
                },
                set: (value) => {
                    defProperty.set.call(field, value);
                    if (value !== this._model.displayValue) {
                        const event = new Event('input', { bubbles: true });
                        // @ts-ignore
                        event.inputType = 'insertFromPaste';
                        field.dispatchEvent(event);
                    }
                },
            });
        }
    }

    shouldComponentUpdate(nextProps: IFieldOptions<Value, ModelOptions>): boolean {
        if (this.props.model !== nextProps.model) {
            this._model = nextProps.model;
        }
        const currentDisplayValue: string = this._model.displayValue;
        if (this._model.displayValueBeforeUpdate !== currentDisplayValue) {
            this.fixedChangeEventController(currentDisplayValue);
        }
        this._updateByModel();
        this._fixBugs.beforeUpdate(this.props, nextProps);
        return this.props !== nextProps;
    }

    componentDidUpdate(): void {
        this._fixBugs.afterUpdate();
    }

    componentWillUnmount(): void {
        this._selectionFromFieldToModel = undefined;
        this._destroyed = true;
    }

    /**
     * Метод получения DOM элемента поля ввода.
     * Если элемент отсутствует в верстке, то будет выброшена ошибка.
     */
    private _getField(): HTMLInputElement | null {
        const field: HTMLInputElement = this.getContainer();

        if (field) {
            return field;
        }

        throw Error(
            'Не удалось определить DOM элемент поля ввода. ' +
                'Метод был вызван до монтирования контрола в DOM, ' +
                'или неправильно отработал механизм ядра по работе с _children.'
        );
    }

    getContainer(): HTMLInputElement | null {
        return this._fieldRef.current;
    }

    private _getFieldValue(field: HTMLInputElement): string {
        return typeof field.value !== 'undefined'
            ? field.value
            : field.innerText?.replace?.(/ /g, ' ');
    }

    private _getContentEditableSelection(): ISelection {
        const field: HTMLInputElement = this._getField();
        let start = 0;
        let end = 0;
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(selection.rangeCount - 1);
            let offset;
            if (range.startContainer !== range.endContainer) {
                offset = range.startContainer?.textContent?.length;
                start = range.startOffset;
            } else {
                const value = range.startContainer.nodeValue;
                offset = Math.max(field.innerText.indexOf(value), 0);
                start = range.startOffset + offset;
            }
            end = range.endOffset + offset;
        } else {
            start = end = this._model.displayValue.length;
        }
        return {
            start,
            end,
        };
    }

    private _getFieldSelection(): ISelection {
        const field: HTMLInputElement = this._getField();

        const start = field.selectionStart;
        const end = field.selectionEnd;
        if (typeof start === 'undefined') {
            return this._getContentEditableSelection();
        }

        return {
            start,
            end,
        };
    }

    private _hasAutoFillField(): boolean {
        const field: HTMLInputElement = this._getField();
        const fieldValue: string = this._getFieldValue(field);
        const modelValue: string = this._model.displayValue;

        return fieldValue !== '' && fieldValue !== modelValue;
    }

    private _updateModel(data: IModelData<Value, ModelOptions>): void {
        const model = this._model;

        if (data.value && data.value !== model.value) {
            model.value = data.value;
        }
        if (data.options && !isEqual(model.options, data.options)) {
            model.options = data.options;
        }
        if (data.selection && !isEqual(model.selection, data.selection)) {
            model.selection = data.selection;
        }
    }

    private _updateField(value: string, selection: ISelection): void {
        this.setValue(value);
        this.setSelectionRange(selection.start, selection.end);
    }

    private _selectionFromFieldToModel(): void {
        const fieldSelection: ISelection = this._getFieldSelection();
        const selection: ISelection = { ...this._model.selection };
        this._updateModel({
            selection: fieldSelection,
        });
        this._notifySelection(selection);
    }

    private _getArgsForEvent(name: EventName): unknown[] {
        const model = this._model;
        switch (name) {
            case 'valueChanged':
                return [model.value, model.displayValue];
            case 'inputCompleted':
                return [model.value, model.displayValue];
            case 'inputControl':
                return [model.value, model.displayValue, model.selection];
            case 'selectionStartChanged':
                return [model.selection.start];
            case 'selectionEndChanged':
                return [model.selection.end];
        }
    }

    private _getConfigForController(name: ControllerName): ChangeEventConfig<Value, ModelOptions> {
        switch (name) {
            case 'changeEventController':
                // Нужно отдавать model, а не displayValue. Например, строка поиска наследуется от Input:Base и сама
                // реализует опцию trim. В этом случае displayValue меняется в родителе и нам нужно получить
                // новое значение.
                return {
                    tag: this.props.tag,
                    model: this._model,
                } as ChangeEventConfig<Value, ModelOptions>;
        }
    }

    protected _notifyEvent(name: EventName): void {
        const nameEvent = new SyntheticEvent(null, {
            type: name,
            target: this._fieldRef.current,
        });
        this.props[EVENTS_PROPS_NAME[name]]?.(nameEvent, ...this._getArgsForEvent(name));
    }

    private _handleInput(splitValue: ISplitValue, inputType: InputType): void {
        const displayValue: string = this._model.displayValue;
        const value: Value = this._model.value;
        const selection: ISelection = { ...this._model.selection };

        if (this._model.handleInput(splitValue, inputType)) {
            if (this.props.inputCallback) {
                const formattedText: IFieldData = this.props.inputCallback({
                    value: this._model.value,
                    position: this._model.selection.start,
                    displayValue: this._model.displayValue,
                });

                this._model.displayValue = formattedText.displayValue;
                this._model.selection = {
                    start: formattedText.position,
                    end: formattedText.position,
                };
            }

            if (this._model.isValueChanged(displayValue, value as string)) {
                this._notifyEvent('valueChanged');
            }
            this._notifySelection(selection);
        }
        this._notifyEvent('inputControl');
    }

    private _updateByModel(): void {
        const model = this._model;
        const field = this._getField();
        const versionModel = model.getVersion();
        /*
         * Обновляемся по данным модели только в случае, если она поменяла версию с
         * момента последнего обновления.
         */
        const shouldBeChanged = this._currentVersionModel !== versionModel;
        if (shouldBeChanged) {
            const oldValue = field.value;
            this._updateField(model.displayValue, model.selection);

            if (
                WorkWithSelection.isFieldFocused(field) &&
                !field.readOnly &&
                oldValue !== model.displayValue &&
                this.props.recalculateLocationVisibleArea
            ) {
                this.props.recalculateLocationVisibleArea(
                    field,
                    model.displayValue,
                    model.selection
                );
            }
            if (this._mounted) {
                this.setState({
                    currentVersionModel: versionModel,
                });
            }
            this.props.onModelUpdate?.();
            this._currentVersionModel = versionModel;
        }
    }

    private _notifySelection(selection: ISelection): void {
        if (!isEqual(selection, this._model.selection)) {
            this._notifyEvent('selectionStartChanged');
            this._notifyEvent('selectionEndChanged');
        }
    }

    // BEGIN OF HANDLERS SECTION

    protected _inputHandler(event: SyntheticEvent<KeyboardEvent>): void {
        const field = this._getField();
        const model = this._model;
        let newPosition = field.selectionEnd;
        if (typeof newPosition === 'undefined') {
            newPosition = this._getContentEditableSelection().end;
        }
        const data = this._fixBugs.dataForInputProcessing({
            oldSelection: model.selection,
            newPosition,
            newValue: this._getFieldValue(field),
            oldValue: model.displayValue,
        });
        const value = data.oldValue;
        const newValue = data.newValue;
        const selection = data.oldSelection;
        const position = data.newPosition;
        model.newValue = newValue;

        const text: IText = {
            value: newValue,
            carriagePosition: position,
        };
        let nativeInputType = event.nativeEvent.inputType;
        /*
         * В событиях браузера есть баг, связаный с inputType.
         * Он возвращает не корректное значение если ввести текст, и после нажать del.
         * На del должно приходить deleteContentForward, но приходит insertText.
         * https://online.sbis.ru/opendoc.html?guid=6a69f94b-3e61-49bf-a6c7-6c856c7e935c
         */
        if (nativeInputType === 'insertText' && event.nativeEvent.data === null) {
            nativeInputType = 'deleteContentForward';
        }
        const inputType: InputType = calculateInputType(value, selection, text, nativeInputType);
        const splitValue: ISplitValue = split(value, newValue, position, selection, inputType);

        this._handleInput(splitValue, inputType);

        /*
         * Некоторые браузеры предоставляют возможность пользователю выбрать значение из предложенного списка.
         * Список формируется на основе введенного слова, путем попытки предугадать, какое слово вы пытаетесь набрать.
         * Выбранное значение полностью заменяет введенное слово.
         * Опытным путем удалось определить, что после ввода возможны 2 сценария:
         * 1. Каретка стоит в конце слова. Свойство selectionStart = selectionEnd = конец слова. Например, устройство ASUS_Z00AD, Android 5, браузер chrome.
         * 2. Слово выделено целиком. Свойство selectionStart = 0, а selectionEnd = конец слова. Например, устройство ASUS_Z00AD, Android 5, встроенный браузер.
         * Данные в первом случае ничем не отличаются от обычного ввода, поэтому он не вызывает проблем.
         * Разберем работу контрола во втором случае. Контрол всегда должен отображаться в соответствии со своей моделью.
         * После ввода selectionStart в модели равен текущей позиции каретки, а у поля, как говорилось ранее, selectionStart = 0. Из-за этого контрол будет менять выделение.
         * В этом случае возникает нативный баг. Он проявляется в том, что последующего ввода символов не происходит. https://jsfiddle.net/fxzsqug4/1/
         * Чтобы избавиться от бага, нужно поставить операцию изменения выделение в конец стека.
         * Например, можно воспользоваться setTimeout. https://jsfiddle.net/fxzsqug4/2/
         * Однако, можно просто не синхронизироваться с моделью во время обработки события input.
         * Потому что модель синхронизируется с полем во время цикла синхронизации, если изменения
         * не были применены. Такой подход увеличит время перерисоки,
         * но в местах с багом этого визуально не заметно.
         */
        if (!detection.isMobileAndroid) {
            this._updateField(model.displayValue, model.selection);
        } else {
            /*
             * На старых версиях android, появляется ошибка описанная выше.
             * На более новых версия (начиная с 8), ошибка не повторяется, если синхронизировать только value.
             */
            const androidVersion = detection.AndroidVersion;
            if (androidVersion && androidVersion >= MINIMAL_ANDROID_VERSION) {
                this.setValue(model.displayValue);
            }
        }
        this.props.onInput?.(event);
    }

    protected _selectionChanged(): void {
        /*
           В случае если после установки фокуса и первоначальной установки selection
           меняют selection еще раз(через изменение модели),
           то случается так, что событие от первоначальной установки стреляет
           и мы затираем значение модели значением из инпута(т.к. beforeUpdate от изменения selection еще не наступил)
           Кейс: Маунт -> первое установление фокуса и selection ->
           еще одно изменение selection -> событие о изменении selection
         */
        if (!this._selectionChangedByFocus) {
            this._workWithSelection.call(this._selectionFromFieldToModel);
        }
    }

    private _setModelSelection() {
        const field = this._getField();
        if (
            this.props.model.selection.start !== field.selectionStart ||
            this.props.model.selection.end !== field.selectionEnd
        ) {
            field.selectionStart = this.props.model.selection.start;
            field.selectionEnd = this.props.model.selection.end;
        }
    }

    protected _selectHandler(event): void {
        // Если программно меняли позицию каретки, то проверяем отличается ли позиция каретки фактическая и в модели.
        // Если значение отличается, то считаем что значение в модели правильное.
        if (this.props.model.customSelectorChanged) {
            this.props.model.customSelectorChanged = false;
            this._setModelSelection();
            return;
        }
        if (this._selectTimeOut) {
            clearTimeout(this._selectTimeOut);
        }
        // Сейчас есть проблема, когда в слове есть опечатка, и нажимают на него правой кнопкой мыши.
        // В таком случае событие select срабатывает 2 раза. А так как мы потом сами возвращаем курсор в нужное место,
        // получается так, что иногда нам успевает прийти втрое событие(когда текст выделен), но иногда мы быстрее меняем
        // позицию курсора, из-за чего 2 событие приходит не корректным.
        // Поэтому если нажата правая кнопка мыши, мы устанавливаем курсор с 0 timeout
        if (event?.nativeEvent?.button === 2) {
            this._selectTimeOut = setTimeout(() => {
                this._selectionChanged();
                this._selectTimeOut = null;
            }, 0);
        } else {
            this._selectionChanged();
        }
        this.props.onSelect?.(event);
    }

    protected _clickHandler(event): void {
        /*
         * If the value in the field is selected, when you click on the selected area,
         * the cursor in the field is placed after the event. https://jsfiddle.net/wv9o4xmd/
         * Therefore, we remember the selection from the field at the next drawing cycle.
         */
        runDelayed(() => {
            if (this._destroyed) {
                return;
            }
            this._selectionFromFieldToModel();
            this._currentVersionModel = this._model.getVersion();
            if (this._mounted) {
                this.setState({
                    currentVersionModel: this._model.getVersion(),
                });
            }
            this.props.onModelUpdate?.();
        });
        this.props.onClick?.(event);
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        const T_KEY_CODE = 84;
        const PAUSE_KEY_CODE = 19;

        /*
         * При начале выделения и выходе за пределы field, не срабатывает событие click,
         * из-за чего получаем неправильный selection у модели при вводе.
         * Поэтому заново вычисляем selection для модели.
         * https://online.sbis.ru/opendoc.html?guid=2d76628b-eacc-48ac-837a-99b26009c4e1
         */
        if (!PROCESSED_KEYS.includes(event.nativeEvent.key)) {
            this._selectionFromFieldToModel();
        }
        this._changeEventController.keyDownHandler(
            event,
            this._getConfigForController('changeEventController')
        );

        if (
            ((event.nativeEvent.altKey && event.nativeEvent.keyCode === T_KEY_CODE) ||
                event.nativeEvent.keyCode === PAUSE_KEY_CODE) &&
            this.props.transliterate
        ) {
            transliterate(this._model.value, this._getFieldSelection()).then((value) => {
                this._updateField(value, this._getFieldSelection());
                this._updateModel({ value });
                this._notifyEvent('valueChanged');
            });
        }
        this.props.onKeyDown?.(event);
    }

    protected _keyUpHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (PROCESSED_KEYS.includes(event.nativeEvent.key)) {
            this._selectionFromFieldToModel();
        }
        this.props.onKeyUp?.(event);
    }

    protected _blurHandler(event: SyntheticEvent<FocusEvent>): void {
        const field: HTMLInputElement = this._getField();

        /*
         * Защита от случая, когда фокус ушёл с поля из-за удаления из DOM.
         */
        if (!field) {
            return;
        }

        /*
         * После ухода фокуса поле должно быть проскролено в начало.
         * Браузеры работают по разному, chrome прокручивает, а ie и firefox нет.
         * Дулаем прокрутку на уровне контрола для унификации поведения.
         */
        field.scrollLeft = 0;

        this._changeEventController.blurHandler(
            event,
            this._getConfigForController('changeEventController')
        );
        MobileFocusController.blurHandler(event);
        this.props.onBlur?.(event);
    }

    protected _touchStartHandler(event: SyntheticEvent<TouchEvent>): void {
        MobileFocusController.touchStartHandler(event);
        this.props.onTouchStart?.(event);
    }

    protected _focusHandler(event: SyntheticEvent<FocusEvent>): void {
        MobileFocusController.focusHandler(event);
        this._fixBugs.focusHandler(event);
        this.props.onFocus?.(event);
    }

    protected _mouseDownHandler(event): void {
        this._fixBugs.mouseDownHandler();
        this.props.onMouseDown?.(event);
    }

    // END OF HANDLERS SECTION

    setValue(value: string): boolean {
        const field: HTMLInputElement = this._getField();
        const fieldValue = this._getFieldValue(field);

        if (fieldValue === value) {
            return false;
        }

        if (field.value !== undefined) {
            field.value = value;
            // На андроид есть нативная проблема, связанная с тем, что при смене value в поле ввода, курсор ставится в конец.
            // Поэтому сами восстанавливаем позицию курсора
            if (detection.isMobileAndroid) {
                this.setCaretPosition(this._model.selection.start);
            }
        }
        return true;
    }

    setCaretPosition(caretPosition: number): boolean {
        return this.setSelectionRange(caretPosition, caretPosition);
    }

    setSelectionRange(start: number, end: number): boolean {
        const field: HTMLInputElement = this._getField();
        const selection: ISelection = { start, end };

        this._notifySelection(selection);
        this._selectionChangedByFocus = false;
        return this._workWithSelection.setSelectionRange(field, selection);
    }

    getFieldData<T>(name: string): T {
        return this._getField()[name];
    }

    hasHorizontalScroll(): boolean {
        /*
         * При смене состояния readOnly, может произойти ситуация, когда базовый контрол замаунтился, а field нет.
         * https://online.sbis.ru/opendoc.html?guid=1aaaab99-539a-4dec-87e1-c92095fd553a
         */
        if (this._fieldRef.current) {
            return hasHorizontalScroll(this._getField());
        }
        return false;
    }

    scrollTo(scrollTop: number): void {
        this._getField().scrollTop = scrollTop;
    }

    paste(text: string): void {
        const splitValue: ISplitValue = splitValueForPasting(
            this._model.displayValue,
            this._model.selection,
            text
        );

        this._handleInput(splitValue, 'insert');
    }

    fixedChangeEventController(currentDisplayValue: string = ''): void {
        this._changeEventController.fixed(currentDisplayValue);
    }

    activate(cfg) {
        activate(this._fieldRef.current, cfg);
    }

    protected _setRef(ref) {
        this._fieldRef.current = ref;
        if (this.props.fieldRef) {
            if (typeof this.props.fieldRef === 'function') {
                this.props.fieldRef(this);
            } else {
                this.props.fieldRef.current = this;
            }
        }
        if (this.props.forwardedRef) {
            if (typeof this.props.forwardedRef === 'function') {
                this.props.forwardedRef(ref);
            } else {
                this.props.forwardedRef.current = ref;
            }
        }
    }

    protected _getContentProps(className: string) {
        const attrs = wasabyAttrsToReactDom(this.props.attrs) || {};
        const contentProps: IContentProps = {
            ...attrs,
            ref: this._setRef,
            className,
            tabIndex: 0,
            spellCheck: this.props.spellCheck || attrs.spellCheck,
            onBlur: this._blurHandler,
            onInput: this._inputHandler,
            onKeyUp: this._keyUpHandler,
            onFocus: this._focusHandler,
            onClick: this._clickHandler,
            onSelect: this._selectHandler,
            onKeyDown: this._keyDownHandler,
            onMouseDown: this._mouseDownHandler,
            onTouchStart: this._touchStartHandler,
            onKeyPress: this.props.onKeyPress,
            onCopy: this.props.onCopy,
            onCut: this.props.onCut,
            onPaste: this.props.onPaste,
        };
        if (this._isBrowserPlatform) {
            contentProps.key = this._inputKey;
            if (this._model.displayValue) {
                contentProps.defaultValue = this._model.displayValue;
            }
        } else if (this._model.displayValue) {
            contentProps.value = this._model.displayValue;
        }
        return contentProps;
    }

    render() {
        const contentProps = this._getContentProps(
            `controls-Field js-controls-Field${
                this.props.highlightedOnFocus ? ' controls-Field-focused-item' : ''
            }${this.props.className ? ` ${this.props.className}` : ''}`
        );
        if (this.props.tag === 'textarea') {
            contentProps.defaultValue = this._isBrowserPlatform
                ? this._model.displayValue
                : undefined;
        }
        return this.props.tag === 'textarea' ? (
            <textarea {...contentProps} />
        ) : (
            <input {...contentProps} />
        );
    }

    static getOptionTypes(): Partial<Record<keyof IFieldOptions<string, {}>, Function>> {
        return {
            tag: descriptor(String),
            name: descriptor(String).required(),
            transliterate: descriptor(Boolean),
        };
    }

    static defaultProps: Partial<IFieldOptions<string, {}>> = {
        tag: 'input',
        transliterate: true,
    };
}

export default Field;

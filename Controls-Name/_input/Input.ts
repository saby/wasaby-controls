import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name/_input/Input/Input';
import { Base, ITextViewModelOptions, TextViewModel, Field } from 'Controls/input';
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UICommon/Events';
import rk = require('i18n!Controls-Name');
import { Entity } from 'Controls/dragnDrop';
import { constants, detection } from 'Env/Env';
import { Container as ValidateContainer } from 'Controls/validate';
import Constants from 'Controls-Name/_input/constants';
import {
    ISelection,
    IInputOptions,
    ISpacePosition,
    INameValue,
    IKeyboardEventAction,
    IProcessKeyboardOption,
    IDragAction,
    IDragObject,
} from './interface/IInput';
import { getWidth } from 'Controls/sizeUtils';
import 'css!Controls-Name/Input';

const INPUT_ID_PLACEHOLDER = {
    lastName: rk('Фамилия', 'ФИО'),
    firstName: rk('Имя', 'ФИО'),
    middleName: rk('Отчество', 'ФИО'),
};
const INPUT_MAXLENGTH = 200;
export const DEFAULT_ORDER = ['lastName', 'firstName', 'middleName'];

interface IReceivedState {
    autocomplete: string;
}

/**
 * Поле ввода ФИО.
 * @class Controls-Name/Input
 * @private
 * @extends UI/Base:Control
 * @mixes Controls/input:IBorderVisibility
 * @control
 */
export default class Input extends Control<IInputOptions, IReceivedState> {
    protected _template: TemplateFunction = template;
    private _inputs: RecordSet;
    protected _stringInputsValue: string = '';
    protected _inputOrderString: string;
    private _lastActiveInput: string = '';
    private _dropPositions: ISpacePosition[] = [];
    private _horizontalPosition: number;
    protected _drawInputs: boolean = false;
    protected _isFocusRestored: boolean = false;
    protected _autocomplete: string;
    // Промис активного запроса к БЛ на парсинг имени, блокирует изменение в поле на время запроса к источнику.
    private _blockInputPromise: Promise<void> | null = null;
    // Имя поля ввода, в котором должен быть установлен фокус после вставки.
    private _focusInputName: string;
    private _modelOptions: ITextViewModelOptions = {
        maxLength: 200,
    };
    _children: {
        buffer: HTMLInputElement;
        container: HTMLElement;
        validator: ValidateContainer;
    };

    protected _beforeMount(
        options?: IInputOptions,
        contexts?: object,
        receivedState?: IReceivedState
    ): IReceivedState {
        this._initViewModel(options);
        this._updateViewModel(options);
        // Иногда Яндекс браузер игнорирует autocomplete установленный в off, поэтому задаем рандомный.
        if (options.autoComplete) {
            this._autocomplete = options.autoComplete;
        } else {
            this._autocomplete =
                receivedState?.autocomplete ||
                (detection.yandex ? 'autocomplete-' + Date.now() : 'off');
        }
        return {
            autocomplete: this._autocomplete,
        };
    }

    protected _beforeUpdate(options: IInputOptions): void {
        this._updateViewModel(options);
    }

    protected _afterUpdate(oldOptions: IInputOptions): void {
        const isActive = this._container === document.activeElement;
        // Нужно, чтобы активный компонент ставил фокус в первый input после переключения режима отрисовки на input-ы.
        if (this._drawInputs && !this._isFocusRestored) {
            this._isFocusRestored = true;
            if (isActive) {
                this.activate();
            }
        }

        if (JSON.stringify(oldOptions.inputOrder) !== JSON.stringify(this._options.inputOrder)) {
            // при перестроении порядка полей фокус переместится, возвращаем его в прежнее по номеру поле ввода
            if (this._lastActiveInput && oldOptions.inputOrder) {
                const lastActiveInputIndex = oldOptions.inputOrder.indexOf(this._lastActiveInput);
                if (lastActiveInputIndex !== -1 && isActive) {
                    this._lastActiveInput = this._options.inputOrder[lastActiveInputIndex];
                    // TODO выписать ошибку по фокусировке поля ввода
                    (
                        this._children['ws-' + this._lastActiveInput] as Field<
                            string,
                            ITextViewModelOptions
                        >
                    ).activate();
                }
            }
        }

        if (this._focusInputName) {
            const inputTarget = this._children['ws-' + this._focusInputName] as Field<
                string,
                ITextViewModelOptions
            >;
            const position: number = this._inputs.getRecordById(this._focusInputName).get('model')
                .displayValue.length;
            Input._setCaretPosition(inputTarget, position);
            this._focusInputName = null;
        }
    }

    protected _afterRender(): void {
        if (!this._options.readOnly && this._drawInputs) {
            // обновление значений в input-ах, если изменилось значение в модели
            // TODO https://online.sbis.ru/opendoc.html?guid=096ba984-1a6b-4d64-8d53-0608babd5236
            this._options.inputOrder.forEach((inputId: string) => {
                const inputModel = this._inputs.getRecordById(inputId);
                Input.updateInputValue(
                    this._children['ws-' + inputModel.get('id')] as HTMLInputElement,
                    inputModel.get('model').displayValue
                );
            });
        }
    }

    protected _afterMount(options?: IInputOptions): void {
        // изначально вместо input-ов в шаблоне отрисовываются блоки с текстом,
        // после маунта переключаем отрисовку на input-ы.
        // Сделано так потому что до момента встраивания компонента в DOM мы не можем рассчитать авторазмеры Input-ов,
        // т.к. неизвестна ширина текста (нет доступа к _children.buffer)
        this._drawInputs = true;

        // TODO Нужно удалить после https://online.sbis.ru/opendoc.html?guid=403837db-4075-4080-8317-5a37fa71b64a
        this._notify('inputReady', [this]);
    }

    protected _deactivatedHandler(): void {
        this._children.validator.validate();
    }

    protected _deactivatedContainerHandler(): void {
        const currentValue = this._getStringInputsValue();
        if (this._options.trim) {
            this._inputs.each((input) => {
                const trimmerValue = input.get('model').displayValue.trim();
                if (input.get('model').displayValue !== trimmerValue) {
                    input.get('model').displayValue = trimmerValue;
                    this._notifyValueChanged(input);
                }
            });
        }
        if (this._stringInputsValue !== currentValue || this._inputs.isChanged()) {
            this._notifyInputCompleted(currentValue);
            this._inputs.acceptChanges();
        }
    }

    protected _activatedContainerHandler(): void {
        this._stringInputsValue = this._getStringInputsValue();
    }

    private _getStringInputsValue(): string {
        let currentStringInputsValue = '';
        this._inputs.each((input) => {
            const displayValue = input.get('model').displayValue
                ? input.get('model').displayValue
                : '';
            if (displayValue && currentStringInputsValue) {
                currentStringInputsValue += ' ';
            }
            currentStringInputsValue += displayValue;
        });
        return currentStringInputsValue;
    }

    protected _stoppedEvent(event) {
        event.preventDefault();
    }

    /**
     * Вычисление ширины разделителя, может варьироваться в зависимости от темы.
     * @private
     */
    protected _getSeparatorWidth(): number {
        const separator = this._children[
            'separator_' + this._options.inputOrder[0]
        ] as HTMLInputElement;
        return separator ? separator.clientWidth : 0;
    }

    protected _inputFocusHandler(event: SyntheticEvent<FocusEvent>, inputRecord: Record): void {
        this._lastActiveInput = inputRecord.get('id');
        this._notify('inputFocus', [inputRecord]);
    }

    /**
     * @event Controls-Name/Input#inputCompleted Происходит при завершении ввода. Завершение ввода — это контрол потерял фокус, или пользователь нажал
     * клавишу "Enter".
     * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
     * @param {String} value Строковое представление поля ввода.
     * @param {Object} newValue Объект со значениями полей.
     * @param {RecordSet} inputs Коллекция содержащая информацию из полей.
     */

    private _notifyInputCompleted(value: string): void {
        const newValue: INameValue = this._getObjectValueField();
        this._notify('inputCompleted', [value, newValue, this._inputs]);
    }

    protected _buttonReorderClickHandler(event: SyntheticEvent<MouseEvent>): void {
        this._notify('reorder', []);
    }

    /**
     * Метод перехода фокуса при активации компонента.
     * @param {activateNext: boolean} cfg конфигурация для активации помпонента.
     * activateNext=true - нужно перенести фокус в следующее за последним активиным полем ввода.
     * Если поле последнее, осатвить фокус в нем.
     */
    activate(cfg?: {
        enableScreenKeyboard?: boolean;
        enableScrollToElement?: boolean;
        activateNext?: boolean;
    }): boolean {
        if (this._lastActiveInput) {
            if (cfg && cfg.activateNext) {
                this._lastActiveInput = Input._getNextInput(
                    this._options.inputOrder,
                    this._lastActiveInput
                );
            }
            (
                this._children['ws-' + this._lastActiveInput] as Field<
                    string,
                    ITextViewModelOptions
                >
            ).activate();
            return true;
        }
        return super.activate(cfg);
    }

    /**
     * Обработчик изменения значения в поле ввода, обновляет модель отображения.
     * @param {SyntheticEvent<InputEvent>} event
     * @param {Record} inputRecord запись из модели отображения, связанная с текущим полем ввода
     * @private
     */
    protected _inputChangeHandler(event: SyntheticEvent<InputEvent>, inputRecord: Record): void {
        const input = event.target as HTMLInputElement;
        const inputValue = (inputRecord.get('model') as TextViewModel).displayValue;
        // На Android события keydown не присылают валидный код нажатой клавиши,
        // поэтому ловим ввод пробела при изменении input-а.
        if (
            constants.browser.isMobileAndroid &&
            event.nativeEvent.data &&
            event.nativeEvent.data[event.nativeEvent.data.length - 1] === ' '
        ) {
            const selection = Input._getSelection(input);
            const action: IKeyboardEventAction = this._processKeyboard({
                keyCode: Constants.KEY_CODES.Space,
                selection,
                inputValue,
                inputId: inputRecord.get('id'),
            });
            if (action) {
                const actionInput = this._children['ws-' + action.input] as Field<
                    string,
                    ITextViewModelOptions
                >;
                Input._setCaretPosition(actionInput, 0);
                // cut last "space" symbol
                input.value = inputValue.slice(0, -1);
            }
        }

        this._updateInput(inputRecord, input.value);
        this._notifyValueChanged(inputRecord);
        this._updateFakeField(inputRecord, input.value);
    }

    protected _updateFakeField(inputRecord: Record, value: string = ''): void {
        const fakeFieldName = `${inputRecord.get('id')}FakeField`;
        if (this._children.hasOwnProperty(fakeFieldName)) {
            // При быстром вводе возникает ситуация, когда текст начинает прыгать.
            // Это связано с тем, что ширина меняется после beforeUpdate
            // Поэтому ширину инпута нужно предварительно менять синхронно, чтобы не было скачков,
            // для этого, обновляем значение в fakeField
            // https://online.sbis.ru/opendoc.html?guid=a3869e0b-e4f6-41ba-9bad-99526f950144
            if (value.trim()) {
                this._children[fakeFieldName].innerText = value;
            } else {
                this._children[fakeFieldName].innerText = inputRecord.get('placeholder');
            }
        }
    }

    /**
     * Нотификация события об изменении value для работы двустороннего биндинга.
     * @param {Record} [item] запись, соответствующая редактируемой части ФИО
     * @private
     */
    protected _notifyValueChanged(item?: Record): void {
        const newValue: INameValue = this._getObjectValueField();
        const stringValue = item ? item.get('model').displayValue : '';
        this._notify('valueChanged', [stringValue, newValue, item]);
    }

    /**
     * Обработка вставки из буфера обмена в поле ввода ФИО
     * @param event
     * @param inputRecord
     * @private
     */
    protected _inputPasteHandler(event: SyntheticEvent<ClipboardEvent>, inputRecord: Record): void {
        const pasteData: string = event.nativeEvent.clipboardData
            ? event.nativeEvent.clipboardData.getData(
                  constants.browser.isMobileIOS ? 'text/plain' : 'text'
              )
            : // @ts-ignore
              window.clipboardData.getData('text');
        let pasteString: string = Input._preparePasteValue(pasteData);

        const inputTarget = event.target as HTMLInputElement;
        const inputValue = Input._inputPaste(inputTarget, pasteString, INPUT_MAXLENGTH);

        if (this._options.source) {
            pasteString = Input._getStringValue(this._options.inputOrder, this._inputs, {
                id: inputRecord.get('id'),
                value: inputValue,
            });
            if (pasteString && !this._blockInputPromise) {
                this._blockInputPromise = this._options.source
                    .create({
                        value: pasteString,
                        order: Input.getOrder(this._options.fields),
                    })
                    .then((item: Record) => {
                        const lastChangedInput = this._updateValueAfterPaste(
                            item,
                            this._inputs,
                            this._options.inputOrder
                        );
                        if (lastChangedInput) {
                            this._focusInputName = lastChangedInput;
                            this._notifyValueChanged(
                                this._inputs.getRecordById(this._focusInputName)
                            );
                        }
                        this._notify('dataReceived', [item]);
                    })
                    .finally(() => {
                        this._blockInputPromise = null;
                    });
            }
        } else {
            this._updateInput(inputRecord, inputValue);
            this._focusInputName = inputRecord.get('id');
            this._notifyValueChanged(inputRecord);
        }
        event.preventDefault();
    }

    /**
     * Обновляет модель данных при вставке.
     * Возвращает идентификатор последнего измененного поля модели, либо пустую строку при отсутствии изменений.
     * @param {Record} pasteRecord запись с новыми данными поля ФИО.
     * @param {RecordSet} inputs модель данных поля ФИО.
     * @param {string} inputOrder текущий порядок вывода полей
     * @private
     */
    protected _updateValueAfterPaste(
        pasteRecord: Record,
        inputs: RecordSet,
        inputOrder: string[]
    ): string {
        let lastChangedInputName: string = '';
        inputs.each((input) => {
            const name = input.get('id');
            const value = pasteRecord.get(name);
            /*
             * От Бл в pasteRecord не всегда приходят все поля ФИО, указанные в fields.
             * Это происходит из-за того, что распознаны не все сущности, из-за чего может вернуться undefined.
             */
            if (value !== undefined) {
                if (input.get('model').displayValue !== value) {
                    this._updateInput(input, value);
                    if (inputOrder.indexOf(name) > inputOrder.indexOf(lastChangedInputName)) {
                        lastChangedInputName = name;
                    }
                }
            }
        });
        return lastChangedInputName;
    }

    /**
     * Обработчик клавиатуры в полях ввода ФИО.
     * @param {SyntheticEvent<Event>>} event
     * @param {Record} inputRecord связанная с событием клавиатуры запись из модели отображения.
     * @private
     */
    protected _keyPressHandler(event: SyntheticEvent<KeyboardEvent>, inputRecord: Record): void {
        if (this._blockInputPromise) {
            event.preventDefault();
            return;
        }
        const inputTarget: HTMLInputElement = event.target as HTMLInputElement;
        const action: IKeyboardEventAction = this._processKeyboard({
            keyCode: event.nativeEvent.keyCode,
            shiftKey: event.nativeEvent.shiftKey,
            selection: Input._getSelection(inputTarget),
            inputValue: inputTarget.value,
            inputId: inputRecord.get('id'),
        });
        if (action) {
            const input = this._children['ws-' + action.input] as Field<
                string,
                ITextViewModelOptions
            >;
            // Значение берем с опций, т.к. могли нажать backspace и инициировать перемещение на другое поле ввода
            // Значение берем того поля, куда перемещаемся.
            const inputValue = this._options.value[action.input];
            Input._setCaretPosition(input, action.position === 'start' ? 0 : inputValue.length);
            if (action.preventDefault) {
                event.preventDefault();
            }
        }
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this._deactivatedContainerHandler();
        }
        this._processKeydownEvent(event);
    }

    private _processKeydownEvent(event: SyntheticEvent<KeyboardEvent>): void {
        const code: string = event.nativeEvent.key;
        const processedKeys: string[] = [
            'End',
            'Home',
            ' ',
            'ArrowLeft',
            'ArrowRight',
            'Spacebar',
            'Left',
            'Right',
            'Delete',
        ];
        if (processedKeys.includes(code)) {
            event.stopPropagation();
        }
    }

    private _getObjectValueField(): INameValue {
        const objectValue: INameValue = {};
        this._inputs.each((input) => {
            objectValue[input.get('id')] = input.get('model').displayValue;
        });
        return objectValue;
    }

    private _processKeyboard({
        keyCode,
        shiftKey,
        selection,
        inputValue,
        inputId,
    }: IProcessKeyboardOption): IKeyboardEventAction | null {
        let result = null;
        if (selection.length) {
            return result;
        }
        const order = this._options.inputOrder;
        const inputPosition: number = order.indexOf(inputId);
        const lastPosition: number = order.length - 1;
        switch (keyCode) {
            case Constants.KEY_CODES.Space:
                // перенос курсора в начало следующего поля ввода (если оно пусто)
                if (inputPosition < lastPosition && selection.start === inputValue.length) {
                    if (
                        this._inputs.getRecordById(order[inputPosition + 1]).get('model')
                            .displayValue === ''
                    ) {
                        result = {
                            input: order[inputPosition + 1],
                            position: 'start',
                            preventDefault: true,
                        };
                    }
                }
                break;
            case Constants.KEY_CODES.ArrowRight:
                // перенос курсора в начало следующего поля ввода
                if (selection.start === inputValue.length && inputPosition < lastPosition) {
                    result = {
                        input: order[inputPosition + 1],
                        position: 'start',
                        preventDefault: true,
                    };
                }
                break;
            case Constants.KEY_CODES.ArrowLeft:
            case Constants.KEY_CODES.Backspace:
                // перенос курсора в конец предыдущего поля ввода
                if (selection.start === 0 && inputPosition > 0) {
                    result = {
                        input: order[inputPosition - 1],
                        position: 'end',
                        preventDefault: true,
                    };
                }
                break;
            case Constants.KEY_CODES.End:
                // перенос курсора в конец последнего поля ввода
                if (shiftKey !== true) {
                    result = {
                        input: order[lastPosition],
                        position: 'end',
                        preventDefault: false,
                    };
                }
                break;
            case Constants.KEY_CODES.Home:
                // перенос курсора в начало первого поля ввода
                if (shiftKey !== true) {
                    result = {
                        input: order[0],
                        position: 'start',
                        preventDefault: false,
                    };
                }
                break;
            default:
                break;
        }
        return result;
    }

    protected _separatorHoverHandler(
        event: SyntheticEvent<MouseEvent>,
        item: Record,
        isHover: boolean
    ): void {
        if (isHover) {
            this._inputs.each((input) => {
                input.set('marked', false);
            });
        }
        item.set('marked', isHover);
    }

    /**
     * Обработчик mousedown/touchstart по разделителю, начинающий операцию DragNDrop.
     * @param {SyntheticEvent<Event>} event
     * @param {Record} inputRecord запись, соответствующая полю ввода, связанному с перемещаемым разделителем.
     * @private
     */
    protected _startDragHandler(
        event: SyntheticEvent<MouseEvent | TouchEvent>,
        inputRecord: Record
    ): void {
        if (this._options.readOnly) {
            return;
        }

        // нужно, чтобы отключить выделение при DnD.
        event.preventDefault();
        // Вызов preventDefault останавливает переход фокуса на элемент, активируем себя вручную.
        // TODO поправить метод activate по ошибке
        //  https://online.sbis.ru/opendoc.html?guid=80153bd5-7582-419a-98d4-171e073c4c87
        super.activate();

        const idx = this._options.inputOrder.indexOf(inputRecord.get('id'));
        // @ts-ignore
        this._children.dragNDrop.startDragNDrop(new Entity({ inputRecord, idx }), event);
    }

    /**
     * Обработчик начала перемещения разделителя с помощью DragNDrop.
     * @private
     */
    protected _dragStartHandler(): void {
        this._dropPositions = Input._calcPossibleDropPositions(
            this._options.inputOrder,
            this._inputs,
            this._getSeparatorWidth(),
            this._getTextWidth.bind(this)
        );
        this._horizontalPosition = this._children.container.getBoundingClientRect().left;
    }

    /**
     * Обработчик перетаскивания разделителя в компоненте.
     * @param {SyntheticEvent<Event>} event
     * @param {object} dragObject описание перемещаемого объекта
     * @private
     */
    protected _dragNDropHandler(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        const horizontal = dragObject.position.x - this._horizontalPosition;
        const separatorPosition = this._getSeparatorPosition(horizontal, this._dropPositions);
        const currentDropPosition = this._dropPositions[separatorPosition];
        const dragEntityOptions = dragObject.entity.getOptions();
        const idxFrom = dragEntityOptions.idx;
        const idxTo = this._options.inputOrder.indexOf(currentDropPosition.inputId);
        // находимся у исходной позиции разделителя
        if (currentDropPosition.separator === idxFrom) {
            return;
        }
        const updateAction: IDragAction[] = this._processDrag(idxFrom, idxTo, currentDropPosition);
        this._updateValuesOnDrag(updateAction);
    }

    /**
     * Рассчет изменений значений полей ФИО при DnD разделителей
     * @param idxFrom индекс поля, разделитель которого перетаскивается
     * @param idxTo индекс поля, в который перетаскивается разделитель.
     * @param currentDropPosition объект с описанием позиции, в которую происходит перемещение разделителя.
     * @private
     */
    private _processDrag(
        idxFrom: number,
        idxTo: number,
        currentDropPosition: ISpacePosition
    ): IDragAction[] {
        const order = this._options.inputOrder;
        const isLeftMove = idxTo <= idxFrom;
        const updateAction: IDragAction[] = [];
        if (isLeftMove) {
            // перемещение разделителя влево
            if (Math.abs(idxFrom - idxTo) > 0) {
                // перетащили влево через 1 разделитель или в начало текущего поля ввода
                if (!currentDropPosition.subStrAfter) {
                    // в начало текущего поля ввода
                    updateAction.push({
                        inputId: order[idxFrom + 1],
                        value: [
                            this._inputs.getRecordById(order[idxFrom]).get('model').displayValue,
                            this._inputs.getRecordById(order[idxFrom + 1]).get('model')
                                .displayValue,
                        ]
                            .join(' ')
                            .trim(),
                    });
                    updateAction.push({
                        inputId: order[idxFrom],
                        value: '',
                    });
                } else {
                    // log('перетащили влево через 1 разделитель!');
                }
            } else {
                updateAction.push({
                    inputId: order[idxTo],
                    value: currentDropPosition.subStrBefore,
                });
                updateAction.push({
                    inputId: order[idxTo + 1],
                    value: [
                        currentDropPosition.subStrAfter,
                        this._inputs.getRecordById(order[idxTo + 1]).get('model').displayValue,
                    ]
                        .join(' ')
                        .trim(),
                });
            }
        } else {
            // перемещение разделителя вправо
            if (Math.abs(idxFrom - idxTo) > 1) {
                // log('перетащили вправо через 1 разделитель!');
            } else {
                updateAction.push({
                    inputId: order[idxTo],
                    value: currentDropPosition.subStrAfter,
                });
                updateAction.push({
                    inputId: order[idxFrom],
                    value: [
                        this._inputs.getRecordById(order[idxFrom]).get('model').displayValue,
                        currentDropPosition.subStrBefore,
                    ]
                        .join(' ')
                        .trim(),
                });
            }
        }
        return updateAction;
    }

    private _updateValuesOnDrag(updateAction: IDragAction[]): void {
        if (updateAction.length) {
            updateAction.forEach((action: IDragAction) => {
                const record = this._inputs.getRecordById(action.inputId);
                this._updateInput(record, action.value);
                this._updateFakeField(record, action.value);
            });
            this._dropPositions = Input._calcPossibleDropPositions(
                this._options.inputOrder,
                this._inputs,
                this._getSeparatorWidth(),
                this._getTextWidth.bind(this)
            );
            this._notifyValueChanged();
        }
    }

    /**
     * Хелпер для нахождения ближайшей к смещению offset drop-позиции.
     * @param {Number} offset смещение от начала контейнера компонента
     * @param {ISpacePosition[]} dropPositions массив с описанием точек для дропа разделителя
     * @result {number} индекс ближайшей drop-позиции в массиве dropPositions
     * @private
     */
    protected _getSeparatorPosition(offset: number, dropPositions: ISpacePosition[]): number {
        let pos = 0;
        while (dropPositions[pos] && dropPositions[pos].offset <= offset) {
            pos++;
        }
        let rightPointPosition: number;
        let leftPointPosition: number;
        let separatorPosition: number = pos - 1;
        if (dropPositions[pos]) {
            rightPointPosition = pos;
            leftPointPosition = pos - 1 >= 0 ? pos - 1 : pos;
            const leftDistance = Math.abs(dropPositions[leftPointPosition].offset - offset);
            const rightDistance = Math.abs(dropPositions[rightPointPosition].offset - offset);
            separatorPosition =
                leftDistance <= rightDistance ? leftPointPosition : rightPointPosition;
        }
        return separatorPosition;
    }

    /**
     * Инициализирует рекордсет модели отображения записями, указанными в options.fields.
     * @param {IInputOptions} options опции контрола
     * @private
     */
    protected _initViewModel(options: IInputOptions): void {
        const placeholders = options.placeholders || [];
        const data = [
            {
                id: 'lastName',
                model: null,
                placeholder: placeholders[0] || INPUT_ID_PLACEHOLDER.lastName,
            },
            {
                id: 'firstName',
                model: null,
                placeholder: placeholders[1] || INPUT_ID_PLACEHOLDER.firstName,
            },
            {
                id: 'middleName',
                model: null,
                placeholder: placeholders[2] || INPUT_ID_PLACEHOLDER.middleName,
            },
        ];
        const rawData = data.filter((value) => {
            if (options.fields.indexOf(value.id) !== -1) {
                value.model = new TextViewModel(this._modelOptions, options.value[value.id] || '');
                return true;
            }
        });
        this._inputs = new RecordSet({ rawData, keyProperty: 'id' });
    }

    /**
     * Обновляет значения в модели отображения в зависимости от опций компонента.
     * @param {IInputOptions} options опции контрола
     * @private
     */
    protected _updateViewModel(options: IInputOptions): void {
        if (
            !isEqual(options.fields, this._options.fields) ||
            !isEqual(options.placeholders, this._options.placeholders)
        ) {
            this._initViewModel(options);
        }
        if (options.value !== this._options.value) {
            this._inputs.each((input) => {
                const name = input.get('id');
                if (input.get('model').displayValue !== options.value[name]) {
                    this._updateInput(input, options.value[name]);
                    this._updateFakeField(input, options.value[name]);
                }
            });
        }
        if (JSON.stringify(options.inputOrder) !== JSON.stringify(this._options.inputOrder)) {
            this._inputOrderString = Input._prepareInputOrderString(options.inputOrder);
        }
    }

    /**
     * Обновление значения и ширины поля ввода (в зависимости от значения value) в записи модели.
     * @param {Record} record запись, соответствующая полю ввода
     * @param {String} value новое значение в поле ввода
     * @private
     */
    protected _updateInput(record: Record, value: string): Record {
        record.get('model').value = value;
        record.set({ width: this._getTextWidth(value) });
        return record;
    }

    /**
     * Определение ширины текста text для авторазмеров поля ввода.
     * @param {string} text текст, ширину которого нужно посчитать
     * @private
     */
    protected _getTextWidth(text: string): number {
        this._children.buffer.innerText = text;
        let width = this._children.buffer.getBoundingClientRect().width;
        if (!width && text) {
            const textElement = document.createElement('span');
            textElement.style.fontSize = `var(--font-size_${this._options.fontSize})`;
            textElement.innerText = text;
            width = getWidth(textElement);
        }
        return width;
    }

    /**
     * Ограничение вводимых с клавиатуры символов в поле ФИО
     * @param {string} key символ/клавиша, которую нажали
     * @static
     */
    static _inputConstraint(key: string): boolean {
        return key.length >= 1;
    }

    /**
     * Возвращает объект с описанием выделения {start, end, length} в поле ввода input.
     * @param {HTMLInputElement} input поле ввода
     * @static
     */
    static _getSelection(input: HTMLInputElement): ISelection {
        const selection = {
            start: input.selectionStart,
            end: input.selectionEnd,
            length: 0,
        };
        selection.length = selection.end - selection.start;
        return selection;
    }

    /**
     * Устанавливает курсор в поле ввода в нужную позицию
     * @param {HTMLElement} input поле ввода
     * @param {number} position позиция курсора в поле ввода
     * @static
     */
    static _setCaretPosition(input: Field<string, ITextViewModelOptions>, position: number): void {
        input.activate();
        input.setSelectionRange(position, position);
    }

    static _prepareInputOrderString(inputOrder: string[]): string {
        const result = [];
        inputOrder.forEach((inputId) => {
            result.push(INPUT_ID_PLACEHOLDER[inputId]);
        });
        return result.join(' ');
    }

    /**
     * Если возможно, возвращает идентификатор поля, следующего за переданным полем ввода,
     * либо переданный идентификатор, если следующее поля отсутствует.
     * @param {string[]} inputOrder массив с порядком полей ввода в компоненте
     * @param {string} inputId последнее активное поле воода
     * @static
     */
    static _getNextInput(inputOrder: string[], inputId: string): string {
        let inputPosition: number = inputOrder.indexOf(inputId);
        if (inputPosition !== -1) {
            if (inputPosition < inputOrder.length - 1) {
                inputPosition++;
            }
            return inputOrder[inputPosition];
        }
        return inputId;
    }

    /**
     * Заполняет dropPositions объектами с описаниями возможных позиций для переноса разделителя при DragNDrop.
     * @private
     */
    static _calcPossibleDropPositions(
        inputOrder: string[],
        inputs: RecordSet,
        separatorWidth: number,
        getTextWidth: Function
    ): ISpacePosition[] {
        // первая позиция - начало слова.
        const dropPositions = [
            {
                offset: 0,
                subStrBefore: '',
                subStrAfter: inputs.getRecordById(inputOrder[0]).get('model').displayValue.trim(),
                inputId: inputOrder[0],
                separator: null,
            },
        ];
        // рассчет остальных позиций
        let previousInputsWidth = 0;
        // regexp ищет беспробельные последовательности в строке
        const regex = /\S+/g;
        inputOrder.forEach((inputId, index) => {
            const input = inputs.getRecordById(inputId);
            const value = input.get('model').displayValue;
            let result = regex.exec(value);
            let subStrBefore;
            let subStrAfter;
            while (result) {
                // предрассчет подстрок для простоты вычислений при DnD.
                subStrBefore = value.slice(0, result.index + result[0].length);
                subStrAfter = value.slice(result.index + result[0].length).trim();
                dropPositions.push({
                    offset: previousInputsWidth + getTextWidth(subStrBefore),
                    subStrBefore,
                    subStrAfter,
                    inputId,
                    separator: null,
                });
                result = regex.exec(value);
                // для последнего найденного слова ставим индекс разделителя
                if (!result) {
                    dropPositions[dropPositions.length - 1].separator = index;
                }
            }
            let width = input.get(value ? 'width' : 'placeholderWidth');
            if (!width) {
                width = getTextWidth(input.get(value ? 'value' : 'placeholder')) || 0;
            }
            previousInputsWidth += width + separatorWidth;
        });
        return dropPositions;
    }

    /**
     * Подготавливает строковое значение при втавке из буфера обмена, чтобы оно удовлетворяло ограничениям при вводе.
     * @param {string} pasteValue исходная строка, вставляемая в поле ввода
     * @static
     */
    static _preparePasteValue(pasteValue: string): string {
        // при вставке из Excel с строке могут присутствовать символы табуляции
        // символы перевода строки нужно заменить на пробелы
        const pasteString = pasteValue.replace(/[\t\n]/g, ' ');
        return Input._filterInputValue(pasteString);
    }

    static _filterInputValue(inputValue: string): string {
        let result: string = '';
        for (let idx = 0; idx < inputValue.length; idx++) {
            if (Input._inputConstraint(inputValue.charAt(idx))) {
                result += inputValue.charAt(idx);
            }
        }
        return result;
    }

    static getOrder(fields: string[]): string[] {
        if (fields.length === 3) {
            return fields;
        }
        const orders = [...fields];
        DEFAULT_ORDER.forEach((order) => {
            if (!orders.includes(order)) {
                orders.push(order);
            }
        });
        return orders;
    }

    static _inputPaste(input: HTMLInputElement, pasteValue: string, maxLength: number): string {
        const selection = Input._getSelection(input);
        const inputValue: string = input.value;
        const pasteMaxLength = maxLength - (inputValue.length - selection.length);
        return (
            inputValue.substring(0, selection.start) +
            (pasteValue.length <= pasteMaxLength
                ? pasteValue
                : pasteValue.substring(0, pasteMaxLength)) +
            inputValue.substring(selection.end)
        );
    }

    static _getStringValue(
        inputOrder: string[],
        inputs: RecordSet,
        paste?: { id: string; value: string }
    ): string {
        const value = [];
        inputOrder.forEach((inputId) => {
            const inputValue: string =
                paste && paste.id === inputId
                    ? paste.value
                    : inputs.getRecordById(inputId).get('model').displayValue;
            if (inputValue.length) {
                value.push(inputValue);
            }
        });
        return value.join(' ');
    }

    static updateInputValue(field: HTMLInputElement, value: string): void {
        if (field.value !== value) {
            field.value = value;
        }
    }

    static getDefaultOptions(): IInputOptions {
        const defaultOptions: IInputOptions = Base.getDefaultOptions() as IInputOptions;
        defaultOptions.fields = ['lastName', 'firstName', 'middleName'];
        defaultOptions.value = {};
        defaultOptions.inputOrder = ['lastName', 'firstName', 'middleName'];
        defaultOptions.reorderButtonSize = 's';
        defaultOptions.autoComplete = '';
        return defaultOptions;
    }
}

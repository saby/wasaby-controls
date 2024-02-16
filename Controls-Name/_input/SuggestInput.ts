import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Record } from 'Types/entity';
import * as clone from 'Core/core-clone';
import * as template from 'wml!Controls-Name/_input/SuggestInput/SuggestInput';
import { INameValue } from './interface/IInput';
import { ISuggestInput } from './interface/ISuggestInput';
import { default as Input, DEFAULT_ORDER } from 'Controls-Name/_input/Input';
import { delay } from 'Types/function';
import { constants } from 'Env/Env';
import { TextViewModel, IBase } from 'Controls/input';
import { Logger } from 'UI/Utils';

/**
 * Компонент для ввода российских и иностранных ФИО, представляет собой поле ввода с разделителями внутри,
 * благодаря которым сразу видно что является фамилией, что именем, а что отчеством.
 * @class Controls-Name/Input
 * @extends UI/Base:Control
 * @mixes Controls/interface:IBorderStyle
 * @mixes Controls/interface:IFontWeight
 * @mixes Controls/_interface/IFilter
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/input:IBorderVisibility
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_interface/IHeight
 * @mixes Controls/interface:IValidationStatus
 * @mixes Controls/interface:ISuggest
 * @mixes Controls/interface:ISource
 * @mixes Controls/_input/interface/ITag
 * @mixes Controls-Name/_input/interface/ISuggestInput
 * @demo Controls-Name-demo/Demo/Index
 * @control
 * @public
 */
export class SuggestInput extends Control<ISuggestInput> implements IBase {
    readonly '[Controls/_input/interface/IBase]': boolean = true;
    protected _template: TemplateFunction = template;
    _children: {
        input: Input;
    };
    // состояние видимости автодополнения
    protected _suggestVisible: boolean = false;
    // часть ФИО, для которой был произведен последний поиск в автодополнении,
    // нужен, чтобы при выборе из списка вставить значение в нужную часть ФИО
    private _lastFinishedInputType: string = '';
    // массив хранит текущий тип поля ввода для поиска в автодополнении
    private _searchState: string[] = [];
    // активное поле ввода компонента
    private _activeInput: string = '';
    // Объект со значениями полей firstName, middleName, lastName из опций.
    private _value: INameValue = {};
    // Массив с текущим порядком полей ввода частей ФИО
    private _inputOrder: string[];
    // Флаг отображения кнопки сброса порядка полей (опция _inputOrder) к стандартному.
    protected _showReorderButton: boolean = false;
    // Объект с значением полей ФИО из опций на момент последнего запроса порядка полей в компоненте.
    // Нужен, чтобы не спамить запросами бизнес-логику.
    private _previousValueState: INameValue = {};
    // Фильтр для запроса автодополнения. Компонент добавляет поля 'hintFieldValue', 'hintFieldType'.
    private _filter: {
        hintFieldType?: string;
        hintFieldValue?: string;
        value?: INameValue;
    } = {};
    private _chooseEventFired: boolean = false;

    protected _beforeMount(options: ISuggestInput): void {
        const { filter, fields } = options;
        this._searchStart = this._searchStart.bind(this);
        this._searchEnd = this._searchEnd.bind(this);
        this._initOptions(options);
        this._initInputOrder(fields);
        const firstInput = this._inputOrder[0];
        const input = new Record({
            rawData: {
                id: firstInput,
                model: new TextViewModel({}, this._value[firstInput]),
            },
        });
        this._updateFilter(input, filter, this._value);
    }

    protected _beforeUpdate(options: ISuggestInput): void {
        this._initOptions(options);
    }

    /**
     * Инициализация/обновление состояния ФИО.
     * @param {string} firstName
     * @param {string} middleName
     * @param {string} lastName
     * @private
     */
    protected _initOptions(options: ISuggestInput): void {
        const firstName = options.value?.firstName || options.firstName;
        const middleName = options.value?.middleName || options.middleName;
        const lastName = options.value?.lastName || options.lastName;

        this._value = {
            firstName: firstName || '',
            middleName: middleName || '',
            lastName: lastName || '',
        };
    }

    protected _initInputOrder(fields: string[]): void {
        // Порядок разделов меняется:
        // - при нажании кнопки сброса порядка,
        // - при очищении поля ввода.
        this._inputOrder = DEFAULT_ORDER.filter((inputId: string) => {
            return fields.indexOf(inputId) !== -1;
        });
        this._showReorderButton = false;
        // Обновим сохраненное состояние ФИО, чтобы не спамить БЛ лишними запросами при деактивании компонента.
        this._previousValueState = clone(this._value);
    }

    /**
     * Метод обработки выбора записи в автодополнении.
     * @param {SyntheticEvent<Event>} event дескриптор события
     * @param {Types/entity:Record} item выбранная в автодополнении запись
     * @private
     */
    protected _chooseHandler(event: SyntheticEvent<Event>, item: Record): void {
        // Остановка всплытия события из дочернего контрола Controls.suggest:_InputController необходима для
        // предотвращения дублирования всплытия события "choose".
        event.stopPropagation();
        this._chooseEventFired = true;
        this._notify('genderChanged', [item.get('gender')]);
        // возвращаем фокус в поле ввода ФИО после выбора из списка
        this._children.input.activate({ activateNext: true });
        // На iPad откладываем обновление значения поля ввода и событие "choose" на следующий цикл перерисовки.
        // Изменение значения в поле ввода приводит к изменению его ширины и смещению идущих за ним полей.
        // Одновременное смещение input-а и переход фокуса в iPad может привести к неверному позиционированию курсора.
        // https://online.sbis.ru/opendoc.html?guid=0ffb5994-07eb-43ae-bec5-9103f88a294e
        if (constants.browser.isMobileSafari) {
            delay(() => {
                this._chooseCallback(item);
            });
        } else {
            this._chooseCallback(item);
        }
    }

    /**
     * Обновление значений в поле ввода после выбора из автодополнения.
     * @param {Types/entity:Record} item запись, выбранная в автодополнении
     * @private
     */
    protected _chooseCallback(item: Record): void {
        const value = this._valueFromRecord(item);
        this._notifyValueChanged(value);
        this._notify('valueChanged', [value[this._activeInput], value, item]);
        this._notify('choose', [item]);
    }

    /**
     * Потификация события "fieldName"Changed для работы биндингов на опции компонента.
     * @param {INameValue} value заполненный объект со значениями частей ФИО
     * @private
     */
    private _notifyValueChanged(value: INameValue): void {
        const names = ['firstName', 'lastName', 'middleName'];
        names.forEach((name: string) => {
            if (this._options[name] !== value[name]) {
                this._notify([name, 'Changed'].join(''), [value[name], value]);
            }
        });
    }

    /**
     * Возвращает новое значение компонента после выбора записи item из автодополнения
     * В поле displayProperty приходит выбранное значение автодополнения:
     * - Строковое значение записывается в соответствующую часть ФИО.
     * - В случае передачи объекта с полями [firstName, middleName, lastName] обновляются все части ФИО.
     * @param {Record} item выбранная запись из автодополнения
     * @private
     */
    private _valueFromRecord(item: Record): INameValue {
        let value = clone(this._value);
        const itemValue = item.get(this._options.displayProperty || '');
        if (typeof itemValue === 'string') {
            value[this._lastFinishedInputType || this._activeInput] = itemValue;
        } else if (typeof value === 'object') {
            // TODO возможно, нужно присваивать только поля firstName, middleName, lastName
            value = clone(itemValue);
        }
        return value;
    }

    protected _validateInputOrder(): void {
        if (this._inputOrder.length === 3) {
            if (
                (this._inputOrder[0] === 'middleName' && this._inputOrder[1] === 'firstName') ||
                (this._inputOrder[0] === 'firstName' && this._inputOrder[1] === 'lastName')
            ) {
                const tmp = this._inputOrder[1];
                this._inputOrder[1] = this._inputOrder[2];
                this._inputOrder[2] = tmp;
            }
        }
    }

    protected _deactivatedHandler(): void {
        this._suggestVisible = false;

        if (this._options.source) {
            // проверка для того, чтобы избежать лишних запросов к источнику на БЛ.
            if (JSON.stringify(this._previousValueState) !== JSON.stringify(this._value)) {
                this._previousValueState = clone(this._value);
                this._chooseEventFired = false;
                this._options.source
                    .create({
                        ...this._value,
                        order: Input.getOrder(this._options.fields),
                    })
                    .then((item: Record) => {
                        // FIXME: если в асинхронном запросе порядка полей ФИО выбрали из автодополнения,
                        // нельзя будет сравнить исходные значения полей с данными с БЛ,
                        // а если сохранять состояние (_previousValueState) и сравнивать его,
                        // то потеряются изменения, выбранные из автодополнения.
                        // Пока решаем проблему тем, что игнорируем коллбэк.
                        if (this._chooseEventFired) {
                            this._chooseEventFired = false;
                            return;
                        }
                        this._inputOrder = this._getInputOrder(item, this._options.fields);
                        let countFilledFields = 0;
                        let countReceivedFields = 0;
                        // обновляем значения из результата метода
                        this._options.fields.forEach((fieldName) => {
                            const newValue = item.get(fieldName);
                            if (this._value[fieldName]) {
                                countFilledFields++;
                            }
                            if (newValue) {
                                countReceivedFields++;
                            }

                            this._value[fieldName] = newValue;
                        });

                        if (countReceivedFields === 1) {
                            this._validateInputOrder();
                        }

                        // Если изначально заполненных полей было больше чем пришло с бл, то кидаем ошибку
                        // https://online.sbis.ru/opendoc.html?guid=e551e6e3-2c8b-45f1-adc5-3ed64890b581
                        if (
                            this._options.fields.length === DEFAULT_ORDER.length &&
                            countFilledFields > countReceivedFields
                        ) {
                            Logger.warn(
                                'Name.Input: Источник данных вернул неправильное значение. ' +
                                    'С БЛ вернулось меньшее количество полей, это могло привести к некорректной ' +
                                    'работе контрола. Проверьте работу источника данных.'
                            );
                        }

                        this._showReorderButton = !this._isOrderDefault(
                            this._inputOrder,
                            this._options.fields
                        );

                        this._notifyValueChanged(this._value);
                        this._notify('valueChanged', [
                            this._value[this._activeInput],
                            this._value,
                            item,
                        ]);
                        this._notify('genderChanged', [item.get('gender')]);
                        this._notify('dataReceived', [item]);
                    });
            }
        }
    }

    protected _dataReceivedHandler(e: SyntheticEvent, item: Record): void {
        this._notify('genderChanged', [item.get('gender')]);
        this._notify('dataReceived', [item]);
        DEFAULT_ORDER.forEach((name) => {
            const value = item?.get(name);
            if (value) {
                this._value[name] = value;
            }
        });
        this._previousValueState = clone(this._value);
    }

    // коллбэк на начало поиска в автодополнении
    private _searchStart(): void {
        this._searchState.push(this._activeInput);
    }

    // коллбэк на конец поиска в автодополнении
    private _searchEnd(): void {
        this._lastFinishedInputType = this._searchState.pop() || this._activeInput;
    }

    protected _valueChangedHandler(
        event: SyntheticEvent<Event>,
        stringValue: string,
        value: INameValue,
        input: Record
    ): void {
        event.preventDefault();
        // обновление состояния: активной части ввода ФИО и фильтра для автодополнения
        if (input) {
            this._updateFilter(input, this._options.filter, value);
        }

        if (!value.firstName && !value.lastName && !value.middleName) {
            this._initInputOrder(this._options.fields);
        }

        this._notifyValueChanged(value);
        this._notify('valueChanged', [stringValue, value, input]);
    }

    protected _inputFocusHandler(event: SyntheticEvent<Event>, input: Record): void {
        this._updateFilter(input, this._options.filter, this._value);
    }

    /**
     * Определение нового порядка следования полей в ФИО по записи item относительно текущего порядка.
     * @param {Types/entity:Record} item запись, содержащая поля ФИО
     * @param {string[]} fields набор доступных полей в поле ФИО.
     * @private
     */
    private _getInputOrder(item: Record, fields: string[]): string[] {
        return (item.get('order') || DEFAULT_ORDER).filter((inputId: string) => {
            return fields.indexOf(inputId) !== -1;
        });
    }

    /**
     * Определяет является ли текущий порядок порядком по-умолчанию в поле ввода ФИО.
     * @param {string[]} inputOrder текущий порядок в поле ФИО
     * @param {string[]} fields набор доступных полей в поле ФИО
     * @private
     */
    private _isOrderDefault(inputOrder: string[], fields: string[]): boolean {
        const defaultOrder = DEFAULT_ORDER.filter((inputId: string) => {
            return fields.indexOf(inputId) !== -1;
        });
        return JSON.stringify(inputOrder) === JSON.stringify(defaultOrder);
    }

    /**
     * Обработчик нажатия кнопки упорядочивания полей ФИО.
     * @private
     */
    protected _reorderHandler(): void {
        this._initInputOrder(this._options.fields);
    }

    /**
     * Обновление состояния фильтра и типа активного поля ввода ФИО.
     * @param {Record} input - запись с параметрами поля ввода
     * @param {object} filter - объект с фильтром, указанным в опциях компонента.
     * @param {INameValue} value - объект со значениями полей ФИО.
     * @private
     */
    private _updateFilter(input: Record, filter: object, value: INameValue): void {
        if (
            this._activeInput !== input.get('id') ||
            this._filter.hintFieldValue !== input.get('model').displayValue
        ) {
            this._activeInput = input.get('id');
            this._filter = clone(filter || {});
            this._filter.hintFieldType = input.get('id');
            this._filter.hintFieldValue = input.get('model').displayValue;
            this._filter.value = value;
        }
    }

    static defaultProps: ISuggestInput = {
        // Необходимо для того, чтобы скрыть кнопку показать все от suggest
        // это официальное предложение от разработчиков suggest
        // ts-ignore уйдет после https://online.sbis.ru/opendoc.html?guid=b8d731d4-8bfe-473a-93ed-28e430257dd7
        // @ts-ignore
        footerTemplate: null,
        fields: ['lastName', 'firstName', 'middleName'],
    };
}

/**
 * @name Controls-Name/Input#placeholders
 * @cfg {String[]} Содержит текст подсказки для полей ввода ФИО. Передается в формате [lastName, firstName, middleName]
 */

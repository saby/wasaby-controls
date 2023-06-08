/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { Model } from 'Types/entity';
import { editing } from 'Controls/list';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблиц} с возможностью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 *
 * @public
 * @see Controls/editableArea:View
 * @remark
 * Разница между этим интерфейсом и {@link Controls/editableArea:View Controls/editableArea:View} заключается в том, что первый используется в списках, а второй — вне их (например, на вкладках).
 */
export interface IEditableGrid {
    /**
     * @name Controls/_grid/interface/IEditableGrid#editingConfig
     * @cfg {Controls/grid:IGridEditingConfig | undefined} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
     * @demo Controls-demo/gridNew/EditInPlace/Toolbar/Index
     */

    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @function
     * @param {Controls/grid:IItemEditOptions} options Параметры редактирования.
     * @returns {TAsyncOperationResult}
     * @remark
     * Используйте этот метод в ситуациях, когда вы хотите начать редактирование из нестандартного места, например, из {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ панели действий элемента}.
     *
     * Promise разрешается после монтирования контрола в DOM.
     *
     * Перед запуском редактирования по месту происходит событие {@link beforeBeginEdit}, а после запуска — {@link afterBeginEdit}.
     *
     * Формат полей редактируемой записи может отличаться от формата полей {@link Types/Collection:RecordSet}, отображаемый списком. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-edit-format здесь}.
     * @example
     * В следующем примере показано, как начать редактирование элемента.
     * <pre class="brush: html;">
     * <!-- WML -->
     * <Controls.grid:View name="grid" />
     * </pre>
     * <pre class="brush: js;">
     * // JavaScript
     * foo: function() {
     *    this._children.grid.beginEdit({
     *       item: this._items.at(0)
     *    });
     * }
     * </pre>
     * @see beginAdd
     * @see commitEdit
     * @see cancelEdit
     * @see beforeBeginEdit
     * @see afterBeginEdit
     */
    beginEdit(options?: IItemEditOptions): TAsyncOperationResult;

    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ добавление по месту}.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @function
     * @param {Controls/grid:IItemAddOptions} options Параметры добавления.
     * @returns {TAsyncOperationResult}
     * @remark
     * Promise разрешается после монтирования контрола в DOM.
     *
     * Перед запуском добавления по месту происходит событие {@link beforeBeginEdit}, а после запуска — {@link afterBeginEdit afterBeginEdit}.
     *
     * Вы можете задать позицию, в которой отображается шаблон редактирования строки. Для этого в опции {@link editingConfig} установите значение для параметра {@link Controls/grid:IGridEditingConfig#addPosition addPosition}. Шаблон редактирования строки может отображаться в начале и в конце списка, группы (если включена {@link Controls/interface/IGroupedList#groupProperty группировка}) или узла (для иерархических списков).
     *
     * В случае, когда метод beginAdd вызван без аргументов, добавляемая запись будет создана при помощи установленного на списке источника данных путем вызова у него метода {@link Types/source:ICrud#create create}.
     * @demo Controls-demo/gridNew/EditInPlace/EditingCell/Index
     * @example
     * В следующем примере показано, как начать добавление элемента.
     *
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.grid:View name="grid" />
     * </pre>
     *
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.grid.beginAdd();
     * }
     * </pre>
     * @see beginEdit
     * @see commitEdit
     * @see cancelEdit
     * @see beforeBeginEdit
     * @see afterBeginEdit
     */
    beginAdd(options?: IItemAddOptions): TAsyncOperationResult;

    /**
     * Завершает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование/добавление по месту} с сохранением введенных данных.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @function
     * @returns {TAsyncOperationResult}
     * @remark
     * Используйте этот метод, когда вы хотите завершить редактирование в ответ на действие пользователя, например, когда пользователь пытается закрыть диалоговое окно, используйте этот метод для сохранения изменений.
     *
     * Promise разрешается после монтирования контрола в DOM. Если редактирование успешно завершилось, то Promise ничего не возвращает.
     *
     * При завершении редактирования по месту происходят события, подробнее о которых читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/events/ здесь}.
     * @example
     * В следующем примере показано, как завершить редактирование и сохранить изменения.
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.grid:View name="grid" />
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.grid.commitEdit();
     * }
     * </pre>
     * @see beginEdit
     * @see beginAdd
     * @see cancelEdit
     */
    commitEdit(): TAsyncOperationResult;

    /**
     * Завершает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование/добавление по месту} без сохранения введенных данных.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @function
     * @returns {TAsyncOperationResult}
     * @remark
     * Используйте этот метод, когда вы хотите завершить редактирование или добавление в ответ на действия пользователя, например, когда пользователь нажимает на кнопку "Отмена".
     *
     * Promise разрешается после монтирования контрола в DOM.
     *
     * При завершении редактирования по месту происходят события, подробнее о которых читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/events/ здесь}.
     * @example
     * В следующем примере показано, как завершить редактирование и отменить изменения.
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.grid:View name="grid" />
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.grid.cancelEdit();
     * }
     * </pre>
     * @see beginEdit
     * @see beginAdd
     * @see commitEdit
     */
    cancelEdit(): TAsyncOperationResult;
}

export interface IEditableGridOptions {
    editingConfig?: IGridEditingConfig;
}

/**
 * @typedef {Enum} TEditingMode
 * @description Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#mode mode}.
 * @variant row Редактирование всей строки.
 * @variant cell Редактирование отдельных ячеек.
 */
type TEditingMode = 'row' | 'cell';

/**
 * Интерфейс объекта-конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту} в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицах}.
 * @interface Controls/_grid/interface/IGridEditingConfig
 * @implements Controls/list:IEditingConfig
 * @public
 */
export interface IGridEditingConfig {
    autoAddOnInit?: boolean;
    editOnClick?: boolean;
    autoAdd?: boolean;
    autoAddByApplyButton?: boolean;
    sequentialEditing?: boolean;
    /**
     * @name Controls/_grid/interface/IGridEditingConfig#sequentialEditingMode
     * @cfg {Controls/_grid/interface/IEditableGrid/TSequentialEditingMode.typedef} Автоматический запуск редактирования по месту для следующего элемента, происходящий при завершении редактирования любого (кроме последнего) элемента списка.
     * @default row
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#edit здесь}.
     */
    sequentialEditingMode?: TSequentialEditingMode;
    toolbarVisibility?: boolean;
    backgroundStyle?: string;
    addPosition?: TAddPosition;
    /**
     * @name Controls/_grid/interface/IGridEditingConfig#mode
     * @cfg {Controls/_grid/interface/IEditableGrid/TEditingMode.typedef} Режим редактирования таблицы.
     * @default row
     * @demo Controls-demo/gridNew/EditInPlace/SingleCellEditable/Index
     * @demo Controls-demo/gridNew/EditInPlace/EditingCell/Index
     */
    mode?: TEditingMode;
    item?: Model;
}

/**
 * @typedef {Promise<void | IOperationCanceledResult>} TAsyncOperationResult
 * @description Результат выполнения методов {@link beginAdd}, {@link beginEdit}, {@link cancelEdit} и {@link commitEdit}.
 */
type TAsyncOperationResult = Promise<void | IOperationCanceledResult>;

/**
 * @typedef {Enum} Controls/_grid/interface/IEditableGrid/TSequentialEditingMode
 * @description Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#sequentialEditingMode sequentialEditingMode}.
 * @variant row Запускать редактирование в следующей строке, при завершении текущего редактирования.
 * @variant cell Запускать редактирование в следующей ячейке, при завершении текущего редактирования.
 * @variant none Не запускать новое редактирование, при завершении текущего редактирования.
 */
type TSequentialEditingMode = 'row' | 'cell' | 'none';

/**
 * @typedef {Object} IOperationCanceledResult
 * @description Объект, который может возвращать Promise при вызове методов {@link beginAdd}, {@link beginEdit}, {@link cancelEdit} и {@link commitEdit}.
 * @property {Boolean} canceled Свойство установлено в значение true при отмене:
 *
 * * завершения редактирование/добавление по месту без сохранения введенных данных.
 * * запуска добавления по месту.
 * * запуска редактирования по месту.
 * * при ошибке валидации.
 */
interface IOperationCanceledResult {
    canceled: true;
}

/**
 * @typedef {Enum} TAddPosition
 * @description Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#addPosition addPosition}.
 * @variant top В начале.
 * @variant bottom В конце.
 */
type TAddPosition = 'top' | 'bottom';

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/add/ добавления по месту}.
 * @interface Controls/_grid/interface/IItemAddOptions
 * @public
 */
export interface IItemAddOptions {
    /**
     * @name Controls/_grid/interface/IItemAddOptions#item
     * @cfg {Types/entity:Model} Запись, которая будет запущена на добавление.
     * @remark Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на добавление вместо первоначальной.
     */
    item?: Model;
    /**
     * @name Controls/_grid/interface/IItemAddOptions#targetItem
     * @cfg {Types/entity:Model} Запись списка, рядом с которой будет запущено добавление по месту.
     */
    targetItem?: Model;
    /**
     * @name Controls/_grid/interface/IItemAddOptions#shouldActivateInput
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта добавления.
     */
    shouldActivateInput?: boolean;
    /**
     * @name Controls/_grid/interface/IItemAddOptions#addPosition
     * @cfg {TAddPosition} Позиция добавляемой записи. В случае, если в параметрах был передан targetItem, позиция определяется относительно его, иначе — всего списка.
     */
    addPosition?: TAddPosition;
    /**
     * @name Controls/_grid/interface/IItemAddOptions#columnIndex
     * @cfg {Number} Индекс редактируемой ячейки при запуске добавления по месту. Опция актуальна к использованию, когда опция {@link Controls/grid:IGridEditingConfig#mode mode} установлена в значение "cell".
     * @remark Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-edit-cell здесь}.
     * @default undefined
     */
    columnIndex?: number;
}

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту}.
 * @interface Controls/_grid/interface/IItemEditOptions
 * @public
 */
export interface IItemEditOptions {
    /**
     * @name Controls/_grid/interface/IItemEditOptions#item
     * @cfg {Types/entity:Model} Запись, которая будет запущена на редактирование.
     * @remark
     * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на редактирование вместо первоначальной.
     */
    item?: Model;
    /**
     * @name Controls/_grid/interface/IItemEditOptions#shouldActivateInput
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта редактирования.
     */
    shouldActivateInput?: boolean;
    /**
     * @name Controls/_grid/interface/IItemEditOptions#columnIndex
     * @cfg {Number} Индекс редактируемой ячейки при запуске редактирования по месту. Опция актуальна к использованию, когда опция {@link Controls/grid:IGridEditingConfig#mode mode} установлена в значение "cell".
     * @remark Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-add-cell здесь}.
     * @default undefined
     */
    columnIndex?: number;
}

/**
 * @typedef {Object} Controls/_grid/interface/IEditableGrid/IBeforeBeginEditEventResultOptions
 * @description Тип объекта, который можно вернуть из обработчика события {@link beforeBeginEdit}.
 * @property {Types/entity:Model} [item=undefined] Запись, которая будет запущена на редактирование/добавление.
 */
interface IBeforeBeginEditEventResultOptions {
    item?: Model;
}

/**
 * @typedef {String | IBeforeBeginEditEventResultOptions} TBeforeBeginEditEventSyncResult
 * @description Синхронные значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}.
 * @variant 'Сancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_grid/interface/IEditableGrid/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
type TBeforeBeginEditEventSyncResult =
    | editing.CANCEL
    | IBeforeBeginEditEventResultOptions;

/**
 * @typedef {TBeforeBeginEditEventSyncResult | Promise<TBeforeBeginEditEventSyncResult>} TBeforeBeginEditEventResult
 * @description Значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}.  Результат также можно возвращать в виде Promise.
 * @variant 'Сancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_grid/interface/IEditableGrid/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
export type TBeforeBeginEditEventResult =
    | TBeforeBeginEditEventSyncResult
    | Promise<TBeforeBeginEditEventSyncResult>;

/**
 * @typedef {String | undefined} TBeforeEndEditEventSyncResult
 * @description Синхронные значения, которые можно возвращать из обработчика события {@link beforeEndEdit}.
 * @variant 'Сancel' Отмена окончания редактирования/добавления по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
type TBeforeEndEditEventSyncResult = editing.CANCEL | undefined;

/**
 * @typedef {TBeforeEndEditEventSyncResult | Promise<TBeforeEndEditEventSyncResult>} TBeforeEndEditEventResult
 * @description Значения, которые можно возвращать из обработчика события {@link beforeEndEdit}. Результат также можно возвращать в виде Promise.
 * @variant 'Сancel' Отменить редактирование/добавление по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
export type TBeforeEndEditEventResult =
    | TBeforeEndEditEventSyncResult
    | Promise<TBeforeEndEditEventSyncResult>;

/**
 * @event Controls/_grid/interface/IEditableGrid#beforeBeginEdit Происходит перед запуском {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/grid:IItemEditOptions | Controls/grid:IItemAddOptions} options Параметры редактирования.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAdd autoAdd});
 *     * только что добавленного элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @returns {TBeforeBeginEditEventResult}
 * @example
 * В следующем примере показано, как запретить редактирование элемента, если он соответствует условию:
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.grid:View on:beforeBeginEdit="beforeBeginEditHandler()" />
 * </pre>
 * <pre class="brush: js; highlight: [4,5,6,7,8]">
 * // JavaScript
 * define('ModuleName', ['Controls/list'], function(constants) {
 *    ...
 *    beforeBeginEditHandler: function(e, options) {
 *       if (options.item.getId() === 1) {
 *          return constants.editing.CANCEL;
 *       }
 *    }
 * });
 * </pre>
 * В следующем примере показано, как прочитать элемент из БЛ и открыть его для редактирования:
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.grid:View on:beforeBeginEdit="beforeBeginEditHandler()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * beforeBeginEditHandler: function(e, options) {
 *    return this.source.read(options.item.getId()).then(function(result) {
 *       return {
 *          item: result
 *       };
 *    });
 * }
 * </pre>
 * В следующем примере показано, как начать редактирование элемента, созданного на клиенте:
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.grid:View on:beforeBeginEdit="beforeBeginEditHandler()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * define('ModuleName', ['Types/entity'], function(entity) {
 *    ...
 *    beforeBeginEditHandler: function(e, options) {
 *       return {
 *          item: new entity.Model({
 *             rawData: {
 *                //Obviously, you would use something else instead of Date.now() to generate id, but we'll use it here to keep the example simple
 *                id: Date.now(),
 *                title: ''
 *             }
 *          })
 *       }
 *    }
 * });
 * </pre>
 * @see afterBeginEdit
 * @see beforeEndEdit
 * @see afterEndEdit
 * @see editingConfig
 * @markdown
 */

/**
 * @event Controls/_grid/interface/IEditableGrid#afterBeginEdit Происходит после запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Редактируемый элемент.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAdd autoAdd}).
 *     * только что добавленного элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @remark
 * Подпишитесь на событие, если необходимо что-либо сделать после начала редактирования (например, скрыть кнопку "Добавить запись").
 * Событие запускается, когда подготовка данных успешно завершена и возможно безопасно обновить пользовательский интерфейс.
 * @example
 * В следующем примере показано, как скрыть кнопку "Добавить" после начала редактирования или добавления.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.grid:View on:afterBeginEdit="afterBeginEditHandler()" />
 * <ws:if data="{{ showAddButton }}">
 *     <Controls.list:AddButton />
 * </ws:if>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * afterBeginEditHandler: function(e, item, isAdd) {
 *    this.showAddButton = false;
 * }
 * </pre>
 * @see beforeBeginEdit
 * @see beforeEndEdit
 * @see afterEndEdit
 * @markdown
 */

/**
 * @event Controls/_grid/interface/IEditableGrid#beforeEndEdit Происходит перед завершением {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Редактируемый элемент.
 * @param {Boolean} willSave Параметр принимает значение true, когда отредактированный элемент сохраняется.
 * Такое происходит в следующих случаях:
 * 1. был вызыван метод {@link commitEdit}.
 * 2. пользователь выполнил действие, которое приводит к сохранению:
 *     * закрыл с сохранением (по кнопке "сохранить", либо через методы карточки, если они есть) диалог, на котором находится список с редактируемым элементом;
 *     * начал редактирование другого элемента по клику.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAdd autoAdd});
 *     * только что добавленного элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @returns {Controls/_grid/interface/IEditableGrid/TBeforeEndEditEventResult.typedef}
 * @remark
 * Используйте событие, если необходимо проверить данные и отменить изменения. По умолчанию для сохранения изменений вызывается метод обновления списка.
 * Не обновляйте пользовательский интерфейс в обработчике этого события, потому что если во время подготовки данных произойдет ошибка, вам придется откатить изменения.
 * @example
 * В следующем примере показано завершение редактирования элемента, если выполнено условие.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.grid:View on:beforeEndEdit="beforeEndEditHandler()" />
 * </pre>
 * <pre class="brush: js; highlight: [4,5,6,7,8]">
 * // JavaScript
 * define('ModuleName', ['Controls/list'], function(constants) {
 *    ...
 *    beforeEndEditHandler: function(e, item, commit, isAdd) {
 *       if (!item.get('text').length) {
 *          return constants.editing.CANCEL;
 *       }
 *    }
 * });
 * </pre>
 * @see beforeBeginEdit
 * @see afterBeginEdit
 * @see afterEndEdit
 * @markdown
 */

/**
 * @event Controls/_grid/interface/IEditableGrid#afterEndEdit Происходит после завершения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Редактируемый элемент.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAdd autoAdd});
 *     * после окончания редактирования только что добавленного элемента списка (см. свойство {@link Controls/grid:IGridEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @remark
 * Подпишитесь на событие, если необходимо что-либо сделать после завершения редактирования (например, показать кнопку "Добавить запись").
 * Событие запускается, когда редактирование успешно завершено и возможно безопасно обновить пользовательский интерфейс.
 * @example
 * В следующем примере показано, как отобразить кнопку "Добавить" после окончания редактирования или добавления.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.grid:View on:afterEndEdit="afterEndEditHandler()" />
 * <ws:if data="{{ showAddButton }}">
 *     <Controls.list:AddButton />
 * </ws:if>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * afterEndEditHandler: function() {
 *    this.showAddButton = true;
 * }
 * </pre>
 * @see beforeBeginEdit
 * @see afterBeginEdit
 * @see beforeEndEdit
 * @markdown
 */

/* eslint-disable max-len */
//# region Чистовой вариант доки. Использовать его, когда станет возможно отнаследовать интерфейс.

// import {IEditableList, IEditingConfig} from 'Controls/list';
//
// /**
//  * @typedef {Enum} TEditingMode
//  * @description Допустимые значения для свойства {@link IGridEditingConfig mode}.
//  * @variant row Редактирование всей строки.
//  * @variant cell Редактирование отдельных ячеек.
//  */
// type TEditingMode = 'row' | 'cell';
//
// /**
//  * @typedef {Object} IGridEditingConfig
//  * @description Интерфейс объекта-конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
//  * @property {Boolean} [addPosition=false] Автоматический запуск добавления по месту при инициализации {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ пустого списка}. По умолчанию отключено (false). Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/init/ здесь}.
//  * @property {Boolean} [editOnClick=false] Запуск редактирования по месту при клике по элементу списка. Является частью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/basic/ базовой конфигурации} функционала редактирования по месту. По умолчанию отключено (false).
//  * @property {Boolean} [autoAdd=false] Автоматический запуск добавления нового элемента, происходящий при завершении редактирования последнего элемента списка. По умолчанию отключено (false). Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#add здесь}.
//  * @property {Boolean} [autoAddByApplyButton=true] Отмена автоматического запуска добавления нового элемента, если завершение добавления предыдущего элемента происходит {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/item-actions/#visible кнопкой "Сохранить"} на {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи}. По умолчанию автоматический запуск включен (true). Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#add здесь}.
//  * @property {Boolean} [toolbarVisibility=false] Видимость кнопок "Сохранить" и "Отмена", отображаемых на {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи} в режиме редактирования. По умолчанию кнопки скрыты (false). Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/item-actions/#visible здесь}.
//  * @property {String} [backgroundStyle=default] Предназначен для настройки фона редактируемого элемента. Подробнее см {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#table-background Цвет фона элемента в режиме редактирования}.
//  * @property {TEditingMode} [mode=row] Режим редактирования таблицы.
//  * @property {TAddPosition} [addPosition=bottom] Позиция добавления по месту. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#add-position здесь}.
//  * @property {Types/entity:Model} [item=undefined] Автоматический запуск редактирования/добавления по месту при инициализации списка. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/init/ здесь}.
//  */
// export interface IGridEditingConfig extends IEditingConfig {
//     mode?: TEditingMode;
// }
//
// /**
//  * @typedef {Object} IGridItemEditOptions
//  * @description Объект-конфигурации для запуска редактирования по месту.
//  * @property {Types/entity:Model} [item] Запись, которая будет запущена на редактирование.
//  * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на редактирование вместо первоначальной.
//  * @property {Boolean} [shouldActivateInput] Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта редактирования.
//  * @property {Number} [columnIndex=undefined] Индекс редактируемой ячейки при старте редактирования. Доступно только при значении опции {@link IGridEditingConfig mode}="cell".
//  */
// export interface IGridItemEditOptions {
//     item?: Model;
//     shouldActivateInput?: boolean;
//     columnIndex?: number;
// }
//
// /**
//  * @typedef {Object} IGridItemAddOptions
//  * @description Объект-конфигурации для запуска добавления по месту.
//  * @property {Types/entity:Model} [item] Запись, которая будет запущена на добавление.
//  * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на добавление вместо первоначальной.
//  * @property {Types/entity:Model} [targetItem] Запись списка, рядом с которой будет запущено добавление по месту.
//  * @property {Boolean} [shouldActivateInput] Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта добавления.
//  * @property {TAddPosition} [addPosition] Позиция добавляемой записи. В случае, если в параметрах был передан targetItem, позиция определяется относительно его, иначе — всего списка.
//  * @property {Number} [columnIndex=undefined] Индекс редактируемой ячейки при старте добавления. Доступно только при значении опции {@link IGridEditingConfig mode}="cell".
//  */
// export interface IGridItemAddOptions {
//     item?: Model;
//     targetItem?: Model;
//     shouldActivateInput?: boolean;
//     addPosition?: TAddPosition;
//     columnIndex?: number;
// }
//
// /**
//  * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/grid/ таблиц} с возможностью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
//  *
//  * @public
//  * @implements Controls/list:IEditableList
//  * @see Controls/editableArea:View
//  * @remark
//  * Разница между этим интерфейсом и {@link Controls/editableArea:View Controls/editableArea:View} заключается в том, что первый используется в списках, а второй — вне их (например, на вкладках).
//  */
// export interface IEditableGrid extends IEditableList {
//     _options: {
//         /**
//          * @name Controls/_grid/interface/IEditableGrid#editingConfig
//          * @cfg {IGridEditingConfig | undefined} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
//          */
//         editingConfig: IGridEditingConfig;
//     };
//
//     /**
//      * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
//      * Использование метода в таблице с режимом "только чтение" невозможно.
//      * @function
//      * @param {IGridItemEditOptions} options Параметры редактирования.
//      * @returns {TAsyncOperationResult}
//      * @remark
//      * Используйте этот метод в ситуациях, когда вы хотите начать редактирование из нестандартного места, например, из {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ панели действий элемента}.
//      *
//      * Promise разрешается после монтирования контрола в DOM.
//      *
//      * Перед запуском редактирования по месту происходит событие {@link beforeBeginEdit}, а после запуска — {@link afterBeginEdit}.
//      *
//      * Формат полей редактируемой записи может отличаться от формата полей {@link Types/Collection:RecordSet}, отображаемый списком. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-edit-format здесь}.
//      * @example
//      * В следующем примере показано, как начать редактирование элемента.
//      * <pre class="brush: html;">
//      * <!-- WML -->
//      * <Controls.list:View name="list" />
//      * </pre>
//      * <pre class="brush: js;">
//      * // JavaScript
//      * foo: function() {
//      *    this._children.list.beginEdit({
//      *       item: this._items.at(0)
//      *    });
//      * }
//      * </pre>
//      * @see beginAdd
//      * @see commitEdit
//      * @see cancelEdit
//      * @see beforeBeginEdit
//      * @see afterBeginEdit
//      */
//     beginEdit(options?: IGridItemEditOptions): TAsyncOperationResult;
//
//     /**
//      * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ добавление по месту}.
//      * Использование метода в списке с режимом "только чтение" невозможно.
//      * @function
//      * @param {IGridItemAddOptions} options Параметры добавления.
//      * @returns {TAsyncOperationResult}
//      * @remark
//      * Promise разрешается после монтирования контрола в DOM.
//      *
//      * Перед запуском добавления по месту происходит событие {@link beforeBeginEdit beforeBeginEdit}, а после запуска — {@link afterBeginEdit afterBeginEdit}.
//      *
//      * Вы можете задать позицию, в которой отображается шаблон редактирования строки. Для этого в опции {@link editingConfig} установите значение для параметра {@link IGridEditingConfig addPosition}. Шаблон редактирования строки может отображаться в начале и в конце списка, группы (если включена {@link Controls/interface/IGroupedList#groupProperty группировка}) или узла (для иерархических списков).
//      *
//      * В случае, когда метод beginAdd вызван без аргументов, добавляемая запись будет создана при помощи установленного на списке источника данных путем вызова у него метода {@link Types/source:ICrud#create create}.
//      * @demo Controls-demo/list_new/EditInPlace/AddItem/Index
//      * @demo Controls-demo/list_new/EditInPlace/AddItemInBegin/Index Шаблон редактирования строки отображается в начале списка.
//      * @demo Controls-demo/list_new/EditInPlace/AddItemInEnd/Index Шаблон редактирования строки отображается в конце списка.
//      * @example
//      * В следующем примере показано, как начать добавление элемента.
//      *
//      * <pre class="brush: html">
//      * <!-- WML -->
//      * <Controls.list:View name="list" />
//      * </pre>
//      *
//      * <pre class="brush: js">
//      * // JavaScript
//      * foo: function() {
//      *    this._children.list.beginAdd();
//      * }
//      * </pre>
//      * @see beginEdit
//      * @see commitEdit
//      * @see cancelEdit
//      * @see beforeBeginEdit
//      * @see afterBeginEdit
//      */
//     beginAdd(options?: IGridItemAddOptions): TAsyncOperationResult;
// }

//# endregion
/* eslint-enable max-len */

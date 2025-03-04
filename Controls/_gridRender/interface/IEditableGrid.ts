/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { Model } from 'Types/entity';
import {
    IEditingConfig as IBaseEditingConfig,
    TInputBackgroundVisibility,
    TInputBorderVisibility,
} from 'Controls/baseList';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблиц} с возможностью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @public
 * @see Controls/editableArea:View
 * @remark
 * Разница между этим интерфейсом и {@link Controls/editableArea:View Controls/editableArea:View} заключается в том, что первый используется в списках, а второй — вне их (например, на вкладках).
 */
export interface IEditableGrid {
    /**
     * @name Controls/_gridRender/interface/IEditableGrid#editingConfig
     * @cfg {Controls/grid:IGridEditingConfig | undefined} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
     * @demo Controls-demo/gridNew/EditInPlace/Toolbar/Index
     */

    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
     * Использование метода в списке с режимом "только чтение" невозможно.
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
     * @param {Controls/grid:IItemAddOptions} options Параметры добавления.
     * @returns {TAsyncOperationResult}
     * @remark
     * Promise разрешается после монтирования контрола в DOM.
     *
     * Перед запуском добавления по месту происходит событие {@link beforeBeginEdit}, а после запуска — {@link afterBeginEdit afterBeginEdit}.
     *
     * Вы можете задать позицию, в которой отображается шаблон редактирования строки. Для этого в опции {@link editingConfig} установите значение для параметра {@link Controls/grid:IGridEditingConfig#addPosition addPosition}. Шаблон редактирования строки может отображаться в начале и в конце списка, группы (если включена {@link Controls/interface/IGridControl#groupProperty группировка}) или узла (для иерархических списков).
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
 * Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#mode mode}.
 * @typedef TEditingMode
 * @variant row Редактирование всей строки.
 * @variant cell Редактирование отдельных ячеек.
 */
export type TEditingMode = 'row' | 'cell';

/**
 * Интерфейс объекта-конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту} в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицах}.
 * @public
 */
export interface IGridEditingConfig extends IBaseEditingConfig {
    /**
     * Режим подсветки полей ввода в режиме просмотра.
     * @default onhover
     */
    inputBackgroundVisibility?: TInputBackgroundVisibility;
    /**
     * Видимость границ полей ввода в режиме просмотра.
     * @default hidden
     */
    inputBorderVisibility?: TInputBorderVisibility;
}

/**
 * Результат выполнения методов {@link beginAdd}, {@link beginEdit}, {@link cancelEdit} и {@link commitEdit}.
 * Возвращается либо Promise<void>, если операция прошла успешно, либо Promise<{ canceled: true }>
 * @typedef TAsyncOperationResult
 */
export type TAsyncOperationResult = Promise<void | IOperationCanceledResult>;

/**
 * Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#sequentialEditingMode sequentialEditingMode}.
 * @typedef TSequentialEditingMode
 * @variant row Запускать редактирование в следующей строке, при завершении текущего редактирования.
 * @variant cell Запускать редактирование в следующей ячейке, при завершении текущего редактирования.
 * @variant none Не запускать новое редактирование, при завершении текущего редактирования.
 */
export type TSequentialEditingMode = 'row' | 'cell' | 'none';

/**
 * Объект, который может возвращать Promise при вызове методов {@link beginAdd}, {@link beginEdit}, {@link cancelEdit} и {@link commitEdit}.
 * @typedef IOperationCanceledResult
 * @property {Boolean} canceled Свойство установлено в значение true при отмене:
 * * завершения редактирование/добавление по месту без сохранения введенных данных.
 * * запуска добавления по месту.
 * * запуска редактирования по месту.
 * * при ошибке валидации.
 */
interface IOperationCanceledResult {
    canceled: true;
}

/**
 * Допустимые значения для свойства {@link Controls/grid:IGridEditingConfig#addPosition addPosition}.
 * @typedef TAddPosition
 * @variant top В начале.
 * @variant bottom В конце.
 */
export type TAddPosition = 'top' | 'bottom';

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/add/ добавления по месту}.
 * @public
 */
export interface IItemAddOptions {
    /**
     * @cfg {Types/entity:Model} Запись, которая будет запущена на добавление.
     * @remark Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на добавление вместо первоначальной.
     */
    item?: Model;
    /**
     * @cfg {Types/entity:Model} Запись списка, рядом с которой будет запущено добавление по месту.
     */
    targetItem?: Model;
    /**
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта добавления.
     */
    shouldActivateInput?: boolean;
    /**
     * @cfg {TAddPosition} Позиция добавляемой записи. В случае, если в параметрах был передан targetItem, позиция определяется относительно его, иначе — всего списка.
     */
    addPosition?: TAddPosition;
    /**
     * @cfg {Number} Индекс редактируемой ячейки при запуске добавления по месту. Опция актуальна к использованию, когда опция {@link Controls/grid:IGridEditingConfig#mode mode} установлена в значение "cell".
     * @remark Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-edit-cell здесь}.
     * @default undefined
     */
    columnIndex?: number;
}

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту}.
 * @public
 */
export interface IItemEditOptions {
    /**
     * @cfg {Types/entity:Model} Запись, которая будет запущена на редактирование.
     * @remark
     * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на редактирование вместо первоначальной.
     */
    item?: Model;
    /**
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта редактирования.
     */
    shouldActivateInput?: boolean;
    /**
     * @cfg {Number} Индекс редактируемой ячейки при запуске редактирования по месту. Опция актуальна к использованию, когда опция {@link Controls/grid:IGridEditingConfig#mode mode} установлена в значение "cell".
     * @remark Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#begin-add-cell здесь}.
     * @default undefined
     */
    columnIndex?: number;
}

/**
 * Тип объекта, который можно вернуть из обработчика события {@link beforeBeginEdit}
 * @public
 */
export interface IBeforeBeginEditEventResultOptions {
    /**
     * Запись, которая будет запущена на редактирование/добавление.
     */
    item?: Model;
}

/**
 * Синхронные значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}.
 * @typedef TBeforeBeginEditEventSyncResult
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_gridRender/interface/IEditableGrid/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
export type TBeforeBeginEditEventSyncResult = editing.CANCEL | IBeforeBeginEditEventResultOptions;

/**
 * Значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}.  Результат также можно возвращать в виде Promise.
 * @typedef TBeforeBeginEditEventResult
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_gridRender/interface/IEditableGrid/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
export type TBeforeBeginEditEventResult =
    | TBeforeBeginEditEventSyncResult
    | Promise<TBeforeBeginEditEventSyncResult>;

/**
 * Синхронные значения, которые можно возвращать из обработчика события {@link beforeEndEdit}.
 * @typedef TBeforeEndEditEventSyncResult
 * @variant 'Cancel' Отмена окончания редактирования/добавления по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
export type TBeforeEndEditEventSyncResult = editing.CANCEL | undefined;

/**
 * Значения, которые можно возвращать из обработчика события {@link beforeEndEdit}. Результат также можно возвращать в виде Promise.
 * @typedef TBeforeEndEditEventResult
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
export type TBeforeEndEditEventResult =
    | TBeforeEndEditEventSyncResult
    | Promise<TBeforeEndEditEventSyncResult>;

/**
 * @event Controls/_gridRender/interface/IEditableGrid#beforeBeginEdit Происходит перед запуском {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
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
 * @event Controls/_gridRender/interface/IEditableGrid#afterBeginEdit Происходит после запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
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
 * @event Controls/_gridRender/interface/IEditableGrid#beforeEndEdit Происходит перед завершением {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
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
 * @returns {Controls/_gridRender/interface/IEditableGrid/TBeforeEndEditEventResult.typedef}
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
 * @event Controls/_gridRender/interface/IEditableGrid#afterEndEdit Происходит после завершения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
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

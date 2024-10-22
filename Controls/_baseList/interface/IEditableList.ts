/**
 * @kaizen_zone f3c537c7-1cd5-4a44-a53a-3f5ceaf2ebab
 */
import { Model } from 'Types/entity';
import { LIST_EDITING_CONSTANTS } from '../BaseControl';
import { TApplyButtonStyle } from 'Controls/itemActions';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/list/ списков} с возможностью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @interface Controls/_baseList/interface/IEditableList
 * @public
 * @see Controls/editableArea:View
 * @remark
 * Разница между этим интерфейсом и {@link Controls/editableArea:View Controls/editableArea:View} заключается в том, что первый используется в списках, а второй — вне их (например, на вкладках).
 */
export interface IEditableList {
    /**
     * @name Controls/_baseList/interface/IEditableList#editingConfig
     * @cfg {Controls/list:IEditingConfig | undefined} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
     * @demo Controls-demo/list_new/EditInPlace/EmptyActionsWithToolBar/Index
     * @example
     * В следующем примере в режиме редактирования по месту отображаются кнопки "Сохранить" и "Отмена" на панели опций записи.
     * <pre class="brush: html; highlight: [3]">
     * <!-- WML -->
     * <Controls.list:View name="list" keyProperty="id" source="{{_viewSource}}">
     *     <ws:editingConfig editOnClick="{{true}}" toolbarVisibility="{{true}}" />
     *     <ws:itemTemplate>
     *         <ws:partial template="Controls/list:ItemTemplate">
     *             <ws:contentTemplate>
     *                 <ws:partial template="Controls/list:EditingTemplate" value="{{ itemTemplate.item.contents.title }}">
     *                     <ws:editorTemplate>
     *                         <Controls.input:Text bind:value="itemTemplate.item.contents.title" />
     *                     </ws:editorTemplate>
     *                 </ws:partial>
     *             </ws:contentTemplate>
     *         </ws:partial>
     *     </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     */

    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @param {Controls/list:IItemEditOptions} options Параметры редактирования.
     * @returns {Controls/_baseList/interface/IEditableList/TAsyncOperationResult.typedef}
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
     * <Controls.list:View name="list" />
     * </pre>
     * <pre class="brush: js;">
     * // JavaScript
     * foo: function() {
     *    this._children.list.beginEdit({
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
     * @param {Controls/list:IItemAddOptions} options Параметры добавления.
     * @returns {Controls/_baseList/interface/IEditableList/TAsyncOperationResult.typedef}
     * @remark
     * Promise разрешается после монтирования контрола в DOM.
     *
     * Перед запуском добавления по месту происходит событие {@link beforeBeginEdit}, а после запуска — {@link afterBeginEdit}.
     *
     * Вы можете задать позицию, в которой отображается шаблон редактирования строки. Для этого в опции {@link editingConfig} установите значение для параметра {@link Controls/list:IEditingConfig#addPosition addPosition}. Шаблон редактирования строки может отображаться в начале и в конце списка, группы (если включена {@link Controls/interface/IGroupedList#groupProperty группировка}) или узла (для иерархических списков).
     *
     * В случае, когда метод beginAdd вызван без аргументов, добавляемая запись будет создана при помощи установленного на списке источника данных путем вызова у него метода {@link Types/source:ICrud#create create}.
     * @demo Controls-demo/list_new/EditInPlace/AddItem/Index
     * @demo Controls-demo/list_new/EditInPlace/AddItemInBegin/Index Шаблон редактирования строки отображается в начале списка.
     * @demo Controls-demo/list_new/EditInPlace/AddItemInEnd/Index Шаблон редактирования строки отображается в конце списка.
     * @example
     * В следующем примере показано, как начать добавление элемента.
     *
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.list:View name="list" />
     * </pre>
     *
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.list.beginAdd();
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
     * @returns {Controls/_baseList/interface/IEditableList/TAsyncOperationResult.typedef}
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
     * <Controls.list:View name="list" />
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.list.commitEdit();
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
     * @returns {Controls/_baseList/interface/IEditableList/TAsyncOperationResult.typedef}
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
     * <Controls.list:View name="list" />
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * foo: function() {
     *    this._children.list.cancelEdit();
     * }
     * </pre>
     * @see beginEdit
     * @see beginAdd
     * @see commitEdit
     */
    cancelEdit(): TAsyncOperationResult;
}

/**
 * Интерфейс объекта-конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 *
 * @interface Controls/_baseList/interface/IEditingConfig
 * @public
 */
export interface IEditingConfig {
    /**
     * @name Controls/_baseList/interface/IEditingConfig#addPosition
     * @cfg {Boolean} Автоматический запуск добавления по месту при инициализации {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ пустого списка}.
     * @variant true Включен.
     * @variant false Отключен.
     * @default false
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/init/ здесь}.
     * @see autoAdd
     */
    autoAddOnInit?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#editOnClick
     * @cfg {Boolean} Запуск редактирования по месту при клике по элементу списка. Является частью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/basic/ базовой конфигурации} функционала редактирования по месту.
     * @variant true Включен.
     * @variant false Отключен.
     * @default false
     */
    editOnClick?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#editOnEnter
     * @cfg {Boolean} Запуск редактирования по месту отмеченного маркером элемента списка при нажатии клавиши Enter. Является частью {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/basic/ базовой конфигурации} функционала редактирования по месту.
     * @variant true Включен.
     * @variant false Отключен.
     * @default false
     */
    editOnEnter?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#autoAdd
     * @cfg {Boolean} Автоматический запуск добавления нового элемента, происходящий при завершении редактирования последнего элемента списка.
     * @variant true Включен.
     * @variant false Отключен.
     * @default false
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#add здесь}.
     * @see autoAddOnInit
     */
    autoAdd?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#autoAddByApplyButton
     * @cfg {Boolean} Автоматическое добавление нового элемента после добавления текущего элемента нажатием {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/item-actions/#visible кнопки "Сохранить"} на {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи}.
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#add здесь}.
     * @variant true Автоматическое добавление включено.
     * @variant false Автоматическое добавление отключено.
     * @default true
     */
    autoAddByApplyButton?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#sequentialEditing
     * @cfg {Boolean} Автоматический запуск редактирования по месту для следующего элемента при завершении редактирования любого (кроме последнего) элемента списка.
     * @deprecated Опция устарела, используйте опцию {@link Controls/_baseList/interface/IEditingConfig#sequentialEditingMode sequentialEditingMode}
     * @variant true Включен.
     * @variant false Отключен.
     * @default true
     * @see sequentialEditingMode
     * @remark
     * Опция устарела, используйте опцию {@link Controls/_baseList/interface/IEditingConfig#sequentialEditingMode sequentialEditingMode}
     */
    sequentialEditing?: boolean;

    /**
     * @name Controls/_baseList/interface/IEditingConfig#sequentialEditingMode
     * @cfg {Controls/_baseList/interface/IEditableList/TSequentialEditingMode.typedef} Автоматический запуск редактирования по месту для следующего элемента, происходящий при завершении редактирования любого (кроме последнего) элемента списка.
     * @default row
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/auto/#edit здесь}.
     */
    sequentialEditingMode?: TSequentialEditingMode;

    /**
     * @name Controls/_baseList/interface/IEditingConfig#toolbarVisibility
     * @cfg {Boolean} Видимость кнопок "Сохранить" и "Отмена", отображаемых на {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи} в режиме редактирования.
     * @variant true Кнопки видны.
     * @variant false Кнопки скрыты.
     * @default false
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/item-actions/#visible здесь}.
     */
    toolbarVisibility?: boolean;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#backgroundStyle
     * @cfg {String} Предназначен для настройки фона редактируемого элемента.
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#table-background Цвет фона элемента в режиме редактирования}.
     * @default backgroundStyle
     */
    backgroundStyle?: string;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#addPosition
     * @cfg {Controls/_baseList/interface/IEditableList/TAddPosition.typedef} Позиция добавления по месту.
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/code/#add-position здесь}.
     * @default bottom
     */
    addPosition?: TAddPosition;
    /**
     * @name Controls/_baseList/interface/IEditingConfig#item
     * @cfg {Types/entity:Model} Автоматический запуск редактирования/добавления по месту при инициализации списка.
     * @remark
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/init/ здесь}.
     * @default undefined
     */
    item?: Model;
    /**
     * @cfg {String} Стиль кнопки "Подтвердить"
     * @demo Controls-demo/gridNew/EditInPlace/Toolbar/Toolbar
     */
    applyButtonStyle?: TApplyButtonStyle;
}

export interface IEditableListOptions {
    editingConfig?: IEditingConfig;
}

/**
 * @typedef {Promise<void | IOperationCanceledResult>} Controls/_baseList/interface/IEditableList/TAsyncOperationResult
 * @description Результат выполнения методов {@link beginAdd}, {@link beginEdit}, {@link cancelEdit} и {@link commitEdit}.
 */
export type TAsyncOperationResult = Promise<void | IOperationCanceledResult>;

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
export interface IOperationCanceledResult {
    canceled: true;
}

/**
 * @typedef {String} Controls/_baseList/interface/IEditableList/TAddPosition
 * @description Допустимые значения для свойства {@link Controls/list:IEditingConfig#addPosition addPosition}.
 * @variant top В начале.
 * @variant bottom В конце.
 */
export type TAddPosition = 'top' | 'bottom';

/**
 * @typedef {String} Controls/_baseList/interface/IEditableList/TSequentialEditingMode
 * @description Допустимые значения для свойства {@link Controls/list:IEditingConfig#sequentialEditingMode sequentialEditingMode}.
 * @variant row Запускать редактирование в следующей строке, при завершении текущего редактирования.
 * @variant none Не запускать новое редактирование, при завершении текущего редактирования.
 */
type TSequentialEditingMode = 'row' | 'none';

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ways-to-start/add/ добавления по месту}.
 *
 * @interface Controls/_baseList/interface/IItemAddOptions
 * @public
 */
export interface IItemAddOptions {
    /**
     * @name Controls/_baseList/interface/IItemAddOptions#item
     * @cfg {Types/entity:Model} Запись, которая будет запущена на добавление.
     * @remark
     * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на добавление вместо первоначальной.
     */
    item?: Model;
    /**
     * @name Controls/_baseList/interface/IItemAddOptions#targetItem
     * @cfg {Types/entity:Model} Запись списка, рядом с которой будет запущено добавление по месту.
     */
    targetItem?: Model;
    /**
     * @name Controls/_baseList/interface/IItemAddOptions#shouldActivateInput
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта добавления.
     */
    shouldActivateInput?: boolean;
    /**
     * @name Controls/_baseList/interface/IItemAddOptions#addPosition
     * @cfg {Controls/_baseList/interface/IEditableList/TAddPosition.typedef} Позиция добавляемой записи. В случае, если в параметрах был передан targetItem, позиция определяется относительно его, иначе — всего списка.
     */
    addPosition?: TAddPosition;
}

/**
 * Интерфейс объекта-конфигурации для запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования по месту}.
 *
 * @interface Controls/_baseList/interface/IItemEditOptions
 * @public
 */
export interface IItemEditOptions {
    /**
     * @name Controls/_baseList/interface/IItemEditOptions#item
     * @cfg {Types/entity:Model} Запись, которая будет запущена на редактирование.
     * @remark
     * Если из обработчика события {@link beforeBeginEdit} также будет возвращена запись, то именно она будет запущена на редактирование вместо первоначальной.
     */
    item?: Model;
    /**
     * @name Controls/_baseList/interface/IItemEditOptions#shouldActivateInput
     * @cfg {Boolean} Флаг, определяющий, следует ли усстанавливать фокус в поле ввода, после старта редактирования.
     */
    shouldActivateInput?: boolean;
}

/**
 * @typedef {Object} Controls/_baseList/interface/IEditableList/IBeforeBeginEditEventResultOptions
 * @description Тип объекта, который можно вернуть из обработчика события {@link beforeBeginEdit}.
 * @property {Types/entity:Model} [item=undefined] Запись, которая будет запущена на редактирование/добавление.
 */
interface IBeforeBeginEditEventResultOptions {
    item?: Model;
}

/**
 * @typedef {String | IBeforeBeginEditEventResultOptions} TBeforeBeginEditEventSyncResult
 * @description Синхронные значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}.
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_baseList/interface/IEditableList/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
type TBeforeBeginEditEventSyncResult =
    | LIST_EDITING_CONSTANTS.CANCEL
    | IBeforeBeginEditEventResultOptions;

/**
 * @typedef {TBeforeBeginEditEventSyncResult | Promise<TBeforeBeginEditEventSyncResult>} TBeforeBeginEditEventResult
 * @description Значения, которые можно возвращать из обработчика события {@link beforeBeginEdit}. Результат также можно возвращать в виде Promise.
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant options {@link Controls/_baseList/interface/IEditableList/IBeforeBeginEditEventResultOptions Параметры редактирования/добавления по месту}.
 */
export type TBeforeBeginEditEventResult =
    | TBeforeBeginEditEventSyncResult
    | Promise<TBeforeBeginEditEventSyncResult>;

/**
 * @typedef {String | undefined} Controls/_baseList/interface/IEditableList/TBeforeEndEditEventSyncResult
 * @description Синхронные значения, которые можно возвращать из обработчика события {@link beforeEndEdit}.
 * @variant 'Cancel' Отмена окончания редактирования/добавления по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
type TBeforeEndEditEventSyncResult = LIST_EDITING_CONSTANTS.CANCEL | undefined;

/**
 * @typedef {TBeforeEndEditEventSyncResult | Promise<TBeforeEndEditEventSyncResult>} Controls/_baseList/interface/IEditableList/TBeforeEndEditEventResult
 * @description Значения, которые можно возвращать из обработчика события {@link beforeEndEdit}. Результат также можно возвращать в виде Promise.
 * @variant 'Cancel' Отменить редактирование/добавление по месту.
 * @variant undefined Использовать базовую логику редактирования/добавления по месту.
 */
export type TBeforeEndEditEventResult =
    | TBeforeEndEditEventSyncResult
    | Promise<TBeforeEndEditEventSyncResult>;

/**
 * @event Controls/_baseList/interface/IEditableList#beforeBeginEdit Происходит перед запуском {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/list:IItemEditOptions | Controls/list:IItemAddOptions} options Параметры редактирования.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAdd autoAdd});
 *     * только что добавленного элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @returns {Promise<String | Controls/_baseList/interface/IEditableList/IBeforeBeginEditEventResultOptions.typedef>}
 * Если передана строка "Cancel", тогда происходит отмена окончания редактирования/добавления по месту.
 * @demo Controls-demo/list_new/EditInPlace/BeginEdit/Index
 * @example
 * В следующем примере показано, как запретить редактирование элемента, если он соответствует условию:
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
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
 * <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
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
 * <Controls.list:View on:beforeBeginEdit="beforeBeginEditHandler()" />
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
 * @event Controls/_baseList/interface/IEditableList#afterBeginEdit Происходит после запуска {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Редактируемый элемент.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAdd autoAdd}).
 *     * только что добавленного элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @remark
 * Подпишитесь на событие, если необходимо что-либо сделать после начала редактирования (например, скрыть кнопку "Добавить запись").
 * Событие запускается, когда подготовка данных успешно завершена и возможно безопасно обновить пользовательский интерфейс.
 * @example
 * В следующем примере показано, как скрыть кнопку "Добавить" после начала редактирования или добавления.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.list:View on:afterBeginEdit="afterBeginEditHandler()" />
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
 * @event Controls/_baseList/interface/IEditableList#beforeEndEdit Происходит перед завершением {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
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
 *     * последнего (уже существующего) элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAdd autoAdd});
 *     * только что добавленного элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @returns {Controls/_baseList/interface/IEditableList/TBeforeEndEditEventResult.typedef}
 * @demo Controls-demo/list_new/EditInPlace/EndEdit/Index
 * @remark
 * Используйте событие, если необходимо проверить данные и отменить изменения. По умолчанию для сохранения изменений вызывается метод обновления списка.
 * Не обновляйте пользовательский интерфейс в обработчике этого события, потому что если во время подготовки данных произойдет ошибка, вам придется откатить изменения.
 * @example
 * В следующем примере показано завершение редактирования элемента, если выполнено условие.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.list:View on:beforeEndEdit="beforeEndEditHandler()" />
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
 * @event Controls/_baseList/interface/IEditableList#afterEndEdit Происходит после завершения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования/добавления по месту}.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Редактируемый элемент.
 * @param {Boolean} isAdd Параметр принимает значение true, когда элемент добавляется по месту.
 * Добавление элемента происходит в следующих случаях:
 * 1. вызов метода {@link beginAdd}.
 * 2. после окончания редактирования:
 *     * последнего (уже существующего) элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAdd autoAdd});
 *     * после окончания редактирования только что добавленного элемента списка (см. опцию {@link Controls/list:IEditingConfig#autoAddByApplyButton autoAddByApplyButton}).
 * @remark
 * Подпишитесь на событие, если необходимо что-либо сделать после завершения редактирования (например, показать кнопку "Добавить запись").
 * Событие запускается, когда редактирование успешно завершено и возможно безопасно обновить пользовательский интерфейс.
 * @demo Controls-demo/list_new/EditInPlace/SlowAdding/Index
 * @example
 * В следующем примере показано, как отобразить кнопку "Добавить" после окончания редактирования или добавления.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.list:View on:afterEndEdit="afterEndEditHandler()" />
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

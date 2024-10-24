/**
 * @kaizen_zone 32467cda-e824-424f-9d3b-3faead248ea2
 */
import { Record } from 'Types/entity';

export type TApplyButtonStyle = 'unaccent' | 'accent';

export interface IViewOptions {
    autoEdit?: boolean;
    editingObject?: Record;
    toolbarVisible?: boolean;
    backgroundStyle?: string;
    shouldActivateInput?: boolean;
    applyButtonStyle?: TApplyButtonStyle;
}

/**
 * Интерфейс для полей ввода с возможностью редактирования по месту.
 * @remark
 * Разница между этим интерфейсом и {@link Controls/list:IEditableList} заключается в том,
 * что второй используется в списках, а первый вне их (например, на вкладках).
 *
 * @public
 */

export interface IView {
    readonly '[Controls/editableArea:View]': boolean;
}

/**
 * @name Controls/_editableArea/interface/IView#autoEdit
 * @cfg {Boolean} Определяет, находится ли контрол в режиме редактирования при построении.
 * @default false
 * @demo Controls-demo/EditableArea/AutoEdit/Index
 */

/**
 * @name Controls/_editableArea/interface/IView#shouldActivateInput
 * @cfg {Boolean} Флаг, определяющий, следует ли устанавливать фокус в поле ввода, после старта редактирования.
 * @default true
 */

/**
 * @name Controls/_editableArea/interface/IView#backgroundStyle
 * @cfg {String} Определяет префикс стиля для настройки фона внутренних элементов контрола.
 * @variant editableArea Стандартный фон заливки строки редактирования.
 * @demo Controls-demo/EditableArea/BackgroundStyle/Index
 */

/**
 * @name Controls/_editableArea/interface/IView#toolbarVisible
 * @cfg {Boolean} Определяет, должны ли отображаться кнопки 'Сохранить' и 'Отмена'.
 * @default false
 * @demo Controls-demo/EditableArea/ToolbarVisible/Index
 */

/**
 * @name Controls/_editableArea/interface/IView#editingObject
 * @cfg {Types/entity:Record} Запись с исходными данными.
 * @demo Controls-demo/EditableArea/View/Index
 * @see editingObjectChanged
 */

/**
 * @name Controls/_editableArea/interface/IView#applyButtonStyle
 * @cfg {String} Стиль отображения кнопки 'Сохранить'.
 * @variant unaccent
 * @variant accent
 * @default accent
 * @demo Controls-demo/EditableArea/ApplyButtonStyle/Index
 */

/**
 * @name Controls/_editableArea/interface/IView#content
 * @cfg {Function} Шаблон, который будет использоваться для редактирования.
 * @remark
 * Если вы хотите, чтобы содержимое выглядело так же, как {@link Controls.input:Text Controls/input:Text}, используйте {@link Controls/editableArea:Base Controls/editableArea:Base}.
 * Если по какой-то причине это не подходит, то вы можете использовать свой собственный шаблон.
 * @demo Controls-demo/EditableArea/ViewContent/Index
 * @see Controls/editableArea:Base
 */

/**
 * Начать редактирование.
 * @function Controls/_editableArea/interface/IView#beginEdit
 * @demo Controls-demo/EditableArea/EditingFunctions/Index
 * @remark
 * Если требуется построить контрол в режиме редактирования, то вместо метода используйте опцию @{link autoEdit}.
 * @see commitEdit
 * @see cancelEdit
 * @see autoEdit
 */

/**
 * Завершает редактирование и отменяет изменения.
 * @function Controls/_editableArea/interface/IView#cancelEdit
 * @return Promise<void>
 * @demo Controls-demo/EditableArea/EditingFunctions/Index
 * @see beginEdit
 * @see commitEdit
 */

/**
 * Завершает редактирование и сохраняет изменения.
 * @function Controls/_editableArea/interface/IView#commitEdit
 * @return Promise<void>
 * @demo Controls-demo/EditableArea/EditingFunctions/Index
 * @see beginEdit
 * @see cancelEdit
 */

/**
 * @typedef {String} BeforeBeginEditResult
 * @variant Cancel Отменяет начало редактирования.
 */

/**
 * @typedef {String|Promise|undefined} BeforeEndEditResult
 * @description Результат, возвращаемый обработчиком события beforeBeginEdit.
 * @variant Promise Используется для сохранения с пользовательской логикой.
 * @variant Cancel Отменяет окончание редактирования.
 * @variant undefined Стандартное завершение редактирования. Сохранение происходит на стороне платформы.
 */

/**
 * @event beforeBeginEdit Происходит перед стартом редактирования.
 * @name Controls/_editableArea/interface/IView#beforeBeginEdit
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} options Объект, в котором лежит item — редактируемая строка.
 * @param {Boolean} isAdd Флаг, который позволяет различать редактирование (false) и добавление (true).
 * @returns {BeforeBeginEditResult}
 * @example
 * В следующем примере показано, как обрабатывать событие.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.editableArea:View on:beforeBeginEdit="beforeBeginEditHandler()" editingObject="{{_editingObject}}" />
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * define('ModuleName', ['Controls/list'], function(constants) {
 *    ...
 *    beforeBeginEditHandler: function(e, options, isAdd) {
 *       if (!isAdd) { // Редактирование разрешено только в определенных ситуациях.
 *          return constants.editing.CANCEL;
 *       }
 *    }
 * });
 * </pre>
 * @see beforeEndEdit
 * @see afterEndEdit
 * @see editingObject
 */

/**
 * @event beforeEndEdit Происходит до окончания редактирования.
 * @name Controls/_editableArea/interface/IView#beforeEndEdit
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} editingObject Редактируемая запись.
 * @param {Boolean} commit Если значение параметра true, редактирование закончится сохранением.
 * @returns {BeforeEndEditResult}
 * @remark
 * Событие срабатывает только в случае, если проверка прошла успешно. Если вы вернете Types/deferred:Deferred из обработчика событий, редактирование закончится только в случае, если отложенное решение будет успешно выполнено.
 * @example
 * В следующем примере показано, как отменить завершение редактирования при выполнении определенного условия.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.editableArea:View on:beforeEndEdit="beforeEndEditHandler()" editingObject="{{_editingObject}}" />
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * define('ModuleName', ['Controls/list'], function(constants) {
 *    ...
 *    beforeEndEditHandler: function(e, record, commit) {
 *       //Let's say that we want to allow saving only if the field "text" is not empty (in this example the exact same effect can be achieved through validation mechanism, but sometimes condition is more complicated).
 *       if (commit && record.get("text").length === 0) {
 *          return constants.editing.CANCEL;
 *       }
 *    }
 * });
 * </pre>
 * @see beforeBeginEdit
 * @see afterEndEdit
 * @see editingObject
 */

/**
 * @event afterEndEdit Происходит после окончания редактирования.
 * @name Controls/_editableArea/interface/IView#afterEndEdit
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} editingObject Редактируемая запись.
 * @example
 * В следующем примере показано, как скрыть и показать изображение в зависимости от состояния редактирования.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.editableArea:View on:beforeBeginEdit="beforeBeginEditHandler()" on:afterEndEdit="afterEndEditHandler()" editingObject="{{_editingObject}}" />
 * <ws:if data="{{_imgVisible}}">
 *    <img src="/media/examples/frog.png" alt="Frog"/>
 * </ws:if>
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * beforeBeginEditHandler: function(e, record) {
 *    this._imgVisible = false;
 * },
 * afterEndEditHandler: function(e, record) {
 *    this._imgVisible = true;
 * }
 * </pre>
 * @see beforeBeginEdit
 * @see beforeEndEdit
 * @see editingObject
 */

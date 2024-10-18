/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TemplateFunction } from 'UI/Base';

export interface IDraggableOptions {
    itemsDragNDrop?: boolean;
    draggingTemplate?: Function;
}

/**
 * Интерфейс для перемещения элементов списка с помощью drag'n'drop.
 * Больше информации можно прочитать {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ здесь}.
 *
 * @public
 */

/*
 * Interface to move elements of the list by using drag'n'drop.
 * More information you can read {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ here}.
 *
 * @public
 * @author Авраменко А.С.
 */
export default interface IDraggable {
    readonly '[Controls/_interface/IDraggable]': boolean;
    itemsDragNDrop: boolean;
    draggingTemplate: TemplateFunction;
}

/**
 * @name Controls/_interface/IDraggable#itemsDragNDrop
 * @cfg {Boolean} Определяет, может ли пользователь перемещать элементы в списке с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ drag'n'drop}. Когда опция установлена в значение true, перемещение разрешено.
 * @default false
 * @example
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    keyProperty="id"
 *    itemsDragNDrop="{{true}}" />
 * </pre>
 */

/*
 * @name Controls/_interface/IDraggable#itemsDragNDrop
 * @cfg {Boolean} Determines whether the user can move entries in the list using drag'n'drop.
 * @default false
 * @example
 * The following example shows how to enable the ability to move items using drag'n'drop.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    keyProperty="id"
 *    itemsDragNDrop="{{true}}" />
 * </pre>
 */

/**
 * @name Controls/_interface/IDraggable#draggingTemplate
 * @cfg {Function} Шаблон {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ перемещаемого элемента}.
 * @default undefined
 * @remark В процессе перемещения рядом с курсором отображается эскиз перемещаемого объекта. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ здесь}.
 * @example
 * В следующем примере показано, как использовать базовый шаблон перемещения элементов {@link Controls/dragnDrop:DraggingTemplate}.
 * <pre class="brush: html; highlight: [5,6,7,8,9,10,11,12,13]">
 * <!-- WML -->
 * <Controls.list:View
 *     source="{{_viewSource}}"
 *     keyProperty="id"
 *     on:customdragStart="_onDragStart()"
 *     itemsDragNDrop="{{true}}">
 *     <ws:draggingTemplate>
 *         <ws:partial template="Controls/dragnDrop:DraggingTemplate"
 *             mainText="{{draggingTemplate.entity.getOptions().mainText}}"
 *             image="{{draggingTemplate.entity.getOptions().image}}"
 *             additionalText="{{draggingTemplate.entity.getOptions().additionalText}}">
 *          </ws:partial>
 *     </ws:draggingTemplate>
 * </Controls.list:View>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _viewSource: null,
 * _onDragStart: function(event, items) {
 *    var mainItem = this._items.getRecordById(items[0]);
 *    return new Entity({
 *       items: items,
 *       mainText: mainItem.get('FIO'),
 *       additionalText: mainItem.get('title'),
 *       image: mainItem.get('userPhoto')
 *    });
 * },
 * _beforeMount: function() {
 *    this._viewSource= new Source({...});
 * }
 * </pre>
 */

/*
 * @name Controls/_interface/IDraggable#draggingTemplate
 * @cfg {Function} Template of the entity to be moved.
 * @default Controls/dragnDrop:DraggingTemplate
 * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
 * @example
 * The following example shows how to use a standard dragging template.
 * <pre>
 *    <Controls.list:View source="{{_viewSource}}"
 *                   keyProperty="id"
 *                   on:customdragStart="_onDragStart()"
 *                   itemsDragNDrop="{{true}}">
 *       <ws:draggingTemplate>
 *          <ws:partial template="Controls/dragnDrop:DraggingTemplate"
 *                      mainText="{{draggingTemplate.entity.getOptions().mainText}}"
 *                      image="{{draggingTemplate.entity.getOptions().image}}"
 *                      additionalText="{{draggingTemplate.entity.getOptions().additionalText}}">
 *          </ws:partial>
 *       </ws:draggingTemplate>
 *    </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _onDragStart: function(event, items) {
 *          var mainItem = this._items.getRecordById(items[0]);
 *          return new Entity({
 *             items: items,
 *             mainText: mainItem.get('FIO'),
 *             additionalText: mainItem.get('title'),
 *             image: mainItem.get('userPhoto')
 *          });
 *       },
 *       _beforeMount: function() {
 *          this._viewSource= new Source({...});
 *       }
 *       ...
 *    }
 * </pre>
 */

/**
 * @event Controls/_interface/IDraggable#customdragStart Происходит при начале перемещения элемента.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array<String>} items Идентификаторы перемещаемых элементов.
 * @param {string|number} draggedKey Идентификатор элемента, за который начали drag-n-drop.
 * @remark Чтобы начать перемещение drag'n'drop из события, необходимо вернуть объект перемещения. Событие срабатывает у контейнера, в котором началось перемещение.
 * Отличается от события {@link /docs/js/Controls/interface/IDraggable/events/dragEnter/ dragEnter}, которое срабатывает у контейнера, в который была перемещена запись.
 * @example
 * В следующем примере показано, как начать перемещение элементов с помощью drag'n'drop, если все элементы имеют одинаковый тип.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <Controls.list:View
 *     source="{{_viewSource}}"
 *     keyProperty="id"
 *     on:customdragStart="_dragStart()"
 *     itemsDragNDrop="{{true}}" />
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _viewSource: null,
 * _dragStart: function(event, items) {
 *    var eventResult = false;
 *    if (this._isSameTypes(items)) {
 *       eventResult = new ItemsEntity({
 *          items: items
 *       });
 *    }
 *    return eventResult;
 * },
 * _isSameTypes: function() {...},
 * _beforeMount: function() {
 *    this._viewSource = new Source({...});
 * }
 * </pre>
 * @see customdragEnd
 */

/*
 * @event Occurs before the user starts dragging an element in the list.
 * @name Controls/_interface/IDraggable#customdragStart
 * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
 * @param {Array.<String>} items An array of identifiers for items to be moved.
 * @returns {Controls/_dragnDrop/Entity/Items)
 * @remark To start a drag'n'drop move from an event, you must return the move entity.
 * @example
 * The following example shows how to start moving items using drag'n'drop if all items are of the same type.
 * <pre>
 *     <Controls.list:View source="{{_viewSource}}"
 *                    keyProperty="id"
 *                    on:customdragStart="_dragStart()"
 *                    itemsDragNDrop="{{true}}">
 *     </Controls.list:View>
 * </pre>
 *
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _dragStart: function(event, items) {
 *          var eventResult = false;
 *          if (this._isSameTypes(items)) {
 *             eventResult = new ItemsEntity({
 *                items: items
 *             });
 *          }
 *          return eventResult;
 *       },
 *       _isSameTypes: function() {...},
 *       _beforeMount: function() {
 *          this._viewSource = new Source({...});
 *       }
 *       ...
 *    }
 * </pre>
 * @see customdragEnd
 */

/**
 * @typedef {String} MovePosition
 * @variant after Вставить перемещенные элементы после указанного элемента.
 * @variant before Вставить перемещенные элементы перед указанным элементом.
 * @variant on Вставить перемещенные элементы в указанный элемент.
 */

/*
 * @typedef {String} MovePosition
 * @variant after Insert moved items after the specified item.
 * @variant before Insert moved items before the specified item.
 * @variant on Insert moved items into the specified item.
 */

/**
 * @event Controls/_interface/IDraggable#customdragEnd Происходит при завершении перемещения элемента в списке.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Объект перемещения.
 * @param {Types/entity:Record} target Область, в которую перемещают объект.
 * @param {MovePosition} position Положение перемещения.
 * @example
 * В следующем примере показано, как перемещать элементы с помощью встроенных методов списочного контрола.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.listDataOld:DataContainer source="{{_viewSource}}" keyProperty="id">
 *    <Controls.list:View name="list" on:customdragEnd="_dragEnd()" itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * </pre>
 *
 * <pre class="brush: js;">
 * // TypeScript
 * protected _dragEnd(event: SyntheticEvent, entity: IDragObject, target: Model, position: 'after'|'before'|'on'): void {
 *    const selection = {
 *        selected: entity.getItems(),
 *        excluded: []
 *    }
 *    this._children.list.moveItems(selection, target.getKey(), position)
 *      .then((result) => {
 *          this._children.list.reload();
 *      });
 * },
 * protected _beforeMount(): void {
 *    this._viewSource = new Source({...});
 * }
 * </pre>
 * @see customdragStart
 */

/*
 * @event Occurs after the user has finished dragging an item in the list.
 * @name Controls/_interface/IDraggable#customdragEnd
 * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @param {Types/entity:Record} target Target item to move.
 * @param {MovePosition} position Position to move.
 * @see customdragStart
 */

/**
 * @typedef {Boolean|Types/entity:Record} DragEnterResult
 * @property {Boolean} result Разрешить перемещение элементов в текущий список из другого списка.
 * @property {Types/entity:Record} result Разрешить перемещение элементов в текущий список из другого списка, возвращенная запись будет отображаться в списке как указатель на местоположение перемещения.
 */

/*
 * @typedef {Boolean|Types/entity:Record} DragEnterResult
 * @property {Boolean} Allow dragging items to the current list from another list.
 * @property {Types/entity:Record} Allow dragging items to the current list from another list, the returned entry will be displayed in the list as a pointer to the move location.
 */

/**
 * @event Controls/_interface/IDraggable#customdragEnter Происходит при перемещении элемента из другого контрола.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Объект перемещения.
 * @returns {DragEnterResult}
 * @remark Событие позволяет перемещать элементы в текущий список из другого списка. Событие срабатывает у контейнера, в который была перемещена запись.
 * Отличается от события {@link /docs/js/Controls/list/View/events/customdragStart/?v=21.1000 customdragStart}, которое срабатывает у контейнера, из которого началось перемещение записи.
 * @example
 * В следующем примере показано, как перемещать в список объекты определенного типа.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.listDataOld:DataContainer source="{{_firstSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:customdragStart="_dragStart()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * <Controls.listDataOld:DataContainer source="{{_secondSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:customdragEnter="_dragEnter()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _dragStart: function(event, items) {
 *    return new TasksItemsEntity({
 *       items: items
 *    });
 * },
 * _dragEnter: function(event, entity) {
 *    var result = false;
 *    if (entity instanceof TasksItemsEntity) {
 *       result = new Record({...});
 *    }
 *    return result;
 * },
 * _beforeMount: function() {
 *    this._firstSource = new Source({...});
 *    this._secondSource = new Source({...});
 * }
 * </pre>
 */

/*
 * @event Occurs before moving items from another list to the current list.
 * @name Controls/_interface/IDraggable#customdragEnter
 * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @returns {DragEnterResult}
 * @remark You can use the event to allow dragging items to the current list from another list.
 * @example
 * The following example shows how to allow dragging to a list of entities of a particular type.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.listDataOld:DataContainer source="{{_firstSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:customdragStart="_dragStart()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * <Controls.listDataOld:DataContainer source="{{_secondSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:customdragEnter="_dragEnter()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _dragStart: function(event, items) {
 *    return new TasksItemsEntity({
 *       items: items
 *    });
 * },
 * _dragEnter: function(event, entity) {
 *    var result = false;
 *    if (entity instanceof TasksItemsEntity) {
 *       result = new Record({...});
 *    }
 *    return result;
 * },
 * _beforeMount: function() {
 *    this._firstSource = new Source({...});
 *    this._secondSource = new Source({...});
 * }
 * </pre>
 */

/**
 * @event Controls/_interface/IDraggable#changeDragTarget Происходит перед изменением позиции, в которую будет перемещен элемент.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_dragnDrop/Entity/Items} entity Объект перемещения.
 * @param {Types/entity:Record|String} target Целевой элемент перемещения.
 * @param {MovePosition} position Позиция перемещения.
 * @returns {Boolean}
 * @remark Событие можно использовать для предотвращения перемещения элемента в определенное положение.
 * Если была произведена попытка перемещения элемента к группе, в target придёт строка.
 * @example
 * В следующем примере показано, как предотвратить изменение порядка закрепленных элементов.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.listDataOld:DataContainer source="{{_viewSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:changeDragTarget="_changeDragTarget()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _pinnedProperty: 'pinned',
 * _changeDragTarget: function(event, entity, target, position) {
 *    return target.get(this._pinnedProperty) !== true;
 * },
 * _beforeMount: function() {
 *    this._viewSource = new Source({...});
 * }
 * </pre>
 */

/*
 * @event Occurs before the change of the position of the drag.
 * @name Controls/_interface/IDraggable#changeDragTarget
 * @param {Vdom/Vdom:SyntheticEvent} eventObject The event descriptor.
 * @param {Controls/_dragnDrop/Entity/Items} entity Drag'n'drop entity.
 * @param {Types/entity:Record} target Target item to move.
 * @param {MovePosition} position Position to move.
 * @returns {Boolean}
 * @remark You can use an event to prevent dragging to a specific position.
 * @example
 * The following example shows how to prevent the change of the order of a pinned item.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.listDataOld:DataContainer source="{{_viewSource}}" keyProperty="id">
 *    <Controls.list:View
 *       on:changeDragTarget="_changeDragTarget()"
 *       itemsDragNDrop="{{true}}" />
 * </Controls.listDataOld:DataContainer>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * _pinnedProperty: 'pinned',
 * _changeDragTarget: function(event, entity, target, position) {
 *    return target.get(this._pinnedProperty) !== true;
 * },
 * _beforeMount: function() {
 *    this._viewSource = new Source({...});
 * }
 * </pre>
 */

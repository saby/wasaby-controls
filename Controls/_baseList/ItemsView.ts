/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { default as BaseControl } from 'Controls/_baseList/BaseControl';
import * as ListView from 'Controls/_baseList/ListView';
import * as template from 'wml!Controls/_baseList/ItemsView';
import { Model } from 'Types/entity';
import { IAbstractListVirtualScrollControllerConstructor } from './Controllers/ScrollController/AbstractListVirtualScrollController';
import { AsyncListVirtualScrollController } from './Controllers/ScrollController/AsyncListVirtualScrollController';
import { ListVirtualScrollController } from './Controllers/ScrollController/ListVirtualScrollController';
import type { IEditableList, IEditableListOptions } from 'Controls/baseList';
import { TNotifyCallback } from './List';

type ListFnParams<T extends keyof BaseControl> = Parameters<BaseControl[T]>;
type ListFnReturn<T extends keyof BaseControl> = ReturnType<BaseControl[T]>;

/**
 * Интерфейс, описывающий опции специфичные для списков работающих без источника данных.
 * @interface Controls/_list/IItemsView
 * @public
 */
export interface IItemsViewOptions extends IControlOptions, IEditableListOptions {
    /**
     * @name Controls/_list/IItemsView#items
     * @cfg {Types/collection:RecordSet} Список записей, данные которого нужно отобразить.
     */
    items?: RecordSet;

    /**
     * @name Controls/_list/IItemsView#keyProperty
     * @cfg {String} Имя поля записи, в котором хранится её идентификатор.
     * @remark Опция не является обязательной. Если не указана, то её значение будет взято из RecordSet переданного в опции {@link Controls/_list/IItemsView#items items}
     */
    keyProperty?: TKey;
}

/**
 * Контрол плоского {@link /doc/platform/developmentapl/interface-development/controls/list/list/ списка}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @example
 * При создании {@link Types/collection:RecordSet RecordSet} необходимо указывать корректный формат и keyProperty.
 * <pre class="brush:js">
 *    export default class Index extends Control<IControlOptions> {
 *
 *        protected _items: RecordSet = new RecordSet({
 *            keyProperty: 'key',
 *            rawData: [
 *                {key: 1, title: 'item 1'},
 *                {key: 2, title: 'item 2'}
 *            ],
 *            format: {key: 'integer', title: 'string'},
 *         });
 *
 *         ...
 *    }
 * </pre>
 *
 * При правильно созданном RecordSet на уровне шаблона достаточно указать опцию items. Опция keyProperty для контрола списка возьмется из переданного RecordSet.
 * <pre class="brush:html">
 *    <Controls.list:ItemsView items="{{_items}}"/>
 * </pre>
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/items/ руководство разработчика}
 * * {@link /doc/platform/developmentapl/interface-development/models-collections-types/icollection/#typescollectionrecordset работа с Types/collection:RecordSet}
 *
 * @demo Controls-demo/list_new/ItemsView/Base/Index
 * @demo Controls-demo/list_new/ItemsView/Grouping/Index
 *
 * @class Controls/list:ItemsView
 * @extends UI/Base:Control
 * @implements Controls/list:IItemsView
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/list:IEditableList
 * @implements Controls/_interface/ITrackedProperties
 *
 * @public
 */
export default class ItemsView<
        TOptions extends IItemsViewOptions = IItemsViewOptions,
        TListControl extends BaseControl = BaseControl
    >
    extends Control<TOptions>
    implements IEditableList
{
    // region base control props
    protected _template: TemplateFunction = template;
    protected _children: {
        listControl: TListControl;
    };
    // endregion

    // region template props
    protected _viewTemplate: Function = BaseControl;

    protected _viewName: Function = ListView;

    protected _viewModelConstructor: string = 'Controls/display:Collection';

    protected _listVirtualScrollControllerConstructor: IAbstractListVirtualScrollControllerConstructor;

    protected _itemsSelector: string = '.controls-ListView__itemV';
    // endregion

    // region helper props for the template
    /**
     * Обработчик который используется в шаблоне для проксирования событий логическому родителю.
     */
    protected _notifyCallback: TNotifyCallback = (...args) => {
        return this._notify.call(this, ...args);
    };
    // endregion

    _beforeMount(options: TOptions): void {
        this._listVirtualScrollControllerConstructor =
            this._getListVirtualScrollConstructor(options);
    }

    protected _getListVirtualScrollConstructor(
        options: IControlOptions
    ): IAbstractListVirtualScrollControllerConstructor {
        return this.UNSAFE_isReact && options.feature1184208466
            ? AsyncListVirtualScrollController
            : ListVirtualScrollController;
    }

    // region props
    /**
     * Возвращает инстанс контроллера списка. Для обычных списков тут будет BaseControl,
     * для деревьев - TreeControl.
     */
    protected get _listControl(): TListControl {
        return this._children.listControl as TListControl;
    }
    // endregion

    scrollToItem(key: string | number, position: string, force: boolean): Promise<void> {
        return this._children.listControl.scrollToItem(key, position, force);
    }

    animateRemoving(): void {
        this._listControl.animateRemoving();
    }

    animateAdding(): void {
        this._listControl.animateAdding();
    }

    animateMoving(): void {
        this._listControl.animateMoving();
    }

    // region freezeHoveredItem
    /**
     * Замораживает hover подсветку строки для указанной записи
     */
    freezeHoveredItem(item: Model): void {
        this._listControl.freezeHoveredItem(item);
    }

    /**
     * Размораживает все ранее замороженные итемы
     */
    unfreezeHoveredItems(): void {
        this._listControl.unfreezeHoveredItems();
    }
    // endregion freezeHoveredItem

    // region IEditableList

    beginEdit(...args: ListFnParams<'beginEdit'>): ListFnReturn<'beginEdit'> {
        return this._children.listControl.beginEdit(...args);
    }

    beginAdd(...args: ListFnParams<'beginAdd'>): ListFnReturn<'beginAdd'> {
        return this._children.listControl.beginAdd(...args);
    }

    commitEdit(...args: ListFnParams<'commitEdit'>): ListFnReturn<'commitEdit'> {
        return this._children.listControl.commitEdit(...args);
    }

    cancelEdit(...args: ListFnParams<'cancelEdit'>): ListFnReturn<'cancelEdit'> {
        return this._children.listControl.cancelEdit(...args);
    }

    // endregion IEditableList

    static defaultProps: object = {
        multiSelectVisibility: 'hidden',
        multiSelectPosition: 'default',
        stickyHeader: true,
        stickyResults: true,
        style: 'default',
    };
}

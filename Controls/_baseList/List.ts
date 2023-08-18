/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IMovableList } from './interface/IMovableList';
import { IRemovableList } from './interface/IRemovableList';
import template = require('wml!Controls/_baseList/List');
import { default as viewName, IListViewOptions } from './ListView';
import { default as ListControl } from 'Controls/_baseList/BaseControl';
import { default as Data } from 'Controls/_baseList/Data';
import { ISelectionObject, IBaseSourceConfig, TKey } from 'Controls/interface';
import { DataSet, CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import 'css!Controls/baseList';
import { IReloadItemOptions } from 'Controls/_baseList/interface/IList';
import { IAbstractListVirtualScrollControllerConstructor } from './Controllers/ScrollController/AbstractListVirtualScrollController';
import { AsyncListVirtualScrollController } from './Controllers/ScrollController/AsyncListVirtualScrollController';
import { ListVirtualScrollController } from './Controllers/ScrollController/ListVirtualScrollController';
import { Guid } from 'Types/entity';

export type TNotifyCallback = (eventName: string, args?: unknown[], options?: object) => unknown;

/**
 * Контрол "Плоский список" позволяет отображать данные из различных источников в виде упорядоченного списка.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @class Controls/_list/List
 * @extends UI/Base:Control
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface:IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IEditableList
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IReloadableList
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/list:IListNavigation
 * @implements Controls/error:IErrorControllerOptions
 * @implements Controls/_interface/ITrackedProperties
 *
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility displayProperty groupHistoryId
 *
 * @public
 * @demo Controls-demo/list_new/Base/Index
 */

/*
 * Plain list with custom item template. Can load data from data source.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/'>here</a>.
 *
 * @class Controls/_list/List
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISelectFields
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:ISorting
 * @implements Controls/list:IEditableList
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IReloadableList
 * @implements Controls/marker:IMarkerList
 *
 * @implements Controls/list:IVirtualScroll
 *
 *
 * @author Авраменко А.С.
 * @public
 * @demo Controls-demo/list_new/Base/Index
 */

export default class List<TControl extends ListControl = ListControl>
    extends Control<IListViewOptions>
    implements IMovableList, IRemovableList
{
    protected _template: TemplateFunction = template;
    protected _viewName: TemplateFunction = viewName;
    protected _viewTemplate: TControl = ListControl;
    protected _viewModelConstructor: string | Function = null;
    protected _listVirtualScrollControllerConstructor: IAbstractListVirtualScrollControllerConstructor;
    protected _itemsSelector: string = '.controls-ListView__itemV';
    protected _uniqueId: string;
    protected _children: {
        listControl: TControl;
        data: Data;
    };

    protected _notifyCallback: TNotifyCallback = (...args) => {
        return this._notify.call(this, ...args);
    };

    protected _beforeMount(
        options: IControlOptions,
        context: object,
        receivedState?: { uniqueId: string }
    ): { uniqueId: string } {
        // В списках должен остаться один уникальный идентификатор и это он.
        this._uniqueId = receivedState?.uniqueId || Guid.create();
        this._viewModelConstructor = this._getModelConstructor();
        this._listVirtualScrollControllerConstructor =
            this._getListVirtualScrollConstructor(options);
        return {
            uniqueId: this._uniqueId,
        };
    }

    protected _getListVirtualScrollConstructor(
        options: IControlOptions
    ): IAbstractListVirtualScrollControllerConstructor {
        return this.UNSAFE_isReact && options.feature1184208466
            ? AsyncListVirtualScrollController
            : ListVirtualScrollController;
    }

    protected _onBaseControlActivated(
        e: Event,
        eventOptions: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            keyPressedData?: {
                key: string;
            };
        }
    ): void {
        this._children.listControl.onactivated(e, eventOptions);
    }

    protected _getModelConstructor(): string | Function {
        return 'Controls/display:Collection';
    }

    saveScrollPosition(): void {
        this._children.listControl.saveScrollPosition();
    }

    restoreScrollPosition(): void {
        this._children.listControl.restoreScrollPosition();
    }

    animateRemoving(): void {
        this._children.listControl.animateRemoving();
    }

    animateAdding(): void {
        this._children.listControl.animateAdding();
    }

    animateMoving(): void {
        this._children.listControl.animateMoving();
    }

    reload(
        keepNavigation: boolean = false,
        sourceConfig?: IBaseSourceConfig
    ): Promise<RecordSet | Error> {
        // listControl будет не создан, если была ошибка загрузки
        if (this._children.listControl) {
            return this._children.listControl.reload(keepNavigation, sourceConfig);
        } else {
            return this._children.data.reload(sourceConfig);
        }
    }

    scrollTo(where: string, params?: object): void {
        this._children.listControl.scrollTo(where, params);
    }

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        return this._children.listControl.reloadItem(key, options);
    }

    getItems(): RecordSet {
        // listControl может не быть, если отрисовывается ошибка
        return this._children.listControl ? this._children.listControl.getItems() : null;
    }

    scrollToItem(
        key: string | number,
        position: string,
        force: boolean,
        allowLoad?: boolean
    ): Promise<void> {
        return this._children.listControl.scrollToItem(key, position, force, allowLoad);
    }

    beginEdit(options: object): Promise<void | { canceled: true }> {
        return this._options.readOnly
            ? Promise.reject()
            : this._children.listControl.beginEdit(options);
    }

    beginAdd(options: object): Promise<void | { canceled: true }> {
        return this._options.readOnly
            ? Promise.reject()
            : this._children.listControl.beginAdd(options);
    }

    cancelEdit(): Promise<void | { canceled: true }> {
        return this._options.readOnly ? Promise.reject() : this._children.listControl.cancelEdit();
    }

    commitEdit(): Promise<void | { canceled: true }> {
        return this._options.readOnly ? Promise.reject() : this._children.listControl.commitEdit();
    }

    /**
     * Замораживает hover подсветку строки для указанной записи
     */
    freezeHoveredItem(item: Model): void {
        this._children.listControl.freezeHoveredItem(item);
    }

    /**
     * Размораживает все ранее замороженные итемы
     */
    unfreezeHoveredItems(): void {
        this._children.listControl.unfreezeHoveredItems();
    }

    // region mover

    moveItems(
        selection: ISelectionObject,
        targetKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION,
        viewCommandName?: string
    ): Promise<DataSet> {
        return this._children.listControl.moveItems(
            selection,
            targetKey,
            position,
            viewCommandName
        );
    }

    moveItemUp(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._children.listControl.moveItemUp(selectedKey, viewCommandName);
    }

    moveItemDown(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._children.listControl.moveItemDown(selectedKey, viewCommandName);
    }

    moveItemsWithDialog(selection: ISelectionObject, viewCommandName?: string): Promise<DataSet> {
        return this._children.listControl.moveItemsWithDialog(selection, viewCommandName);
    }

    // endregion mover

    // region remover

    removeItems(selection: ISelectionObject, viewCommandName?: string): Promise<string | void> {
        return this._children.listControl.removeItems(selection, viewCommandName);
    }

    removeItemsWithConfirmation(
        selection: ISelectionObject,
        viewCommandName?: string
    ): Promise<string | void> {
        return this._children.listControl.removeItemsWithConfirmation(selection, viewCommandName);
    }

    // endregion remover

    // TODO удалить по https://online.sbis.ru/opendoc.html?guid=2ad525f0-2b48-4108-9a03-b2f9323ebee2
    _clearSelection(): void {
        this._children.listControl.clearSelection();
    }

    static getDefaultOptions(): object {
        return {
            multiSelectPosition: 'default',
            stickyHeader: true,
            stickyResults: true,
            style: 'default',
            itemsContainerPadding: {
                top: 'default',
                bottom: 'default',
                left: 'default',
                right: 'default',
            },
        };
    }
}
/**
 * @name Controls/_list/List#itemPadding
 * @cfg {Controls/_interface/IItemPadding/IPadding}
 * @demo Controls-demo/list_new/ItemPadding/DifferentPadding/Index В примере заданы горизонтальные отступы.
 * @demo Controls-demo/list_new/ItemPadding/NoPadding/Index В примере отступы отсутствуют.
 */

/**
 * @name Controls/_list/List#filter
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Object} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/ объекта фильтра}. Фильтр отправляется в запрос к источнику для получения данных.
 * @remark
 * При изменении фильтра важно передавать новый объект фильтра, изменение объекта по ссылке не приведет к желаемому результату.
 */

/**
 * @name Controls/_list/List#navigation
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 */

/**
 * @name Controls/_list/List#sorting
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Controls/_interface/ISorting/TSorting.typedef>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 * @remark
 * Допустимы значения направления сортировки ASC/DESC.
 *
 * * В таблицах можно изменять сортировку нажатием кнопки сортировки в конкретной ячейке заголовкв таблицы. Для этого нужно в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ конфигурации ячейки шапки} задать свойство {@link Controls/grid:IHeaderCell#sortingProperty sortingProperty}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/sorting/ здесь}
 *
 * * При отсутствии заголовков в реестре можно воспользоваться кнопкой открытия меню сортировки. Для этого нужно добавить на страницу и настроить контрол {@link Controls/sorting:Selector}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/table/ здесь}
 *
 * Выбранную сортировку можно сохранять. Для этого используют опцию {@link Controls/grid:IPropStorage#propStorageId propStorageId}.
 */

/**
 * @name Controls/_list/List#source
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 */

/**
 * @name Controls/_list/List#keyProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 * Если keyProperty не задан, то значение будет взято из source.
 */
/**
 * @name Controls/_list/List#selectedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#all выбранных элементов}.
 */

/**
 * @name Controls/_list/List#excludedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#excluded-keys исключенных элементов}.
 */

/**
 * @name Controls/_list/List#multiSelectVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ чекбоксов}.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default hidden
 * @remark
 * В режиме onhover логика работы следующая:
 * * На Touch-устройствах чекбокс и место под него будет скрыто до тех пор, пока по любой записи не сделают свайп вправо
 * * На Desktop устройствах отображается место под чекбокс, но при наведении на запись отображается сам чекбокс.
 * @demo Controls-demo/list_new/MultiSelect/MultiSelectVisibility/OnHover/Index
 * @see multiSelectAccessibilityProperty
 * @see multiSelectPosition
 */

/**
 * @name Controls/_list/List#markerVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
 * @default onactivated
 * @see markedKey
 * @see markedKeyChanged
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */

/**
 * @name Controls/_list/List#displayProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, содержимое которого будет отображаться по умолчанию.
 * @default title
 */

/**
 * @name Controls/_list/List#groupHistoryId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
 */

/**
 * @kaizen_zone e8e36b1a-d1b2-42b9-a236-b49c3be0934f
 */
import {
    detectGoingBackByPath,
    getCursorValue,
    isCursorNavigation,
    needRecreateCollection,
    resolveViewMode,
} from './utils';
import {
    IBaseSourceConfig,
    INavigationOptionValue,
    INavigationPositionSourceConfig,
    INavigationSourceConfig,
    ISelectionObject,
    TKey,
} from 'Controls/interface';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import { EventUtils } from 'UI/Events';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UI/Vdom';
import { Path } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { descriptor, Model } from 'Types/entity';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn, IHeaderCell, isReactView, resolveViewControls } from 'Controls/grid';
import { isFullGridSupport } from 'Controls/display';
import { IDragObject, ItemsEntity } from 'Controls/dragnDrop';
import { addPageDeps, executeSyncOrAsync } from 'UI/Deps';
import PathController from 'Controls/_explorer/PathController';
import { CrudEntityKey, DataSet, LOCAL_MOVE_POSITION } from 'Types/source';
import { MultiColumnStrategy, SingleColumnStrategy } from 'Controls/marker';
import type { TNotEditableJsSelector } from 'Controls/editInPlace';
import type { SearchGridControl } from 'Controls/searchBreadcrumbsGrid';
import { TreeGridControl, TreeGridView, TreeGridViewTable } from 'Controls/treeGrid';
import {
    IItemPadding,
    IReloadItemOptions,
    ListView,
    ScrollEmitter,
    ListVirtualScrollController,
    IEditableList,
} from 'Controls/list';
import { IExplorerOptions, TExplorerViewMode } from 'Controls/_explorer/interface/IExplorer';
import * as template from 'wml!Controls/_explorer/View/View';
import * as cInstance from 'Core/core-instance';
import 'css!Controls/explorer';
import randomId = require('Core/helpers/Number/randomId');
import type { TreeTileView } from 'Controls/treeTile';
import type { ViewTemplate as ColumnsViewTemplate } from 'Controls/columns';
import type { SearchView, SearchViewTable } from 'Controls/searchBreadcrumbsGrid';
import type { IScrollState } from 'Controls/scroll';
import { TNotifyCallback } from '../_baseList/List';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';

const HOT_KEYS = {
    _backByPath: constants.key.backspace,
};
const ITEM_TYPES = {
    node: true,
    hiddenNode: false,
    leaf: null,
};
const DEFAULT_VIEW_MODE = 'table';

const NOT_EDITABLE_JS_SELECTOR: TNotEditableJsSelector = 'js-controls-ListView__notEditable';

// Тип, описывающий возможные внутренние значения viewMode
type TInnerViewMode = TExplorerViewMode | 'columns';

//# region views loading configurations types
interface IViewControllers {
    search: typeof SearchGridControl | null;
    tile: typeof TreeGridControl;
    table: typeof TreeGridControl;
    list: typeof TreeGridControl;
    columns: typeof TreeGridControl;
}

interface IViewNames {
    search: SearchView | null;
    tile: TreeTileView | null;
    table: TreeGridView;
    list: ListView;
    columns: ColumnsViewTemplate | null;
}

interface IViewTableNames {
    search: SearchViewTable | null;
    tile: TreeTileView | null;
    table: TreeGridViewTable;
    list: ListView;
    columns: ColumnsViewTemplate | null;
}

interface IViewModelConstructors {
    search: 'Controls/searchBreadcrumbsGrid:SearchGridCollection' | null;
    tile: 'Controls/treeTile:TreeTileCollection' | null;
    table: 'Controls/treeGrid:TreeGridCollection';
    list: 'Controls/treeGrid:TreeGridCollection';
    columns: 'Controls/columns:ColumnsCollection' | null;
}

type TViewItemsSelector = Record<TInnerViewMode, string>;

//# endregion

type TreeFnParams<T extends keyof TreeGridControl> = Parameters<TreeGridControl[T]>;
type TreeFnReturn<T extends keyof TreeGridControl> = ReturnType<TreeGridControl[T]>;

const MARKER_STRATEGY = {
    list: SingleColumnStrategy,
    tile: SingleColumnStrategy,
    table: SingleColumnStrategy,
    columns: MultiColumnStrategy,
};

interface IMarkedKeysStore {
    [p: string]: { markedKey: TKey; parent?: TKey; cursorPosition?: unknown };
}

/**
 * Контрол "Иерархический проводник" позволяет отображать данные из различных источников данных в одном из четырех режимов: плоский список, дерево с колонками, плитка и поиск.
 * В режимах отображения "дерево" и "поиск" над контролом отображаются хлебные крошки, используемые для навигации по разделам.
 * В контроле можно включить поведение проваливания в узел, когда при клике по узлу — такой узел становится корнем иерархии.
 * При этом контрол будет отображать только содержимое выбранного узла.
 * Если для контрола настроена навигация, тогда после проваливания в узел начинает работать подгрузка дочерних элементов по скроллу.
 *
 * @remark
 * Сортировка применяется к запросу к источнику данных. Полученные от источника записи дополнительно не сортируются.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_explorer.less переменные тем оформления explorer}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления list}
 *
 * @demo Controls-demo/Explorer/Explorer
 * @demo Controls-demo/Explorer/Search
 *
 * @class Controls/explorer:View
 * @extends UI/Base:Control
 * @implements Controls/list:IReloadableList
 * @implements Controls/interface:ISource
 * @implements Controls/interface/ITreeGridItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/grid:IEditableGrid
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IHierarchy
 * @implements Controls/tree:ITree
 * @implements Controls/explorer:IExplorer
 * @implements Controls/interface:IDraggable
 * @implements Controls/tile:ITile
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/_explorer/interface/IExplorer
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IRemovableList
 * @implements Controls/marker:IMarkerList
 * @implements Controls/tile:ITreeTile
 * @implements Controls/error:IErrorControllerOptions
 *
 * @public
 */
export default class Explorer extends Control<IExplorerOptions> implements IEditableList {
    // region protected fields
    protected _template: TemplateFunction = template;
    protected _viewName: string;
    protected _viewTemplate: typeof TreeGridControl = TreeGridControl;
    protected _markerStrategy: string;
    protected _viewMode: TExplorerViewMode;
    protected _viewModelConstructor: string;
    protected _notifyCallback: TNotifyCallback = (...args) => {
        return this._notify.call(this, ...args);
    };
    private _navigation: INavigationOptionValue<INavigationSourceConfig>;
    protected _itemTemplate: string | TemplateFunction;
    protected _groupTemplate: string | TemplateFunction;
    protected _notifyHandler: typeof EventUtils.tmplNotify = EventUtils.tmplNotify;
    protected _backgroundStyle: string;
    protected _itemsSetCallback: Function;
    protected _itemPadding: object;
    protected _dragOnBreadCrumbs: boolean = false;
    protected _needSetMarkerCallback: (item: Model, domEvent: Event) => boolean;
    protected _canStartDragNDrop: Function;
    /**
     * Флаг идентифицирует нужно или нет пересоздавать коллекцию для списка.
     * Прокидывается в TreeControl (BaseControl).
     */
    protected _recreateCollection: boolean = false;

    /**
     * Текущее применяемое значение строки поиска
     */
    protected _searchValue: string = '';
    /**
     * Новое значение строки поиска, которое будет применено после загрузки данных и
     * смены viewMode
     */
    private _newSearchValue: string;

    /**
     * Текущая применяемая конфигурация колонок
     */
    protected _columns: IColumn[];
    /**
     * Новая конфигурация колонок, которую мы задерживаем до выполнения асинхронной операции.
     */
    protected _newColumns: IColumn[];

    /**
     * Текущая применяемая конфигурация заголовков колонок
     */
    protected _header: IHeaderCell[];
    /**
     * Новая конфигурация заголовков колонок, которую мы задерживаем до выполнения асинхронной операции.
     */
    protected _newHeader: IHeaderCell[];

    protected _itemActionsPosition: string;
    protected _searchInitialBreadCrumbsMode: 'row' | 'cell';

    // Состояния необходимые для корректной работы проводника с горизонтальным скроллом.

    /**
     * При горизонтальном скролле представление оборачивается в скроллконтейнер с возможностью
     * горизонтального скроллирования. Все зафиксированные элементы обернуты в Controls/scroll:StickyBlock,
     * работающий через position: sticky. Исходя из нативных особенностей работы position: sticky, такой блок
     * должен иметь ограниченную ширину. В противном случае фиксация не произойдет и блок будет скроллироваться.
     * @protected
     */
    protected _breadCrumbsMaxWidth?: number;

    protected _children: {
        treeControl: TreeGridControl;
        pathController: PathController;
        scrollObserver: ScrollEmitter;
    };

    protected _itemsSelector: string = '.controls-ListView__itemV';
    // endregion

    // region private fields
    /**
     * Идентификатор самого верхнего корневого элемента.
     * Вычисляется на основании хлебных крошек либо на основании текущего root
     * если хлебные крошки отсутствуют.
     */
    private _topRoot: TKey;
    /**
     * Текущие данные хлебных крошек
     */
    protected _breadcrumbs: Path;
    private _hoveredBreadCrumb: string;
    private _dragControlId: string;
    private _markerForRestoredScroll: TKey;
    private _resetScrollAfterViewModeChange: boolean = false;
    private _isMounted: boolean = false;
    private _restoredMarkedKeys: IMarkedKeysStore = {};
    private _potentialMarkedKey: TKey;
    private _newItemPadding: IItemPadding;
    private _newItemActionsPosition: string;
    private _newItemTemplate: string | TemplateFunction;
    private _itemTemplateOptions: { [key: string]: unknown };
    private _newItemTemplateOptions: { [key: string]: unknown };
    private _newBackgroundStyle: string;
    /**
     * Флаг, идентифицирующий, что в данный момент идет переход назад
     */
    protected _isGoingBack: boolean;
    // Восстановленное значение курсора при возврате назад по хлебным крошкам
    private _restoredCursor: unknown;
    private _pendingViewMode: TExplorerViewMode;

    private _items: RecordSet;
    // Флаг идентифицирует что идет проваливание в папку. Именно проваливание, а не возврат по крошкам
    private _isGoingFront: boolean;
    // endregion

    //# region views loading configurations
    private _viewControllers: IViewControllers = {
        search: null,
        tile: TreeGridControl,
        table: TreeGridControl,
        list: TreeGridControl,
        columns: TreeGridControl,
    };

    private _viewNames: IViewNames = {
        search: null,
        tile: null,
        table: TreeGridView,
        list: ListView,
        columns: null,
    };

    private _viewTableNames: IViewTableNames = {
        search: null,
        tile: null,
        table: TreeGridViewTable,
        list: ListView,
        columns: null,
    };

    private _viewModelConstructors: IViewModelConstructors = {
        search: null,
        tile: null,
        table: 'Controls/treeGrid:TreeGridCollection',
        list: 'Controls/treeGrid:TreeGridCollection',
        columns: null,
    };

    private _viewItemsSelector: TViewItemsSelector = {
        columns: null,
        list: '.controls-ListView__itemV',
        tile: '.controls-ListView__itemV',
        table: '.controls-ListView__itemV',
        search: '.controls-ListView__itemV',
    };

    private _viewVirtualScrollController: Record<TInnerViewMode, unknown> = {
        columns: null,
        list: ListVirtualScrollController,
        tile: ListVirtualScrollController,
        table: ListVirtualScrollController,
        search: ListVirtualScrollController,
    };

    protected _listVirtualScrollControllerConstructor: unknown;

    //# endregion

    // region life circle hooks
    protected _beforeMount(cfg: IExplorerOptions): Promise<void> | void {
        this._disableVirtualScrollForColumns =
            cfg.disableVirtualScroll !== undefined ? cfg.disableVirtualScroll : true;

        // Если крошки не скрыты, то грузим их что бы при проваливании они отрисовались без прыжков.
        // Безусловно грузить эти модули мы не можем т.к. есть реестры,
        // где крошки не нужны. И тогда мы получим деградацию по трафику.
        if (cfg.breadcrumbsVisibility !== 'hidden') {
            executeSyncOrAsync(['Controls/breadcrumbs'], () => {
                /**/
            });
        }

        if (cfg.itemPadding) {
            this._itemPadding = cfg.itemPadding;
        }
        if (cfg.itemTemplate) {
            this._itemTemplate = cfg.itemTemplate;
        }
        if (cfg.itemTemplateOptions) {
            this._itemTemplateOptions = cfg.itemTemplateOptions;
        }
        if (cfg.groupTemplate) {
            this._groupTemplate = cfg.groupTemplate;
        }
        if (cfg.backgroundStyle) {
            this._backgroundStyle = cfg.backgroundStyle;
        }
        if (cfg.header) {
            // нужно проставить и _header и _newHeader иначе здесь ниже в _setViewMode
            // при _applyNewVisualOptions проставится this._newHeader в _header, т.к.
            // они сейчас сравниваются на равенство
            // TODO: Нужно отрефакторить эту логику. Сейчас заголовок нужен только
            //  при viewMode === 'search' || 'table' + на него завязана проверка видимости
            //  шапки с хлебными крошками в PathWrapper, но эту проверку можно также на viewMode сделать
            this._newHeader = this._header = cfg.viewMode === 'tile' ? undefined : cfg.header;
        }
        if (cfg.columns) {
            this._columns = this._newColumns = cfg.columns;
        }
        if (cfg.searchValue) {
            this._searchValue = cfg.searchValue;
        }

        this._itemActionsPosition = cfg.itemActionsPosition;

        this._canMoveMarker = this._canMoveMarker.bind(this);
        this._onItemClick = this._onItemClick.bind(this);
        this._itemMouseDown = this._itemMouseDown.bind(this);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._itemsSetCallback = this._itemsSetCallbackFunc.bind(this);
        this._canStartDragNDrop = this._canStartDragNDropFunc.bind(this);
        this._breadCrumbsDragHighlighter = this._breadCrumbsDragHighlighter.bind(this);
        // Определяет нужно или нет ставить маркер на указанную запись
        this._needSetMarkerCallback = (item: Model, domEvent: Event): boolean => {
            return (
                item instanceof Array ||
                !!(domEvent.target as HTMLElement).closest('.js-controls-ListView__checkbox') ||
                // Маркер не ставим на папки при проваливании, но если expandByItemClick, то ставить нужно
                item.get(this._options.nodeProperty) !== ITEM_TYPES.node ||
                !!this._options.expandByItemClick
            );
        };

        this._navigation = cfg.navigation;
        this._dragControlId = cfg.dragControlId || randomId();

        // Это нужно для попадания стилей плитки в bundle на сервере
        // https://online.sbis.ru/opendoc.html?guid=f9cf5faa-15cf-4286-9721-a2e4439c0b5d
        if (cfg.viewMode === 'tile') {
            addPageDeps(['css!Controls/tile']);
        } else if (cfg.viewMode === 'list' && cfg.useColumns) {
            addPageDeps(['css!Controls/columns']);
        }

        if (!isFullGridSupport() && cfg.viewMode === 'table') {
            addPageDeps(['Controls/gridIE']);
        }

        this._onBreadcrumbsChanged(cfg.breadCrumbsItems, cfg);

        return this._setViewMode(cfg.viewMode, cfg);
    }

    protected _afterMount(): void {
        this._isMounted = true;
        this._notify(
            'register',
            ['rootChanged', this, this._setRootOnBreadCrumbsClick.bind(this)],
            { bubbling: true }
        );
        this._children.scrollObserver.startRegister([this._children.scrollObserver]);
    }

    protected _beforeUpdate(cfg: IExplorerOptions): void {
        const isViewModeChanged =
            cfg.viewMode !== this._options.viewMode || cfg.useColumns !== this._options.useColumns;
        // Проверяем именно root в опциях
        // https://online.sbis.ru/opendoc.html?guid=4b67d75e-1770-4e79-9629-d37ee767203b
        const isRootChanged = cfg.root !== this._options.root;

        // При смене рута нужно обновить и topRoot, т.к. данные хлебных крошек
        // могут остаться неизменными, например, null -> null, но т.к. рут поменялся,
        // то и topRoot должен измениться
        if (isRootChanged) {
            this._topRoot = this._getTopRoot(this._breadcrumbs, cfg.parentProperty, cfg.root);
        }

        // Нужно пересоздавать коллекцию если viewMode меняют со списка на таблицу.
        // Т.к. у списка и таблицы заданы одинаковые коллекции, то изменение набора колонок
        // с прикладной стороны в режиме list не приводит к прокидыванию новых колонок в модель
        // и в итоге таблица разъезжается при переключении в режим таблицы
        this._recreateCollection = needRecreateCollection(this._options.viewMode, cfg.viewMode);

        // Мы не должны ставить маркер до проваливания, т.к. это лишняя синхронизация.
        // Но если отменили проваливание, то нужно поставить маркер.
        if (this._potentialMarkedKey !== undefined && !isRootChanged) {
            this._children.treeControl.setMarkedKey(this._potentialMarkedKey);
        }
        if (!this._isGoingBack) {
            this._potentialMarkedKey = undefined;
        }

        const isSourceControllerLoading = cfg.sourceController && cfg.sourceController.isLoading();
        this._resetScrollAfterViewModeChange = isViewModeChanged && !isRootChanged;

        // region freeze options
        if (!isEqual(cfg.itemPadding, this._options.itemPadding)) {
            this._newItemPadding = cfg.itemPadding;
        }

        if (cfg.itemTemplate !== this._options.itemTemplate) {
            this._newItemTemplate = cfg.itemTemplate;
        }

        if (cfg.itemTemplateOptions !== this._options.itemTemplateOptions) {
            this._newItemTemplateOptions = cfg.itemTemplateOptions;
        }

        if (cfg.backgroundStyle !== this._options.backgroundStyle) {
            this._newBackgroundStyle = cfg.backgroundStyle;
        }

        if (cfg.header !== this._options.header || isViewModeChanged) {
            this._newHeader = cfg.viewMode === 'tile' ? undefined : cfg.header;
        }

        if (cfg.columns !== this._options.columns) {
            this._newColumns = cfg.columns;
        }

        if (cfg.searchValue !== this._options.searchValue) {
            this._newSearchValue = cfg.searchValue || '';
        }

        if (cfg.itemActionsPosition !== this._options.itemActionsPosition) {
            /* Нужно задерживать itemActionsPosition, потому что добавляется дополнительная колонка в гриде
               Если сменить таблицу на плитку, то на время загрузки вьюхи таблица разъедется
            */
            this._newItemActionsPosition = cfg.itemActionsPosition;
        }
        // endregion

        if (cfg.breadCrumbsItems !== this._options.breadCrumbsItems) {
            this._onBreadcrumbsChanged(cfg.breadCrumbsItems, cfg);
        }

        const navigationChanged = !isEqual(cfg.navigation, this._options.navigation);
        if (navigationChanged) {
            this._navigation = cfg.navigation;
        }

        const willBeDataRequest = isRootChanged && !cfg.sourceController;
        // Если меняется рут и нам не передан sourceController или переданный sourceController сейчас
        // выполняет загрузку данных, то инициируем отложенное прокидывание новых опций, т.к. до
        // загрузки новых данных ничего менять не надо что бы не было лишних скачков и перерисовок
        if (
            willBeDataRequest ||
            (isViewModeChanged && (willBeDataRequest || isSourceControllerLoading)) ||
            (this._pendingViewMode && cfg.viewMode !== this._pendingViewMode)
        ) {
            this._setPendingViewMode(cfg.viewMode, cfg);
        } else if (isViewModeChanged && !this._pendingViewMode) {
            // Также отложенно необходимо устанавливать viewMode, если при переходе с viewMode === "search" на "table"
            // или "tile" будет перезагрузка. Этот код нужен до тех пор, пока не будут спускаться данные сверху-вниз.
            // https://online.sbis.ru/opendoc.html?guid=f90c96e6-032c-404c-94df-cc1b515133d6
            const filterChanged = !isEqual(cfg.filter, this._options.filter);
            const recreateSource =
                cfg.source !== this._options.source ||
                (isSourceControllerLoading && this._options.viewMode === 'search');
            const sortingChanged = !isEqual(cfg.sorting, this._options.sorting);

            if (
                (filterChanged || recreateSource || sortingChanged || navigationChanged) &&
                !cfg.sourceController
            ) {
                this._setPendingViewMode(cfg.viewMode, cfg);
            } else {
                this._checkedChangeViewMode(cfg.viewMode, cfg);
            }
        } else if (
            !isViewModeChanged &&
            this._pendingViewMode &&
            cfg.viewMode === this._pendingViewMode &&
            cfg.sourceController
        ) {
            // https://online.sbis.ru/opendoc.html?guid=7d20eb84-51d7-4012-8943-1d4aaabf7afe
            if (!this._viewModelConstructors[this._pendingViewMode]) {
                // Делаю синхронным установку viewMode, что требуется для отрисовки без моргания, когда библиотека
                // Controls/columns или Controls/treeTile уже загружены HOC'ом (например, newBrowser'ом)
                // https://online.sbis.ru/opendoc.html?guid=88261118-1965-41ec-ac73-b0a32caa26ed
                const res =
                    this._pendingViewMode === 'search'
                        ? this._loadSearchGridViewMode()
                        : this._loadTileViewMode(cfg);
                if (res instanceof Promise) {
                    res.then(() => {
                        this._setViewModeSync(this._pendingViewMode, cfg);
                    });
                } else {
                    this._setViewModeSync(this._pendingViewMode, cfg);
                }
            } else {
                this._setViewModeSync(this._pendingViewMode, cfg);
            }
        } else if (this._viewModelConstructors[cfg.viewMode]) {
            // Применяем опции только если уже загружен текущий viewMode, иначе в момент попадания в данную точку
            // мы уже загружаем viewMode и _applyNewVisualOptions будет вызван в каллбеке после его загрузки
            // https://online.sbis.ru/opendoc.html?guid=2785c4f9-f339-4536-b531-b59e0890d894
            this._applyNewVisualOptions();
        }
    }

    protected _beforeRender(): void {
        // Сбрасываем скролл при смене режима отображения
        // https://online.sbis.ru/opendoc.html?guid=d4099117-ef37-4cd6-9742-a7a921c4aca3
        if (this._resetScrollAfterViewModeChange) {
            this._children.treeControl.scrollTo('top');
            this._resetScrollAfterViewModeChange = false;
        }
    }

    protected _afterRender(): void {
        if (this._markerForRestoredScroll !== null) {
            this.scrollToItem(this._markerForRestoredScroll);
            this._markerForRestoredScroll = null;
        }

        // Сбрасываем флаг, который прокидывается в TreeControl иначе модель будет постоянно пересоздаваться
        if (this._recreateCollection) {
            this._recreateCollection = false;
        }
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['rootChanged', this], { bubbling: true });
    }
    // endregion

    protected _documentDragEnd(event: SyntheticEvent, dragObject: IDragObject): void {
        if (this._hoveredBreadCrumb !== undefined) {
            this._notify('customdragEnd', [dragObject.entity, this._hoveredBreadCrumb, 'on']);
        }
        this._dragOnBreadCrumbs = false;
    }

    protected _documentDragStart(
        event: SyntheticEvent,
        dragObject: IDragObject<ItemsEntity>
    ): void {
        // TODO: Sometimes at the end of dnd, the parameter is not reset. Will be fixed by:
        //  https://online.sbis.ru/opendoc.html?guid=85cea965-2aa6-4f1b-b2a3-1f0d65477687
        this._hoveredBreadCrumb = undefined;

        const dragEntity = dragObject.entity as ItemsEntity & {
            dragControlId: string;
        };
        if (
            this._options.itemsDragNDrop &&
            this._options.parentProperty &&
            cInstance.instanceOfModule(dragEntity, 'Controls/dragnDrop:ItemsEntity') &&
            dragEntity.dragControlId === this._dragControlId
        ) {
            // Принудительно показываем "домик" в хлебных крошках если находимся не в корневом узле
            // или не все перетаскиваемые итемы лежат в корне
            this._dragOnBreadCrumbs =
                this._options.root !== this._topRoot ||
                !this._dragItemsFromRoot(dragObject.entity.getItems());
        }
    }

    protected _hoveredCrumbChanged(event: SyntheticEvent, item: Model): void {
        event.stopPropagation();
        this._hoveredBreadCrumb = item ? item.getKey() : undefined;
    }

    protected _breadCrumbsDragHighlighter(itemKey: TKey, hasArrow: boolean): string {
        return this._dragOnBreadCrumbs && this._hoveredBreadCrumb === itemKey && itemKey !== 'dots'
            ? 'controls-BreadCrumbsView__dropTarget_' + (hasArrow ? 'withArrow' : 'withoutArrow')
            : '';
    }

    protected _onItemClick(
        items: Model | Model[],
        clickEvent: SyntheticEvent,
        columnIndex?: number
    ): boolean {
        let item: Model;
        if (items instanceof Array) {
            item = items[items.length - 1];
        } else {
            item = items;
        }

        const res = this._notify('itemClick', [item, clickEvent, columnIndex]) as boolean;

        const changeRoot = () => {
            // Перед проваливанием запомним значение курсора записи, т.к. в крошках могут его не прислать
            const currRootInfo = this._restoredMarkedKeys[this._options.root];
            if (currRootInfo && isCursorNavigation(this._navigation)) {
                const cursorValue = getCursorValue(item as Model, this._navigation);
                if (cursorValue) {
                    currRootInfo.cursorPosition = cursorValue;
                }
            }

            let savedPosition;
            // При проваливании нужно сбросить восстановленное значение курсора
            // иначе данные загрузятся не корректные
            if (
                isCursorNavigation(this._navigation) &&
                this._restoredCursor === this._navigation.sourceConfig.position
            ) {
                savedPosition = this._navigation.sourceConfig.position;
                this._navigation.sourceConfig.position = null;
            }

            const rootChanged = this._setRoot(item.getKey());
            if (rootChanged === false) {
                // Восстановим значение курсора если оно было изменено
                if (savedPosition) {
                    (
                        this._navigation as INavigationOptionValue<INavigationPositionSourceConfig>
                    ).sourceConfig.position = savedPosition;
                }

                return;
            }

            // При search не должны сбрасывать маркер, так как он встанет на папку
            if (this._options.searchNavigationMode !== 'expand') {
                this._isGoingFront = true;
            }
        };

        // Не нужно проваливаться в папку, если должно начаться ее редактирование.
        // TODO: После перехода на новую схему редактирования это должен решать baseControl или treeControl.
        //    в данной реализации получается, что в дереве с возможностью редактирования не получится
        //    развернуть узел кликом по нему (expandByItemClick).
        //    https://online.sbis.ru/opendoc.html?guid=f91b2f96-d6e7-45d0-b929-a0030f0a2788
        const isNodeEditable = () => {
            const hasEditOnClick =
                !!this._options.editingConfig && !!this._options.editingConfig.editOnClick;
            return (
                hasEditOnClick &&
                !(clickEvent.target as HTMLElement).closest(`.${NOT_EDITABLE_JS_SELECTOR}`)
            );
        };

        const shouldHandleClick = res !== false && !isNodeEditable();

        if (shouldHandleClick) {
            const itemType = item.get(this._options.nodeProperty);
            const isGroupNode = this._options.nodeTypeProperty
                ? item.get(this._options.nodeTypeProperty) === 'group'
                : false;
            const isSearchMode = this._viewMode === 'search';

            // Проваливание возможно только в узел (ITEM_TYPES.node).
            // Проваливание невозможно, если по клику следует развернуть узел/скрытый узел.
            if (
                (!isSearchMode &&
                    this._options.expandByItemClick &&
                    itemType !== ITEM_TYPES.leaf) ||
                itemType !== ITEM_TYPES.node ||
                isGroupNode
            ) {
                return res;
            }

            // Если в списке запущено редактирование, то проваливаемся только после успешного завершения.
            if (!this._children.treeControl.isEditing()) {
                changeRoot();
            } else {
                this.commitEdit().then((result) => {
                    if (!(result && result.canceled)) {
                        changeRoot();
                    }
                    return result;
                });
            }

            // Проваливание в папку и попытка проваливания в папку не должны вызывать разворот узла.
            // Мы не можем провалиться в папку, пока на другом элементе списка запущено редактирование.
            return false;
        }

        return res;
    }

    /**
     * Обрабатываем изменение хлебных крошек от внутреннего DataContainer.
     * Сейчас хлебные крошки используются:
     *  * для вычисления topRoot
     *  * для вычисления id записи, которая должна быть помечена при возврате
     *  назад по хлебным крошкам.
     */
    protected _onBreadcrumbsChanged(
        breadcrumbs: Path,
        options: IExplorerOptions = this._options
    ): void {
        const isSearchViewMode = options.viewMode === 'search';
        const isGoingBack = detectGoingBackByPath(this._breadcrumbs, breadcrumbs);

        // Проставим флаг _isGoingBack только в том случае, если мы не в режиме поиска и на основании пути определено,
        // что идет переход назад. Т.к. в режиме поиска крошки сбрасываются и тогда просто проверки путей недостаточно.
        this._isGoingBack = !isSearchViewMode && isGoingBack;

        if (this._isGoingBack) {
            const curRoot = options.root;

            if (this._restoredMarkedKeys[curRoot]) {
                this._potentialMarkedKey = this._restoredMarkedKeys[curRoot].markedKey;
            }
        }

        const parentProperty = options.parentProperty;

        this._breadcrumbs = breadcrumbs;
        this._topRoot = this._getTopRoot(breadcrumbs, parentProperty, options.root);

        // На основании новых данных заполним хранилище в котором хранятся идентификаторы
        // помеченных записей для каждого корня
        this._initMarkedKeys(
            options.root,
            this._topRoot,
            breadcrumbs,
            parentProperty,
            options.navigation
        );
    }

    protected _onBreadcrumbsClick(event: SyntheticEvent, item: Model): void {
        const newRoot = item.getKey();
        this._setRootOnBreadCrumbsClick(newRoot);
    }

    private _setRootOnBreadCrumbsClick(root: TKey): void {
        const rootChanged = this._setRoot(root);

        // Если смену root отменили, то и делать ничего не надо, т.к.
        // остаемся в текущей папке
        if (rootChanged === false) {
            return;
        }

        this._isGoingBack = true;

        // При переходе назад нужно проставить сохраненный маркер для этого корня.
        // По факту он конечно сейчас не проставится, но это вызовет событие об изменении
        // markerKey и если у прикладника был bind, то это обновит значение опции и все
        // последующие синхронизации будут идти с актуальным markedKey.
        // В противном случае setMarkedKey в itemsSetCallback может не сработать в этом же
        // цикле синхронизации если сверху был передан markedKey !== undefined. Т.к. в
        // BaseControl метод setMarkedKey проставляет маркер синхронно только если в опциях
        // не указан markedKey
        const markedKey = this._restoredMarkedKeys[root]?.markedKey;
        if (markedKey) {
            this._potentialMarkedKey = markedKey;
            this._children.treeControl.setMarkedKey(markedKey);
        }

        /*
          Позиция скрола при выходе из папки восстанавливается через скроллирование к отмеченной записи.
          Чтобы список мог восстановить позицию скрола по отмеченой записи, она должна быть в наборе данных.
          Чтобы обеспечить ее присутствие, нужно загружать именно ту страницу, на которой она есть.
          Восстановление работает только при курсорной навигации.

          Далее какой-то странный сценарий, непонятно на сколько он актуальный:
          Если в момент возвращения из папки был изменен тип навигации, не нужно восстанавливать, иначе будут
          смешаны опции курсорной и постраничной навигаций.
         */
        // Если загрузка данных осуществляется снаружи explorer и включена навигация по курсору,
        // то нужно восстановить курсор, что бы тот, кто грузит данные сверху выполнил запрос с
        // корректным значением курсора
        if (isCursorNavigation(this._options.navigation)) {
            this._restoredCursor = this._restorePositionNavigation(root);
        }
    }

    protected _onExternalKeyDown(event: SyntheticEvent): void {
        this._onExplorerKeyDown(event);
        if (!event.isStopped() && event.isBubbling()) {
            this._children.treeControl.handleKeyDown(event);
        }
    }

    protected _onExplorerKeyDown(event: SyntheticEvent): void {
        // Хитрая система обработки нажатия клавиш.
        // В данном случае обрабатываем только Backspace, вызывая наш метод _backByPath,
        // в который первым аргументом придет null (4-й аргумент ф-ии keysHandler),
        // а вторым объект события (1-й аргумент ф-ии keysHandler)
        EventUtils.keysHandler(event, HOT_KEYS, this, null, false);
    }

    protected _itemMouseDown(item: Model, nativeEvent: MouseEvent): void {
        if (this._viewMode !== 'search' && !this._options.expandByItemClick) {
            const itemType = item.get(this._options.nodeProperty);

            // делаем подгрузку только при клике левой кнопкой мыши
            // https://online.sbis.ru/opendoc.html?guid=2b2ec279-7509-436d-bf20-56dc720cafa7&client=3
            if (nativeEvent.button === 0 && itemType === ITEM_TYPES.node) {
                this._options.onBeforeRootChanged?.(item.getKey());
                this._notify('beforeRootChanged', [item.getKey()]);
            }
        }
        this._notify('itemMouseDown', [item, nativeEvent]);
    }

    /**
     * Обработчик нажатия клавиши Backspace
     * @see _onExplorerKeyDown
     */
    protected _backByPath(scope: unknown, event: Event): void {
        this._children.pathController.goBack(event);
    }

    // region proxy methods to TreeControl
    scrollTo(...args: TreeFnParams<'scrollTo'>): TreeFnReturn<'scrollTo'> {
        return this._children.treeControl.scrollTo(...args);
    }

    scrollToItem(
        key: string | number,
        position?: string,
        force?: boolean,
        allowLoad?: boolean
    ): Promise<void> | void {
        if (this._children.treeControl) {
            return this._children.treeControl.scrollToItem(key, position, force, allowLoad);
        }
    }

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        return this._children.treeControl.reloadItem(key, options);
    }

    /**
     * Перезагружает указанные записи списка. Для этого отправляет запрос query-методом
     * со значением текущего фильтра в поле [parentProperty] которого передаются идентификаторы
     * родительских узлов.
     */
    reloadItems(ids: TKey[]): Promise<RecordSet | Error> {
        return this._children.treeControl.reloadItems(ids);
    }

    horizontalScrollTo(position: number, smooth: boolean = false): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).horizontalScrollTo(
            position,
            smooth
        );
    }

    scrollToLeft(): void {
        if (this._children.treeControl) {
            this._children.treeControl.scrollToLeft();
        }
    }

    scrollToRight(): void {
        if (this._children.treeControl) {
            this._children.treeControl.scrollToRight();
        }
    }

    scrollToColumn(columnIndexOrKey: number | string): void {
        if (this._children.treeControl) {
            this._children.treeControl.scrollToColumn(columnIndexOrKey);
        }
    }

    // region IEditableList

    beginEdit(...args: TreeFnParams<'beginEdit'>): TreeFnReturn<'beginEdit'> {
        return this._children.treeControl.beginEdit(...args);
    }

    beginAdd(...args: TreeFnParams<'beginAdd'>): TreeFnReturn<'beginAdd'> {
        return this._children.treeControl.beginAdd(...args);
    }

    commitEdit(...args: TreeFnParams<'commitEdit'>): TreeFnReturn<'commitEdit'> {
        return this._children.treeControl.commitEdit(...args);
    }

    cancelEdit(...args: TreeFnParams<'cancelEdit'>): TreeFnReturn<'cancelEdit'> {
        return this._children.treeControl.cancelEdit(...args);
    }

    // endregion IEditableList

    reload(keepNavigation: boolean = false, sourceConfig?: IBaseSourceConfig): Promise<unknown> {
        const treeControl = this._getTreeControl();
        if (!treeControl) {
            return Promise.reject();
        }
        return treeControl.reload(keepNavigation, sourceConfig);
    }

    getItems(): RecordSet {
        return this._getTreeControl()?.getItems();
    }

    // todo removed or documented by task:
    // https://online.sbis.ru/opendoc.html?guid=24d045ac-851f-40ad-b2ba-ef7f6b0566ac
    toggleExpanded(id: TKey): Promise<unknown> {
        return this._children.treeControl.toggleExpanded(id);
    }

    // region mover

    moveItems(
        selection: ISelectionObject,
        targetKey: CrudEntityKey,
        position: LOCAL_MOVE_POSITION,
        viewCommandName?: string
    ): Promise<DataSet> {
        return this._children.treeControl.moveItems(
            selection,
            targetKey,
            position,
            viewCommandName
        );
    }

    moveItemUp(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._children.treeControl.moveItemUp(selectedKey, viewCommandName);
    }

    moveItemDown(selectedKey: CrudEntityKey, viewCommandName?: string): Promise<void> {
        return this._children.treeControl.moveItemDown(selectedKey, viewCommandName);
    }

    moveItemsWithDialog(selection: ISelectionObject, viewCommandName?: string): Promise<DataSet> {
        return this._children.treeControl.moveItemsWithDialog(selection, viewCommandName);
    }

    // endregion mover

    // region remover

    removeItems(selection: ISelectionObject, viewCommandName?: string): Promise<string | void> {
        return this._children.treeControl.removeItems(selection, viewCommandName);
    }

    removeItemsWithConfirmation(
        selection: ISelectionObject,
        viewCommandName?: string
    ): Promise<string | void> {
        return this._children.treeControl.removeItemsWithConfirmation(selection, viewCommandName);
    }

    // endregion remover

    // TODO удалить по https://online.sbis.ru/opendoc.html?guid=2ad525f0-2b48-4108-9a03-b2f9323ebee2
    _clearSelection(): void {
        this._children.treeControl.clearSelection();
    }

    getMarkedNodeKey(): TKey {
        return this._children.treeControl.getMarkedNodeKey();
    }
    // endregion

    private _getTreeControl(): TreeGridControl {
        // Удалить это логирование в хф к 22.2100
        // https://online.sbis.ru/opendoc.html?guid=63c08045-cd90-4722-9ade-f474685c7848
        if (!this._children?.treeControl) {
            Logger.error(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                "Trying to call child control which isn't rendered; explorer.View._destroyed=" +
                    this._destroyed +
                    '; explorer.View._mounted=' +
                    this._isMounted,
                this
            );
        }
        return this._children?.treeControl;
    }

    /**
     * Посылает событие о смене root и возвращает результат обработки этого события
     */
    private _setRoot(root: TKey, dataRoot: TKey = null): boolean {
        let result = true;

        if (this._options.hasOwnProperty('root')) {
            // часть механизма простановки маркера вместе с this._needSetMarkerCallback
            // https://online.sbis.ru/opendoc.html?guid=aa51a7c3-7813-4af5-a9ea-eb703ce15e76
            this._potentialMarkedKey = root;
        }

        if (typeof this._options.itemOpenHandler === 'function') {
            this._options.itemOpenHandler(root, this._items, dataRoot);
        }

        if (this._isMounted) {
            this._options.onRootChanged?.(root);
            result = this._notify('rootChanged', [root]) as boolean;
        }

        this._forceUpdate();
        return result;
    }

    private _initMarkedKeys(
        root: TKey,
        topRoot: TKey,
        breadcrumbs: Path,
        parentProperty: string,
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): void {
        const store = this._restoredMarkedKeys;

        if (!store[root]) {
            store[root] = { markedKey: null };
        }

        if (!store[topRoot]) {
            store[topRoot] = { markedKey: null };
        }

        // Если хлебных крошек нет, то дальше идти нет смысла
        if (!breadcrumbs?.length) {
            this._restoredMarkedKeys = store;
            return;
        }

        const actualIds = [root + '', topRoot + ''];
        breadcrumbs?.forEach((crumb) => {
            const crumbKey = crumb.getKey();
            const parentKey = crumb.get(parentProperty);

            actualIds.push(crumbKey + '');
            store[crumbKey] = {
                parent: parentKey,
                markedKey: null,
                // В крошке может не быть информации о курсоре, но она могла быть
                // в самой записи в которую провалились
                cursorPosition: store[crumbKey]?.cursorPosition,
            };

            if (store[parentKey]) {
                store[parentKey].markedKey = crumbKey;

                if (isCursorNavigation(navigation)) {
                    const cursorValue = getCursorValue(crumb, navigation);
                    if (cursorValue) {
                        store[parentKey].cursorPosition = cursorValue;
                    }
                }
            }
        });

        // Пробежимся по ключам сформированного store и выкинем
        // все ключи, которых нет в текущих крошках
        Object.keys(store).forEach((storeKey) => {
            if (!actualIds.includes(storeKey)) {
                delete store[storeKey];
            }
        });
        this._restoredMarkedKeys = store;
    }

    private _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
        if (this._options.itemsReadyCallback) {
            this._options.itemsReadyCallback(items);
        }
    }

    private _itemsSetCallbackFunc(items: RecordSet, newOptions: IExplorerOptions): void {
        if (this._isGoingBack) {
            if (this._potentialMarkedKey) {
                this._children.treeControl.setMarkedKey(this._potentialMarkedKey);
                this._markerForRestoredScroll = this._potentialMarkedKey;
                this._potentialMarkedKey = undefined;

                // Вызывает _forceUpdate иначе у нас может не стрельнуть _afterRender
                // и _markerForRestoredScroll не применится
                this._forceUpdate();
            }

            if (
                isCursorNavigation(this._navigation) &&
                this._restoredCursor === this._navigation.sourceConfig.position
            ) {
                this._navigation.sourceConfig.position = null;
            }

            this._isGoingBack = false;
        }

        if (this._isGoingFront) {
            // Проверить. Возможно, больше этот код не нужен.
            // До перевода на наследование работало так:
            // 1. При входе в папку через хлебные крошки маркер контроллер устанавливал новую опцию
            // 2. baseControl стрелял событие markedKeyChanged, контрол-родитель(в кейсе - демка),
            // забиндивший опцию ловил его и менял у себя состояние.
            // 3. Происходил еще один цикл синхронизации, в котором старое и новое значение ключа разные.
            // 4. По иерархии, шло обновление treeControl, который тут устанавливал снова новый ключ
            // маркера - null (в itemsSetCallback от эксплорера).
            // 5. update доходит до BaseControl'a и ключ маркера устанавливается по новым опциям
            // (ключ папки в которую вошли).
            // [ ключ папки -> обновление бинда -> цикл -> treeControl: ключ null (itemsSetCallback) ->
            // baseControl: ключ по бинду]

            // При проваливании в папку маркер нужно сбрасывать
            this._children.treeControl.setMarkedKey(null);

            // После перехода на наследование, между обновлением treeControl и baseControl разрыва нет, более того,
            // поменялся порядок апдейтов контролов. После перевода на наследование сначала обновляется BaseControl.
            this._isGoingFront = false;
        }

        if (this._pendingViewMode) {
            this._checkedChangeViewMode(this._pendingViewMode, this._options);
            this._pendingViewMode = null;
        }
    }

    private _canMoveMarker(): boolean {
        return !this._isGoingFront;
    }

    protected _getColumnScrollSelectors() {
        // TODO: После переписывания таблиц на реакт это уйдет в Controls/_gridColumnScroll/GridControl.
        // Проверка нужна, т.к. wml заходит во все функции, даже те, которые обернуты в условие.
        if (isLoaded('Controls/gridColumnScroll')) {
            return loadSync<typeof import('Controls/gridColumnScroll')>('Controls/gridColumnScroll')
                .SELECTORS;
        }
    }

    private _setViewConfig(viewMode: TExplorerViewMode, cfg: IExplorerOptions): void {
        const resolvedViewMode = resolveViewMode(viewMode, cfg.useColumns);

        const baseView = (isFullGridSupport() ? this._viewNames : this._viewTableNames)[
            resolvedViewMode
        ];
        if ((resolvedViewMode === 'table' || resolvedViewMode === 'search') && isReactView(cfg)) {
            resolveViewControls(this, cfg, baseView, TreeGridControl, this._viewControllers[resolvedViewMode]);
        } else {
            this._viewName = baseView;
            this._viewTemplate = TreeGridControl;
        }

        this._setInitBreadCrumbsMode();
        this._markerStrategy = MARKER_STRATEGY[resolvedViewMode];
        this._viewModelConstructor = this._viewModelConstructors[resolvedViewMode];
        this._listVirtualScrollControllerConstructor =
            this._viewVirtualScrollController[resolvedViewMode];
        this._itemsSelector = this._viewItemsSelector[resolvedViewMode];
    }

    private _setViewModeSync(viewMode: TExplorerViewMode, cfg: IExplorerOptions): void {
        this._viewMode = viewMode;
        this._setViewConfig(this._viewMode, cfg);
        this._applyNewVisualOptions();

        if (this._isMounted) {
            this._notify('viewModeChanged', [viewMode]);
        }
    }

    private _setViewMode(viewMode: TExplorerViewMode, cfg: IExplorerOptions): Promise<void> | void {
        if (viewMode === 'search' && cfg.searchStartingWith === 'root') {
            this._updateRootOnViewModeChanged(viewMode, cfg);
        }

        let action: Promise<void> | void;
        const resolvedViewMode = resolveViewMode(viewMode, cfg.useColumns);

        if (!this._viewModelConstructors[resolvedViewMode]) {
            if (resolvedViewMode === 'columns') {
                action = this._loadColumnsViewMode(cfg);
            } else if (resolvedViewMode === 'search') {
                action = this._loadSearchGridViewMode();
            } else {
                action = this._loadTileViewMode(cfg);
            }
        } else {
            return this._setViewModeSync(viewMode, cfg);
        }

        if (action instanceof Promise) {
            return action.then(() => {
                this._setViewModeSync(viewMode, cfg);
            });
        }

        return this._setViewModeSync(viewMode, cfg);
    }

    private _applyNewVisualOptions(): void {
        if (this._newItemPadding) {
            this._itemPadding = this._newItemPadding;
            this._newItemPadding = null;
        }
        // Если itemTemplate сбросили, то он будет равен undefined
        if (this._newItemTemplate !== null) {
            this._itemTemplate = this._newItemTemplate;
            this._newItemTemplate = null;
        }
        // Если itemTemplate сбросили, то он будет равен undefined
        if (this._newItemTemplateOptions !== null) {
            this._itemTemplateOptions = this._newItemTemplateOptions;
            this._newItemTemplateOptions = null;
        }
        if (this._newBackgroundStyle) {
            this._backgroundStyle = this._newBackgroundStyle;
            this._newBackgroundStyle = null;
        }

        // _newHeader может измениться на undefined при смене с табличного представления
        if (this._newHeader !== this._header) {
            this._header = this._newHeader;
            // Не надо занулять this._newHeader иначе при следующем вызове
            // _applyNewVisualOptions это может вызвать сброс шапки
            /* this._newHeader = null;*/
        }

        if (this._newColumns !== this._columns) {
            this._columns = this._newColumns;
        }

        if (this._newItemActionsPosition) {
            this._itemActionsPosition = this._newItemActionsPosition;
            this._newItemActionsPosition = null;
        }

        if (this._newSearchValue !== undefined) {
            this._searchValue = this._newSearchValue;
            this._newSearchValue = undefined;
        }
    }

    protected _getItemTemplate(
        viewMode: string,
        itemTemplate: TemplateFunction,
        listItemTemplate: TemplateFunction,
        tileItemTemplate: TemplateFunction
    ): TemplateFunction {
        if (viewMode === 'tile') {
            return tileItemTemplate;
        } else if (viewMode === 'list') {
            return listItemTemplate || itemTemplate;
        }
        return itemTemplate;
    }

    protected _getEmptyTemplate(
        viewMode: string,
        emptyTemplate: TemplateFunction,
        listEmptyTemplate: TemplateFunction
    ): TemplateFunction {
        if (viewMode === 'list' && listEmptyTemplate) {
            return listEmptyTemplate;
        }
        return emptyTemplate;
    }

    /**
     * Возвращает идентификатор самого верхнего известного корневого узла.
     */
    private _getTopRoot(breadcrumbs: Path, parentProperty: string, root: TKey): TKey {
        let result;

        // Если есть хлебные крошки, то получаем top root из них.
        // В противном случае просто возвращаем текущий root
        if (breadcrumbs?.length) {
            result = breadcrumbs[0].get(parentProperty);
        } else {
            result = root;
        }

        return result;
    }

    /**
     * Вернет true если все перетаскиваемые итемы лежат в корне
     */
    private _dragItemsFromRoot(dragItems: TKey[]): boolean {
        let itemFromRoot = true;

        for (let i = 0; i < dragItems.length; i++) {
            const item = this._items.getRecordById(dragItems[i]);

            if (!item || item.get(this._options.parentProperty) !== this._topRoot) {
                itemFromRoot = false;
                break;
            }
        }

        return itemFromRoot;
    }

    private _loadTileViewMode(cfg: IExplorerOptions): Promise<void> | void {
        const deps = ['Controls/treeTile'];
        return executeSyncOrAsync(deps, (tile) => {
            this._viewNames.tile = tile.TreeTileView;
            this._viewTableNames.tile = tile.TreeTileView;
            this._viewModelConstructors.tile = 'Controls/treeTile:TreeTileCollection';
            if (cfg.orientation === 'horizontal') {
                this._viewVirtualScrollController.tile = tile.HorizontalTileScrollController;
            }
        });
    }

    private _loadColumnsViewMode(cfg: IExplorerOptions): Promise<void> | void {
        return executeSyncOrAsync(['Controls/columns'], (columns) => {
            this._viewNames.columns = columns.ViewTemplate;
            this._viewTableNames.columns = columns.ViewTemplate;
            this._viewModelConstructors.columns = 'Controls/columns:ColumnsCollection';
            this._viewItemsSelector.columns = columns.ViewTemplate.itemsSelector;
            this._viewVirtualScrollController.columns = this._disableVirtualScrollForColumns
                ? ListVirtualScrollController
                : columns.ColumnsVirtualScrollController;
        });
    }

    private _loadSearchGridViewMode(): Promise<void> | void {
        return executeSyncOrAsync(['Controls/searchBreadcrumbsGrid'], (searchGrid) => {
            this._viewNames.search = searchGrid.SearchView;
            this._viewTableNames.search = searchGrid.SearchViewTable;
            this._viewControllers.search = searchGrid.SearchGridControl;
            this._viewModelConstructors.search =
                'Controls/searchBreadcrumbsGrid:SearchGridCollection';
        });
    }

    private _canStartDragNDropFunc(): boolean {
        return this._viewMode !== 'search';
    }

    private _checkedChangeViewMode(viewMode: TExplorerViewMode, cfg: IExplorerOptions): void {
        const isViewModeChanged = viewMode !== this._viewMode;

        Promise.resolve(this._setViewMode(viewMode, cfg)).then(() => {
            // Обрабатываем searchNavigationMode только после того как
            // проставится setViewMode, т.к. он может проставится асинхронно,
            // а код ниже вызывает изменение версии модели, что приводит к лишней
            // перерисовке до изменения viewMode
            const isAllExpanded = cfg.expandedItems && cfg.expandedItems[0] === null;
            if (isViewModeChanged && cfg.searchNavigationMode !== 'expand' && !isAllExpanded) {
                this._children.treeControl?.resetExpandedItems();
            }
        });
    }

    /**
     * Восстанавливает значение курсора для курсорной навигации при выходе из папки.
     * Одна из частей механизма сохранения позиции скролла и отмеченной записи
     * при проваливании в папку и выходе назад.
     *
     * @param rootId id узла в который возвращаемся
     */
    private _restorePositionNavigation(rootId: TKey): unknown {
        const rootInfo = this._restoredMarkedKeys[rootId];
        if (!rootInfo) {
            return;
        }

        let cursor;
        if (typeof rootInfo?.cursorPosition !== 'undefined') {
            cursor = rootInfo.cursorPosition;
        } else {
            cursor = (this._options._navigation?.sourceConfig as INavigationPositionSourceConfig)
                ?.position;
        }

        (this._navigation.sourceConfig as INavigationPositionSourceConfig).position =
            cursor || null;
        return cursor;
    }

    private _setPendingViewMode(viewMode: TExplorerViewMode, options: IExplorerOptions): void {
        this._pendingViewMode = viewMode;

        if (viewMode === 'search') {
            this._updateRootOnViewModeChanged(viewMode, options);
        }
    }

    private _updateRootOnViewModeChanged(viewMode: string, options: IExplorerOptions): void {
        if (viewMode === 'search' && options.searchStartingWith === 'root') {
            if (this._topRoot !== options.root) {
                this._setRoot(this._topRoot, this._topRoot);
            }
        }
    }

    private _setInitBreadCrumbsMode(): void {
        if ('treeControl' in this._children && this._children.treeControl.isColumnScrollVisible()) {
            this._searchInitialBreadCrumbsMode = 'cell';
        } else {
            this._searchInitialBreadCrumbsMode = undefined;
        }
    }

    protected _observeScrollHandler(
        e: SyntheticEvent<null>,
        eventName: string,
        params: { clientWidth: number }
    ): void {
        // Если шапка не зафиксирована или крошки скрыты, то не нужно рассчитывать _breadCrumbsMaxWidth,
        // т.к. это вызывает лишнюю синхронизацию, которая отжирает время оживления страницы.
        if (!this._options.stickyHeader || this._options.breadcrumbsVisibility === 'hidden') {
            return;
        }

        switch (eventName) {
            case 'horizontalScrollResize':
            case 'horizontalViewportResize':
            case 'canHorizontalScroll':
                if (this._breadCrumbsMaxWidth !== params.clientWidth) {
                    this._breadCrumbsMaxWidth = params.clientWidth;
                }
                break;
            case 'cantHorizontalScroll':
                if (this._breadCrumbsMaxWidth) {
                    this._breadCrumbsMaxWidth = undefined;
                }
                break;
        }
    }

    // Рекомендованный метод для прослушки скролл контейнера.
    // Код из метода _observeScrollHandler должен быть удален.
    // https://online.sbis.ru/opendoc.html?guid=0592da79-a3fe-4d71-a428-8ced91db0df4&client=3
    protected _scrollStateChangedHandler(
        event: SyntheticEvent,
        newState: IScrollState,
        oldState: IScrollState
    ): void {
        if (!this._options.stickyHeader || this._options.breadcrumbsVisibility === 'hidden') {
            return;
        }

        if (
            this._options.isAdaptive &&
            (oldState.canHorizontalScroll || newState.canHorizontalScroll) &&
            this._breadCrumbsMaxWidth !== newState.clientWidth
        ) {
            this._breadCrumbsMaxWidth = newState.clientWidth;
        }
    }

    _constants: object = {
        DEFAULT_VIEW_MODE,
        ITEM_TYPES,
        VIEW_NAMES: this._viewNames,
        VIEW_MODEL_CONSTRUCTORS: this._viewModelConstructors,
    };

    static getOptionTypes(): object {
        return {
            viewMode: descriptor(String).oneOf(['table', 'search', 'tile', 'list']),
        };
    }

    static getDefaultOptions(): object {
        return {
            multiSelectVisibility: 'hidden',
            viewMode: DEFAULT_VIEW_MODE,
            backButtonIconStyle: 'primary',
            backButtonFontColorStyle: 'secondary',
            columnsCount: 1,
            stickyHeader: true,
            stickyResults: true,
            searchStartingWith: 'root',
            showActionButton: false,
            isFullGridSupport: isFullGridSupport(),
            breadCrumbsMode: 'row',
            headerVisibility: 'hasdata',
            resultsVisibility: 'hasdata',
        };
    }
}

/*
 * Hierarchical list that can expand and go inside the folders. Can load data from data source.
 * <a href="/materials/DemoStand/app/Controls-demo%2FExplorer%2FExplorer">Demo example</a>.
 * <a href="/materials/DemoStand/app/Controls-demo%2FExplorer%2FSearch">Demo example with search</a>.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/explorer/'>here</a>.
 *
 * @class Controls/_explorer/View
 * @extends UI/Base:Control
 * @implements Controls/list:IReloadableList
 * @implements Controls/interface:ISource
 * @implements Controls/interface/ITreeGridItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/grid:IEditableGrid
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IHierarchy
 * @implements Controls/tree:ITree
 * @implements Controls/explorer:IExplorer
 * @implements Controls/interface:IDraggable
 * @implements Controls/tile:ITile
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/grid:IGridControl
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IRemovableList
 * @implements Controls/marker:IMarkerList
 *
 * @public
 * @author Авраменко А.С.
 */

/**
 * @event arrowClick Происходит при клике на кнопку "Просмотр записи".
 * @name Controls/explorer:View#arrowClick
 * @remark Кнопка отображается при наведении курсора на текущую папку хлебных крошек. Отображение кнопки "Просмотр записи" задаётся с помощью опции {@link Controls/_explorer/interface/IExplorer#showActionButton}. По умолчанию кнопка скрыта.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event rootChanged Происходит при изменении корня иерархии (например, при переходе пользователя по хлебным крошкам).
 * @name Controls/explorer:View#rootChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String|Number} root Идентификатор корневой записи.
 */

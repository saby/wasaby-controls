/**
 * @kaizen_zone 5c260dca-bc4a-4366-949a-824d00984a8e
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { ICrudPlus, PrefetchProxy, Memory } from 'Types/source';
import { factory, RecordSet } from 'Types/collection';
import { descriptor, Record, Model } from 'Types/entity';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { StickyOpener, IStickyPopupOptions } from 'Controls/popup';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { showType } from './interfaces/IShowType';
import rk = require('i18n!Controls');
import { IWasabyAttributes } from 'UICore/Executor';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    getButtonTemplate,
    getMenuItems,
    needShowMenu,
    hasSourceChanged,
    getTemplateByItem,
    loadItems,
    getSimpleButtonTemplateOptionsByItem,
} from 'Controls/_toolbars/Util';
import {
    IHierarchyOptions,
    IIconSizeOptions,
    IItemTemplateOptions,
    IItemsOptions,
    IFontColorStyleOptions,
    IIconStyleOptions,
    IFilterOptions,
    IHeightOptions,
} from 'Controls/interface';
import {
    IItemAction,
    TItemActionVisibilityCallback,
} from 'Controls/itemActions';
import { IToolbarSourceOptions } from 'Controls/_toolbars/interfaces/IToolbarSource';
import { Button, IViewMode, IButtonOptions } from 'Controls/buttons';
import { IGroupedOptions } from 'Controls/dropdown';
import { default as defaultItemTemplate } from 'Controls/_toolbars/View/ItemTemplate';
import { DependencyTimer, isLeftMouseButton } from 'Controls/popup';
import { IoC } from 'Env/Env';
import { default as Async } from 'Controls/Container/Async';
import 'css!Controls/toolbars';
import 'css!Controls/buttons';
import 'css!Controls/CommonClasses';

type TItem = Record;
type TItems = RecordSet<TItem>;
type TypeItem = 'ghost' | 'icon' | 'link' | 'list';
export type TItemsSpacing = 'small' | 'medium' | 'big';

export interface IToolbarOptions
    extends IControlOptions,
        IHierarchyOptions,
        IIconSizeOptions,
        IItemTemplateOptions,
        IGroupedOptions,
        IToolbarSourceOptions,
        IItemsOptions<TItem>,
        IFontColorStyleOptions,
        IIconStyleOptions,
        IFilterOptions,
        IHeightOptions {
    /**
     * @name Controls/_toolbars/IToolbar#popupClassName
     * @cfg {String} Имя класса, которое будет добавлено к атрибуту class на корневой ноде выпадающего меню.
     * @default ''
     */
    popupClassName?: string;
    /**
     * @name Controls/_toolbars/IToolbar#itemsSpacing
     * @cfg {String} Размер расстояния между кнопками.
     * @variant small
     * @variant medium
     * @variant big
     * @default medium
     * @remark
     * Работает совместно с опцией contrastBackground установленной в значение true, иначе опция будет проигнорирована.
     */
    itemsSpacing?: TItemsSpacing;
    /**
     * @name Controls/_toolbars/IToolbar#direction
     * @cfg {String} Расположение элементов в тулбаре.
     * @variant vertical
     * @variant horizontal
     * @demo Controls-demo/Toolbar/Direction/Index
     */
    direction?: 'vertical' | 'horizontal';
    /**
     * @name Controls/_toolbars/IToolbar#additionalProperty
     * @cfg {String} Имя свойства, содержащего информацию о дополнительном пункте выпадающего меню. Подробное описание <a href="/doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/item-config/#additional">здесь</a>.
     */
    additionalProperty?: string;
    /**
     * @name Controls/_toolbars/IToolbar#popupFooterTemplate
     * @cfg {String|TemplateFunction} Шаблон футера дополнительного меню тулбара.
     * @demo Controls-demo/Toolbar/PopupFooterTemplate/Index
     */
    popupFooterTemplate?: String | Function;
    /**
     * @name Controls/_toolbars/IToolbar#itemActions
     * @cfg {Array<Controls/itemActions:IItemAction>} Конфигурация опций записи.
     * @demo Controls-demo/Toolbar/ItemActions/Index
     */
    itemActions?: IItemAction[];
    /**
     * @name Controls/_toolbars/IToolbar#itemActionVisibilityCallback
     * @cfg {function} Функция управления видимостью опций записи.
     * @remark
     * Аргументы функции:
     *
     * * action (тип {@link Controls/itemActions:IItemAction}) — объект с настройкой действия.
     * * item (тип {@link Types/entity:Model}) — экземпляр записи, действие над которой обрабатывается.
     *
     * Если из функции возвращается true, то операция отображается.
     * @demo Controls-demo/Toolbar/ItemActions/Index
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
    /**
     * @name Controls/_toolbars/IToolbar#menuSource
     * @cfg {Types/source:ICrudPlus} Объект, реализующий интерфейс {@link Types/source:ICrud},
     * необходимый для работы с источником данных выпадающего меню тулбара.
     * Данные будут загружены отложено, при взаимодействии с меню.
     * @remark Если задана опция, а также в source или items, указаны данные, которые необходимо отобразить в выпадающем меню,
     * то будут отображены данные, переданные в menuSource.
     * @see source
     * @see items
     * @demo Controls-demo/Toolbar/MenuLoadCallback/Index
     */
    menuSource?: ICrudPlus;
    /**
     * @name Controls/_toolbars/IToolbar#menuLoadCallback
     * @cfg {Function} Функция, которая вызывается каждый раз непосредственно после загрузки данных в меню из источника.
     * Функцию можно использовать для изменения данных еще до того, как они будут отображены в контроле.
     * @see menuSource
     * @demo Controls-demo/Toolbar/MenuLoadCallback/Index
     */
    menuLoadCallback?: (items: RecordSet) => void;
    /**
     * @name Controls/_toolbars/IToolbar#contrastBackground
     * @cfg {Boolean} Определяет наличие подложки у кнопки открытия выпадающего меню тулбара.
     */
    contrastBackground?: true;
    /**
     * @name Controls/_toolbars/IToolbar#translucent
     * @cfg {boolean} Режим полупрозрачного отображения кнопки открытия выпадающего меню тулбара
     * @default false
     * @demo Controls-demo/Toolbar/Translucent/Index
     */
    translucent?: boolean;
    /**
     * @name Controls/_toolbars/IToolbar#menuButtonViewMode
     * @cfg {IViewMode} Стиль отображения кнопки открытия выпадающего меню тулбара
     * @default ghost
     * @demo Controls-demo/Toolbar/MenuButtonViewMode/Index
     */
    menuButtonViewMode?: IViewMode;

    /**
     * @name Controls/_toolbars/IToolbar#closeMenuOnOutsideClick
     * @cfg {Boolean} Определяет возможность закрытия окна по клику вне.
     * @default true
     */
    closeMenuOnOutsideClick?: boolean;
    /**
     * @name Controls/_toolbars/IToolbar#menuIcon
     * @cfg {string} Иконка выпадающего меню тулбара
     */
    menuIcon?: string;
    keyProperty?: string;
    /**
     * @name Controls/_toolbars/IToolbar#menuIconSize
     * @cfg {Controls/interface:TIconSize} Размер иконки выпадающего меню тулбара
     */
    menuIconSize?: string;
    onDropDownOpen?: () => void;
    onDropDownClose?: () => void;
    groupingKeyCallback?: () => void;
    menuDraggable?: boolean;
    onItemclick?: (
        event: Event,
        item: TItem,
        nativeEvent: SyntheticEvent
    ) => void;
    onItemClick?: (
        event: Event,
        item: TItem,
        nativeEvent: SyntheticEvent
    ) => void;
    menuBackgroundStyle?: string;
    menuHoverBackgroundStyle?: string;
    /**
     * @name Controls/_toolbars/IToolbar#menuOptions
     * @cfg {Object} Дополнительные параметры которые будет переданы в выпадающее меню тулбара
     */
    menuOptions?: object;
    attrs?: IWasabyAttributes;
    className?: string;
}

interface IToolbarState {
    firstItem: TItem;
    items: TItems;
    needShowMenu: boolean;
    countShowItems: number;
}

/**
 * Интерфейс опций контрола {@link Controls/toolbars:View}.
 * @interface Controls/_toolbars/IToolbar
 * @public
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/dropdown:IGrouped
 * @implements Controls/toolbars:IToolbarSource
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IHeight
 */

/**
 * Графический контрол, отображаемый в виде панели с размещенными на ней кнопками, клик по которым вызывает соответствующие им команды.
 * @class Controls/_toolbars/View
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FToolbar%2FBase%2FIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_toolbars.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/toolbars:IToolbar
 * @implements Controls/interface:IItems
 * @public
 * @demo Controls-demo/Toolbar/Base/Index
 */

export default class View extends React.Component<
    IToolbarOptions,
    IToolbarState
> {
    protected _source: ICrudPlus = null;
    protected _sourceByItems: Memory = null;
    protected _menuSource: ICrudPlus = null;
    protected _nodeProperty: string = null;
    protected _parentProperty: string = null;
    protected _isLoadMenuItems: boolean = false;
    protected _buttonTemplate: TemplateFunction = getButtonTemplate();
    protected _sticky: StickyOpener;
    protected _menuItems: { [key: number]: TItems } = {};
    protected _dependenciesTimer: DependencyTimer = null;
    protected _loadViewPromise: Promise<unknown> = null;
    protected _toolbarItemsRef: React.RefObject<HTMLDivElement> = null;
    protected _menuTargetRef: React.RefObject<Button> = null;

    constructor(props: IToolbarOptions) {
        super(props);
        this._toolbarItemsRef = React.createRef();
        this._menuTargetRef = React.createRef();
        this.state = {
            items: props.items ? props.items : new RecordSet({ rawData: [] }),
            countShowItems: props.items
                ? this._getCountShowItems(
                      props.items,
                      props.isAdaptive,
                      props.direction
                  )
                : 0,
            firstItem: props.items
                ? this._getFirstToolbarItem(
                      props.isAdaptive,
                      props.direction,
                      props.items
                  )
                : null,
            needShowMenu: props.items
                ? needShowMenu(props.items) ||
                  (props.isAdaptive &&
                      props.direction === 'vertical' &&
                      props.items.getCount() > 1)
                : null,
        };
        this._resultHandler = this._resultHandler.bind(this);
        this._closeHandler = this._closeHandler.bind(this);
        this._openHandler = this._openHandler.bind(this);
        this._isShowToolbar = this._isShowToolbar.bind(this);
    }

    componentDidMount(): void {
        const { source, filter, isAdaptive, direction, items } = this.props;
        this._setState(this.props);
        if (source) {
            this._setStateBySource(source, filter, isAdaptive, direction);
        } else if (items) {
            this._setStateByItems(items, null, isAdaptive, direction);
        }
    }

    componentDidUpdate(
        prevProps: IToolbarOptions,
        prevState: IToolbarState
    ): void {
        const itemsChanged = prevProps.items !== this.props.items;
        const filterChanged = prevProps.filter !== this.props.filter;
        const menuSourceChanged =
            prevProps.menuSource !== this.props.menuSource;
        if (this._needChangeState(this.props)) {
            this._setState(this.props);
        }
        if (
            hasSourceChanged(this.props.source, prevProps.source) ||
            filterChanged
        ) {
            this._isLoadMenuItems = false;
            this._sticky?.close();
            this._setStateBySource(
                this.props.source,
                this.props.filter,
                this.props.isAdaptive,
                this.props.direction
            );
        }
        if (itemsChanged) {
            this._isLoadMenuItems = false;
            this._sourceByItems = null;
            this._setStateByItems(
                this.props.items,
                null,
                this.props.isAdaptive,
                this.props.direction
            );
        }
        if (menuSourceChanged) {
            this._menuItems = {};
            this._isLoadMenuItems = false;
            this._setMenuSource(this.props.menuSource);
        }
        if (itemsChanged || menuSourceChanged) {
            if (
                this._sticky?.isOpened() &&
                !this.props.closeMenuOnOutsideClick
            ) {
                this.openMenu();
            }
        }
    }

    componentWillUnmount() {
        this._sticky?.destroy();
        this._sticky = null;
    }

    openMenu(): void {
        this._openMenu(this._getMenuConfig());
    }

    closeMenu(): void {
        this._sticky.close();
    }

    // FIXME костыльное решение для быстрого лечения падающего смока.
    // Нужно общее красивое решение для всех опенеров на реакте.
    // https://online.sbis.ru/opendoc.html?guid=e184361b-4a8c-4525-b7a7-a775ba663997&client=3
    get _container(): HTMLElement {
        return this._toolbarItemsRef.current;
    }

    protected _needChangeState(newOptions: IToolbarOptions): boolean {
        const currentOptions = this.props;

        return [
            'keyProperty',
            'parentProperty',
            'nodeProperty',
            'popupClassName',
        ].some((optionName: string) => {
            return currentOptions[optionName] !== newOptions[optionName];
        });
    }

    protected _createPrefetchProxy(
        source: ICrudPlus,
        items: TItems
    ): ICrudPlus {
        return new PrefetchProxy({
            target: source,
            data: {
                query: items,
            },
        });
    }

    protected _getFirstToolbarItem(
        isAdaptive: boolean,
        direction: string,
        items: TItems
    ): TItem {
        const count = items.getCount();
        if (count) {
            if (count === 1) {
                // Если элемент один, покажем его только в тулбаре.
                const isFirstItemShowTypeToolbar =
                    items.at(0).get('showType') === showType.TOOLBAR;
                if (!isFirstItemShowTypeToolbar) {
                    items.at(0).set('showType', showType.TOOLBAR);
                }
            }
            for (let i = 0; i < count; i++) {
                const item = items.at(i) as TItem;
                const isToolbarItem = this._isShowToolbar(
                    item,
                    this._parentProperty,
                    isAdaptive,
                    direction,
                    items
                );
                if (isToolbarItem) {
                    return item;
                }
            }
        }
        return void 0;
    }

    protected _isShowToolbar(
        item: TItem,
        parentProperty: string,
        isAdaptive: boolean,
        direction: string,
        items: TItems
    ): boolean {
        const showOnlyMenu =
            isAdaptive && direction === 'vertical' && items.getCount() > 1;
        const itemShowType = showOnlyMenu
            ? showType.MENU
            : item.get('showType');

        if (itemShowType === showType.MENU) {
            return false;
        }
        const itemHasParentProperty =
            item.has(parentProperty) && item.get(parentProperty) !== null;
        if (itemHasParentProperty) {
            return itemShowType === showType.MENU_TOOLBAR;
        }

        return true;
    }

    protected _setStateByItems(
        items: TItems,
        source?: ICrudPlus,
        isAdaptive?: boolean,
        direction?: string
    ): void {
        if (this.state.items !== items) {
            this.setState({ items });
            this.setState({
                countShowItems: this._getCountShowItems(
                    items,
                    isAdaptive,
                    direction
                ),
            });
            // у первой записи тулбара не требуется показывать отступ слева
            this.setState({
                firstItem: this._getFirstToolbarItem(
                    isAdaptive,
                    direction,
                    items
                ) as TItem,
            });
            if (source) {
                this._source = this._createPrefetchProxy(
                    source,
                    this.state.items
                );
            }
            this.setState((prevState) => {
                return {
                    needShowMenu:
                        needShowMenu(prevState.items) ||
                        (isAdaptive &&
                            direction === 'vertical' &&
                            prevState.items.getCount() > 1),
                };
            });
        }
    }

    protected _getCountShowItems(
        items: TItems,
        isAdaptive: boolean,
        direction: string
    ): number {
        let result = 0;
        items.forEach((item) => {
            if (
                this._isShowToolbar(
                    item as TItem,
                    this._parentProperty,
                    isAdaptive,
                    direction,
                    items
                )
            ) {
                result += 1;
            }
        });
        return result;
    }

    protected _setStateBySource(
        source: ICrudPlus,
        filter?: Object,
        isAdaptive?: boolean,
        direction?: string
    ): void {
        loadItems(source, filter).then((items) => {
            this._setStateByItems(items, source, isAdaptive, direction);
        });
    }

    protected _setState(options: IToolbarOptions): void {
        this._nodeProperty = options.nodeProperty;
        this._parentProperty = options.parentProperty;
    }

    protected _getSourceForMenu(item: TItem): Promise<unknown> {
        if (this.props.menuSource) {
            return this._getMenuSource(item).then((menuSource) => {
                return menuSource;
            });
        }
        const source = this._getSynchronousSourceForMenu();
        return Promise.resolve(source);
    }

    protected _getMenuSource(item: TItem): Promise<ICrudPlus> {
        const itemKey = item.get(this.props.keyProperty);
        if (!this._menuItems[itemKey]) {
            const filter = this.props.filter || {};
            filter[this.props.parentProperty] = itemKey;
            const sourceController = new SourceController({
                source: this.props.menuSource,
                keyProperty: this.props.keyProperty,
                filter,
            });
            return sourceController.load().then((items: TItems) => {
                this._menuItems[itemKey] = items;
                return this._createPrefetchProxy(this.props.menuSource, items);
            });
        } else {
            const source = this._createPrefetchProxy(
                this.props.menuSource,
                this._menuItems[itemKey]
            );
            return Promise.resolve(source);
        }
    }

    protected _createMemory(items: TItems): Memory {
        return new Memory({
            data: items.getRawData(),
            keyProperty: items.getKeyProperty(),
        });
    }

    protected _setSourceByItems(items: TItems): void {
        if (!this._sourceByItems) {
            this._sourceByItems = this._createMemory(items);
        }
    }

    protected _getSynchronousSourceForMenu(menuItems?: TItems): ICrudPlus {
        const items = menuItems || this.state.items;
        if (items) {
            this._setSourceByItems(items);
            return this._sourceByItems;
        }
        if (this._source) {
            return this._source;
        }
    }

    protected _setMenuSource(
        menuSource: ICrudPlus = this.props.menuSource
    ): void {
        if (this.props.menuSource) {
            this._menuSource = menuSource;
        } else {
            const menuItems = View._calcMenuItems(
                this.state.items,
                this.props.isAdaptive,
                this.props.direction
            );
            const source =
                this.props.source ||
                this._getSynchronousSourceForMenu(menuItems);
            this._menuSource = this._createPrefetchProxy(source, menuItems);
        }
    }

    protected _openHandler(): void {
        if (this.props.onDropDownOpen) {
            this.props.onDropDownOpen();
        }
    }

    protected _closeHandler(): void {
        if (this.props.onDropDownClose) {
            this.props.onDropDownClose();
        }
        this._setStateByItems(
            this.state.items,
            this.props.source,
            this.props.isAdaptive,
            this.props.direction
        );
        this._setMenuSource();
    }

    protected _resultHandler(
        action: string,
        data: Model,
        nativeEvent: SyntheticEvent,
        event?: SyntheticEvent
    ): void {
        if (
            action === 'itemClick' ||
            action === 'rightTemplateClick' ||
            action === 'applyClick'
        ) {
            const item = data;
            const mainEvent = action === 'applyClick' ? event : nativeEvent;
            const wasabyActionEnvironment =
                'on' + action[0].toUpperCase() + action.slice(1).toLowerCase();
            const reactActionEnvironment =
                'on' + action[0].toUpperCase() + action.slice(1);
            if (this.props[wasabyActionEnvironment]) {
                this.props[wasabyActionEnvironment](
                    mainEvent,
                    item,
                    mainEvent._nativeEvent
                );
            }
            if (this.props[reactActionEnvironment]) {
                this.props[reactActionEnvironment](
                    mainEvent,
                    item,
                    mainEvent._nativeEvent
                );
            }
            const isCloseOnItemClick =
                (action === 'applyClick' || !item.get(this._nodeProperty)) &&
                mainEvent?.result !== false;

            /*
             * menuOpener may not exist because toolbar can be closed by toolbar parent in item click handler
             */
            if (
                this._sticky?.isOpened() &&
                (isCloseOnItemClick || mainEvent?.result === true)
            ) {
                this._sticky.close();
            }
        }
    }

    protected _getMenuOptions(): IStickyPopupOptions {
        return {
            direction: {
                horizontal: 'left',
                vertical: 'bottom',
            },
            targetPoint: {
                vertical: 'top',
                horizontal: 'right',
            },
            eventHandlers: {
                onResult: this._resultHandler,
                onClose: this._closeHandler,
                onOpen: this._openHandler,
            },
            template: 'Controls/menu:Popup',
            closeOnOutsideClick: this.props.closeMenuOnOutsideClick,
            actionOnScroll: 'close',
            fittingMode: {
                vertical: 'adaptive',
                horizontal: 'overflow',
            },
        };
    }

    protected _getMenuTemplateOptions(): IStickyPopupOptions {
        const {
            direction,
            groupTemplate,
            groupProperty,
            groupingKeyCallback,
            keyProperty,
            parentProperty,
            nodeProperty,
            iconSize,
            iconStyle,
            itemTemplateProperty,
            menuDraggable,
        } = this.props;
        const isVertical = direction === 'vertical';
        const menuTemplateOptions: IStickyPopupOptions & {
            itemsSpacing: string;
        } = {
            groupTemplate,
            groupProperty,
            groupingKeyCallback,
            keyProperty,
            parentProperty,
            nodeProperty,
            iconSize,
            iconStyle,
            itemTemplateProperty,
            draggable: menuDraggable,
        };

        if (isVertical) {
            menuTemplateOptions.itemsSpacing = 'xs';
        }

        return menuTemplateOptions;
    }

    protected _getMenuConfigByItem(
        item: TItem,
        source: ICrudPlus,
        root: number,
        items: RecordSet
    ): IStickyPopupOptions {
        const { direction, iconSize, iconStyle, theme } = this.props;
        const isVerticalDirection = direction === 'vertical';
        let className = '';
        if (isVerticalDirection) {
            className += `controls-Toolbar-${direction}__popup__list`;
        } else {
            const type = View._typeItem(item);
            className += `controls-Toolbar__popup__${type}`;
            if (type === 'icon') {
                className += `-${item.get('iconSize') || iconSize}`;
            }
            className += ` ${View._menuItemClassName(
                item
            )} controls_popupTemplate_theme-${theme} controls_dropdownPopup_theme-${theme}`;
        }
        const config = {
            ...this._getMenuOptions(),
            opener: this,
            className,
            templateOptions: {
                source,
                items,
                root,
                ...this._getMenuTemplateOptions(),
                showHeader: item.get('showHeader'),
                closeButtonVisibility: true,
                headConfig: {
                    icon: item.get('icon'),
                    caption: item.get('title'),
                    iconSize: item.get('iconSize'),
                    iconStyle: item.get('iconStyle') || iconStyle,
                },
                ...item.get('menuOptions'),
            },
        };
        if (!isVerticalDirection) {
            config.targetPoint = {
                vertical: 'top',
                horizontal: 'left',
            };
            config.direction = {
                horizontal: 'right',
            };
        }
        return config;
    }

    protected _openMenu(
        config: IStickyPopupOptions,
        event?: SyntheticEvent
    ): void {
        if (!this._sticky) {
            this._sticky = new StickyOpener();
        }
        // Перед открытием нового меню закроем старое.
        // Т.к. вып. список грузит данные асинхронно, то при перерисовке открытого окна будет визуальный баг,
        // когда позиция окна обновилась, а содержимое нет, т.к. не успело загрузиться.
        if (this.props.closeMenuOnOutsideClick) {
            this._sticky.close();
        }
        this._sticky.open(config);
    }

    protected _isOnlyOneItem(menuItems: RecordSet): boolean {
        return (
            menuItems.getCount() === 1 &&
            !menuItems.at(0).get(this.props.itemTemplateProperty)
        );
    }

    protected _itemClickHandler(
        event: SyntheticEvent<Event>,
        item: TItem
    ): void {
        const readOnly: boolean = item.get('readOnly') || this.props.readOnly;
        const currentTarget = event.currentTarget;
        if (readOnly) {
            event.stopPropagation();
            return;
        }
        if (item.get(this._nodeProperty)) {
            this._getSourceForMenu(item).then((source) => {
                const root = item.get(this.props.keyProperty);
                const menuItems = this._menuItems[root];
                const config = this._getMenuConfigByItem(
                    item,
                    source as ICrudPlus,
                    root,
                    menuItems
                );
                if (menuItems && this._isOnlyOneItem(menuItems)) {
                    this._resultHandler('itemClick', menuItems.at(0), event);
                } else {
                    this._openMenu(
                        {
                            ...config,
                            target: currentTarget,
                        },
                        event
                    );
                }
            });
        }
        event.stopPropagation();
        // Компонент может строиться в wasaby и react окружении, где отличается название коллбека события, пишем
        // проверку и вызываем для каждого.
        if (this.props.onItemclick) {
            this.props.onItemclick(event, item, event.nativeEvent);
        }
        if (this.props.onItemClick) {
            this.props.onItemClick(event, item, event.nativeEvent);
        }
    }

    protected _getMenuConfig(): IStickyPopupOptions {
        const {
            direction,
            popupClassName,
            theme,
            menuBackgroundStyle,
            menuHoverBackgroundStyle,
            itemActions,
            itemActionVisibilityCallback,
            additionalProperty,
            popupFooterTemplate,
            menuLoadCallback,
            menuOptions,
        } = this.props;
        return {
            ...this._getMenuOptions(),
            opener: this._menuTargetRef?.current,
            className: `${popupClassName} controls-Toolbar-${direction}__popup__list controls_popupTemplate_theme-${theme}`,
            templateOptions: {
                backgroundStyle: menuBackgroundStyle,
                hoverBackgroundStyle: menuHoverBackgroundStyle,
                source: this._menuSource,
                ...this._getMenuTemplateOptions(),
                itemActions,
                itemActionVisibilityCallback,
                additionalProperty,
                footerContentTemplate: popupFooterTemplate,
                closeButtonVisibility: true,
                dataLoadCallback: menuLoadCallback,
                dropdownClassName: `controls-Toolbar-${direction}__dropdown`,
                ...menuOptions,
            },
            target:
                direction === 'vertical'
                    ? this._toolbarItemsRef?.current
                    : this._menuTargetRef?.current,
        };
    }

    protected _onClickHandler(event: Event): void {
        event.stopPropagation();
    }

    protected _mouseDownHandler(event: Event): void {
        if (!isLeftMouseButton(event)) {
            return;
        }

        if (!this.props.readOnly) {
            if (!this._isLoadMenuItems) {
                this._setMenuSource();
                this._isLoadMenuItems = true;
            }
            this._openMenu(this._getMenuConfig());
        }
    }

    protected _loadDependencies(): Promise<unknown> {
        try {
            if (!this._isLoadMenuItems) {
                this._setMenuSource();
                this._isLoadMenuItems = true;
            }

            if (!this._loadViewPromise) {
                this._loadViewPromise = import('Controls/menu');
            }
            return this._loadViewPromise;
        } catch (e) {
            IoC.resolve('ILogger').error('_toolbars:View', e);
        }
    }

    protected _getSimpleButtonTemplateOptionsByItem(
        item: TItem
    ): IButtonOptions {
        return getSimpleButtonTemplateOptionsByItem(item, this.props);
    }

    protected _mouseEnterHandler() {
        if (!this.props.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this));
        }
    }

    protected _mouseLeaveHandler(): void {
        this._dependenciesTimer?.stop();
    }

    protected _createItemTemplate(
        item: Model,
        index: number
    ): TemplateFunction {
        const ItemTemplate = getTemplateByItem(item, this.props);
        const attrsForItemTemplate = {
            'data-name':
                item.get(this.props.keyProperty) ||
                item.get(this.state.items.getKeyProperty()),
            'data-qa':
                item.get(this.props.keyProperty) ||
                item.get(this.state.items.getKeyProperty()),
            className: 'controls-Toolbar__item',
        };
        const itemTemplateOptions = {
            item,
            key: index,
            direction: this.props.direction,
            itemsSpacing: this.props.itemsSpacing,
            buttonTemplate: getButtonTemplate(),
            buttonTemplateOptions:
                this._getSimpleButtonTemplateOptionsByItem(item),
            isFirstItem: this.state.firstItem === item,
            type: 'toolbar',
            attrs: attrsForItemTemplate,
            onClick: (e) => {
                return this._itemClickHandler(e, item);
            },
        };
        if (typeof ItemTemplate === 'string') {
            return (
                <Async
                    templateName={ItemTemplate}
                    templateOptions={itemTemplateOptions}
                />
            );
        }
        return <ItemTemplate {...itemTemplateOptions} />;
    }

    render(): React.ReactElement {
        const attrs = wasabyAttrsToReactDom(this.props.attrs || {});
        const attrsClassName = 'controls-Toolbar ' + (attrs.className || '');
        const toolbarItems = [];
        this.state.items.each((item, index) => {
            if (
                this._isShowToolbar(
                    item as TItem,
                    this.props.parentProperty,
                    this.props.isAdaptive,
                    this.props.direction,
                    this.state.items
                )
            ) {
                toolbarItems.push(this._createItemTemplate(item, item.getKey() || index));
            }
        });
        return (
            <div
                ref={this.props.forwardedRef}
                {...attrs}
                className={attrsClassName + (this.props.className || '')}
            >
                <div
                    className={`controls-Toolbar_content controls-Toolbar_content-${this.props.direction}`}
                    ref={this._toolbarItemsRef}
                >
                    {toolbarItems}
                    {this.state.needShowMenu && (
                        <Button
                            ref={this._menuTargetRef}
                            className={`controls-Toolbar__menu controls-Toolbar__menu_${
                                this.props.direction
                            }-spacing-${
                                this.state.countShowItems
                                    ? this.props.contrastBackground
                                        ? this.props.itemsSpacing
                                        : 'small'
                                    : 'none'
                            }`}
                            translucent={
                                this.props.translucent ? 'dark' : 'none'
                            }
                            viewMode={
                                this.props.translucent
                                    ? 'filled'
                                    : this.props.menuButtonViewMode
                            }
                            buttonStyle={this.props.translucent ? 'pale' : ''}
                            iconStyle={
                                this.props.translucent
                                    ? 'contrast'
                                    : 'secondary'
                            }
                            tooltip={rk('Открыть меню')}
                            iconSize={
                                this.props.menuIconSize
                                    ? this.props.menuIconSize
                                    : this.props.iconSize === 'l'
                                    ? 'l'
                                    : 'm'
                            }
                            icon={this.props.menuIcon}
                            inlineHeight={
                                this.props.direction === 'vertical'
                                    ? 'xl'
                                    : this.props.inlineHeight
                                    ? this.props.inlineHeight
                                    : this.props.iconSize === 'l'
                                    ? 'l'
                                    : 'm'
                            }
                            contrastBackground={this.props.contrastBackground}
                            data-qa="controls-Toolbar__menu"
                            onClick={(e) => {
                                return this._onClickHandler(e);
                            }}
                            onMouseDown={(e) => {
                                return this._mouseDownHandler(e);
                            }}
                            onMouseEnter={() => {
                                return this._mouseEnterHandler();
                            }}
                            onMouseLeave={() => {
                                return this._mouseLeaveHandler();
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    static defaultProps: Partial<IToolbarOptions> = {
        menuSource: null,
        popupClassName: '',
        itemsSpacing: 'medium',
        iconSize: 'm',
        direction: 'horizontal',
        itemTemplate: defaultItemTemplate,
        iconStyle: 'secondary',
        translucent: false,
        closeMenuOnOutsideClick: true,
        menuIcon: 'icon-SettingsNew',
        menuButtonViewMode: 'ghost',
    };

    private static _calcMenuItems(
        items: TItems,
        isAdaptive: boolean = false,
        direction: string
    ): TItems {
        const showOnlyMenu =
            isAdaptive && direction === 'vertical' && items.getCount() > 1;
        return getMenuItems<TItem>(items, showOnlyMenu).value(
            factory.recordSet,
            {
                adapter: items.getAdapter(),
                keyProperty: items.getKeyProperty(),
                format: items.getFormat(),
            }
        );
    }

    private static _typeItem(item: TItem): TypeItem {
        if (item.get('icon')) {
            return 'icon';
        }
        if (item.get('viewMode') === 'ghost') {
            return 'ghost';
        }

        return 'link';
    }

    private static _menuItemClassName(item: TItem): string {
        const menuClassName = item.get('popupClassName');

        if (menuClassName) {
            return menuClassName;
        }

        return '';
    }

    static getOptionsTypes(): object {
        return {
            popupClassName: descriptor(String),
            itemsSpacing: descriptor(String).oneOf(['small', 'medium', 'big']),
        };
    }
}

/**
 * @event dropDownOpen Происходит при открытии выпадающего списка.
 * @name Controls/_toolbars/View#dropDownOpen
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event dropDownClose Происходит при закрытии выпадающего списка.
 * @name Controls/_toolbars/View#dropDownClose
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event itemClick Происходит при клике по элементу.
 * @name Controls/_toolbars/View#itemClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.toolbars:View on:itemClick="onToolbarItemClick()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * onToolbarItemClick: function(e, selectedItem) {
 *    var itemId = selectedItem.get('id');
 *    switch (itemId) {
 *       case 'remove':
 *          this._removeItems();
 *          break;
 *       case 'move':
 *          this._moveItems();
 *          break;
 * }
 * </pre>
 */

/**
 * @name Controls/_toolbars/View#iconStyle
 * @cfg {String}
 * @demo Controls-demo/Toolbar/IconStyle/Index
 */

/**
 * @name Controls/_toolbars/View#fontColorStyle
 * @cfg {Controls/interface/TFontColorStyle.typedef}
 * @demo Controls-demo/Toolbar/IconStyle/Index
 */

/**
 * @name Controls/_toolbars/View#menuOptions
 * @cfg {Controls/menu:IMenuPopupOptions} Дополнительные опции, которые будет переданы в выпадающий список.
 * @see Controls/menu:Popup
 */

/**
 * @name Controls/_toolbars/View#itemTemplate
 * @cfg {String | TemplateFunction} Пользовательский шаблон отображения элемента внутри тулбара.
 * @description Для того чтобы задать шаблон элемента и в тулбаре и в выпадающем списке, используйте опцию {@link Controls/interface/IItemTemplate itemTemplateProperty}.
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <div class="controlsDemo__wrapper">
 *    <div class="controlsDemo__cell">
 *       <Controls.toolbars:View
 *          items="{{_items}}"
 *          keyProperty="id">
 *             <ws:itemTemplate>
 *                <div style="background: #E1E1E1">
 *                   <ws:partial template="Controls/toolbars:ItemTemplate" />
 *                </div>
 *             </ws:itemTemplate>
 *       </Controls.toolbars:View>
 *    </div>
 * </div>
 * </pre>
 *
 * @demo Controls-demo/Toolbar/ItemTemplate/Index
 * @remark
 * Позволяет установить пользовательский шаблон отображения элемента.
 * По умолчанию используется базовый шаблон {@link Controls/toolbars:ItemTemplate}.
 * При установке шаблона **обязателен** вызов базового шаблона Controls/toolbars:ItemTemplate.
 * @see Controls/_toolbars/View#itemTemplateProperty
 * @see Controls/toolbars:ItemTemplate
 */

/**
 * @name Controls/_toolbars/View#itemTemplateProperty
 * @cfg {String} Имя поля элемента, которое содержит имя шаблона отображения элемента. С помощью этой настройки отдельным элементам можно задать собственный шаблон отображения.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <div class="controlsDemo__wrapper">
 *    <div class="controlsDemo__cell">
 *       <Controls.toolbars:View
 *          items="{{_items}}"
 *          keyProperty="id"
 *          itemTemplateProperty="template"/>
 *    </div>
 * </div>
 * </pre>
 * @remark
 * Если не задано значение в опции itemTemplateProperty или в свойстве элемента, то используется шаблон из {@link Controls/_toolbars/View#itemTemplate itemTemplate}.
 * @see Controls/_toolbars/View#itemTemplate
 * @see Controls/toolbars:ItemTemplate
 */

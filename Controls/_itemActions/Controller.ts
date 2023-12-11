/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { unstable_batchedUpdates } from 'react-dom';
import { Control } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { Memory, CrudEntityKey } from 'Types/source';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';
import type { Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import type { CollectionItem, ISwipeConfig } from 'Controls/display';
import { DependencyTimer, IStickyPopupOptions } from 'Controls/popup';
import { IMenuPopupOptions } from 'Controls/menu';
import { IItemActionsItem } from './interface/IItemActionsItem';
import { IItemActionsCollection } from './interface/IItemActionsCollection';
import { IItemActionsObject, IShownItemAction } from './interface/IItemActionsObject';
import { verticalMeasurer } from './measurers/VerticalMeasurer';
import { horizontalMeasurer } from './measurers/HorizontalMeasurer';
import { MENU_BUTTON_KEY, Utils } from './Utils';
import { IContextMenuConfig } from './interface/IContextMenuConfig';
import * as mStubs from 'Core/moduleStubs';
import { getActions } from './measurers/ItemActionMeasurer';
import { TItemActionsVisibility } from './interface/IItemActionsOptions';
import { TApplyButtonStyle } from './interface/IItemActionsTemplateConfig';
import { TButtonStyle } from 'Controls/buttons';
import {
    TIconStyle,
    IItemAction,
    TActionCaptionPosition,
    TEditArrowVisibilityCallback,
    TItemActionsPosition,
    TItemActionsSize,
    TItemActionVisibilityCallback,
} from 'Controls/interface';
import { TItemActionShowType, TActionDisplayMode } from './constants';
import { getIcon, isSVGIcon } from 'Controls/Utils/Icon';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import {
    DEFAULT_ICON_STYLE,
    DEFAULT_BUTTON_STYLE,
    DEFAULT_ACTION_ALIGNMENT,
    DEFAULT_ACTION_CAPTION_POSITION,
    DEFAULT_ACTION_MODE,
    DEFAULT_ACTION_POSITION,
    DEFAULT_ACTION_SIZE,
    DEFAULT_FUNCTIONAL_BUTTON_STYLE,
} from './constants';

type ISetItemActionsStateCallback = (itemActions: IItemAction[]) => void;
export type IItemActionsTemplateMountedCallback = (
    item: CollectionItem,
    setStateCallback: ISetItemActionsStateCallback
) => void;
export type IItemActionsTemplateUnmountedCallback = (item: CollectionItem) => void;

/**
 * @typedef {String} TMenuButtonVisibility
 * Видимость кнопки "Ещё" в свайпе
 * @variant visible - кнопка видима в любом случае
 * @variant adaptive - Расчёт происходит от количесива элементов в свайпе
 */
export type TMenuButtonVisibility = 'visible' | 'adaptive';

/**
 * @interface Controls/_itemActions/Controller/IControllerOptions
 * @public
 */
export interface IControllerOptions {
    /**
     * Коллекция элементов, содержащих операции с записью
     */
    collection: IItemActionsCollection;
    /**
     * Операции с записью
     */
    itemActions: IItemAction[];
    /**
     * Название текущей темы оформления
     */
    theme: string;
    /**
     * @cfg {Controls/_interface/IAction/TItemActionsSize.typedef}
     * Размер иконок операций над записью
     * Поддерживаемые варианты: 's' | 'm'
     * Значение по умолчанию задаётся стандартами контрола, использующего ItemActionsController
     */
    iconSize?: TItemActionsSize;
    /**
     * Размер иконки меню
     * варианты 's'|'m'|'l'
     */
    menuIconSize?: TItemActionsSize;
    /**
     * Имя свойства, которое содержит конфигурацию для панели с опциями записи.
     */
    itemActionsProperty?: string;
    /**
     * Функция обратного вызова для определения видимости опций записи.
     */
    visibilityCallback?: TItemActionVisibilityCallback;
    /**
     * Должна ли быть видна панель с кнопками для редактирования
     */
    editingToolbarVisible?: boolean;
    /**
     * Позиция по отношению к записи.
     * Варианты: 'inside' | 'outside' | 'custom'
     */
    itemActionsPosition?: TItemActionsPosition;
    /**
     * Класс для установки контейнеру controls-itemActionsV.
     * По умолчанию 'controls-itemActionsV_position_bottomRight'
     */
    itemActionsClass?: string;
    /**
     * @cfg {String} Стиль кнопки "Подтвердить"
     * @demo Controls-demo/gridNew/EditInPlace/Toolbar/Index
     */
    applyButtonStyle?: TApplyButtonStyle;
    /**
     * Выравнивание опций записи, когда они отображаются в режиме swipe
     * Варианты: 'horizontal' | 'vertical'
     */
    actionAlignment?: 'horizontal' | 'vertical';
    /**
     * Позиция заголовка для опций записи, когда они отображаются в режиме swipe.
     */
    actionCaptionPosition?: TActionCaptionPosition;
    /**
     * Опция записи, которую необходимо тображать в свайпе, если есть editArrow
     */
    editArrowAction?: IItemAction;
    /**
     * Видимость Опция записи, которую необходимо тображать в свайпе, если есть editArrow
     */
    editArrowVisibilityCallback?: TEditArrowVisibilityCallback;
    /**
     * Конфигурация для контекстного меню опции записи.
     */
    contextMenuConfig?: IContextMenuConfig;
    /**
     * Редактируемая запись
     */
    editingItem?: IItemActionsItem;
    /**
     * Стиль операций над записью редактируемой записи
     */
    editingStyle?: string;

    /**
     * Способ размещения опций записи по ховеру
     * @variant strict вычисляется на основе showType
     * @variant adaptive динамическое в зависимости от ширины плитки. В этом режиме не отображаются операции с
     * дочерними элементами. Доступ к ним возможен только через меню с тремя точками.
     * @defaul strict
     */
    actionMode: 'strict' | 'adaptive';

    /**
     * @name Controls/_itemActions/Controller/IControllerOptions#itemActionsVisibility
     * @cfg {Controls/_itemActions/interface/IItemActionsOptions/TItemActionsVisibility.typedef} Отображение опций записи с задержкой или без.
     */
    itemActionsVisibility: TItemActionsVisibility;

    /**
     * Временная опция для реверсного вывода операций над записью
     * @description
     * https://online.sbis.ru/opendoc.html?guid=76408b97-fc91-46dc-81b0-0f375d07ab99
     */
    feature1183020440?: boolean;

    // Временная опция, чтобы не выводить меню опций записи, если нет выводимых опций, но задан футер
    // Для устранения опции требуется переход на настоящие actions и footer по задаче:
    // https://online.sbis.ru/opendoc.html?guid=dca1ba93-ffe6-4f68-9f05-9d266a0bc28f
    task1183329228?: boolean;
}

/**
 * Функция обратного вызова, возвращающая видимость операций по умолчанию
 * @param action
 * @param item
 * @param isEditing
 */
const defaultVisibilityCallback = (action: IItemAction, item: Model, isEditing: boolean) => {
    return true;
};

/**
 * Контроллер, управляющий состоянием ItemActions в коллекции
 * @public
 */
export class Controller {
    private _collection: IItemActionsCollection;
    private _commonItemActions: IItemAction[];
    private _itemActionsProperty: string;
    private _itemActionVisibilityCallback: TItemActionVisibilityCallback;
    private _editArrowVisibilityCallback: TEditArrowVisibilityCallback;
    private _editArrowAction: IItemAction;
    private _contextMenuConfig: IContextMenuConfig;
    private _iconSize: TItemActionsSize;
    private _menuIconSize: TItemActionsSize;
    private _actionMode: 'adaptive' | 'strict';
    private _applyButtonStyle: TApplyButtonStyle;
    // вариант расположения опций в свайпе на момент инициализации
    private _actionsAlignment: 'horizontal' | 'vertical';

    private _theme: string;

    // Ширина опций записи для рассчётов свайп-конфига после изменения видимости опций записи
    private _actionsWidth: number;

    // Высота опций записи для рассчётов свайп-конфига после изменения видимости опций записи
    private _actionsHeight: number;

    // Текущее позиционирование опций записи
    private _itemActionsPosition: TItemActionsPosition;

    private _activeItemKey: any;

    // Таймер для погрузки зависимостей
    private _dependenciesTimer: DependencyTimer = null;

    private _loadMenuTempPromise: Promise<>;

    // Видимость опций записи
    private _itemActionsVisibility: TItemActionsVisibility;

    // Сохранённые операции над записью для восстановления при переключении между свайпом и
    // отображением ItemActionsVisibility="visible"
    private _savedItemActions: IItemActionsObject;

    // Временная опция для реверсного вывода операций над записью
    // https://online.sbis.ru/opendoc.html?guid=76408b97-fc91-46dc-81b0-0f375d07ab99
    private _feature1183020440: boolean;

    // Временная опция, чтобы не выводить меню опций записи, если нет выводимых опций, но задан футер
    // Для устранения опции требуется переход на настоящие actions и footer по задаче:
    // https://online.sbis.ru/opendoc.html?guid=dca1ba93-ffe6-4f68-9f05-9d266a0bc28f
    private _task1183329228: boolean;

    /**
     * Состояние "свайпнутости"
     * Если true, то хотя бы одна запись в списке свайпнута.
     */
    private _isSwiped: boolean;

    /**
     * Флаг, что опции были уже один раз установлены
     */
    private _actionsAssigned: boolean;

    private _setItemActionsStateCallbacks: Record<CrudEntityKey, ISetItemActionsStateCallback>;

    private readonly _getItemActionsTemplateMountedCallback: IItemActionsTemplateMountedCallback;
    private readonly _getItemActionsTemplateUnmountedCallback: IItemActionsTemplateUnmountedCallback;

    constructor(options?: IControllerOptions) {
        if (options) {
            this.updateOptions(options);
        }

        this._getItemActionsTemplateMountedCallback = (item, setStateCallback) => {
            if (!this._setItemActionsStateCallbacks) {
                this._setItemActionsStateCallbacks = {};
            }

            this._setItemActionsStateCallbacks[item.key] = setStateCallback;
        };

        this._getItemActionsTemplateUnmountedCallback = (item) => {
            if (this._setItemActionsStateCallbacks) {
                delete this._setItemActionsStateCallbacks[item.key];
            }
        };
    }

    /**
     * Старый метод обновления операций над записью для обратной совместимости.
     * Обновляет и опции контроллера и операции на записях в текущем диапазоне индексов
     * @deprecated use updateOptions + updateActions instead
     * @param options
     */
    update(options: IControllerOptions): void {
        this.updateOptions(options);
        this.updateActions(options.editingItem);
    }

    /**
     * Метод инициализации и обновления параметров.
     * Метод только устанавливает параметры и не обновляет операции у записей.
     * @param options
     */
    updateOptions(options: IControllerOptions): void {
        this._theme = options.theme;
        this._editArrowVisibilityCallback =
            options.editArrowVisibilityCallback ||
            ((item: Model) => {
                return true;
            });
        this._editArrowAction = options.editArrowAction;
        this._contextMenuConfig = options.contextMenuConfig;
        this._actionMode = options.actionMode || DEFAULT_ACTION_MODE;
        this._applyButtonStyle = options.applyButtonStyle;
        this._iconSize = options.iconSize;
        this._menuIconSize = options.menuIconSize || DEFAULT_ACTION_SIZE;
        this._actionsAlignment = options.actionAlignment || DEFAULT_ACTION_ALIGNMENT;
        this._itemActionsPosition = options.itemActionsPosition || DEFAULT_ACTION_POSITION;
        this._collection = options.collection;
        this._itemActionsVisibility = options.itemActionsVisibility;
        this._feature1183020440 = options.feature1183020440;
        this._task1183329228 = options.task1183329228;
        this._updateActionsTemplateConfig(options);

        if (
            !options.itemActions ||
            !isEqual(this._commonItemActions, options.itemActions) ||
            this._itemActionsProperty !== options.itemActionsProperty ||
            this._itemActionVisibilityCallback !== options.visibilityCallback
        ) {
            this._commonItemActions =
                !options.itemActions && options.editArrowAction ? [] : options.itemActions;
            this._itemActionsProperty = options.itemActionsProperty;
            this._itemActionVisibilityCallback =
                options.visibilityCallback || defaultVisibilityCallback;
        }
    }

    destroy(): void {
        this._setItemActionsStateCallbacks = {};
    }

    /**
     * Обновляет операции над записью у указанной записи или у всех записей в текущем диапазоне индексов.
     * @param item Запись, у которой обновляются операции.
     */
    updateActions(item?: IItemActionsItem): (number | string)[] {
        let result: (number | string)[] = [];
        if (this._commonItemActions || this._itemActionsProperty) {
            result = this._updateActionsOnItems(item);
        }
        return result;
    }

    /**
     * Определяет на основе переданных newItems и removedItems, надо ли обновлять ItemActions.
     * Возвращает false, если при добавлении или удалении элементов в newItems и в removedItems отсутствуют
     * записи, для которых нужно инициализировать ItemActions.
     * Возвращает false, если в newItems.properties указан тип изменений, при котором не нужно инициализировать ItemActions.
     * Возвращает true, если newItems или newItems.properties не заданы.
     * @param action
     * @param newItems
     * @param removedItems
     */
    shouldUpdateOnCollectionChange(
        action: string,
        newItems?: CollectionItem<Model>[] & { properties: string },
        removedItems?: CollectionItem<Model>[] & { properties: string }
    ): boolean {
        // При добавлении или удалении элементов списка, которые не имеют операций над записью
        // не надо набирать операции заново.
        // Например, nodeFooter не имеют операций над записью и никак не должны на них влиять.
        if (
            action === IObservable.ACTION_ADD &&
            newItems &&
            newItems.length &&
            !newItems.some((item) => {
                return item.SupportItemActions;
            })
        ) {
            return false;
        }
        if (
            action === IObservable.ACTION_REMOVE &&
            removedItems &&
            removedItems.length &&
            !removedItems.some((item) => {
                return item.SupportItemActions;
            })
        ) {
            return false;
        }
        const propertyVariants = [
            'selected',
            'marked',
            'swiped',
            'hovered',
            'active',
            'dragged',
            'editingContents',
        ];
        return (
            !newItems ||
            !newItems.properties ||
            propertyVariants.indexOf(newItems.properties) === -1
        );
    }

    /**
     * Активирует Swipe для меню операций с записью
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param actionsContainerWidth ширина контейнера для расчёта видимых опций записи
     * @param actionsContainerHeight высота контейнера для расчёта видимых опций записи
     */
    activateSwipe(
        itemKey: CrudEntityKey,
        actionsContainerWidth: number,
        actionsContainerHeight: number
    ): void {
        const item = this._collection.getItemBySourceKey(itemKey);
        if (this._itemActionsVisibility === 'visible') {
            this._saveItemActions(item);
        }
        item.setSwipeAnimation('open');
        this._updateSwipeConfig(item, actionsContainerWidth, actionsContainerHeight);
        if (item.getActions().showed.length) {
            this._setSwipeItem(itemKey);
            this._collection.setActiveItem(item);
        }
    }

    /**
     * Берёт ранее набранные itemActions для указанной записи, и,
     * в зависимости от ширины контейнера определяет видимые.
     * Затем обновляет itemActions записи.
     * @param itemKey
     * @param containerWidth. Если не указан, то набор видимых операций рассчитывается по правилам ховера
     */
    updateItemActions(itemKey: CrudEntityKey, containerWidth?: number): void {
        const item = this._collection.getItemBySourceKey(itemKey);
        const contents = item.getContents();
        let actions: IItemActionsObject = item.getActions();
        if (containerWidth) {
            actions = getActions(actions, this._iconSize, null, containerWidth);
        } else {
            actions.showed = this._filterActionsToShowOnHover(
                actions.all,
                contents,
                item.isEditing()
            );
        }
        const itemActions = this._fixActionsDisplayOptions(actions);
        this._updateActionsOnItem(item, itemActions);
    }

    /**
     * Деактивирует Swipe для меню операций с записью
     */
    deactivateSwipe(resetActiveItem: boolean = true): void {
        const currentSwipedItem = this.getSwipeItem();
        if (this._isSwiped) {
            this._isSwiped = false;
        }
        if (currentSwipedItem) {
            currentSwipedItem.setSwipeAnimation(null);
            if (this._itemActionsVisibility === 'visible') {
                this._restoreItemActions(currentSwipedItem);
            }
            this._setSwipeItem(null);
            if (resetActiveItem) {
                this._collection.setActiveItem(null);
            }
            this._collection.setSwipeConfig(null);
        }
    }

    /**
     * Получает последний swiped элемент
     */
    getSwipeItem(): IItemActionsItem {
        return this._collection.find((item) => {
            return item.isSwiped();
        });
    }

    /**
     * Собирает конфиг выпадающего меню операций
     * @param item элемент коллекции, для которого выполняется действие
     * @param clickEvent событие клика
     * @param parentAction Родительская операция с записью
     * @param opener контрол или элемент - опенер для работы системы автофокусов
     * @param isContextMenu Флаг, указывающий на то, что расчёты производятся для контекстного меню
     */
    prepareActionsMenuConfig(
        item: IItemActionsItem,
        clickEvent: SyntheticEvent<MouseEvent>,
        parentAction: IShownItemAction,
        opener: Element | Control<object, unknown>,
        isContextMenu: boolean
    ): IStickyPopupOptions {
        if (!item) {
            return;
        }
        const menuActions = this._getMenuActions(item, parentAction);
        if (
            (!menuActions || menuActions.length === 0) &&
            (!this._hasMenuHeaderOrFooter() || this._task1183329228)
        ) {
            return;
        }

        const target = isContextMenu ? null : this._calculateTargetPoint(clickEvent.target);
        const isActionMenu = !!parentAction && !parentAction.isMenu;
        const templateOptions = this._getActionsMenuTemplateConfig(
            item,
            isActionMenu,
            parentAction,
            menuActions
        );

        let menuConfig: IStickyPopupOptions = {
            // @ts-ignore
            opener,
            target,
            template: 'Controls/menu:Popup',
            actionOnScroll: 'close',
            templateOptions,
            // Этот класс задаёт смещение для popup при расчёте его top/left так,
            // чтобы иконка в заголовке меню совпадала с иконкой кнопки, по которой это меню открыли
            className:
                `controls-MenuButton_link_iconSize-medium_popup controls_popupTemplate_theme-${this._theme}` +
                ` controls_dropdownPopup_theme-${this._theme}`,
            closeOnOutsideClick: true,
            autofocus: false,
            fittingMode: {
                vertical: 'overflow',
                horizontal: 'adaptive',
            },
            readOnly: false,
        };
        if (!isActionMenu) {
            menuConfig = {
                ...menuConfig,
                direction: {
                    horizontal: isContextMenu ? 'right' : 'left',
                },
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                // Этот класс задаёт смещение для popup при расчёте его top/left так,
                // чтобы кнопка закрытия меню совпадала с иконкой кнопки открытия меню
                className: `controls-ItemActions__popup__list controls_popupTemplate_theme-${this._theme}`,
                // @ts-ignore
                nativeEvent: isContextMenu ? clickEvent.nativeEvent : null,
            };
        }
        return menuConfig;
    }

    /**
     * Устанавливает активный Item в коллекции
     * @param item Текущий элемент коллекции
     */
    setActiveItem(item: IItemActionsItem): void {
        this._collection.setActiveItem(item);
        if (
            item &&
            typeof item.getContents !== 'undefined' &&
            typeof item.getContents().getKey !== 'undefined'
        ) {
            this._activeItemKey = item.getContents().getKey();
        }
    }

    /**
     * Возвращает текущий активный Item
     */
    getActiveItem(): IItemActionsItem {
        let activeItem = this._collection.getActiveItem();

        /*
         * Проверяем что элемент существует, в противном случае пытаемся его найти.
         */
        if (
            activeItem === undefined &&
            typeof this._collection.getItemBySourceKey !== 'undefined' &&
            this._activeItemKey
        ) {
            activeItem = this._collection.getItemBySourceKey(this._activeItemKey);
        }
        return activeItem;
    }

    /**
     * Устанавливает текущее состояние анимации в модель.
     * На этом этапе анимация только начинается, все пересчёты происходят при завершении
     * анимации на deactivateSwipe.
     */
    startSwipeCloseAnimation(): void {
        const swipeItem = this.getSwipeItem();
        swipeItem.setSwipeAnimation('close');
    }

    /**
     * Стартует таймер загрузки зависимостей меню
     * @remark
     * Рендер контрола Controls/dropdown:Button намного дороже, поэтому вместо menuButton используем текущую вёрстку и таймеры
     */
    startMenuDependenciesTimer(): void {
        if (!this._dependenciesTimer) {
            this._dependenciesTimer = new DependencyTimer();
        }
        this._dependenciesTimer.start(this._loadDependencies.bind(this));
    }

    /**
     * Останавливает таймер и фактически загружает все зависимости
     */
    stopMenuDependenciesTimer(): void {
        this._dependenciesTimer?.stop();
    }

    /**
     * Установить состояние флага "Опции записи заданы для элементов коллекции"
     * @param {Boolean} assigned Состояние флага "Опции записи заданы для элементов коллекции"
     * @public
     */
    setActionsAssigned(assigned: boolean): void {
        this._actionsAssigned = assigned;
    }

    /**
     * Получить состояние флага "Опции записи заданы для элементов коллекции"
     * @public
     * @return {Boolean} Состояние флага "Опции записи заданы для элементов коллекции"
     */
    isActionsAssigned(): boolean {
        return this._actionsAssigned;
    }

    /**
     * Возвращает состояние свайпнутости
     */
    isSwiped(): boolean {
        return this._isSwiped;
    }

    /**
     * На основании размеров контейнера "свайпнутой" записи опреляет,
     * Нужно ли обновлять её swipeConfig
     */
    updateSwipeConfigIfNeed(
        baseContainer: HTMLElement,
        uniqueSelector: string,
        measurableSelector: string
    ): void {
        // Для outside нет никакого динамического расчёта
        if (this._itemActionsPosition === 'outside') {
            return;
        }
        const item = this.getSwipeItem();
        const itemKey = item.getContents().getKey();
        const itemSelector = `.${uniqueSelector} .controls-ListView__itemV[item-key='${itemKey}']`;
        const itemNode = baseContainer.querySelector(itemSelector) as HTMLElement;

        // Если не нашли HTML элемент по ключу записи, то просто выходим
        if (!itemNode) {
            return;
        }
        const swipeContainerSize = Controller.getSwipeContainerSize(itemNode, measurableSelector);
        const need =
            item &&
            (this._actionsWidth !== swipeContainerSize.width ||
                this._actionsHeight !== swipeContainerSize.height);
        if (need) {
            this._updateSwipeConfig(item, swipeContainerSize.width, swipeContainerSize.height);
        }
    }

    getItemActionsTemplateMountedCallback(): IItemActionsTemplateMountedCallback {
        return this._getItemActionsTemplateMountedCallback;
    }

    getItemActionsTemplateUnmountedCallback(): IItemActionsTemplateUnmountedCallback {
        return this._getItemActionsTemplateUnmountedCallback;
    }

    /**
     * Возвращает конфиг для шаблона меню опций
     * @param item элемент коллекции, для которого выполняется действие
     * @param isActionMenu
     * @param parentAction
     * @param menuActions
     * @private
     */
    private _getActionsMenuTemplateConfig(
        item: IItemActionsItem,
        isActionMenu: boolean,
        parentAction: IItemAction,
        menuActions: IItemAction[]
    ): IMenuPopupOptions {
        const source = new Memory({
            data: menuActions.map(this._prepareMenuAction),
            keyProperty: 'id',
        });
        const iconSize =
            (this._contextMenuConfig && this._contextMenuConfig.iconSize) || DEFAULT_ACTION_SIZE;
        const headConfig = isActionMenu
            ? {
                  caption: parentAction.title,
                  icon: parentAction.icon,
                  iconSize,
              }
            : null;
        const root = parentAction && (parentAction.id !== MENU_BUTTON_KEY ? parentAction.id : null);
        return {
            source,
            footerItemData: {
                item: Controller._getItemContents(item),
            },
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            // Позволяем настроить closeButtonVisibility
            closeButtonVisibility: !isActionMenu && !root,
            ...this._contextMenuConfig,
            root,
            // @ts-ignore
            showHeader: isActionMenu,
            headConfig,
            iconSize,
        };
    }

    private _loadDependencies(): Promise<unknown[]> {
        if (!this._loadMenuTempPromise) {
            const templatesToLoad = ['Controls/menu'];
            if (this._contextMenuConfig) {
                const templates = [
                    'headerTemplate',
                    'footerTemplate',
                    'itemTemplate',
                    'groupTemplate',
                ];
                templates.forEach((template) => {
                    if (typeof this._contextMenuConfig[template] === 'string') {
                        templatesToLoad.push(this._contextMenuConfig[template]);
                    }
                });
            }
            this._loadMenuTempPromise = mStubs.require(templatesToLoad).then((loadedDeps) => {
                return loadedDeps[0].Control.loadCSS(this._theme);
            });
        }
        return this._loadMenuTempPromise;
    }

    /**
     * Вычисляет операции над записью для каждого элемента коллекции
     * Для старой модели listViewModel возвращает массив id изменённых значений
     * @private
     */
    private _updateActionsOnItems(editingItem?: IItemActionsItem): (number | string)[] {
        let hasChanges = false;
        const changedItemsIds: (number | string)[] = [];
        if (this._collection.isEventRaising()) {
            this._collection.setEventRaising(false, true);
        }

        // Если есть редактируемая запись, то itemActions нужно показать только на ней. Нет смысла обновлять все записи.
        if (editingItem) {
            this._updateActionsOnParticularItem(editingItem);
        } else {
            unstable_batchedUpdates(() => {
                this._collection.getViewIterator().each((item) => {
                    if (item.isAdd) {
                        return;
                    }
                    const itemChanged = this._updateActionsOnParticularItem(item);
                    hasChanges = hasChanges || itemChanged;
                });

                // Если у нас изменились экшины у записей и нет коллбэков для вызова перерисовки записей,
                // то это значит что у нас список на реакте и нужно вызвать перерисовку всего списка.
                // Из-за setEventRaising это само не произойдет
                if (hasChanges) {
                    this._collection.nextVersion();
                }
            });
        }
        // Считаем, что операции над записью заданы во всех случаях, включая вариант,
        // когда передан редакатируемый элемент. Это позволит обновлять операции на редактируемом элементе при апдейте
        this.setActionsAssigned(true);

        if (!this._collection.isEventRaising()) {
            this._collection.setEventRaising(true, true);
        }

        if (hasChanges) {
            // Если поменялась видимость ItemActions через VisibilityCallback, то надо обновить конфиг свайпа
            if (this._itemActionsPosition !== 'outside') {
                const swipedItem = this.getSwipeItem();
                if (swipedItem) {
                    this._updateSwipeConfig(swipedItem, this._actionsWidth, this._actionsHeight);
                }
            }
        }

        return changedItemsIds;
    }

    private _updateActionsOnParticularItem(item: IItemActionsItem): boolean {
        if (!item.SupportItemActions) {
            return false;
        }
        const actionsObject = this._fixActionsDisplayOptions(this._getActionsObject(item));
        return this._setItemActions(item, actionsObject, this._actionMode === 'adaptive');
    }

    /**
     * Получает для указанного элемента коллекции набор опций записи для меню, отфильтрованный по parentAction
     * Если parentAction - кнопка вызова меню или parentAction не указан, то элементы фильтруются по showType.
     * Если parentAction содержит id, то элементы фильтруются по parent===id.
     * Если был сделан свайп по элементу, то возвращаются опции записи, отсутствующие в showed.
     * @see http://axure.tensor.ru/standarts/v7/%D1%81%D0%B2%D0%B0%D0%B9%D0%BF__version_04_.html
     * @param item
     * @param parentAction
     * @private
     */
    private _getMenuActions(item: IItemActionsItem, parentAction: IShownItemAction): IItemAction[] {
        const contents = Controller._getItemContents(item);
        const actionsObject = item.getActions();
        let visibleActions =
            actionsObject &&
            actionsObject.all &&
            this._filterVisibleActions(actionsObject.all, contents, item.isEditing());
        if (visibleActions) {
            // Кроме как intersection all vs showed мы не можем знать, какие опции Measurer скрыл под кнопку "Ещё",
            // Поэтому для свайпнутой записи имеет смысл показывать в меню те опции, которые отсутствуют в showed
            // массиве или у которых showType MENU_TOOLBAR или MENU
            // см. https://online.sbis.ru/opendoc.html?guid=f43a6f8e-84a5-4f22-b67f-4545bf586adc
            // см. https://online.sbis.ru/opendoc.html?guid=91e7bea1-fa6c-483f-a5dc-860b084ab17a
            // см. https://online.sbis.ru/opendoc.html?guid=b5751217-3833-441f-9eb6-53526625bc0c
            if (item.isSwiped() && (!parentAction || parentAction.isMenu)) {
                return visibleActions.filter((action) => {
                    return (
                        !this._hasActionInArray(action, actionsObject.showed) ||
                        action.showType !== TItemActionShowType.TOOLBAR
                    );
                });
            }
            // По стандарту при адаптивном способе отображения операций кнопки с подменю не показываются в
            // быстром доступе, а в меню надо показывать весь набор операций.
            // Это приводит к "дублированию" кнопок, когда есть кнопка с подменю и такая же,
            // без подменю - для быстрого доступа. Напр:
            // см. https://online.sbis.ru/opendoc.html?guid=85014e84-fc7a-4d0c-9d9d-bddc8cd124fa.
            // Пока в этом случае показываем операции в меню по обычным правилам.
            // Если прикладник хочет полную адаптивность, он может всем операциям поставить
            // action.showType === TItemActionShowType.MENU.
            if (!!parentAction && !parentAction.isMenu) {
                visibleActions = this._getActionsByParentRecursive(visibleActions, parentAction);
            } else {
                visibleActions = this._getItemsWithFilterRecursive(visibleActions, (action) => {
                    return action.showType !== TItemActionShowType.TOOLBAR;
                });
            }
            return this._cutOrphans(visibleActions, parentAction);
        }
        return [];
    }

    // Меню не поддерживает отображение детей без родителя. Это приводит к ошибкам.
    // Например, показывается пустое меню без элементов. Тут рекурсивно отрезаем всех сироток.
    // Рекурсия нужна, т.к. иногда передают очень глубокую иерархию и нельзя отрезать только верхний слой.
    private _cutOrphans(visibleActions: IItemAction[], parentAction: IItemAction): IItemAction[] {
        let availableActionsKeys: (string | number)[] = this._getAvailableActionsKeys(
            visibleActions,
            parentAction
        );
        while (
            visibleActions.some((action) => {
                return (
                    action.parent !== undefined &&
                    availableActionsKeys.indexOf(action.parent) === -1
                );
            })
        ) {
            visibleActions = visibleActions.filter((action) => {
                return (
                    action.parent === undefined || availableActionsKeys.indexOf(action.parent) > -1
                );
            });
            availableActionsKeys = this._getAvailableActionsKeys(visibleActions, parentAction);
        }
        return visibleActions;
    }

    private _getAvailableActionsKeys(
        visibleActions: IItemAction[],
        parentAction: IItemAction
    ): (string | number)[] {
        const availableActionsKeys: (string | number)[] = visibleActions.map((action) => {
            return action.id;
        });
        if (parentAction !== undefined) {
            availableActionsKeys.push(
                parentAction && parentAction.id !== MENU_BUTTON_KEY ? parentAction.id : null
            );
        }
        return availableActionsKeys;
    }

    /**
     * Набирает элементы для иерархического меню по указанному родителю
     * @param visibleActions
     * @param parent
     * @private
     */
    private _getActionsByParentRecursive(
        visibleActions: IItemAction[],
        parent: IItemAction
    ): IItemAction[] {
        let result: IItemAction[] = [];
        const parentId = parent.id === MENU_BUTTON_KEY ? null : parent.id;
        visibleActions.forEach((action) => {
            if (action.parent === undefined) {
                action.parent = null;
            }
            if (parentId === action.parent) {
                result.push(action);
                if (action['parent@']) {
                    result = result.concat(
                        this._getActionsByParentRecursive(visibleActions, action)
                    );
                }
            }
        });
        return result;
    }

    /**
     * Набирает элементы для иерархического меню, применяя к родительским элементам указанный фильтр.
     * Дочерние элементы иерархически включаются по родителю.
     * @param visibleActions
     * @param filter
     * @private
     */
    private _getItemsWithFilterRecursive(
        visibleActions: IItemAction[],
        filter: (action: IItemAction) => boolean
    ): IItemAction[] {
        const result: IItemAction[] = [];
        visibleActions.filter(filter).forEach((action) => {
            if (result.indexOf(action) === -1) {
                result.push(action);
            }
            if (action['parent@']) {
                this._getActionsByParentRecursive(visibleActions, action).forEach((childAction) => {
                    if (result.indexOf(childAction) === -1) {
                        result.push(childAction);
                    }
                });
            }
        });
        return result;
    }

    private _hasActionInArray(action: IItemAction, actions: IItemAction[]): boolean {
        return actions.some((item) => {
            return item.id === action.id;
        });
    }

    /**
     * Устанавливает текущий swiped элемент
     * @param key Ключ элемента коллекции, на котором был выполнен swipe
     * @param silent Если true, коллекция не отправит onCollectionChange
     */
    private _setSwipeItem(key: CrudEntityKey, silent?: boolean): void {
        const oldSwipeItem = this.getSwipeItem();
        const newSwipeItem = this._collection.getItemBySourceKey(key);

        if (oldSwipeItem && oldSwipeItem !== newSwipeItem) {
            oldSwipeItem.setSwiped(false, silent);
            this._isSwiped = false;
            this._updateActionsOnParticularItem(oldSwipeItem);
        }
        if (newSwipeItem) {
            newSwipeItem.setSwiped(true, silent);
            this._isSwiped = true;
        }
    }

    /**
     * В процессе открытия меню, запись может пререрисоваться, и таргета не будет в DOM.
     * Поэтому необходимо передавать координаты таргета для popup
     * @param realTarget
     */
    private _calculateTargetPoint(realTarget: HTMLElement): {
        x: number;
        y: number;
        width: number;
        height: number;
    } {
        const rect = DimensionsMeasurer.getBoundingClientRect(realTarget);
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
        };
    }

    /**
     * Вычисляет конфигурацию, которая используется в качестве scope у itemActionsTemplate
     */
    private _updateActionsTemplateConfig(options: IControllerOptions): void {
        this._collection.setActionsTemplateConfig(
            {
                toolbarVisibility: options.editingToolbarVisible,
                editingStyle: options.editingStyle || undefined,
                itemActionsClass: options.itemActionsClass,
                itemActionsPosition: this._itemActionsPosition,
                actionAlignment: this._actionsAlignment,
                actionCaptionPosition:
                    options.actionCaptionPosition || DEFAULT_ACTION_CAPTION_POSITION,
            },
            true
        );
    }

    private _updateSwipeConfig(
        item: IItemActionsItem,
        actionsContainerWidth: number,
        actionsContainerHeight: number
    ): void {
        const contents = Controller._getItemContents(item);
        const menuButtonVisibility = this._hasMenuHeaderOrFooter() ? 'visible' : 'adaptive';
        this._actionsWidth = actionsContainerWidth;
        this._actionsHeight = actionsContainerHeight;
        const actions = this._filterVisibleActions(
            item.getActions().all,
            contents,
            item.isEditing()
        );
        const actionsTemplateConfig = this._collection.getActionsTemplateConfig();
        actionsTemplateConfig.actionAlignment = this._actionsAlignment;

        if (this._editArrowAction && this._editArrowVisibilityCallback(contents)) {
            this._addEditArrow(actions);
        }

        let swipeConfig = Controller._calculateSwipeConfig(
            actions,
            actionsTemplateConfig.actionAlignment,
            actionsContainerWidth,
            actionsContainerHeight,
            actionsTemplateConfig.actionCaptionPosition,
            menuButtonVisibility,
            this._theme
        );

        if (
            actionsTemplateConfig.actionAlignment !== 'horizontal' &&
            Controller._needsHorizontalMeasurement(swipeConfig)
        ) {
            actionsTemplateConfig.actionAlignment = 'horizontal';
            swipeConfig = Controller._calculateSwipeConfig(
                actions,
                actionsTemplateConfig.actionAlignment,
                actionsContainerWidth,
                actionsContainerHeight,
                actionsTemplateConfig.actionCaptionPosition,
                menuButtonVisibility,
                this._theme
            );
        }
        this._collection.setActionsTemplateConfig(actionsTemplateConfig, true);

        const visibleActions = swipeConfig.itemActions.showed;
        swipeConfig.itemActions.showed = visibleActions.map(this._prepareSwipeAction);

        if (swipeConfig.twoColumns) {
            swipeConfig.twoColumnsActions = [
                [visibleActions[0], visibleActions[1]],
                [visibleActions[2], visibleActions[3]],
            ];
        }

        this._setItemActions(item, swipeConfig.itemActions);
        this._collection.setSwipeConfig(swipeConfig);
    }

    /**
     * Добавляет editArrow к переданному массиву actions
     * @param actions
     * @private
     */
    private _addEditArrow(actions: IItemAction[]): void {
        if (
            !actions.find((action) => {
                return action.id === 'view';
            })
        ) {
            actions.unshift(this._prepareHoverAction(this._editArrowAction));
        }
    }

    private _saveItemActions(item: IItemActionsItem): void {
        this._savedItemActions = item.getActions();
    }

    private _restoreItemActions(item: IItemActionsItem): void {
        if (this._savedItemActions) {
            this._updateActionsOnItem(item, this._savedItemActions);
        }
    }

    /**
     * Проверяет, есть ли Header или Footer в настройках меню.
     * @private
     */
    private _hasMenuHeaderOrFooter(): boolean {
        return (
            this._contextMenuConfig &&
            !!(this._contextMenuConfig.footerTemplate || this._contextMenuConfig.headerTemplate)
        );
    }

    /**
     * Возвращает конфиг кнопки операции открытия меню.
     * @private
     */
    private _getMenuButton(): IShownItemAction {
        return Utils.getMenuButton(this._menuIconSize, false);
    }

    /**
     * Набирает операции, которые должны быть показаны только в тулбаре или в тулбаре и в меню и возвращает
     * объект {showed, all}
     * @param item
     * @private
     */
    private _getActionsObject(item: IItemActionsItem): IItemActionsObject {
        const contents = Controller._getItemContents(item);
        let all: IItemAction[];
        if (this._itemActionsProperty) {
            all = contents.get(this._itemActionsProperty);
            if (all === undefined) {
                Logger.error(
                    `ItemActions: Property ${this._itemActionsProperty} has incorrect value for record ` +
                        `with key ${contents.getKey()}. Array was expected.`,
                    this
                );
                all = [];
            }
        } else {
            all = this._commonItemActions;
        }
        // В адаптивном режиме showed определяются после вызова события updateItemActionsOnItem при setHovered
        const showed =
            this._actionMode !== 'adaptive'
                ? this._filterActionsToShowOnHover(all, contents, item.isEditing())
                : [];
        return { all, showed };
    }

    /**
     * Отфильтровывает те операции над записью, которые надо показать по ховеру
     * @private
     */
    private _filterActionsToShowOnHover(
        itemActions: IItemAction[],
        contents: Model,
        isEditing: boolean
    ): IItemAction[] {
        let actionsToShowOnHover: IItemAction[] = [];
        const actionsToShowInMenu: IItemAction[] = [];
        for (let i = 0; i < itemActions.length; i++) {
            // В любом случае не учитываем те операции над записью, в которых есть parent.
            // Для них видимость определяется при открытии соответствующего их parent меню.
            if (itemActions[i].parent) {
                continue;
            }
            const isMenuAction =
                !itemActions[i].showType || itemActions[i].showType === TItemActionShowType.MENU;
            // На этом этапе нам важно понимать только, что надо показывать кнопку меню с тремя точками,
            // Поэтому двух операций из меню тут будет достаточно, а остальные из тех, что показываются только в меню,
            // пропускаем. Их видимость определяется при открытии меню.
            if (isMenuAction && actionsToShowInMenu.length > 1) {
                continue;
            }
            const isVisible = this._itemActionVisibilityCallback(
                itemActions[i],
                contents,
                isEditing
            );
            if (!isVisible) {
                continue;
            }
            // Если операция должна быть видима по колбеку и показывается в меню
            // или в меню и по ховеру, записываем её в массив записей меню.
            if (isMenuAction || itemActions[i].showType === TItemActionShowType.MENU_TOOLBAR) {
                actionsToShowInMenu.push(itemActions[i]);
            }
            // Любые другие операции записываем в список для отображения по ховеру
            if (!isMenuAction || itemActions[i].showType === TItemActionShowType.MENU_TOOLBAR) {
                actionsToShowOnHover.push(itemActions[i]);
            }
        }

        // Добавляем кнопку меню только если прикладник вернул
        // в ItemActionsVisibilityCallback true для MENU_BUTTON_KEY
        const menuItemAction = this._getMenuButton();

        if (actionsToShowOnHover.length > 0) {
            // Если единственная видимая операция для показа в меню отсутствует в показанных по ховеру,
            // Или есть более одной видимой операции для показа в меню, или в конфигурации
            // меню указано, что надо показать подвал или шапку меню, то показываем кнопку с тремя точками.
            if (
                menuItemAction &&
                ((actionsToShowInMenu.length === 1 &&
                    actionsToShowOnHover.indexOf(actionsToShowInMenu[0]) === -1) ||
                    actionsToShowInMenu.length > 1 ||
                    this._hasMenuHeaderOrFooter())
            ) {
                actionsToShowOnHover.push(menuItemAction);
            }
            if (this._feature1183020440) {
                actionsToShowOnHover.reverse();
            }
        } else if (menuItemAction && actionsToShowInMenu.length > 1) {
            // Если записей в меню больше одной то точно показываем кнопку с тремя точками
            actionsToShowOnHover.push(menuItemAction);
        } else {
            // Тут кейс, когда actionsToShowOnHover пуст, а в actionsToShowInMenu.length <= 1
            actionsToShowOnHover = actionsToShowInMenu;
            // По умолчанию, если actionsToShowInMenu.length <= 1, нужно показывать
            // все кнопки на тулбаре, и не добавлять кнопку с тремя точками.
            // Но, если в конфигурации contextMenuConfig указано, что надо показать подвал или шапку меню,
            // нужно показывать кнопку даже тогда, когда вообще ни одной операции не было показано.
            // Некоторым это, наоборот, не нужно. Под опцией task1183329228 принудительный показ кнопки отключен.
            if (menuItemAction && !this._task1183329228) {
                if (this._hasMenuHeaderOrFooter()) {
                    actionsToShowOnHover.push(menuItemAction);
                }
            }
        }
        return actionsToShowOnHover;
    }

    /**
     * Отфильтровывает видимые операции над записью
     * @param itemActions Список операций, которые надо отфильтровать
     * @param contents текущий Record для передачи в callback
     * @param isEditing является ли запись редактируемой
     * @private
     */
    private _filterVisibleActions(
        itemActions: IItemAction[],
        contents: Model,
        isEditing: boolean
    ): IItemAction[] {
        return itemActions.filter((action) => {
            return this._itemActionVisibilityCallback(action, contents, isEditing);
        });
    }

    /**
     * Настройка параметров отображения для кнопки, которая показывается
     * при наведении на запись или при свайпе и itemActionsPosition === 'outside'.
     * ItemAction  с этими опциями передаётся в шаблон без дальнейших изменений.
     * @param action
     * @private
     */
    private _prepareHoverAction(action: IShownItemAction): IShownItemAction {
        const hasIcon = Controller._needShowIcon(action);
        const shownAction: IShownItemAction = {
            ...action,
            hasIcon,
            viewMode: action.viewMode || 'link',
            style: Controller._getButtonStyle(action),
            iconStyle: Controller._getIconStyle(action),
            iconSize: this._getHoverActionIconSize(action),
            fontSize: 'm',
            icon: hasIcon ? getIcon(action.icon) : null,
            caption: Controller._needShowTitle(action) ? action.title : null,
            isSVGIcon: isSVGIcon(action.icon),
        };

        if (
            shownAction.viewMode &&
            shownAction.viewMode !== 'link' &&
            shownAction.viewMode !== 'filled'
        ) {
            Logger.error(
                'Неподдерживаемый вид кнопки. Используйте viewMode, ' +
                    'описанные в интерфейсе IItemAction',
                this
            );
        }

        // ItemActions настраиваются одним размером iconSize, а filled - двумя iconSize + inlineHeight.
        if (shownAction.viewMode === 'filled') {
            if (shownAction.iconSize === 'xs') {
                shownAction.inlineHeight = 'xs';
                shownAction.fontSize = '2xs';
            } else if (action.iconSize === 'l') {
                shownAction.inlineHeight = 'xl';
                shownAction.fontSize = 'l';
            } else {
                shownAction.inlineHeight = 'm';
            }
        }
        return shownAction;
    }

    /**
     * Настройка параметров отображения кнопки, которая показывается в динамическом свайпе
     * при itemActionsPosition === 'inside'.
     * ItemAction с этими опциями передаётся в шаблон без дальнейших изменений.
     * @param action
     * @private
     */
    private _prepareSwipeAction(action: IItemAction): IShownItemAction {
        const shownAction: IShownItemAction = { ...action };
        shownAction.isSVGIcon = isSVGIcon(shownAction.icon);
        shownAction.icon = getIcon(shownAction.icon);
        shownAction.iconStyle =
            shownAction.viewMode === 'filled'
                ? DEFAULT_ICON_STYLE
                : Controller._getIconStyle(shownAction);
        return shownAction;
    }

    /**
     * Настройка параметров отображения кнопки, которая показывается в меню.
     * ItemAction с этими опциями передаётся в меню без дальнейших изменений.
     * @param action
     * @private
     */
    private _prepareMenuAction(action: IItemAction): IItemAction {
        const shownAction: IItemAction = { ...action };
        shownAction.iconStyle = Controller._getIconStyleForStaticBackground(action);
        return shownAction;
    }

    /**
     * Возвращает размер иконок операций над записью по ховеру.
     * В приоритете размер, настроенный индивидуально для кнопки
     * Если он не задан, то берётся текущий размер из опций контроллера или размер по умолчанию.
     * @private
     */
    private _getHoverActionIconSize(action: IItemAction): TItemActionsSize {
        let iconSize = action.iconSize || this._iconSize || DEFAULT_ACTION_SIZE;

        // Конвертируем размеры s и xs иконки, чтобы общий размер filled соответствовал itemActions.
        // m => s; s => xs
        if (action.viewMode === 'filled') {
            iconSize = iconSize === 's' ? 'xs' : 's';
        }
        return iconSize;
    }

    /**
     * Обновляет параметры отображения операций с записью
     * @param actionsObject
     * @private
     */
    private _fixActionsDisplayOptions(actionsObject: IItemActionsObject): IItemActionsObject {
        if (actionsObject.all && actionsObject.all.length) {
            actionsObject.all = actionsObject.all.map((action) => {
                action.tooltip = Controller._getTooltip(action);
                return action;
            });
        }
        if (actionsObject.showed && actionsObject.showed.length) {
            const prepareHoverAction = this._prepareHoverAction.bind(this);
            actionsObject.showed = actionsObject.showed.map(prepareHoverAction);
        }
        return actionsObject;
    }

    /**
     * Получает размеры контейнера, которые будут использованы для измерения области отображения свайпа.
     * Для строк таблиц, когда ширину строки можно измерить только по ширине столбцов,
     * берём за правило, что высота всегда едина для всех колонок строки, а ширину столбцов
     * надо сложить для получения ширины строки.
     * @param itemContainer
     * @param measurableSelector
     */
    static getSwipeContainerSize(
        itemContainer: HTMLElement,
        measurableSelector: string
    ): { width: number; height: number } {
        const result: { width: number; height: number } = {
            width: 0,
            height: 0,
        };
        if (itemContainer.classList.contains(measurableSelector)) {
            result.width = itemContainer.clientWidth;
            result.height = itemContainer.clientHeight;
        } else {
            itemContainer.querySelectorAll(`.${measurableSelector}`).forEach((container) => {
                result.width += container.clientWidth;
                result.height = result.height || container.clientHeight;
            });
        }
        return result;
    }

    /**
     * Если кнопка операции отображается в меню или по свайпу, она рендерится не через шаблон кнопки.
     * Ожидается, что цвет иконки будет контрастным по отношению к стандартному статичному фону свайпа или меню.
     * Т.к. иконка в filled может быть светлая на тёмном фоне, принудительно нужно выставить стандартный цвет.
     * Остальным иконкам задаём стиль согласно их настройкам.
     * @param action
     * @private
     */
    private static _getIconStyleForStaticBackground(action: IItemAction): TIconStyle {
        return action.viewMode === 'filled' ? DEFAULT_ICON_STYLE : Controller._getIconStyle(action);
    }

    /**
     * Стиль цвета иконки на кнопке
     * @param action
     * @private
     */
    private static _getIconStyle(action: IItemAction): TIconStyle {
        const iconStyle = Utils.getStyleFromIcon(
            action.iconStyle,
            action.icon,
            'itemActions/Controller'
        ) as TIconStyle;
        return Utils.getStyle(
            iconStyle,
            DEFAULT_ICON_STYLE,
            'itemActions/Controller'
        ) as TIconStyle;
    }

    /**
     * Стиль цвета кнопки
     * @param action
     * @private
     */
    private static _getButtonStyle(action: IItemAction): TButtonStyle {
        const defaultStyle =
            action.viewMode === 'filled' ? DEFAULT_FUNCTIONAL_BUTTON_STYLE : DEFAULT_BUTTON_STYLE;
        return Utils.getStyle(action.style, defaultStyle, 'itemActions/Controller') as TButtonStyle;
    }

    /**
     * Возвращает contents записи.
     * Если запись - breadcrumbs, то берётся последняя Model из списка contents
     * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
     *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
     * @param item
     */
    private static _getItemContents(item: IItemActionsItem): Model {
        let contents = item?.getContents();
        if (item['[Controls/_baseTree/BreadcrumbsItem]']) {
            contents = contents[(contents as any).length - 1];
        }
        return contents;
    }

    /**
     * Рассчитывает значение для флага hasIcon операции над записью
     * @param action
     * @private
     */
    private static _needShowIcon(action: IItemAction): boolean {
        return !!action.icon && action.displayMode !== TActionDisplayMode.TITLE;
    }

    /**
     * Рассчитывает значение для значения caption операции над записью
     * @param action
     * @private
     */
    private static _needShowTitle(action: IItemAction): boolean {
        return (
            !!action.title &&
            (action.displayMode === TActionDisplayMode.TITLE ||
                action.displayMode === TActionDisplayMode.BOTH ||
                ((action.displayMode === TActionDisplayMode.AUTO || !action.displayMode) &&
                    !action.icon))
        );
    }

    /**
     * Возвращает значение для tooltip операции с записью
     * @param action
     * @private
     */
    private static _getTooltip(action: IItemAction): string | undefined {
        return action.tooltip || action.title;
    }

    /**
     * Устанавливает операции с записью для конкретного элемента коллекции
     * @param item
     * @param actionsObject
     * @param skipShowedChecking
     * @private
     */
    private _setItemActions(
        item: IItemActionsItem,
        actionsObject: IItemActionsObject,
        skipShowedChecking?: boolean
    ): boolean {
        const oldActionsObject = item.getActions();
        if (
            !oldActionsObject ||
            (actionsObject &&
                !Controller._isMatchingActions(oldActionsObject, actionsObject, skipShowedChecking))
        ) {
            return this._updateActionsOnItem(item, actionsObject);
        }
        return false;
    }

    private _updateActionsOnItem(
        item: IItemActionsItem,
        actionsObject: IItemActionsObject
    ): boolean {
        const setItemActionsStateCallback = this._setItemActionsStateCallbacks?.[item.key];
        const curHasVisibleActions = item.hasVisibleActions();
        const newHasVisibleActions =
            actionsObject && actionsObject.showed && actionsObject.showed.length > 0;
        const isOutsideAndMaster =
            this._collection.getStyle() === 'master' && this._itemActionsPosition === 'outside';
        const updateItemVersion =
            !setItemActionsStateCallback ||
            (isOutsideAndMaster && curHasVisibleActions !== newHasVisibleActions);
        item.setActions(actionsObject, !updateItemVersion);
        if (setItemActionsStateCallback) {
            setItemActionsStateCallback(actionsObject.showed);
            // При видимости "всегда" и если операции над записью уже были проинициализированы,
            // обновление происходит до отрисовки шаблонов, поэтому в таких случаях предупреждение не справедливо.
        } else if (this._itemActionsVisibility !== 'visible' && !this.isActionsAssigned()) {
            // В списках на васаби это не улучшить, их нужно на реакт переводить.
            // Но в списках на реакте в теории может такой кейс случиться, нужно о нем предупредить.
            // TODO Когда все списки переведем на реакт, нужно кидать тут ошибку.
            Logger.warn(
                'The whole list will re-render after update of itemActions. It might be improved.'
            );
        }
        return updateItemVersion;
    }

    private static _isMatchingActions(
        oldActionsObject: IItemActionsObject,
        newActionsObject: IItemActionsObject,
        skipShowedChecking: boolean
    ): boolean {
        const isMatchedAll = this._isMatchingActionLists(
            oldActionsObject.all,
            newActionsObject.all
        );
        const isMatchedShowed = this._isMatchingActionLists(
            oldActionsObject.showed,
            newActionsObject.showed
        );
        return skipShowedChecking ? isMatchedAll : isMatchedAll && isMatchedShowed;
    }

    private static _calculateSwipeConfig(
        actions: IItemAction[],
        actionAlignment: string,
        actionsContainerWidth: number,
        actionsContainerHeight: number,
        actionCaptionPosition: TActionCaptionPosition,
        menuButtonVisibility: TMenuButtonVisibility,
        theme: string
    ): ISwipeConfig {
        const measurer = actionAlignment === 'vertical' ? verticalMeasurer : horizontalMeasurer;
        const config: ISwipeConfig = measurer.getSwipeConfig(
            actions,
            actionsContainerWidth,
            actionsContainerHeight,
            actionCaptionPosition,
            menuButtonVisibility,
            theme
        );
        config.needTitle = measurer.needTitle;
        config.needIcon = measurer.needIcon;
        return config;
    }

    private static _needsHorizontalMeasurement(config: ISwipeConfig): boolean {
        const actionsObject = config.itemActions;
        return actionsObject && actionsObject.showed?.length === 1 && actionsObject.all?.length > 1;
    }

    private static _isMatchingActionLists(
        aActions: IItemAction[],
        bActions: IItemAction[]
    ): boolean {
        if (!aActions || !bActions) {
            return false;
        }
        const length = aActions.length;
        if (length !== bActions.length) {
            return false;
        }
        for (let i = 0; i < length; i++) {
            if (
                aActions[i].id !== bActions[i].id ||
                aActions[i].icon !== bActions[i].icon ||
                aActions[i].showType !== bActions[i].showType
            ) {
                return false;
            }
        }
        return true;
    }
}

/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { unstable_batchedUpdates } from 'react-dom';
import { Control } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';
import type { Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import type { CollectionItem } from 'Controls/display';
import { IStickyPopupOptions } from 'Controls/popup';
import { MenuDependencyLoader } from './menuDependency/MenuDependencyLoader';
import { IItemActionsItem } from './interface/IItemActionsItem';
import { IItemActionsCollection } from './interface/IItemActionsCollection';
import { IItemActionsObject, IShownItemAction } from './interface/IItemActionsObject';
import { IContextMenuConfig } from './interface/IContextMenuConfig';
import { loadAsync, loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { getActions } from './measurers/ItemActionMeasurer';
import { TItemActionsVisibility } from './interface/IItemActionsOptions';
import { TApplyButtonStyle } from './interface/IItemActionsTemplateConfig';
import {
    IItemAction,
    TActionCaptionPosition,
    TEditArrowVisibilityCallback,
    TItemActionsPosition,
    TItemActionsSize,
    TItemActionVisibilityCallback,
} from 'Controls/interface';
import { getIcon, isSVGIcon } from 'Controls/Utils/Icon';
import {
    DEFAULT_ACTION_ALIGNMENT,
    DEFAULT_ACTION_CAPTION_POSITION,
    DEFAULT_ACTION_MODE,
    DEFAULT_ACTION_POSITION,
    DEFAULT_ACTION_SIZE,
    DEFAULT_ICON_STYLE,
} from './constants';

import { ActionsMenuUtils } from './renderUtils/ActionsMenuUtils';
import { SwipeUtils } from './renderUtils/SwipeUtils';
import { ActionsMapUtils } from './renderUtils/ActionsMapUtils';
import { ActionsStyleUtils } from './renderUtils/ActionsStyleUtils';

type ISetItemActionsStateCallback = (itemActions: IItemAction[]) => void;
export type IItemActionsTemplateMountedCallback = (
    item: CollectionItem,
    setStateCallback: ISetItemActionsStateCallback
) => void;
export type IItemActionsTemplateUnmountedCallback = (item: CollectionItem) => void;

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
    actionMode?: 'strict' | 'adaptive';

    /**
     * @name Controls/_itemActions/Controller/IControllerOptions#itemActionsVisibility
     * @cfg {Controls/_itemActions/interface/IItemActionsOptions/TItemActionsVisibility.typedef} Отображение опций записи с задержкой или без.
     */
    itemActionsVisibility?: TItemActionsVisibility;

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
    private _actionAlignment: 'horizontal' | 'vertical';

    private _theme: string;

    // Ширина опций записи для рассчётов свайп-конфига после изменения видимости опций записи
    private _actionsWidth: number;

    // Высота опций записи для рассчётов свайп-конфига после изменения видимости опций записи
    private _actionsHeight: number;

    // Текущее позиционирование опций записи
    private _itemActionsPosition: TItemActionsPosition;

    private _activeItemKey: any;

    private _dependencyController: MenuDependencyLoader;

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
        this._prepareMenuAction = this._prepareMenuAction.bind(this);
        this._prepareSwipeAction = this._prepareSwipeAction.bind(this);
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
        this._actionAlignment = options.actionAlignment || DEFAULT_ACTION_ALIGNMENT;
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
        const itemActions = ActionsMapUtils.fixActionsDisplayOptions(actions, this._iconSize);
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
    ): IStickyPopupOptions | undefined {
        if (!item) {
            return;
        }
        const actionsObject = { ...item.getActions() };
        const contents = Controller._getItemContents(item);
        actionsObject.all =
            actionsObject &&
            actionsObject.all &&
            this._filterVisibleActions(actionsObject.all, contents, item.isEditing());
        return ActionsMenuUtils.prepareActionsMenuConfig({
            actionsObject,
            clickEvent,
            parentAction,
            opener,
            isContextMenu,
            contextMenuConfig: this._contextMenuConfig,
            allowConfigWithoutActions: this._hasMenuHeaderOrFooter() && !this._task1183329228,
            isMenuForSwipedItem: item.isSwiped(),
            footerItemData: {
                item: Controller._getItemContents(item),
            },
        });
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
        if (!this._dependencyController) {
            this._dependencyController = new MenuDependencyLoader({
                contextMenuConfig: this._contextMenuConfig,
                theme: this._theme,
            });
            this._dependencyController.start();
        }
    }

    /**
     * Останавливает таймер и фактически загружает все зависимости
     */
    stopMenuDependenciesTimer(): void {
        if (this._dependencyController) {
            this._dependencyController.stop();
        }
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

    // Поиск оригинального действия над записью
    // Необходимо для выполнения действия меню, т.к. меню содержит список клонированных plain-объектов действий
    // А оригинальное действие может быть BaseAction
    findOriginalAction(item: IItemActionsItem, action: IItemAction): IShownItemAction | undefined {
        const actions = item.getActions();
        if (action.id === undefined) {
            return action;
        }
        return actions.all.find((foundAction) => {
            return foundAction.id === action.id;
        });
    }

    private _cloneAction(
        action: IItemAction,
        options?: Partial<IShownItemAction>
    ): IShownItemAction {
        return Object.assign(Object.create(Object.getPrototypeOf(action)), action, options);
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
            const promises = templatesToLoad.map((templatePath) => loadAsync(templatePath));
            this._loadMenuTempPromise = Promise.all(promises).then((loadedDeps) => {
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
        const actionsObject = ActionsMapUtils.fixActionsDisplayOptions(
            this._getActionsObject(item),
            this._iconSize
        );
        return this._setItemActions(item, actionsObject, this._actionMode === 'adaptive');
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
     * Вычисляет конфигурацию, которая используется в качестве scope у itemActionsTemplate
     */
    private _updateActionsTemplateConfig(options: IControllerOptions): void {
        this._collection.setActionsTemplateConfig(
            {
                toolbarVisibility: options.editingToolbarVisible,
                editingStyle: options.editingStyle || undefined,
                itemActionsClass: options.itemActionsClass,
                itemActionsPosition: this._itemActionsPosition,
                actionAlignment: this._actionAlignment,
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

        if (this._editArrowAction && this._editArrowVisibilityCallback(contents)) {
            this._addEditArrow(actions);
        }

        const actionsTemplateConfig = this._collection.getActionsTemplateConfig();
        actionsTemplateConfig.actionAlignment = this._actionAlignment;

        const swipeConfig = SwipeUtils.prepareSwipeConfig({
            itemActions: actions,
            actionAlignment: actionsTemplateConfig.actionAlignment,
            actionsContainerWidth,
            actionsContainerHeight,
            actionCaptionPosition: actionsTemplateConfig.actionCaptionPosition,
            menuButtonVisibility,
            theme: this._theme,
        });

        actionsTemplateConfig.actionAlignment = swipeConfig.actionAlignment;
        this._collection.setActionsTemplateConfig(actionsTemplateConfig, true);
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
            actions.unshift(ActionsMapUtils.prepareHoverAction(this._editArrowAction));
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

        if (
            (all as IItemAction[]).some(
                (action) =>
                    action.executable &&
                    typeof action.actionName === 'string' &&
                    action.actionName.indexOf('/') !== -1
            )
        ) {
            all = this._createActions(all as IItemAction[]) || all;
        }

        // В адаптивном режиме showed определяются после вызова события updateItemActionsOnItem при setHovered
        const showed =
            this._actionMode !== 'adaptive'
                ? this._filterActionsToShowOnHover(all, contents, item.isEditing())
                : [];
        return { all, showed };
    }

    /**
     * TODO создание действий тут - плохая практика. Нужно по-честному выводить экшны через
     *  компонент тулбара, наподобие как делается в SabyPage.
     *  Задача https://online.sbis.ru/opendoc.html?guid=09de9764-520a-4f17-9c47-d429cbfffd07&client=3
     * Создаёт действия, если они переданы в формате действий тулбара.
     * @param actionsOptions
     * @private
     */
    private _createActions(actionsOptions: IItemAction[]): IItemAction[] | undefined {
        if (!isLoaded('Controls/actions')) {
            return;
        }
        const { createAction } = loadSync('Controls/actions');
        return actionsOptions.map((actionOptions) => {
            return actionOptions.executable
                ? createAction(actionOptions.actionName, actionOptions)
                : actionOptions;
        });
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
        return ActionsMapUtils.filterActionsToShowOnHover({
            itemActions,
            menuIconSize: this._menuIconSize,
            forceAddMenuButton: this._hasMenuHeaderOrFooter(),
            itemActionVisibilityCallback: (action: IItemAction) => {
                return this._itemActionVisibilityCallback(action, contents, isEditing);
            },
            feature1183020440: this._feature1183020440,
            task1183329228: this._task1183329228,
        });
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
     * Настройка параметров отображения кнопки, которая показывается в динамическом свайпе
     * при itemActionsPosition === 'inside'.
     * ItemAction с этими опциями передаётся в шаблон без дальнейших изменений.
     * @param action
     * @private
     */
    private _prepareSwipeAction(action: IItemAction): IShownItemAction {
        const shownAction: IShownItemAction = this._cloneAction(action);
        shownAction.isSVGIcon = isSVGIcon(shownAction.icon);
        shownAction.icon = getIcon(shownAction.icon);
        shownAction.iconStyle =
            shownAction.viewMode === 'filled'
                ? DEFAULT_ICON_STYLE
                : ActionsStyleUtils.getIconStyle(shownAction);
        return shownAction;
    }

    /**
     * Настройка параметров отображения кнопки, которая показывается в меню.
     * ItemAction с этими опциями передаётся в меню без дальнейших изменений.
     * @param action
     * @private
     */
    private _prepareMenuAction(action: IItemAction): IItemAction {
        const shownAction: IItemAction = action.getState ? action.getState() : { ...action };
        shownAction.iconStyle = ActionsStyleUtils.getIconStyleForStaticBackground(
            action as unknown as IItemAction
        );
        return shownAction;
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
        const isMatchedAll = this.isMatchingActionLists(oldActionsObject.all, newActionsObject.all);
        const isMatchedShowed = this.isMatchingActionLists(
            oldActionsObject.showed,
            newActionsObject.showed
        );
        return skipShowedChecking ? isMatchedAll : isMatchedAll && isMatchedShowed;
    }

    /**
     * Сравнивает операции над записью по длине массива и полям.
     * @param aActions
     * @param bActions
     */
    static isMatchingActionLists(aActions: IItemAction[], bActions: IItemAction[]): boolean {
        if (aActions === bActions) {
            return true;
        }
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
                aActions[i].showType !== bActions[i].showType ||
                aActions[i]['parent@'] !== bActions[i]['parent@'] ||
                aActions[i].parent !== bActions[i].parent
            ) {
                return false;
            }
        }
        return true;
    }
}

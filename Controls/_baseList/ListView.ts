/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';

import * as ListViewTpl from 'wml!Controls/_baseList/ListView/ListView';
import { default as ForTemplate } from 'Controls/_baseList/Render/ForReact';

import { Control, TemplateFunction } from 'UI/Base';
import type { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { getChangedOptions, SyntheticEvent } from 'UI/Vdom';
import { Logger } from 'UI/Utils';
import { TouchDetect } from 'EnvTouch/EnvTouch';

import { IRoundBorder } from 'Controls/interface';
import { Collection, CollectionItem, Indicator } from 'Controls/display';

import type BaseControl from 'Controls/_baseList/BaseControl';
import type { IBaseControlOptions } from 'Controls/_baseList/BaseControl';

import { helpers } from 'Controls/listsCommonLogic';
import { getKey } from 'Controls/_baseList/resources/utils/helpers';

import 'css!Controls/baseList';
import { HoveredItem } from 'Controls/_baseList/Controllers/HoveredItem';

/**
 * Интерфейс опций контрола списка
 */
export interface IListViewOptions extends IBaseControlOptions {
    listModel: Collection;
    theme: string;
    needShowEmptyTemplate: boolean;
    roundBorder: IRoundBorder;
    contextMenuVisibility: boolean;

    /**
     * Свойство RecordSet, в котором указан стиль тега-уголка для записи
     */
    tagStyleProperty?: string;

    /**
     * Вызывается при клике на тег.
     * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
     * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
     * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
     * @demo Controls-demo/list_new/TagStyle/Index
     */
    onTagClick?: (item: Model, columnIndex: number, event: React.BaseSyntheticEvent) => void;

    /**
     * Вызывается при наведении курсора мыши на тег.
     * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
     * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
     * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
     * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
     * @demo Controls-demo/list_new/TagStyle/Index
     */
    onTagHover?: (item: Model, columnIndex: number, event: React.BaseSyntheticEvent) => void;

    /**
     * Уникальный идентификатор списка. Генерируется единожды в BaseControl.
     */
    uniqueId: string;

    // Может и не быть, есть кейсы когда вьюха используется без BaseControl-а
    itemsContainerReadyCallback?: (itemsContainerGetter: () => HTMLElement) => void;

    bottomPaddingClass: string;
}

export default class ListView extends Control<IListViewOptions> {
    protected _template: TemplateFunction = ListViewTpl;
    protected _children: {
        itemsContainer: HTMLElement;
        topIndicator: HTMLElement;
        bottomIndicator: HTMLElement;
    };

    protected _forTemplate: TemplateFunction | React.ReactElement | string;
    protected _itemTemplate: TemplateFunction | React.ReactElement | string = null;
    protected _groupTemplate: TemplateFunction | string = 'Controls/baseList:GroupTemplate';
    protected _defaultItemTemplate: TemplateFunction | string = 'Controls/baseList:ItemTemplate';

    protected _listModel: Collection;
    protected _hoveredItem: CollectionItem;
    private _hoveredItemController: HoveredItem;

    private _callbackAfterReload: Function[] = null;
    private _callbackOnComponentDidUpdate: Function[] = null;

    private _modelChanged: boolean = false;
    private _pendingRedraw: boolean = false;
    private _waitingComponentDidUpdate: boolean = false;
    private _reloadInProgress: boolean = false;

    private _onCollectionChange: (
        event: SyntheticEvent,
        action: string,
        newItems: CollectionItem[]
    ) => void;
    private _onIndexesChanged: Function;

    constructor(options: IListViewOptions) {
        super(options);

        this._onItemClick = this._onItemClick.bind(this);
        this._onItemMouseDown = this._onItemMouseDown.bind(this);
        this._onItemMouseUp = this._onItemMouseUp.bind(this);
        this._onItemMouseEnter = this._onItemMouseEnter.bind(this);
        this._onItemMouseLeave = this._onItemMouseLeave.bind(this);
        this._onItemMouseMove = this._onItemMouseMove.bind(this);
        this._onItemContextMenu = this._onItemContextMenu.bind(this);
        this._onItemLongTap = this._onItemLongTap.bind(this);
        this._onItemTouchMove = this._onItemTouchMove.bind(this);
        this._onItemTouchStart = this._onItemTouchStart.bind(this);
        this._onItemTouchEnd = this._onItemTouchEnd.bind(this);
        this._onItemSwipe = this._onItemSwipe.bind(this);
        this._onItemWheel = this._onItemWheel.bind(this);

        this._hoveredItemController = new HoveredItem((data) => {
            this._notify('hoveredItemChanged', data);
        });

        this._onCollectionChange = (event, action, newItems) => {
            if (this._destroyed) {
                return;
            }
            if (this._isPendingRedraw(event, action, newItems)) {
                this._pendingRedraw = true;
            }
        };
        this._onIndexesChanged = () => {
            return (this._pendingRedraw = true);
        };
    }

    // region LifeCircleHooks

    protected _beforeMount(newOptions: IListViewOptions): void {
        // TODO Из-за фора на реакте ломается scrollViewer. Проблема в лишних перерисовках, выписаны ошибки на ядро
        //  https://online.sbis.ru/opendoc.html?guid=f7c8a47d-cb15-4106-90ee-7f41a090d53b
        //  https://online.sbis.ru/opendoc.html?guid=35edfa73-54eb-4a5b-8cf1-2ab88b04332d
        this._forTemplate = newOptions._forTemplate || ForTemplate;

        this._checkDeprecated(newOptions);
        if (newOptions.groupTemplate) {
            this._groupTemplate = newOptions.groupTemplate;
        }
        if (newOptions.listModel) {
            this._updateModel(newOptions.listModel);
        }
        this._itemTemplate = this._resolveItemTemplate(newOptions);
    }

    protected _$react_componentDidMount(): void {
        this._options.itemsContainerReadyCallback?.(this.getItemsContainer.bind(this));
        // Есть смысл кидать событие ресайза на маунт.
        // Если это первое построение списка, то данное событие никуда не долетит, т.к. контролы выше еще не построены.
        // Соответственно лишних пересчетов не будет.
        // А если это перерисовка списка, которая вызвала remount вьюхи,
        // то нужно кинуть событие, чтобы размеры в BaseControl пересчитались
        this.onViewResized();
    }

    protected _beforeUpdate(newOptions: IListViewOptions): void {
        this._waitingComponentDidUpdate = true;
        if (newOptions.listModel && this._listModel !== newOptions.listModel) {
            this._modelChanged = true;
            this._updateModel(newOptions.listModel);
        }
        if (this._options.groupTemplate !== newOptions.groupTemplate) {
            this._groupTemplate = newOptions.groupTemplate;
        }
        if (!isEqual(this._options.roundBorder, newOptions.roundBorder)) {
            this._listModel.setRoundBorder(newOptions.roundBorder);
        }
        if (!isEqual(this._options.itemTemplateOptions, newOptions.itemTemplateOptions)) {
            this._listModel.setItemTemplateOptions(newOptions.itemTemplateOptions);
        }
        if (this._options.tagStyleProperty !== newOptions.tagStyleProperty) {
            this._listModel.setTagStyleProperty(newOptions.tagStyleProperty);
        }
        this._itemTemplate = this._resolveItemTemplate(newOptions);

        this._applyNewOptionsAfterReload(this._options, newOptions);
    }

    protected _componentDidUpdate(): void {
        this._waitingComponentDidUpdate = false;
        if (this._callbackOnComponentDidUpdate) {
            this._callbackOnComponentDidUpdate.forEach((callback) => {
                callback();
            });
            this._callbackOnComponentDidUpdate = null;
        }
    }

    protected _$react_componentDidUpdate(): void {
        if (this._pendingRedraw || this._modelChanged) {
            this.onViewResized();
        }

        if (this._pendingRedraw) {
            this._pendingRedraw = false;
        }

        if (this._modelChanged) {
            this._modelChanged = false;
            if (this._listModel) {
                this._options.itemsContainerReadyCallback?.(this.getItemsContainer.bind(this));
            }
        }
    }

    protected _beforeUnmount(): void {
        if (this._listModel && !this._listModel.destroyed) {
            this._listModel.unsubscribe('onCollectionChange', this._onCollectionChange);
            this._listModel.unsubscribe('indexesChanged', this._onIndexesChanged);
        }
    }

    // endregion LifeCircleHooks

    // region Public

    getTopIndicator(): HTMLElement {
        return this._container.querySelector('.controls-BaseControl__loadingIndicator-top');
    }

    getBottomIndicator(): HTMLElement {
        return this._container.querySelector('.controls-BaseControl__loadingIndicator-bottom');
    }

    getItemsContainer(): HTMLElement {
        return this._children.itemsContainer;
    }

    // Сброс к изначальному состоянию без ремаунта, например при reload'е.
    reset(params: { keepScroll?: boolean } = {}): void {
        /* For override  */
    }

    setReloadingState(state: boolean): boolean {
        if (this._reloadInProgress === state) {
            return false;
        }

        this._reloadInProgress = state;
        if (state === false && this._callbackAfterReload) {
            if (this._callbackAfterReload) {
                this._callbackAfterReload.forEach((callback) => {
                    callback();
                });
                this._callbackAfterReload = null;
            }
        }
        return true;
    }

    // endregion Public

    // region EventHandlers

    protected _onItemClick(event: SyntheticEvent<MouseEvent>, item: CollectionItem): void {
        if (helpers.isWithoutBaseControl(this._options)) {
            helpers.events.parseListViewItemClick(
                { event, item, cleanScheme: true },
                {
                    onCheckbox: () => {
                        this._options.onCheckboxClickNew(getKey(item.contents));
                    },
                    onItem: () => {
                        this._options.onItemClickNew(getKey(item.contents));
                    },
                }
            );
        } else {
            helpers.events.parseListViewItemClick(
                { event, item },
                {
                    onCheckbox: () => {
                        this._notify('checkBoxClick', [item, event]);
                    },
                    onGroup: () => {
                        this._notify('groupClick', [item.contents, event, item]);
                    },
                    onItem: () => {
                        this._notify('itemClick', [item.contents, event]);
                    },
                }
            );
        }
    }

    protected _onItemMouseDown(event: SyntheticEvent, item: CollectionItem): void {
        const clickOnCheckbox = event.target.closest('.js-controls-ListView__checkbox');
        if (
            item['[Controls/_display/GroupItem]'] ||
            item['[Controls/_display/SpaceCollectionItem]'] ||
            clickOnCheckbox
        ) {
            return;
        }
        if (item && item.isSwiped()) {
            // TODO: Сейчас на itemMouseDown список переводит фокус на fakeFocusElement
            //  и срабатывает событие listDeactivated. Из-за этого события закрывается свайп,
            //  это неправильно, т.к. из-за этого становится невозможным открытие меню.
            //  Выпилить после решения задачи
            //  https://online.sbis.ru/opendoc.html?guid=38315a8d-2006-4eb8-aeb3-05b9447cd629
            return;
        }

        this._notify('itemMouseDown', [item, event]);
    }

    protected _onItemMouseUp(event: SyntheticEvent, item: CollectionItem): void {
        const clickOnCheckbox = event.target.closest('.js-controls-ListView__checkbox');
        if (
            item['[Controls/_display/GroupItem]'] ||
            item['[Controls/_display/SpaceCollectionItem]'] ||
            clickOnCheckbox
        ) {
            event.stopPropagation();
            return;
        }
        this._notify('itemMouseUp', [item, event]);
    }

    protected _onItemMouseEnter(event: SyntheticEvent, item: CollectionItem): void {
        this._notify('itemMouseEnter', [item, event]);
        this._hoveredItemController.setHoveredItem(item, event);
    }

    protected _onItemMouseLeave(event: SyntheticEvent, item: CollectionItem): void {
        this._notify('itemMouseLeave', [item, event]);
        this._hoveredItemController.setHoveredItem(null);
    }

    protected _onItemMouseMove(event: SyntheticEvent, item: CollectionItem): void {
        this._notify('itemMouseMove', [item, event]);
    }

    protected _onItemContextMenu(event: SyntheticEvent, item: CollectionItem): void {
        if (this._options.contextMenuVisibility !== false && !this._listModel.isEditing()) {
            this._notify('itemContextMenu', [item, event, false]);
        }
    }

    protected _onItemLongTap(event: SyntheticEvent, item: CollectionItem): void {
        if (this._options.contextMenuVisibility !== false && !this._listModel.isEditing()) {
            this._notify('itemLongTap', [item, event]);
        }
    }

    protected _onTouchMove(e: SyntheticEvent<Event>): void {
        // В шаблонах списка для реакта свайп определяется по touchMove.
        // В результате, когда wasaby списки вложены в реактовские обрабатывется только верхний свайп.
        // Тут стопаем touchMove для wasaby, чтобы он не долетал выше списка.
        if (TouchDetect.getInstance().isTouch()) {
            e.stopPropagation();
        }
    }

    /**
     * позволяет в шаблоне элемента стопать и обрабатывать свайп только тогда, когда есть ItemActions
     * @private
     */
    protected _onItemTouchMove(
        event: SyntheticEvent<{ direction: string } & Event>,
        item: CollectionItem
    ): boolean {
        // Надо стопать событие, иначе во вложенных списках
        // при свайпе на внутреннем списке будет срабатывать обработчик на внешнем
        // Но делать это необходимо только если потенциально нужно показывать ItemActions,
        // т.к. некоторым ItemActions не нужны, и тогда они используют DragNDrop
        if (
            !!this._options.itemActions ||
            !!this._options.itemActionsProperty ||
            this._options.showEditArrow
        ) {
            event.stopPropagation();
        }
    }

    protected _onItemTouchStart(event: SyntheticEvent): void {
        this._stopTouchEvent(event);
    }

    protected _onItemTouchEnd(event: SyntheticEvent): void {
        this._stopTouchEvent(event);
    }

    /**
     * Надо стопать событие, иначе во вложенных списках
     * при лонгтапе на внутреннем списке будет срабатывать обработчик на внешнем
     * Но делать это необходимо только если потенциально нужно показывать ContextMenu
     * @param event
     * @private
     */
    private _stopTouchEvent(event: SyntheticEvent): void {
        if (
            (!!this._options.itemActions || !!this._options.itemActionsProperty) &&
            this._options.contextMenuVisibility !== false
        ) {
            event.stopPropagation();
        }
    }

    protected _onItemSwipe(
        event: SyntheticEvent<{ direction: string } & Event>,
        item: CollectionItem
    ): void {
        if (event.nativeEvent.direction === 'left') {
            this.activate();
        }
        this._notify('itemSwipe', [item, event]);
    }

    protected _onItemWheel(event: SyntheticEvent): void {
        /* For override  */
    }

    // endregion EventHandlers

    // TODO эти пробросы можно будет убрать, когда не останется нигде itemActions на wml
    // region wml events map
    protected _onItemActionsMouseEnter(
        ...args: Parameters<BaseControl['_onItemActionsMouseEnter']>
    ): void {
        this._options.onActionsMouseEnter(...args);
    }

    protected _onItemActionMouseDown(
        ...args: Parameters<BaseControl['_onItemActionMouseDown']>
    ): void {
        this._options.onActionMouseDown(...args);
    }

    protected _onItemActionMouseUp(...args: Parameters<BaseControl['_onItemActionMouseUp']>): void {
        this._options.onActionMouseUp(...args);
    }

    protected _onItemActionMouseEnter(
        ...args: Parameters<BaseControl['_onItemActionMouseEnter']>
    ): void {
        this._options.onActionMouseEnter(...args);
    }

    protected _onItemActionMouseLeave(
        ...args: Parameters<BaseControl['_onItemActionMouseLeave']>
    ): void {
        this._options.onActionMouseLeave(...args);
    }

    protected _onItemActionClick(...args: Parameters<BaseControl['_onItemActionClick']>): void {
        this._options.onActionClick(...args);
    }

    protected _onActionsSwipeAnimationEnd(
        ...args: Parameters<BaseControl['_onActionsSwipeAnimationEnd']>
    ): void {
        this._options.onItemActionSwipeAnimationEnd(...args);
    }

    // endregion wml events map

    // region Helpers

    private _doAfterReload(callback: Function): void {
        if (this._reloadInProgress) {
            if (this._callbackAfterReload) {
                this._callbackAfterReload.push(callback);
            } else {
                this._callbackAfterReload = [callback];
            }
        } else {
            callback();
        }
    }

    protected _doOnComponentDidUpdate(callback: Function): void {
        if (this._waitingComponentDidUpdate) {
            if (this._callbackOnComponentDidUpdate) {
                this._callbackOnComponentDidUpdate.push(callback);
            } else {
                this._callbackOnComponentDidUpdate = [callback];
            }
        } else {
            callback();
        }
    }

    /**
     * Метод предназначен для перекрытия в потомках что бы можно было реализовать
     * кастомную проверку и обновление модели
     */
    protected _applyNewOptionsAfterReload(
        oldOptions: IListViewOptions,
        newOptions: IListViewOptions
    ): void {
        const changes = [];
        const changedOptions = getChangedOptions(newOptions, oldOptions);

        if (changedOptions) {
            if (
                changedOptions.hasOwnProperty('stickyFooter') ||
                changedOptions.hasOwnProperty('footerTemplate')
            ) {
                changes.push('footer');
            }
        }

        if (changes.length) {
            this._doAfterReload(() => {
                if (changes.includes('footer')) {
                    this._listModel.setFooter(newOptions);
                }
            });
        }
    }

    private _isPendingRedraw(
        event: SyntheticEvent,
        action: string,
        newItems: CollectionItem[]
    ): boolean {
        const changes = newItems && newItems.properties;
        // Глобальный индикатор не влияет на размеры вьюхи
        const isPendingByIndicator =
            (changes === 'hideIndicator' || changes === 'displayIndicator') &&
            !(newItems[0] as Indicator).isGlobalIndicator();

        return (
            changes !== 'marked' &&
            changes !== 'hovered' &&
            changes !== 'active' &&
            changes !== 'canShowActions' &&
            changes !== 'animated' &&
            changes !== 'swiped' &&
            changes !== 'swipeAnimation' &&
            changes !== 'fixedPosition' &&
            isPendingByIndicator
        );
    }

    protected _setHoveredItem(item: CollectionItem, event: SyntheticEvent<MouseEvent>): void {
        this._hoveredItemController.setHoveredItem(item, event);
    }

    private _checkDeprecated(cfg: Record<string, string>): void {
        if (cfg.markerVisibility === 'always') {
            Logger.warn(
                'IList: Value "always" for property Controls/_list/interface/IList#markerVisibility is deprecated, use value "visible" instead.',
                this
            );
        }
        if (cfg.markerVisibility === 'demand') {
            Logger.warn(
                'IList: Value "demand" for property Controls/_list/interface/IList#markerVisibility is deprecated, use value "onactivated" instead.',
                this
            );
        }
        if (cfg.results) {
            Logger.warn(
                'IList: Option "results" is deprecated and removed in 19.200. Use options "resultsPosition" and "resultsTemplate".',
                this
            );
        }
        if (cfg.groupingKeyCallback) {
            Logger.warn(
                'IList: Option "groupingKeyCallback" is deprecated and removed soon. Use options "groupProperty".',
                this
            );
        }
    }

    // endregion Helpers

    protected onViewResized(): void {
        this._notify('controlResize', [], { bubbling: true });
    }

    protected _getFooterClasses(): string {
        let result = 'controls-ListView__footer';

        // Есть смысл добавлять минимальную высоту футеру только если в коллекции есть данные
        if (this._options.itemActionsPosition === 'outside' && this._listModel.getCount()) {
            result += ' controls-ListView__footer__itemActionsV_outside';
        }

        let leftPadding: string;
        if (
            this._listModel.getMultiSelectVisibility() !== 'hidden' &&
            this._listModel.getMultiSelectPosition() !== 'custom'
        ) {
            leftPadding = 'withCheckboxes';
        } else {
            leftPadding = (
                (this._options.itemPadding && this._options.itemPadding.left) ||
                'default'
            ).toLowerCase();
        }
        result += ` controls-ListView__footer__paddingLeft_${leftPadding}`;

        return result;
    }

    protected _getViewClasses(): string {
        let classes = `controls-ListViewV controls_list_theme-${this._options.theme}`;
        classes += ` controls-ListView_${this._options.style}`;

        if (
            this._options.groupViewMode === 'blocks' ||
            this._options.groupViewMode === 'titledBlocks'
        ) {
            classes +=
                ` controls-ListView__groupViewMode_${this._options.groupViewMode}` +
                ` controls-List__groupViewMode_${this._options.groupViewMode}`;
        }

        return classes;
    }

    private _updateModel(newModel: Collection): void {
        if (this._listModel && !this._listModel.destroyed) {
            this._listModel.unsubscribe('onCollectionChange', this._onCollectionChange);
            this._listModel.unsubscribe('indexesChanged', this._onIndexesChanged);
        }
        this._listModel = newModel;
        this._listModel.subscribe('onCollectionChange', this._onCollectionChange);
        this._listModel.subscribe('indexesChanged', this._onIndexesChanged);
    }

    protected _resolveItemTemplate(options: IListViewOptions): TemplateFunction | string {
        return options.itemTemplate || this._defaultItemTemplate;
    }

    protected _isEmpty(): boolean {
        return this._options.needShowEmptyTemplate;
    }

    static defaultProps: Partial<IListViewOptions> = {
        contextMenuVisibility: true,
    };
}

/*
 * Имя сущности для идентификации списка.
 */
Object.defineProperty(ListView.prototype, 'listInstanceName', {
    value: 'controls-List',
    writable: false,
    groupViewMode: 'default',
});

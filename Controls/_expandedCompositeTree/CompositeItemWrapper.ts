/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { isEqual } from 'Types/object';
import { Model } from 'Types/entity';
import { IObservable } from 'Types/collection';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import * as CompositeItemWrapperTemplate from 'wml!Controls/_expandedCompositeTree/render/CompositeItemWrapper';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IRenderScopeProps } from './interface/IRenderScopeProps';
import { IItemAction } from 'Controls/interface';
import type CompositeCollectionItem from './display/CompositeCollectionItem';
import {
    IAction as IShownItemAction,
    Controller as ItemActionsController,
    IControllerOptions as IItemActionsControllerOptions,
    IItemActionsItem,
} from 'Controls/itemActions';
import { StickyOpener } from 'Controls/popup';

import { RegisterUtil as registerUtil, UnregisterUtil as unregisterUtil } from 'Controls/event';

interface IProps extends IControlOptions {
    renderTemplate: TemplateFunction;
    renderScope: IRenderScopeProps;
    onClickCallback?: Function;
    onActionClick?: Function;
    onActionMouseDown?: Function;
}

const ITEM_SELECTOR = '.controls-ListView__itemV';

/**
 * Контрол - обертка для трансляции событий через слой композитного элемента
 *
 * @public
 */
export default class CompositeItemWrapper extends Control<IProps> {
    protected _template: TemplateFunction = CompositeItemWrapperTemplate;
    protected _itemActionsController: ItemActionsController;
    private _menuOpener: StickyOpener; // HTML элемент, который приходится запоминать
    private _targetItem: HTMLElement;

    constructor(props: IProps) {
        super(props);
        this._menuOpener = new StickyOpener();
        this._onCollectionChanged = this._onCollectionChanged.bind(this);
        this._onItemActionsMouseEnter = this._onItemActionsMouseEnter.bind(this);
        this._onItemActionMouseDown = this._onItemActionMouseDown.bind(this);
        this._onItemActionMouseUp = this._onItemActionMouseUp.bind(this);
        this._onItemActionMouseEnter = this._onItemActionMouseEnter.bind(this);
        this._onItemActionMouseLeave = this._onItemActionMouseLeave.bind(this);
    }

    protected _beforeMount(props: IProps): void {
        props.renderScope.listModel.subscribe('onCollectionChange', this._onCollectionChanged);
        // Контроллер нужен для установки коллбеков в шаблонах записи
        this._getItemActionsController(props);
    }

    protected _beforeUpdate(props: IProps): void {
        const oldProps = this._options.renderScope;
        const newProps = props.renderScope;
        const shouldRecountItemActions =
            oldProps.listModel !== newProps.listModel ||
            oldProps.itemActionsProperty !== newProps.itemActionsProperty ||
            oldProps.itemActionVisibilityCallback !== newProps.itemActionVisibilityCallback ||
            oldProps.itemActionsVisibility !== newProps.itemActionsVisibility ||
            !isEqual(oldProps.itemActions, newProps.itemActions) ||
            !isEqual(oldProps.editingConfig, newProps.editingConfig);
        if (shouldRecountItemActions) {
            this._updateItemActionsProps(props);
            this._recountItemActions();
        }
    }

    protected _getItemActionsTemplateMountedCallback(): Function {
        return this._getItemActionsController()?.getItemActionsTemplateMountedCallback?.();
    }

    protected _getItemActionsTemplateUnmountedCallback(): Function {
        return this._getItemActionsController()?.getItemActionsTemplateMountedCallback?.();
    }

    protected _getViewItemActionsClasses(): string {
        let classes = '';
        if (this._hasItemActionsController()) {
            classes = 'controls-BaseControl_showActions controls-BaseControl_showActions_onhover';
        }
        return classes;
    }

    protected _onItemMouseMove(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        if (
            !TouchDetect.getInstance().isTouch() &&
            this._getItemActionsController() &&
            !this._getItemActionsController().isActionsAssigned()
        ) {
            this._recountItemActions();
        }
        this._notify('itemMouseMove', [item, nativeEvent], { bubbling: true });
    }

    protected _onItemMouseEnter(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        this._notify('itemMouseEnter', [item, nativeEvent], { bubbling: true });
    }

    protected _onItemMouseDown(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        this._notify('itemMouseDown', [item, nativeEvent], { bubbling: true });
    }

    protected _onItemMouseUp(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        this._notify('itemMouseUp', [item, nativeEvent], { bubbling: true });
    }

    protected _onCompositeItemClick(event: SyntheticEvent<MouseEvent>, item: object): void {
        this._options?.onClickCallback(event, item);
    }

    protected _onItemClick(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        this._notify('itemClick', [item, nativeEvent], { bubbling: true });
    }

    //  В ListView itemClick по чекбоксу останавливается и наверх кидается уже checkBoxClick
    protected _onCheckBoxClick(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: MouseEvent
    ): void {
        this._notify('checkBoxClick', [item, nativeEvent], { bubbling: true });
    }

    protected _onItemContextMenu(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (this._getItemActionsController()) {
            this._openItemActionsMenu(null, nativeEvent, item, true);
        }
    }

    protected _onItemLongTap(
        event: SyntheticEvent<MouseEvent>,
        item: object,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (this._getItemActionsController()) {
            this._openItemActionsMenu(null, nativeEvent, item, true);
        }
    }

    protected _onItemSwipe(e: SyntheticEvent<Event>, item: object, swipeEvent): void {
        this._notify('itemSwipe', [item, swipeEvent], { bubbling: true });
    }

    private _hasItemActionsController(): boolean {
        return !!this._itemActionsController;
    }

    protected _onItemActionsMouseEnter(
        event: SyntheticEvent<MouseEvent>,
        item: IItemActionsItem
    ): void {
        // метод вызывается из ItemActionTemplate. В BaseControl используется для фриза.
    }

    protected _onItemActionMouseEnter(event: SyntheticEvent): void {
        this._getItemActionsController().startMenuDependenciesTimer();
    }

    protected _onItemActionMouseLeave(event: SyntheticEvent): void {
        this._getItemActionsController().stopMenuDependenciesTimer();
    }

    protected _onItemActionMouseDown(
        event: SyntheticEvent<MouseEvent>,
        action: IShownItemAction,
        item: IItemActionsItem
    ): Promise<void> | void {
        event.stopPropagation();
        let result;
        if (this._getItemActionsController()) {
            if (action && !action.isMenu && !action['parent@']) {
                result = this.props.onActionMouseDown(event, action, item as IItemActionsItem);
                this._closeItemActionsPopup();
            } else {
                result = this._openItemActionsMenu(action, event, item, false);
            }
        }
        return result;
    }

    protected _onItemActionMouseUp(event: SyntheticEvent<MouseEvent>): void {
        event.stopPropagation();
    }

    private _onCollectionChanged(
        event: SyntheticEvent,
        action: string,
        newItems: CompositeCollectionItem[],
        newItemsIndex: number,
        removedItems: CompositeCollectionItem[],
        removedItemsIndex: number,
        reason: string
    ): void {
        if (this._hasItemActionsController()) {
            switch (action) {
                case IObservable.ACTION_RESET:
                    this._updateItemActionsProps();
                    this._recountItemActions();
                    break;
                case IObservable.ACTION_ADD:
                    this._recountItemActions();
                    break;
                case IObservable.ACTION_REMOVE:
                    this._recountItemActions();
                    break;
                case IObservable.ACTION_MOVE:
                    this._recountItemActions();
                    break;
            }
        }
    }

    private _onScroll(): void {
        this._closeItemActionsPopup();
    }

    /**
     * Инициализирует контроллер itemActions и перенабирает операции над записью
     * @private
     */
    private _recountItemActions(): void {
        this._getItemActionsController()?.updateActions();
    }

    /**
     * Инициализирует контроллер itemActions и обновляет в нём данные
     * @private
     */
    private _updateItemActionsProps(props: IProps = this._options): void {
        const controllerOptions = CompositeItemWrapper._getItemActionsOptions(
            props.renderScope,
            props.theme
        );
        this._getItemActionsController()?.updateOptions(controllerOptions);
    }

    /**
     * Открывает меню операций
     * @param action
     * @param clickEvent
     * @param item
     * @param isContextMenu
     */
    private _openItemActionsMenu(
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        item: IItemActionsItem,
        isContextMenu: boolean
    ): Promise<void> {
        const menuConfig = this._getItemActionsController().prepareActionsMenuConfig(
            item,
            clickEvent,
            action,
            this._options.menuOpener,
            isContextMenu
        );
        if (!menuConfig) {
            return Promise.resolve();
        }

        /*
         * Не во всех раскладках можно получить DOM-элемент, зная только индекс в коллекции, поэтому запоминаем тот,
         * у которого открываем меню. Потом передадим его для события actionClick.
         */
        this._targetItem = (clickEvent.target as HTMLElement).closest(ITEM_SELECTOR);
        clickEvent.nativeEvent.preventDefault();
        clickEvent.nativeEvent.stopImmediatePropagation?.();
        clickEvent.stopImmediatePropagation?.();
        const onResult = this._itemActionsMenuResultHandler.bind(this);
        const onClose = this._itemActionsMenuCloseHandler.bind(this);
        menuConfig.eventHandlers = { onResult, onClose };
        return this._menuOpener.open(menuConfig).then(() => {
            registerUtil(this, 'scroll', this._onScroll.bind(this));
            registerUtil(this, 'customscroll', this._onScroll.bind(this));
            this._getItemActionsController().setActiveItem(item);
        });
    }

    /**
     * Закрывает popup и снимает регистрацию его подписки на событие скролла
     * @private
     */
    private _closeItemActionsPopup(): void {
        if (this._menuOpener.isOpened()) {
            this._menuOpener.close();
            unregisterUtil(this, 'scroll');
            unregisterUtil(this, 'customscroll');
            this._getItemActionsController().setActiveItem(null);
        }
    }

    /**
     * Обработчик закрытия выпадающего/контекстного меню
     * @param e
     * @param clickEvent
     * @private
     */
    private _itemActionsMenuCloseHandler(
        e: SyntheticEvent<MouseEvent>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._closeItemActionsPopup();
    }

    /**
     * Обработчик событий, брошенных через onResult в выпадающем/контекстном меню
     * @param eventName название события, брошенного из Controls/menu:Popup.
     * Варианты значений itemClick, applyClick, selectorDialogOpened, pinClick, menuOpened
     * @param actionModel
     * @param clickEvent
     * @private
     */
    private _itemActionsMenuResultHandler(
        eventName: string,
        actionModel: Model,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (eventName === 'itemClick') {
            const action = actionModel && actionModel.getRawData();
            const item = this._getItemActionsController().getActiveItem();
            if (action && !action['parent@']) {
                clickEvent.target = this._targetItem;
                this.props.onActionMouseDown(clickEvent, action, item as IItemActionsItem);
                this._closeItemActionsPopup();
            }
        }
    }

    private _getItemActionsController(props: IProps = this._options): ItemActionsController {
        const options = props.renderScope;
        if (
            !this._hasItemActionsController() &&
            options &&
            (options.itemActions?.length ||
                options.itemActionsProperty ||
                options.editingConfig?.toolbarVisibility === true)
        ) {
            const controllerOptions = CompositeItemWrapper._getItemActionsOptions(
                options,
                props.theme
            );
            this._itemActionsController = new ItemActionsController(controllerOptions);
        }

        return this._itemActionsController;
    }

    destroy(): void {
        super.destroy();
        this._itemActionsController = null;
        if (this._options.renderScope.listModel) {
            this._options.renderScope.listModel.unsubscribe(
                'onCollectionChange',
                this._onCollectionChanged
            );
        }
    }

    private static _getItemActionsOptions(
        props: IRenderScopeProps,
        theme: string
    ): IItemActionsControllerOptions {
        return {
            itemActions: props.itemActions,
            contextMenuConfig: props.contextMenuConfig,
            itemActionsClass: props.itemActionsClass,
            itemActionsPosition: props.itemActionsPosition,
            itemActionsProperty: props.itemActionsProperty,
            visibilityCallback: props.itemActionVisibilityCallback,
            itemActionsVisibility: 'onhover',
            actionAlignment: 'vertical',
            actionCaptionPosition: 'none',
            iconSize: 'm',
            menuIconSize: 'm',
            collection: props.listModel,
            theme,
            editingToolbarVisible: props.editingConfig?.toolbarVisibility,
            editingStyle: props.editingConfig?.backgroundStyle,
        };
    }
}

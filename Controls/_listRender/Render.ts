/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_listRender/Render/Render');

import defaultItemTemplate = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection } from 'Controls/display';
import { constants } from 'Env/Env';
import { Model } from 'Types/entity';
import 'css!Controls/list';
import 'css!Controls/itemActions';
import 'css!Controls/CommonClasses';

export interface IRenderOptions extends IControlOptions {
    listModel: Collection<unknown>;
    contextMenuEnabled?: boolean;
    contextMenuVisibility?: boolean;
    multiselectVisibility?: string;
    itemTemplate?: TemplateFunction;
    itemsContainerReadyCallback: (itemsContainerGetter: () => HTMLElement) => void;
}

export interface IRenderChildren {
    itemsContainer?: HTMLDivElement;
}

export interface ISwipeEvent extends Event {
    direction: 'left' | 'right' | 'top' | 'bottom';
}

export default class Render extends Control<IRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _children: IRenderChildren;

    protected _templateKeyPrefix: string;

    protected _pendingResize: boolean = false;

    private _mouseEnterHandled: boolean = false;

    protected _onCollectionChange(_e: unknown, action: string): void {
        if (action !== 'ch') {
            // Notify resize when items are added, removed or replaced, or
            // when the recordset is reset
            this._pendingResize = true;
        }
    }

    protected _beforeMount(options: IRenderOptions): void {
        this._templateKeyPrefix = 'list-render';
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._subscribeToModelChanges(options.listModel);
    }

    protected _beforeUpdate(newOptions: IRenderOptions): void {
        if (newOptions.listModel !== this._options.listModel) {
            this._subscribeToModelChanges(newOptions.listModel);
        }
    }

    protected _afterRender(): void {
        if (this._pendingResize) {
            this._notify('controlResize', [], { bubbling: true });
            this._pendingResize = false;
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromModelChanges(this._options.listModel);
    }

    protected _afterMount(): void {
        this._options.itemsContainerReadyCallback?.(this.getItemsContainer.bind(this));
    }

    getItemsContainer(): HTMLDivElement {
        return this._children.itemsContainer;
    }

    protected _onItemClick(e: SyntheticEvent<MouseEvent>, item: CollectionItem): void {
        if (item['[Controls/_display/GroupItem]']) {
            if (e.target?.closest('.controls-ListView__groupExpander')) {
                item.toggleExpanded();
            }
        } else {
            if (!item.isEditing()) {
                this._notify('itemClick', [item.getContents(), e]);
            }
        }
    }

    protected _onItemContextMenu(
        e: SyntheticEvent<MouseEvent>,
        item: CollectionItem<unknown>
    ): void {
        if (item['[Controls/_display/GroupItem]']) {
            return;
        }
        if (
            this._options.contextMenuEnabled !== false &&
            this._options.contextMenuVisibility !== false
        ) {
            this._notify('itemContextMenu', [item, e, false]);
            e.stopPropagation();
        }
    }

    protected _onItemLongTap(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        this._onItemContextMenu(e, item);
    }

    protected _onItemSwipe(e: SyntheticEvent<ISwipeEvent>, item: CollectionItem<unknown>): void {
        if (item['[Controls/_display/GroupItem]']) {
            return;
        }

        e.stopPropagation();

        const itemContainer = (e.target as HTMLElement).closest('.controls-ListView__itemV');

        const swipeContainer = itemContainer.classList.contains(
            'js-controls-ListView__measurableContainer'
        )
            ? itemContainer
            : itemContainer.querySelector('.js-controls-ListView__measurableContainer');

        this._notify('itemSwipe', [
            item,
            e,
            swipeContainer?.clientWidth,
            swipeContainer?.clientHeight,
        ]);
    }

    protected _onActionsSwipeAnimationEnd(e: SyntheticEvent<null>): void {
        if (e.nativeEvent.animationName === 'itemActionsSwipeClose') {
            e.stopPropagation();
            this._notify('closeSwipe', [e]);
        }
    }

    protected _onItemActionMouseDown(
        e: SyntheticEvent<MouseEvent>,
        action: unknown,
        item: CollectionItem<unknown>
    ): void {
        e.stopPropagation();
        this._notify('itemActionMouseDown', [item, action, e]);
    }

    protected _onItemActionsMouseEnter(
        e: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>
    ): void {
        e.stopPropagation();
    }

    protected _onItemActionMouseUp(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    protected _onItemActionClick(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    _onItemActionMouseEnter(event: SyntheticEvent): void {
        this._notify('menuActionMouseEnter');
    }

    _onItemActionMouseLeave(event: SyntheticEvent): void {
        this._notify('menuActionMouseLeave');
    }

    protected _onItemMouseEnter(
        e: SyntheticEvent<MouseEvent>,
        item: CollectionItem<unknown>
    ): void {
        this._mouseEnterHandled = true;
        this._notify('itemMouseEnter', [item, e]);
    }

    protected _onItemMouseOver(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        if (!this._mouseEnterHandled) {
            e.target = e.currentTarget;
            this._onItemMouseEnter(e, item);
        }
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        if (item['[Controls/_display/GroupItem]']) {
            return;
        }
        this._notify('itemMouseMove', [item, e]);
    }

    protected _onItemMouseLeave(
        e: SyntheticEvent<MouseEvent>,
        item: CollectionItem<unknown>
    ): void {
        this._mouseEnterHandled = false;
        this._notify('itemMouseLeave', [item, e]);
    }

    protected _onItemMouseDown(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        this._notify('itemMouseDown', [item, e]);
    }

    protected _onItemWheel(e: SyntheticEvent<WheelEvent>, item: CollectionItem<unknown>): void {
        // Empty handler
    }

    protected _onItemKeyDown(
        e: SyntheticEvent<KeyboardEvent>,
        item: CollectionItem<unknown>
    ): void {
        if (item['[Controls/_display/GroupItem]']) {
            return;
        }
        if (item.isEditing()) {
            // TODO Will probably be moved to EditInPlace container
            // keydown event should not bubble if processed here, but if we stop propagation
            // the rich text editor and tab focus movement would break because they listen
            // to the keydown event on the bubbling phase
            // https://online.sbis.ru/opendoc.html?guid=cefa8cd9-6a81-47cf-b642-068f9b3898b7
            //
            // Escape should not bubble above the edit in place row, because it is only
            // used to cancel the edit mode. If the keydown event bubbles, some parent
            // control might handle the event when it is not needed (e.g. if edit in
            // place is inside of a popup, the popup will be closed).
            if (
                e.nativeEvent.keyCode === constants.key.esc ||
                (!e.target.closest('.ws-dont-stop-native-event') &&
                    e.nativeEvent.keyCode !== constants.key.tab)
            ) {
                e.stopPropagation();
            }
            // Compatibility with BaseControl and EditInPlace control
            this._notify('editingRowKeyDown', [e.nativeEvent], {
                bubbling: true,
            });
        } else {
            this._notify('itemKeyDown', [item, e]);
        }
    }

    protected _canHaveMultiselect(options: IRenderOptions): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }

    protected _subscribeToModelChanges(model: Collection<unknown>): void {
        this._unsubscribeFromModelChanges(this._options.listModel);
        if (model && !model.destroyed) {
            model.subscribe('onCollectionChange', this._onCollectionChange);
        }
    }

    protected _unsubscribeFromModelChanges(model: Collection<unknown>): void {
        if (model && !model.destroyed) {
            this._options.listModel.unsubscribe('onCollectionChange', this._onCollectionChange);
        }
    }

    static getDefaultOptions(): Partial<IRenderOptions> {
        return {
            itemTemplate: defaultItemTemplate,
        };
    }
}

/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { Control, TemplateFunction } from 'UI/Base';
import { IMenuBaseOptions, TKey } from 'Controls/_menu/interface/IMenuBase';
import { isHistorySeparatorVisible } from 'Controls/_menu/Render/getClassList';
import { TreeItem } from 'Controls/baseTree';
import * as itemTemplate from 'wml!Controls/_menu/Render/itemTemplate';
import ViewTemplate = require('wml!Controls/_menu/Render/Render');
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IBaseControlOptions } from 'Controls/list';
import { View as Explorer } from 'Controls/explorer';
import 'css!Controls/menu';
import 'css!Controls/CommonClasses';

interface IMenuRenderOptions extends IMenuBaseOptions, IBaseControlOptions {}

/**
 * Контрол меню рендер.
 * @class Controls/menu:Render
 * @extends UICore/Base:Control
 * @private
 *
 */

class MenuRender extends Control<IMenuRenderOptions> {
    protected _template: TemplateFunction = ViewTemplate;
    protected _expandedItems: string[];
    protected _children: {
        list: Explorer;
    };

    protected _beforeMount(options: IMenuRenderOptions): void {
        this._expandedItems = options.expandedItems;
    }

    scrollToItem(key: TKey): void {
        this._children.list.scrollToItem(key);
    }

    toggleExpanded(key: TKey): void {
        this._children.list.toggleExpanded(key);
    }

    protected _emptyItemMouseEnter(e: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        this._itemMouseEnter(e, item, e);
    }

    protected _emptyItemMouseMove(e: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        this._itemMouseMove(e, item, e);
    }

    protected _selectedKeysChanged(e, event, keys, added, deleted): void {
        this._notify(event, [keys, added, deleted]);
    }

    protected _beforeSelectionChanged(e, selectionDiff): unknown {
        return this._notify('beforeSelectionChanged', [selectionDiff]);
    }

    protected _checkBoxClick(): unknown {
        return this._notify('checkBoxClick', []);
    }

    protected _markedKeyChanged(e, markedKey) {
        this._notify('markedKeyChanged', [markedKey]);
    }

    protected _rootChanged(event, root) {
        this._notify('rootChanged', [root]);
    }

    protected _itemMouseEnter(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (!this._isListRender()) {
            e.stopPropagation();
            this._notify('itemMouseEnter', [item, sourceEvent || e]);
        }
    }

    protected _itemMouseMove(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (!this._isListRender()) {
            e.stopPropagation();
            this._notify('itemMouseMove', [item, sourceEvent || e]);
        }
    }

    protected _itemMouseLeave(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._notify('itemMouseLeave', [item, sourceEvent || e]);
    }

    private _listResized(event): void {
        event.stopPropagation();
    }

    private _isListRender() {
        return (
            (this._options.hierarchyViewMode === 'tree' && this._options.subMenuLevel) ||
            this._options.useListRender ||
            this._options.menuMode === 'selector'
        );
    }

    protected _separatorMouseEnter(event: SyntheticEvent<MouseEvent>): void {
        this._notify('separatorMouseEnter', [event]);
    }

    protected _itemClick(
        e: SyntheticEvent<MouseEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();
        if (item instanceof Model) {
            return this._notify('itemClick', [item, sourceEvent || e]);
        }
    }

    protected _expandedItemsChanged(e: SyntheticEvent<MouseEvent>, expandedKeys: TKey[]): void {
        this._notify('expandedItemsChanged', [expandedKeys, e]);
    }

    protected _isHistorySeparatorVisible(treeItem: TreeItem<Model>): boolean {
        return isHistorySeparatorVisible(treeItem, this._options);
    }

    static defaultProps: Partial<IBaseControlOptions> = {
        itemTemplate,
        virtualScrollConfig: {
            pageSize: 70,
        },
    };
}

export default MenuRender;

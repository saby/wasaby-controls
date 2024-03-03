/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TreeView } from 'Controls/tree';
import { MODULE_NAME as CompositeCollectionItemModuleName } from './display/CompositeCollectionItem';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';

const IS_COMPOSITE_ITEM = `[${CompositeCollectionItemModuleName}]`;
const SELECTOR_MORE_BUTTON = '.controls-ExpandedCompositeTree-footer_moreButton';

/**
 * Контрол-view "Развернутое составное дерево" для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 *
 * @public
 */
export default class ExpandedCompositeTreeView extends TreeView {
    _beforeUpdate(newOptions: any) {
        if (!isEqual(this._options.compositeViewConfig, newOptions.compositeViewConfig)) {
            newOptions.listModel.setCompositeViewConfig(newOptions.compositeViewConfig);
        }
    }

    protected _onItemMouseEnter(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
        } else {
            super._onItemMouseEnter(event, item);
        }
    }

    protected _onItemMouseDown(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
        } else {
            super._onItemMouseDown(event, item);
        }
    }

    protected _onItemMouseUp(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
        } else {
            super._onItemMouseUp(event, item);
        }
    }

    protected _onItemClick(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (event.target.closest(SELECTOR_MORE_BUTTON)) {
            const rootKey = item.getParent().key;
            this._notify('expandedCompositeMoreButtonClick', [rootKey, event], {
                bubbling: true,
            });
            event.stopPropagation();
            return;
        }

        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
            return;
        }

        super._onItemClick(event, item);
    }

    protected _onItemContextMenu(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
        } else {
            super._onItemClick(event, item);
        }
    }

    protected _getViewClasses(): string {
        let classes = super._getViewClasses();
        classes += ' controls-ExpandedCompositeView';
        return classes;
    }
}

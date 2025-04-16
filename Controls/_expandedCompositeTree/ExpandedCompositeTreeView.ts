/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { TreeView } from 'Controls/tree';
import { MODULE_NAME as CompositeCollectionItemModuleName } from './display/CompositeCollectionItem';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'UI/Events';
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';

const IS_COMPOSITE_ITEM = `[${CompositeCollectionItemModuleName}]`;
const SELECTOR_MORE_BUTTON = '.controls-ExpandedCompositeTree-footer_moreButton';

/**
 * Контрол-view "Развернутое составное дерево". Позволяет отображать иерархию в развернутом виде и устанавливать различнве режимы отображения элементов на каждом уровне вложенности.
 * @public
 */
export default class ExpandedCompositeTreeView extends TreeView {
    _beforeUpdate(newOptions: any) {
        if (!isEqual(this._options.compositeViewConfig, newOptions.compositeViewConfig)) {
            newOptions.listModel.setCompositeViewConfig(newOptions.compositeViewConfig);
        }
        if (
            !isEqual(
                this._options.compositeViewConfigCallback,
                newOptions.compositeViewConfigCallback
            )
        ) {
            newOptions.listModel.setCompositeViewConfigCallback(
                newOptions.compositeViewConfigCallback
            );
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

        const isClickableByProps =
            this._options.itemTemplateOptions?.contentTemplateProps?.clickable;
        const isClickable = ExpandedCompositeTreeView.isClickable(event, isClickableByProps);

        if (isClickable) {
            const rootKey = item.key;
            this._notify('rootChanged', [rootKey, event], {
                bubbling: true,
            });
            event.stopPropagation();
        } else if (!isClickableByProps) {
            // НАДО стопать весь КЛИК, а не только предотвращать смену рута
            event.stopPropagation();
        }

        super._onItemClick(event, item);
    }

    protected _onItemContextMenu(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        if (item[IS_COMPOSITE_ITEM]) {
            event.stopPropagation();
        } else {
            super._onItemContextMenu(event, item);
        }
    }

    protected _getViewClasses(): string {
        let classes = super._getViewClasses();
        classes += ' controls-ExpandedCompositeView';
        return classes;
    }

    static isClickable(
        clickEvent: SyntheticEvent<MouseEvent> & { isPropagationStopped?(): boolean },
        isClickableByProps: boolean = true
    ): boolean {
        const isStopped = clickEvent?.isStopped?.() || clickEvent?.isPropagationStopped?.();
        if (isStopped || !isClickableByProps) {
            return false;
        }
        const eventTarget = clickEvent.target as HTMLDivElement;
        // Клик по строке с заголовком узла
        const isClickOnItem = !!eventTarget?.closest(
            '.js-controls-expandedCompositeTree-composite-item'
        );
        // Клик по тексту в строке с заголовком узла
        const isClickOnTitle = !!eventTarget?.closest(
            '.js-controls-expandedCompositeTree-composite-item-title'
        );
        // В компоненте Controls/_expandedCompositeTree/render/CompositeItem.tsx клик должен срабатывать только при
        // клике на текст, также он может быть не кликабельным в зависимости от опций.
        return isClickOnItem && isClickOnTitle;
    }
}

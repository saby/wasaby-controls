/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { TemplateFunction } from 'UI/Base';

import { View as BaseTreeView } from 'Controls/tree';
import ExpandedCompositeTreeView from './ExpandedCompositeTreeView';
import ExpandedCompositeTreeControl from './ExpandedCompositeTreeControl';
import NodeItemTemplate from './render/NodeItemTemplate';

import 'css!Controls/expandedCompositeTree';
import { IExpandedCompositeTree } from 'Controls/_expandedCompositeTree/interface/IExpandedCompositeTree';

/**
 * Контрол "Развернутое составное дерево" для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 * @implements Controls/expandedCompositeTree:IExpandedCompositeTree
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility expandedItems hasChildrenProperty selectionType displayProperty groupHistoryId propStorageId parentProperty nodeProperty nodeHistoryType nodeHistoryId root nodeTypeProperty selectionCountMode markedKey, actionAlignment, actionCaptionPosition, activeElement, attachLoadTopTriggerToNull, bottomPaddingMode, collapsedGroups, collapsedItems, continueSearchTemplate, dataLoadErrback, expandByItemClick, expanderIcon, expanderIconStyle, expanderPosition, expanderSize, expanderVisibility, fadedKeys, groupProperty, groupTemplate, groupViewMode, hiddenGroupPosition, itemsReadyCallback, itemsSpacing, itemsSpacingVisibility, itemTemplateProperty, iterativeLoadingTemplate, iterativeLoadPageSize, iterativeLoadTimeout, keepScrollAfterReload, loadingIndicatorTemplate, markItemByExpanderClick, moreButtonTemplate, moreFontColorStyle, moveMarkerOnScrollPaging, nodeFooterTemplate, nodeFooterVisibilityCallback, nodeHeaderTemplate, nodeLoadCallback, nodeMoreCaption, pagingContentTemplate, pagingLeftTemplate, pagingRightTemplate, pixelRatioBugFix, placeholderAfterContent, roundBorder, rowSeparatorSize, rowSeparatorVisibility, singleExpand, stickyFooter, stickyGroup, stickyHeader, stickyMarkedItem, stickyResults, subPixelArtifactFix, tagStyleProperty, urlProperty, freezeHoveredItem, unfreezeHoveredItems, activeElementChanged, afterItemCollapse, afterItemExpand, beforeItemCollapse, beforeItemExpand, collapsedItemsChanged, cutClick, groupCollapsed, groupExpanded, pagingArrowClick
 * @demo Controls-demo/CompositeItem/Base/Index
 * @see https://n.sbis.ru/article/8f551b84-055e-480a-8cbf-e2495a31e964 Контракт с Бизнес-логикой
 * @public
 */
export class View extends BaseTreeView<ExpandedCompositeTreeControl, IExpandedCompositeTree> {
    protected _viewName: TemplateFunction = ExpandedCompositeTreeView;
    protected _viewTemplate: TemplateFunction = ExpandedCompositeTreeControl;

    protected _getModelConstructor(): string {
        return 'Controls/expandedCompositeTree:Collection';
    }

    static getDefaultOptions(): object {
        return {
            compositeNodesLevel: 3,
            loadNodeOnScroll: false,
            itemTemplate: NodeItemTemplate,
        };
    }
}

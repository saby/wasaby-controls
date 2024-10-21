/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IViewOptions } from '../interface/IViewOptions';

type TViewOptions = keyof IViewOptions;

const VIEW_PROPS: TViewOptions[] = [
    'source',
    'filter',
    'sorting',
    'navigation',
    'selectFields',
    'markerVisibility',
    'markedKey',
    'multiSelectVisibility',
    'selectedKeys',
    'excludedKeys',
    'selectionType',
    'selectionCountMode',
    'displayProperty',
    'parentProperty',
    'nodeProperty',
    'nodeTypeProperty',
    'root',
    'hasChildrenProperty',
    'expandedItems',
    'collapsedItems',
    'nodeHistoryId',
    'nodeHistoryType',
    'groupHistoryId',
    'backButtonCaption',
    'breadCrumbsItems',
    'searchStartingWith',
    'searchValue',
    'viewMode',
    'sourceController',
    'loading',
    'deepReload',
    'singleExpand',
    'itemsOrder',
];

export default VIEW_PROPS;

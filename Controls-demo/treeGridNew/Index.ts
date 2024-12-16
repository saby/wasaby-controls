import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/treeGrid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import BackgroundHoverStyle from 'Controls-demo/treeGridNew/BackgroundHoverStyle/Index';
import Base from 'Controls-demo/treeGridNew/Base/Index';
import CellPadding from 'Controls-demo/treeGridNew/CellPadding/Index';
import CollapsedItems from 'Controls-demo/treeGridNew/CollapsedItems/Index';
import ChildrenLoadMode from 'Controls-demo/treeGridNew/ChildrenLoadMode/Index';
import DeepTree from 'Controls-demo/treeGridNew/DeepTree/Index';
import ColumnScroll from 'Controls-demo/treeGridNew/ColumnScroll/Index';
import DeepInside from 'Controls-demo/treeGridNew/DeepInside/Index';
import DragNDrop from 'Controls-demo/treeGridNew/DragNDrop/Index';
import DragNDropLeafsWithParents from 'Controls-demo/treeGridNew/DragNDropLeafsWithParents/Index';
import EditArrow from 'Controls-demo/treeGridNew/EditArrow/Index';
import EditInPlace from 'Controls-demo/treeGridNew/EditInPlace/Index';
import ExpandedItems from 'Controls-demo/treeGridNew/ExpandedItems/Index';
import Expander from 'Controls-demo/treeGridNew/Expander/Index';
import FrozenTree from 'Controls-demo/treeGridNew/FrozenTree/Index';
import Grouping from 'Controls-demo/treeGridNew/Grouping/Index';
import Header from 'Controls-demo/treeGridNew/Header/Index';
import ItemActions from 'Controls-demo/treeGridNew/ItemActions/Index';
import ItemClickItemActivate from 'Controls-demo/treeGridNew/ItemClick/ItemActivate/Index';
import ItemPadding from 'Controls-demo/treeGridNew/ItemPadding/Index';
import ItemsSpacingBase from 'Controls-demo/treeGridNew/ItemsSpacing/Base/Index';
import ItemTemplate from 'Controls-demo/treeGridNew/ItemTemplate/Index';
import LoadMore from 'Controls-demo/treeGridNew/LoadMore/Index';
import LoadMoreReverseLoad from 'Controls-demo/treeGridNew/LoadMore/ReverseLoad/Index';
import MarkerPosition from 'Controls-demo/treeGridNew/MarkerPosition/Index';
import MarkerVisibility from 'Controls-demo/treeGridNew/MarkerVisibility/Index';
import MoreButton from 'Controls-demo/treeGridNew/MoreButton/Index';
import MoveController from 'Controls-demo/treeGridNew/MoveController/Index';
import Mover from 'Controls-demo/treeGridNew/Mover/Index';
import MultiSelect from 'Controls-demo/treeGridNew/MultiSelect/Index';
import NodeFooter from 'Controls-demo/treeGridNew/NodeFooter/Index';
import NodeHistoryId from 'Controls-demo/treeGridNew/NodeHistoryId/Index';
import NodeTypeProperty from 'Controls-demo/treeGridNew/NodeTypeProperty/Index';
import Offsets from 'Controls-demo/treeGridNew/Offsets/Index';
import OnBeforeItemCollapse from 'Controls-demo/treeGridNew/OnBeforeItemCollapse/Index';
import OnBeforeItemExpand from 'Controls-demo/treeGridNew/OnBeforeItemExpand/Index';
import OnCollapsedItemsChanged from 'Controls-demo/treeGridNew/OnCollapsedItemsChanged/Index';
import OnExpandedItemsChanged from 'Controls-demo/treeGridNew/OnExpandedItemsChanged/Index';
import ReloadItem from 'Controls-demo/treeGridNew/ReloadItem/Index';
import ResultsFromMeta from 'Controls-demo/treeGridNew/ResultsFromMeta/Index';
import ReverseType from 'Controls-demo/treeGridNew/ReverseType/Index';
import RowSeparator from 'Controls-demo/treeGridNew/RowSeparator/Index';
import StickyCallback from 'Controls-demo/treeGridNew/StickyCallback/Index';
import TagStyle from 'Controls-demo/treeGridNew/TagStyle/Index';
import VirtualScroll from 'Controls-demo/treeGridNew/VirtualScroll/Index';
import _testsBreakNodeLoading from 'Controls-demo/treeGridNew/_tests/BreakNodeLoading/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...BackgroundHoverStyle.getLoadConfig(),
            ...Base.getLoadConfig(),
            ...CellPadding.getLoadConfig(),
            ...CollapsedItems.getLoadConfig(),
            ...ChildrenLoadMode.getLoadConfig(),
            ...DeepTree.getLoadConfig(),
            ...ColumnScroll.getLoadConfig(),
            ...DeepInside.getLoadConfig(),
            // ...DragNDrop.getLoadConfig(),
            ...DragNDropLeafsWithParents.getLoadConfig(),
            ...EditArrow.getLoadConfig(),
            ...EditInPlace.getLoadConfig(),
            ...ExpandedItems.getLoadConfig(),
            ...Expander.getLoadConfig(),
            ...FrozenTree.getLoadConfig(),
            ...Grouping.getLoadConfig(),
            ...Header.getLoadConfig(),
            ...ItemActions.getLoadConfig(),
            ...ItemClickItemActivate.getLoadConfig(),
            ...ItemPadding.getLoadConfig(),
            ...ItemsSpacingBase.getLoadConfig(),
            ...ItemTemplate.getLoadConfig(),
            ...LoadMore.getLoadConfig(),
            ...MarkerPosition.getLoadConfig(),
            ...LoadMoreReverseLoad.getLoadConfig(),
            ...MarkerVisibility.getLoadConfig(),
            ...MoreButton.getLoadConfig(),
            ...MoveController.getLoadConfig(),
            ...Mover.getLoadConfig(),
            ...MultiSelect.getLoadConfig(),
            ...NodeFooter.getLoadConfig(),
            ...NodeHistoryId.getLoadConfig(),
            ...NodeTypeProperty.getLoadConfig(),
            ...Offsets.getLoadConfig(),
            ...OnBeforeItemCollapse.getLoadConfig(),
            ...OnBeforeItemExpand.getLoadConfig(),
            ...OnCollapsedItemsChanged.getLoadConfig(),
            ...OnExpandedItemsChanged.getLoadConfig(),
            ...ReloadItem.getLoadConfig(),
            ...ResultsFromMeta.getLoadConfig(),
            ...ReverseType.getLoadConfig(),
            ...RowSeparator.getLoadConfig(),
            ...StickyCallback.getLoadConfig(),
            ...TagStyle.getLoadConfig(),
            ...VirtualScroll.getLoadConfig(),
            ..._testsBreakNodeLoading.getLoadConfig(),
        };
    }
}

import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/NewVirtualScroll';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ConstantHeights from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/Index';
import DifferentHeights from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/Index';
import VirtualScrollItemHeightProperty from 'Controls-demo/list_new/VirtualScroll/ItemHeightProperty/Index';
import VirtualScrollEditing from 'Controls-demo/list_new/VirtualScroll/Editing/Index';
import VirtualScrollPagingEdge from 'Controls-demo/list_new/VirtualScroll/Paging/Edge/Index';
import VirtualScrollPagingEnd from 'Controls-demo/list_new/VirtualScroll/Paging/End/Index';
import VirtualScrollReloadByCursor from 'Controls-demo/list_new/VirtualScroll/Reload/ByCursor/Index';
import VirtualScrollReloadChangeSource from 'Controls-demo/list_new/VirtualScroll/Reload/ChangeSource/Index';
import VirtualScrollReloadPartOfInterface from 'Controls-demo/list_new/VirtualScroll/Reload/PartOfInterface/Index';
import VirtualScrollResizeElement from 'Controls-demo/list_new/VirtualScroll/Resize/Element/Index';
import VirtualScrollResizeList from 'Controls-demo/list_new/VirtualScroll/Resize/List/Index';
import VirtualScrollScenariosScrollToItemAfterMount from 'Controls-demo/list_new/VirtualScroll/Scenarios/ScrollToItemAfterMount/Index';
import VirtualScrollScrollPartOfInterface from 'Controls-demo/list_new/VirtualScroll/Scroll/PartOfInterface/Index';
import VirtualScrollTree from 'Controls-demo/list_new/VirtualScroll/Tree/Index';
import VirtualScrollTriggerOffset from 'Controls-demo/list_new/VirtualScroll/TriggerOffset/Index';
import VirtualScrollVirtualScrollContainerDown from 'Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Down/Index';
import VirtualScrollVirtualScrollContainerBoth from 'Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Both/Index';
import VirtualScrollVirtualScrollContainer from 'Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Index';
import VirtualScrollVirtualScrollEventsNotifyKeyOnRender from 'Controls-demo/list_new/VirtualScroll/VirtualScrollEvents/NotifyKeyOnRender/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ConstantHeights.getLoadConfig(),
            ...DifferentHeights.getLoadConfig(),
            ...VirtualScrollItemHeightProperty.getLoadConfig(),
            ...VirtualScrollEditing.getLoadConfig(),
            ...VirtualScrollPagingEdge.getLoadConfig(),
            ...VirtualScrollPagingEnd.getLoadConfig(),
            ...VirtualScrollReloadByCursor.getLoadConfig(),
            ...VirtualScrollReloadChangeSource.getLoadConfig(),
            ...VirtualScrollReloadPartOfInterface.getLoadConfig(),
            ...VirtualScrollResizeElement.getLoadConfig(),
            ...VirtualScrollResizeList.getLoadConfig(),
            ...VirtualScrollScenariosScrollToItemAfterMount.getLoadConfig(),
            ...VirtualScrollScrollPartOfInterface.getLoadConfig(),
            ...VirtualScrollTree.getLoadConfig(),
            ...VirtualScrollTriggerOffset.getLoadConfig(),
            ...VirtualScrollVirtualScrollContainerDown.getLoadConfig(),
            ...VirtualScrollVirtualScrollContainerBoth.getLoadConfig(),
            ...VirtualScrollVirtualScrollContainer.getLoadConfig(),
            ...VirtualScrollVirtualScrollEventsNotifyKeyOnRender.getLoadConfig(),
        };
    }
}

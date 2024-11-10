import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Base from 'Controls-demo/list_new/Base/Index';
import ChangeSourceFromNull from 'Controls-demo/list_new/ChangeSourceFromNull/Index';
import ChangeSource from 'Controls-demo/list_new/ChangeSource/Index';
import ColumnsView from 'Controls-demo/list_new/ColumnsView/Index';
import ComplexScroll from 'Controls-demo/list_new/ComplexScroll/Index';
import Decorators from 'Controls-demo/list_new/Decorators/Index';
import DisplayProperty from 'Controls-demo/list_new/DisplayProperty/Index';
import DragNDrop from 'Controls-demo/list_new/DragNDrop/Index';
import EditInPlace from 'Controls-demo/list_new/EditInPlace/Index';
import ColumnsViewVirtualScroll2 from 'Controls-demo/list_new/ColumnsView/VirtualScroll2/Index';
import EmptyList from 'Controls-demo/list_new/EmptyList/Index';
import FadedKeys from 'Controls-demo/list_new/FadedKeys/Index';
import Filtering from 'Controls-demo/list_new/Filtering/Index';
import FooterTemplate from 'Controls-demo/list_new/FooterTemplate/Index';
import GradientOnHoverCut from 'Controls-demo/list_new/GradientOnHover/Cut/Index';
import FooterTemplateMinHeight from 'Controls-demo/list_new/FooterTemplate/MinHeight/Index';
import Grouped from 'Controls-demo/list_new/Grouped/Index';
import ItemActions from 'Controls-demo/list_new/ItemActions/Index';
import ItemClick from 'Controls-demo/list_new/ItemClick/Index';
import hoverBackgroundStyle from 'Controls-demo/list_new/hoverBackgroundStyle/Index';
import ItemsSpacing from 'Controls-demo/list_new/ItemsSpacing/Index';
import ItemPadding from 'Controls-demo/list_new/ItemPadding/Index';
import KeepScrollAfterReload from 'Controls-demo/list_new/KeepScrollAfterReload/Index';
import ItemTemplate from 'Controls-demo/list_new/ItemTemplate/Index';
import KeyProperty from 'Controls-demo/list_new/KeyProperty/Index';
import LoadingIndicator from 'Controls-demo/list_new/LoadingIndicator/Index';
import Marker from 'Controls-demo/list_new/Marker/Index';
import MoveControllerBase from 'Controls-demo/list_new/MoveController/Base/Index';
import MultiSelect from 'Controls-demo/list_new/MultiSelect/Index';
import Nested from 'Controls-demo/list_new/Nested/Index';
import OpenUrl from 'Controls-demo/list_new/OpenUrl/Index';
import reload from 'Controls-demo/list_new/reload/Index';
import RoundBorderAll from 'Controls-demo/list_new/RoundBorder/All/Index';
import RoundBorder from 'Controls-demo/list_new/RoundBorder/Index';
import RowSeparator from 'Controls-demo/list_new/RowSeparator/Index';
import Searching from 'Controls-demo/list_new/Searching/Index';
import Separator from 'Controls-demo/list_new/Separator/Index';
import Sorting from 'Controls-demo/list_new/Sorting/Index';
import Navigation from 'Controls-demo/list_new/Navigation/Index';
import StickyMarkedItem from 'Controls-demo/list_new/StickyMarkedItem/Index';
import TrackedProperties from 'Controls-demo/list_new/TrackedProperties/Index';
import StickyCallback from 'Controls-demo/list_new/StickyCallback/Index';
import Swipe from 'Controls-demo/list_new/Swipe/Index';
import VirtualScroll from 'Controls-demo/list_new/VirtualScroll/Index';
import TrackedPropertiesTrackedPropertiesTemplate from 'Controls-demo/list_new/TrackedProperties/TrackedPropertiesTemplate/Index';
import RemoveController from 'Controls-demo/list_new/RemoveController/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...ChangeSourceFromNull.getLoadConfig(),
            ...ChangeSource.getLoadConfig(),
            ...ColumnsView.getLoadConfig(),
            ...ComplexScroll.getLoadConfig(),
            ...Decorators.getLoadConfig(),
            ...DisplayProperty.getLoadConfig(),
            ...DragNDrop.getLoadConfig(),
            ...EditInPlace.getLoadConfig(),
            ...ColumnsViewVirtualScroll2.getLoadConfig(),
            ...EmptyList.getLoadConfig(),
            ...FadedKeys.getLoadConfig(),
            ...Filtering.getLoadConfig(),
            ...FooterTemplate.getLoadConfig(),
            ...GradientOnHoverCut.getLoadConfig(),
            ...FooterTemplateMinHeight.getLoadConfig(),
            ...hoverBackgroundStyle.getLoadConfig(),
            ...Grouped.getLoadConfig(),
            ...ItemActions.getLoadConfig(),
            ...ItemClick.getLoadConfig(),
            ...ItemPadding.getLoadConfig(),
            ...ItemsSpacing.getLoadConfig(),
            ...KeepScrollAfterReload.getLoadConfig(),
            ...ItemTemplate.getLoadConfig(),
            ...KeyProperty.getLoadConfig(),
            ...LoadingIndicator.getLoadConfig(),
            ...Marker.getLoadConfig(),
            ...MoveControllerBase.getLoadConfig(),
            ...MultiSelect.getLoadConfig(),
            ...Navigation.getLoadConfig(),
            ...Nested.getLoadConfig(),
            ...OpenUrl.getLoadConfig(),
            ...reload.getLoadConfig(),
            ...RoundBorderAll.getLoadConfig(),
            ...RoundBorder.getLoadConfig(),
            ...RowSeparator.getLoadConfig(),
            ...Searching.getLoadConfig(),
            ...Separator.getLoadConfig(),
            ...Sorting.getLoadConfig(),
            ...StickyMarkedItem.getLoadConfig(),
            ...TrackedProperties.getLoadConfig(),
            ...StickyCallback.getLoadConfig(),
            ...Swipe.getLoadConfig(),
            ...VirtualScroll.getLoadConfig(),
            ...TrackedPropertiesTrackedPropertiesTemplate.getLoadConfig(),
            ...RemoveController.getLoadConfig(),
        };
    }
}

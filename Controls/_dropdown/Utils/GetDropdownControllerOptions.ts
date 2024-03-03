/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { IDropdownControllerOptions } from 'Controls/_dropdown/interface/IDropdownController';
import { prepareEmpty } from 'Controls/_dropdown/Util';
import { IWasabyContextValue } from 'UICore/Contexts';

/**
 * Утилита для получения опций dropdown:_Controller'a
 * @class Controls/_dropdown/Utils/GetDropdownControllerOptions
 * @private
 */

export default function getDropdownControllerOptions(
    options: IDropdownControllerOptions,
    context?: IWasabyContextValue
): IDropdownControllerOptions {
    return {
        backgroundStyle: options.menuBackgroundStyle,
        headerBackgroundStyle: options.menuHeaderBackgroundStyle,
        hierarchyViewMode: options.hierarchyViewMode,
        useListRender: options.useMenuListRender,
        hoverBackgroundStyle: options.menuHoverBackgroundStyle,
        borderStyle: options.menuBorderStyle,
        hoverBorderStyle: options.menuHoverBorderStyle,
        borderWidth: options.menuBorderWidth,
        borderRadius: options.menuBorderRadius,
        borderVisible: options.menuBorderVisible,
        sourceController: options.sourceController,
        historyIdProperty: options.historyIdProperty,
        source: options.source,
        items: options.items,
        buildByItems: options.buildByItems,
        filter: options.filter,
        selectionType: options.selectionType,
        selectedKeys: options.selectedKeys,
        selectFields: options.selectFields,
        excludedKeys: options.excludedKeys,
        selectedItems: options.selectedItems,
        beforeSelectionChangedCallback: options.menuBeforeSelectionChangedCallback,
        emptyTemplate: options.emptyTemplate,
        navigation: options.navigation,
        keyProperty: options.keyProperty,
        notifyEvent: options.notifyEvent,
        lazyItemsLoading: options.lazyItemsLoading,
        reloadOnOpen: options.reloadOnOpen,
        selectedAllText: options.selectedAllText,
        selectedAllKey: options.selectedAllKey,
        emptyText: prepareEmpty(options.emptyText),
        emptyKey: options.emptyKey,
        itemActions: options.itemActions,
        itemActionVisibilityCallback: options.itemActionVisibilityCallback,
        itemActionsVisibility: options.itemActionsVisibility,
        itemAlign: options.itemAlign,
        itemTemplateProperty: options.itemTemplateProperty,
        itemTemplate: options.itemTemplate,
        itemsSpacing: options.itemsSpacing,
        selectedItemsChangedCallback: options.selectedItemsChangedCallback,
        menuDataLoadCallback: options.dataLoadCallback,
        dataLoadErrback: options.dataLoadErrback,
        historyId: options.historyId,
        historyRoot: options.historyRoot,
        historyNew: options.historyNew,
        maxHistoryVisibleItems: options.maxHistoryVisibleItems,
        allowPin: options.allowPin,
        allowAdaptive: options.allowAdaptive,
        width: options.width,
        popupClassName: options.popupClassName,
        dropdownClassName: options.dropdownClassName,
        markerVisibility: options.markerVisibility,
        displayProperty: options.displayProperty,
        multiSelect: options.multiSelect,
        multiSelectPosition: options.multiSelectPosition,
        multiSelectAccessibilityProperty: options.multiSelectAccessibilityProperty,
        selectorTemplate: options.selectorTemplate,
        headingCaptionProperty: options.headingCaptionProperty,
        headerContentTemplate: options.headerContentTemplate,
        footerContentTemplate: options.footerContentTemplate || options.footerTemplate,
        footerItemData: options.footerItemData,
        footerVisibility: options.footerVisibility,
        breadCrumbsItemTemplate: options.breadCrumbsItemTemplate,
        nodeFooterTemplate: options.nodeFooterTemplate,
        showMoreRightTemplate: options.showMoreRightTemplate,
        closeButtonVisibility: options.closeButtonVisibility,
        openerControl: options.openerControl,
        readOnly: options.readOnly ?? context?.readOnly,
        theme: options.theme,
        headTemplate: options.headTemplate,
        headerTemplate: options.headerTemplate,
        targetPoint: options.targetPoint,
        menuPopupOptions: options.menuPopupOptions,
        closeMenuOnOutsideClick: options.closeMenuOnOutsideClick,
        menuDraggable: options.menuDraggable,
        additionalProperty: options.additionalProperty,
        groupingKeyCallback: options.groupingKeyCallback,
        parentProperty: options.parentProperty,
        nodeProperty: options.nodeProperty,
        sourceProperty: options.sourceProperty,
        headingCaption: options.menuHeadingCaption,
        headingIcon: options.menuHeadingIcon || options.headingIcon,
        headingIconSize: options.menuHeadingIconSize || options.headingIconSize,
        iconSize: options.iconSize,
        hasIconPin: options.hasIconPin,
        showHeader: options.showHeader,
        headConfig: options.headConfig,
        groupTemplate: options.groupTemplate,
        groupProperty: options.groupProperty,
        searchParam: options.searchParam,
        searchValue: options.searchValue,
        minSearchLength: options.minSearchLength,
        searchDelay: options.searchDelay,
        searchValueTrim: options.searchValueTrim,
        searchPlaceholder: options.searchPlaceholder,
        viewMode: options.menuViewMode,
        subMenuDirection: options.subMenuDirection,
        dataName: options.menuDataName,
        menuOpenedCallback: options.menuOpenedCallback,
        openedSubMenuKey: options.openedSubMenuKey,
        themeVariables: options.themeVariables,
        themeClass: options.themeClass,
    };
}

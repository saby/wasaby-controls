import * as React from 'react';
import { ListContext, CollectionContext } from 'Controls/baseList';
import { TreeTileView } from 'Controls/treeTile';
import { ITileRenderEventHandlers } from './interface/IRenderEventHandlers';
import { IAbstractListState } from 'Controls-DataEnv/abstractList';

export interface IRenderProps extends ITileRenderEventHandlers, IAbstractListState {}

const ListContextValue = {
    actionHandlers: {},
};

function Render(props: IRenderProps): JSX.Element {
    const { collection } = props;
    const collectionContextValue = React.useMemo(() => ({ collection }), [collection]);

    return (
        <ListContext.Provider value={ListContextValue}>
            <CollectionContext.Provider value={collectionContextValue}>
                <TreeTileView {...props} listModel={collection} />
            </CollectionContext.Provider>
        </ListContext.Provider>
    );
}

export default React.memo(Render);

// <ws:partial
//     attr:class="controls-itemActionsV_menu-{{_isActionsMenuOpened ? 'shown' : 'hidden'}}"
//     name="{{name}}"
//     template="{{ _options.viewName }}"
//     itemsContainerClass="{{_getItemsContainerClasses()}}"
//     scope="{{_options}}"
//     itemActionsVisibility="{{ _isActionsMenuOpened ? 'hidden' : _options.itemActionsVisibility }}"
//     isFromBaseControl="{{ true }}"
//     bottomPaddingClass="{{_bottomPaddingClass}}"
//     needShowEmptyTemplate="{{ __needShowEmptyTemplate() }}"
//     useCollection="{{ _options.useCollection }}"
//     listModel="{{_listViewModel}}"
//     collection="{{_listViewModel}}"
//     collectionVersion="{{_listViewModel.getVersion()}}"
//     itemHandlers="{{_itemHandlers}}"
//     actionHandlers="{{_actionHandlers}}"
//     storedColumnsWidths="{{ _storedColumnsWidths }}"
//     startDragNDropCallback="{{ _options.itemsDragNDrop ? _startDragNDropCallback }}"
//     preventServerSideColumnScroll="{{ !_useServerSideColumnScroll }}"
//     uniqueId="{{ _uniqueId }}"
//     onItemDeactivated="{{ _onItemDeactivated }}"
//     onActionsMouseEnter="{{_onItemActionsMouseEnter}}"
//     onActionMouseDown="{{_onItemActionMouseDown}}"
//     onActionMouseUp="{{_onItemActionMouseUp}}"
//     onActionMouseEnter="{{_onItemActionMouseEnter}}"
//     onActionMouseLeave="{{_onItemActionMouseLeave}}"
//     onActionClick="{{_onItemActionClick}}"
//     onItemActionSwipeAnimationEnd="{{_onActionsSwipeAnimationEnd}}"
//     _commitEditActionHandler="{{_commitEditActionHandler }}"
//     _cancelEditActionHandler="{{_cancelEditActionHandler }}"
//     itemActionsTemplateMountedCallback="{{_getItemActionsController() && _getItemActionsController().getItemActionsTemplateMountedCallback()}}"
//     itemActionsTemplateUnmountedCallback="{{_getItemActionsController() && _getItemActionsController().getItemActionsTemplateUnmountedCallback()}}"
//     itemsContainerReadyCallback="{{ _itemsContainerReadyHandler }}"
//     viewResized="{{ _viewResize }}"
//     itemsSize="{{ _itemsSize }}"
//     onTagClick="{{ _onTagClickHandler }}"
//     onTagHover="{{ _onTagHoverHandler }}"
//     on:arrowClick="_notifyHandler('arrowClick')"
//     on:closeSwipe="_onCloseSwipe()"
//     on:validateCreated="_onValidateCreated()"
//     on:validateDestroyed="_onValidateDestroyed()"
//     on:animationend="_onItemSwipeAnimationEnd()"
//     on:deactivated="_onListDeactivated()"
//     on:markedKeyChanged="_notifyHandler('markedKeyChanged')"
//     on:beforeMarkedKeyChanged="_notifyHandler('beforeMarkedKeyChanged')"
//     on:beforeSelectionChanged="_notifyHandler('beforeSelectionChanged')"
//     on:itemClick="_onItemClick()"
//     on:groupClick="_onGroupClick()"
//     on:checkBoxClick="_onCheckBoxClick()"
//     on:itemContextMenu="_onItemContextMenu()"
//     on:itemLongTap="_onItemLongTap()"
//     on:itemMouseDown="_itemMouseDown()"
//     on:itemMouseUp="_itemMouseUp()"
//     on:touchstart="_touchStartHandler()"
//     on:itemMouseEnter="_itemMouseEnter()"
//     on:itemMouseMove="_itemMouseMove()"
//     on:itemMouseLeave="_itemMouseLeave()"
//     on:hoveredItemChanged="_notifyHandler('hoveredItemChanged')"
//     on:updateItemActionsOnItem="_updateItemActionsOnItem()"
//     on:itemSwipe="_onItemSwipe()"
//     on:controlResize="_viewResize()"
//     on:doScroll="_stopBubblingEvent()"
//     on:updatePlaceholdersSize="_stopBubblingEvent()"
//     on:enableVirtualNavigation="_stopBubblingEvent()"
//     on:disableVirtualNavigation="_stopBubblingEvent()"
//     on:toggleHorizontalScroll="_onToggleHorizontalScroll()"
//     on:updateShadowMode="_stopInnerUpdateShadowMode()"

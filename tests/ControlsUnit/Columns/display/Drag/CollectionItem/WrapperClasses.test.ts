import { ColumnsCollectionItem as CollectionItem } from 'Controls/columns';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/columns/display/Drag/CollectionItem/WrapperClasses', () => {
    const owner = {
        getHoverBackgroundStyle: () => {
            return null;
        },
        getEditingBackgroundStyle: () => {
            return null;
        },
        isDragging: () => {
            return true;
        },
        isFirstItem: () => {
            return false;
        },
        isLastItem: () => {
            return false;
        },
        getNavigation: () => {
            return {};
        },
        getEditingConfig: () => {
            return {};
        },
        getItemActionsPosition: () => {
            return 'inside';
        },
        notifyItemChange: () => {
            return 'inside';
        },
        getGroupViewMode: () => {
            return 'default';
        },
    };

    it('is node target', () => {
        const item = new CollectionItem({ owner });
        item.setDragTargetNode(true);
        CssClassesAssert.include(item.getWrapperClasses(), 'controls-ColumnsView__dragTargetNode');
    });
});

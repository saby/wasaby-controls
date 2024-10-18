import { ColumnsCollectionItem as CollectionItem } from 'Controls/columns';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/columns/display/Drag/CollectionItem/ContentClasses', () => {
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
    };

    it('is dragged item', () => {
        const item = new CollectionItem({ owner, dragged: true });
        CssClassesAssert.include(
            item.getContentClasses('hidden'),
            'controls-ListView__item_shadow_dragging'
        );
    });

    it('shadowVisibility!=hidden', () => {
        const item = new CollectionItem({ owner });
        CssClassesAssert.include(
            item.getContentClasses(),
            'controls-ListView__item_shadow_visible'
        );
    });

    it('shadowVisibility=hidden', () => {
        const item = new CollectionItem({ owner });
        CssClassesAssert.notInclude(
            item.getContentClasses('hidden'),
            'controls-ListView__item_shadow_visible'
        );
    });
});

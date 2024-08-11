import { TileCollectionItem } from 'Controls/tile';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/_tile/display/mixins/TileItem', () => {
    describe('getWrapperClasses', () => {
        it('small', () => {
            let item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getWrapperClasses({ itemType: 'small' }),
                'controls-TileView__smallTemplate_wrapper'
            );

            item = new TileCollectionItem({ canShowActions: true });
            CssClassesAssert.include(
                item.getWrapperClasses({ itemType: 'small' }),
                'controls-ListView__item_showActions'
            );

            item = new TileCollectionItem({ dragged: true });
            CssClassesAssert.include(
                item.getWrapperClasses({ itemType: 'small' }),
                'controls-ListView__itemContent_faded'
            );
        });

        it('roundBorder', () => {
            const owner = {
                getDisplayProperty: () => {
                    return 'display';
                },
                getMarkerVisibility: () => {
                    return 'hidden';
                },
            };
            const item = new TileCollectionItem({
                owner,
                roundBorder: { tl: 's', tr: 'xs', bl: 'm' },
            });
            const classes = item.getWrapperClasses({});
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_topLeft_s');
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_topRight_xs');
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_bottomLeft_m');
            CssClassesAssert.include(
                classes,
                'controls-TileView__item_roundBorder_bottomRight_default'
            );
        });
    });

    describe('geItemClasses', () => {
        it('roundBorder', () => {
            const owner = {
                getDisplayProperty: () => {
                    return 'display';
                },
                getMarkerVisibility: () => {
                    return 'hidden';
                },
            };
            const item = new TileCollectionItem({
                owner,
                roundBorder: { tl: 's', tr: 'xs', bl: 'm' },
            });
            const classes = item.getItemClasses({});
            CssClassesAssert.include(classes, 'js-controls-ListView__editingTarget');
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_topLeft_s');
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_topRight_xs');
            CssClassesAssert.include(classes, 'controls-TileView__item_roundBorder_bottomLeft_m');
            CssClassesAssert.include(
                classes,
                'controls-TileView__item_roundBorder_bottomRight_default'
            );
        });
    });
});

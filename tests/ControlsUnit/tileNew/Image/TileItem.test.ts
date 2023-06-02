import { TileCollectionItem } from 'Controls/tile';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/_tile/display/mixins/TileItem', () => {
    describe('.getImageHeightAttribute', () => {
        it('rich item', () => {
            const item = new TileCollectionItem();
            expect(item.getImageHeightAttribute('rich')).toEqual('');
        });

        it('default item', () => {
            const item = new TileCollectionItem();
            expect(item.getImageHeightAttribute()).toEqual('100%');
        });
    });

    describe('getImageClasses', () => {
        describe('rich', () => {
            it('by default', () => {
                const item = new TileCollectionItem();
                const result = item.getImageClasses(
                    'rich',
                    undefined,
                    'center',
                    'rectangle',
                    1,
                    'top',
                    's'
                );
                CssClassesAssert.isSame(
                    result,
                    'controls-TileView__richTemplate_image controls-TileView__image controls-TileView__image_align_center controls-TileView__richTemplate_image_viewMode_rectangle controls-TileView__image-cover'
                );
            });

            it('contains controls-TileView__image', () => {
                const item = new TileCollectionItem();
                let result = item.getImageClasses(
                    'rich',
                    undefined,
                    'center',
                    'rectangle',
                    0.5,
                    'top'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__image controls-TileView__image_align_center'
                );

                result = item.getImageClasses(
                    'rich',
                    undefined,
                    'center',
                    '',
                    0.5,
                    'top'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__image controls-TileView__image_align_center'
                );

                result = item.getImageClasses(
                    'rich',
                    undefined,
                    'center',
                    '',
                    0.5,
                    'top',
                    'xl'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__image controls-TileView__image_align_center'
                );

                result = item.getImageClasses(
                    'rich',
                    undefined,
                    'center',
                    'rectangle',
                    1,
                    'top'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__image controls-TileView__image_align_center'
                );
            });
        });

        describe('default item', () => {
            it('by default', () => {
                const item = new TileCollectionItem();
                const result = item.getImageClasses(
                    'default',
                    undefined,
                    'center'
                );
                CssClassesAssert.isSame(
                    result,
                    'controls-TileView__image controls-TileView__image_align_center'
                );
            });

            it('image align top', () => {
                const item = new TileCollectionItem();
                const result = item.getImageClasses(
                    'default',
                    undefined,
                    'top'
                );
                CssClassesAssert.isSame(
                    result,
                    'controls-TileView__image_align_top'
                );
            });

            it('image fit is cover', () => {
                const item = new TileCollectionItem({ imageFit: 'cover' });
                const result = item.getImageClasses(
                    'default',
                    undefined,
                    'top'
                );
                CssClassesAssert.isSame(
                    result,
                    'controls-TileView__image_align_top controls-TileView__image_fullHeight controls-TileView__image_fullWidth controls-TileView__image-cover'
                );
            });
        });
    });

    describe('getImageWrapperClasses', () => {
        describe('rich', () => {
            it('by default', () => {
                const item = new TileCollectionItem();
                const result = item.getImageWrapperClasses({
                    itemType: 'rich',
                    imageViewMode: 'rectangle',
                    imagePosition: 'top',
                    imageSize: 's',
                });
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_top_viewMode_rectangle controls-TileView__richTemplate_image_size_s_position_vertical'
                );
            });

            it('setup image size', () => {
                const item = new TileCollectionItem();
                let result = item.getImageWrapperClasses({
                    itemType: 'rich',
                    imageViewMode: 'rectangle',
                    imagePosition: 'top',
                    imageProportionOnItem: '1:1',
                });
                CssClassesAssert.notInclude(
                    result,
                    'controls-TileView__richTemplate_image_size_'
                );

                result = item.getImageWrapperClasses({
                    itemType: 'rich',
                    imageViewMode: 'rectangle',
                    imagePosition: 'top',
                    imageSize: 's',
                });
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_top_viewMode_rectangle'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_vertical'
                );

                result = item.getImageWrapperClasses({
                    itemType: 'rich',
                    imageViewMode: 'circle',
                    imagePosition: 'top',
                    imageSize: 's',
                    imageProportionOnItem: '1:1',
                });
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_top_viewMode_circle'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_vertical'
                );

                result = item.getImageWrapperClasses({
                    itemType: 'rich',
                    imageViewMode: 'rectangle',
                    imagePosition: 'left',
                    imageSize: 's',
                    imageProportionOnItem: '1:1',
                });
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_left_viewMode_rectangle'
                );
                CssClassesAssert.include(
                    result,
                    'controls-TileView__richTemplate_image_size_s_position_horizontal'
                );
            });
        });
    });
});

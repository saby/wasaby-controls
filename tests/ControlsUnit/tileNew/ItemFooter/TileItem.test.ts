import { TileCollectionItem } from 'Controls/tile';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/_tile/display/mixins/TileItem/Footer', () => {
    describe('shouldDisplayFooterTemplate', () => {
        it('not pass footerTemplate', () => {
            const item = new TileCollectionItem();
            expect(
                item.shouldDisplayFooterTemplate('small', null, 'wrapper')
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate('preview', null, 'content')
            ).toBe(false);
        });

        it('small item', () => {
            const item = new TileCollectionItem();
            expect(
                item.shouldDisplayFooterTemplate(
                    'small',
                    () => {
                        return '';
                    },
                    'wrapper'
                )
            ).toBe(true);
            expect(
                item.shouldDisplayFooterTemplate(
                    'small',
                    () => {
                        return '';
                    },
                    'content'
                )
            ).toBe(false);
        });

        it('preview item', () => {
            const item = new TileCollectionItem();
            expect(
                item.shouldDisplayFooterTemplate(
                    'preview',
                    () => {
                        return '';
                    },
                    'wrapper'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'preview',
                    () => {
                        return '';
                    },
                    'content'
                )
            ).toBe(true);
        });

        it('not support footer for another items', () => {
            const item = new TileCollectionItem();
            expect(
                item.shouldDisplayFooterTemplate(
                    'rich',
                    () => {
                        return '';
                    },
                    'wrapper'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'rich',
                    () => {
                        return '';
                    },
                    'content'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'default',
                    () => {
                        return '';
                    },
                    'wrapper'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'default',
                    () => {
                        return '';
                    },
                    'content'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'medium',
                    () => {
                        return '';
                    },
                    'wrapper'
                )
            ).toBe(false);
            expect(
                item.shouldDisplayFooterTemplate(
                    'medium',
                    () => {
                        return '';
                    },
                    'content'
                )
            ).toBe(false);
        });
    });

    describe('getFooterClasses', () => {
        it('by default', () => {
            const item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getFooterClasses({}),
                'controls-TileView__item_footer'
            );
        });
        it('rich', () => {
            const item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getFooterClasses({ itemType: 'rich' }),
                ''
            );
        });
        it('rich with description', () => {
            const item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getFooterClasses({
                    itemType: 'rich',
                    description: 'description',
                    descriptionLines: 1,
                }),
                'controls-TileView__richTemplate_footer_spacing'
            );
        });
    });
});

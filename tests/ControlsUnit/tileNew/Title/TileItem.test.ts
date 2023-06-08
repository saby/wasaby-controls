import { TileCollectionItem } from 'Controls/tile';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { Model } from 'Types/entity';

describe('Controls/_tile/display/mixins/TileItem', () => {
    describe('getTitleWrapperClasses', () => {
        it('small', () => {
            const item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getTitleWrapperClasses({ itemType: 'small' }),
                'controls-TileView__smallTemplate_title'
            );
        });
        it('rich', () => {
            const item = new TileCollectionItem();
            CssClassesAssert.include(
                item.getTitleWrapperClasses({ itemType: 'rich' }),
                'controls-TileView__richTemplate_itemContent ws-ellipsis'
            );
        });
        it('preview', () => {
            const item = new TileCollectionItem();
            const classes = item.getTitleWrapperClasses({
                itemType: 'preview',
            });
            CssClassesAssert.include(
                classes,
                'controls-TileView__previewTemplate_title controls-fontsize-m'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__previewTemplate_title_singleLine'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__previewTemplate_title_gradient_dark'
            );
            CssClassesAssert.include(
                classes,
                'controls-TileView__previewTemplate_title_text_light'
            );

            CssClassesAssert.include(
                item.getTitleWrapperClasses({
                    itemType: 'preview',
                    titleLines: 2,
                }),
                'controls-TileView__previewTemplate_title_multiLine'
            );
        });
    });

    describe('shouldDisplayTitle', () => {
        const owner = {
            getDisplayProperty: () => {
                return 'display';
            },
            getEditingConfig: () => {
                return {
                    toolbarVisibility: true,
                };
            },
            getItemActionsPosition: () => {
                return 'default';
            },
        };

        describe('default', () => {
            it('without display value', () => {
                const contents = new Model({
                    rawData: { display: '', id: 1 },
                    keyProperty: 'id',
                });
                const item = new TileCollectionItem({ contents, owner });
                expect(item.shouldDisplayTitle('default')).toBe(false);
            });

            it('with display value', () => {
                const contents = new Model({
                    rawData: { display: '111', id: 1 },
                    keyProperty: 'id',
                });
                const item = new TileCollectionItem({ contents, owner });
                expect(item.shouldDisplayTitle('default')).toBe(true);
            });

            it('has visible actions', () => {
                const contents = new Model({
                    rawData: { display: '', id: 1 },
                    keyProperty: 'id',
                });
                const actions = { showed: ['action1'] };
                const item = new TileCollectionItem({
                    contents,
                    owner,
                    actions,
                });
                expect(item.shouldDisplayTitle('default')).toBe(true);
            });

            it('is editing', () => {
                const contents = new Model({
                    rawData: { display: '', id: 1 },
                    keyProperty: 'id',
                });
                const item = new TileCollectionItem({
                    contents,
                    owner,
                    editing: true,
                });
                expect(item.shouldDisplayTitle('default')).toBe(true);
            });
        });

        it('small', () => {
            const item = new TileCollectionItem();
            expect(item.shouldDisplayTitle('small')).toBe(true);
        });

        it('medium', () => {
            const item = new TileCollectionItem();
            expect(item.shouldDisplayTitle('medium')).toBe(true);
        });

        it('rich', () => {
            const item = new TileCollectionItem();
            expect(item.shouldDisplayTitle('rich')).toBe(true);
        });

        describe('preview', () => {
            const contents = new Model({
                rawData: { display: '123', id: 1 },
                keyProperty: 'id',
            });

            it('not has display value', () => {
                const emptyContents = new Model({
                    rawData: { display: '', id: 1 },
                    keyProperty: 'id',
                });
                const actions = { showed: ['action1'] };
                const item = new TileCollectionItem({
                    actions,
                    canShowActions: false,
                    owner,
                    contents: emptyContents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(false);
            });

            it('can show actions and has visible actions', () => {
                const actions = { showed: ['action1'] };
                const item = new TileCollectionItem({
                    actions,
                    canShowActions: true,
                    owner,
                    contents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(true);
            });

            it('not can show actions and has visible actions', () => {
                const actions = { showed: ['action1'] };
                const item = new TileCollectionItem({
                    actions,
                    canShowActions: false,
                    owner,
                    contents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(true);
            });

            it('can show actions and not has visible actions', () => {
                const actions = { showed: [] };
                const item = new TileCollectionItem({
                    actions,
                    canShowActions: true,
                    owner,
                    contents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(true);
            });

            it('not can show actions and not has visible actions', () => {
                const actions = { showed: [] };
                const item = new TileCollectionItem({
                    actions,
                    canShowActions: false,
                    owner,
                    contents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(true);
            });
        });
    });
});

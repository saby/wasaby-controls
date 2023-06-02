import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { Model } from 'Types/entity';

describe('Controls/_treeTile/display/TreeTileCollectionItem', () => {
    describe('.getItemType', () => {
        it('change default to small when is node', () => {
            let item = new TreeTileCollectionItem({
                parent: new TreeTileCollectionItem(),
            });
            expect(item.getItemType('default')).toEqual('default');

            item = new TreeTileCollectionItem({
                contents: { node: true },
                parent: new TreeTileCollectionItem(),
                nodeProperty: 'node',
            });
            expect(item.getItemType('default')).toEqual('small');
        });

        it('not change default to small when pass nodeContentTemplate', () => {
            let item = new TreeTileCollectionItem();
            expect(
                item.getItemType('default', () => {
                    return '';
                })
            ).toEqual('default');

            item = new TreeTileCollectionItem({
                contents: { node: true },
                nodeProperty: 'node',
            });
            expect(
                item.getItemType('default', () => {
                    return '';
                })
            ).toEqual('default');
        });
    });

    describe('.getItemStyles', () => {
        it('is node and default template', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: true },
                nodeProperty: 'node',
                nodesHeight: 100,
            });
            expect(item.getItemStyles({ itemType: 'default' })).toEqual({
                flexBasis: '250px',
                minWidth: '250px',
                height: undefined,
            });
            expect(
                item.getItemStyles({ itemType: 'default', width: 300 })
            ).toEqual({
                flexBasis: '300px',
                minWidth: '300px',
                height: undefined,
            });
            expect(
                item.getItemStyles({
                    itemType: 'default',
                    width: 300,
                    staticHeight: true,
                })
            ).toEqual({
                flexBasis: '300px',
                minWidth: '300px',
                height: '100px',
            });
        });

        it('is node and small template', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: true },
                nodeProperty: 'node',
                nodesHeight: 100,
            });
            expect(item.getItemStyles({ itemType: 'default' })).toEqual({
                flexBasis: '250px',
                minWidth: '250px',
                height: undefined,
            });
            expect(
                item.getItemStyles({ itemType: 'default', width: 300 })
            ).toEqual({
                flexBasis: '300px',
                minWidth: '300px',
                height: undefined,
            });
            expect(
                item.getItemStyles({
                    itemType: 'default',
                    width: 300,
                    staticHeight: true,
                })
            ).toEqual({
                flexBasis: '300px',
                minWidth: '300px',
                height: '100px',
            });
        });
    });
    describe('.getTileHeight', () => {
        it('node', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: true },
                parent: new TreeTileCollectionItem(),
                nodeProperty: 'node',
                nodesHeight: 100,
                tileHeight: 200,
            });
            expect(item.getTileHeight()).toEqual(100);
        });

        it('not node', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: null },
                parent: new TreeTileCollectionItem({}),
                nodeProperty: 'node',
                nodesHeight: 100,
                tileHeight: 200,
            });
            expect(item.getTileHeight()).toEqual(200);
        });
    });

    describe('getTitleWrapperClasses', () => {
        it('small', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: true },
                nodeProperty: 'node',
            });
            CssClassesAssert.include(
                item.getTitleWrapperClasses({ itemType: 'small' }),
                'controls-TileView__smallTemplate_title_node'
            );
        });
        it('preview', () => {
            const item = new TreeTileCollectionItem({
                contents: { node: true },
                nodeProperty: 'node',
            });
            const classes = item.getTitleWrapperClasses({
                itemType: 'preview',
            });
            CssClassesAssert.include(classes, 'controls-fontweight-bold');
            CssClassesAssert.include(classes, 'controls-fontsize-l');
        });
    });

    describe('shouldDisplayTitle', () => {
        describe('preview', () => {
            const owner = {
                getDisplayProperty: () => {
                    return 'display';
                },
            };
            const contents = new Model({
                rawData: { display: '123', id: 1, node: null },
                keyProperty: 'id',
            });
            it('can show actions and has visible actions and not is node', () => {
                const actions = { showed: ['action1'] };
                const item = new TreeTileCollectionItem({
                    actions,
                    canShowActions: true,
                    owner,
                    contents,
                });
                expect(!!item.shouldDisplayTitle('preview')).toBe(true);
            });

            it('can show actions and has visible actions and is node', () => {
                const actions = { showed: ['action1'] };
                contents.set('node', true);
                const item = new TreeTileCollectionItem({
                    actions,
                    canShowActions: true,
                    nodeProperty: 'node',
                    owner,
                    contents,
                });
                expect(item.shouldDisplayTitle('preview')).toBe(true);
            });
        });
    });
});

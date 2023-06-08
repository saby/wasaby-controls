import { TileCollectionItem } from 'Controls/tile';

describe('Controls/_tile/display/mixins/TileItem', () => {
    describe('.getTileWidth', () => {
        describe('tileMode is static', () => {
            it('tileWidth options', () => {
                const item = new TileCollectionItem({ tileWidth: 200 });
                expect(item.getTileWidth()).toEqual(200);
            });

            it('tileWidthProperty priority tileWidth', () => {
                const contents = { width: 250 };
                const item = new TileCollectionItem({
                    tileWidth: 200,
                    contents,
                    tileWidthProperty: 'width',
                });
                expect(item.getTileWidth()).toEqual(250);
            });

            it('tileSize priority tileWidthProperty, tileWidth ', () => {
                const contents = { width: 250 };
                let item = new TileCollectionItem({
                    tileWidth: 200,
                    contents,
                    tileWidthProperty: 'width',
                    tileSize: 's',
                });
                expect(item.getTileWidth()).toEqual(160);

                item = new TileCollectionItem({
                    tileWidth: 200,
                    contents,
                    tileWidthProperty: 'width',
                    tileSize: 's',
                });
                expect(
                    item.getTileWidth(undefined, 'left', 'ellipsis')
                ).toEqual(320);
            });
        });

        describe('tileMode is dynamic', () => {
            it('count by image size', () => {
                const contents = { imageHeight: 200, imageWidth: 150 };
                const item = new TileCollectionItem({
                    tileMode: 'dynamic',
                    contents,
                    imageWidthProperty: 'imageWidth',
                    imageHeightProperty: 'imageHeight',
                });
                expect(item.getTileWidth()).toEqual(250);
            });

            it('count by tileHeight', () => {
                const item = new TileCollectionItem({
                    tileMode: 'dynamic',
                    tileHeight: 300,
                });
                expect(item.getTileWidth()).toEqual(300);
            });
        });
    });
});

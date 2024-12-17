import { TileCollection } from 'Controls/tile';
import { RecordSet } from 'Types/collection';

describe('Controls/_tile/display/TileCollection', () => {
    it('create items with all tile params', () => {
        const items = new RecordSet({
            rawData: [{ id: 1 }],
            keyProperty: 'id',
        });
        const model = new TileCollection({
            collection: items,
            keyProperty: 'id',
            tileMode: 'static',
            tileScalingMode: 'outside',
            tileSize: 's',
            tileWidthProperty: 'tileWidth',
            imageWidthProperty: 'imageWidth',
            tileFitProperty: 'tileFit',
            imageHeightProperty: 'imageHeight',
            imageProperty: 'image',
            imageFit: 'imageFit',
            imageUrlResolver: 'imageUrlResolver',
            roundBorder: { tl: '1px', tr: '2px', bl: '3px', br: '4px' },
        });
        const item = model.at(0);

        expect(item.getTileMode()).toEqual('static');
        expect(item.getTileScalingMode()).toEqual('outside');
        expect(item.getTileSize()).toEqual('s');
        expect(item.getTileWidthProperty()).toEqual('tileWidth');
        expect(item.getImageWidthProperty()).toEqual('imageWidth');
        expect(item.getTileFitProperty()).toEqual('tileFit');
        expect(item.getImageHeightProperty()).toEqual('imageHeight');
        expect(item.getImageProperty()).toEqual('image');
        expect(item.getImageFit()).toEqual('imageFit');
        expect(item.getImageUrlResolver()).toEqual('imageUrlResolver');
        expect(item.getTopLeftRoundBorder()).toEqual('1px');
        expect(item.getTopRightRoundBorder()).toEqual('2px');
        expect(item.getBottomLeftRoundBorder()).toEqual('3px');
        expect(item.getBottomRightRoundBorder()).toEqual('4px');
    });
});

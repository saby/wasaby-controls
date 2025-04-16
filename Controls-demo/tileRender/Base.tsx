import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { TileCollection } from 'Controls/tile';

import { TileView } from 'Controls/tileRender';

export default React.forwardRef((_props, ref: React.ForwardedRef<HTMLDivElement>) => {
    const items = React.useMemo<RecordSet>(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, title: 'tile_1', image: 'image_1' },
                { key: 2, title: 'tile_2', image: 'image_2' },
                { key: 3, title: 'tile_3', image: 'image_3' },
                { key: 4, title: 'tile_4', image: 'image_4' },
                { key: 5, title: 'tile_5', image: 'image_5' },
                { key: 6, title: 'tile_6', image: 'image_6' },
                { key: 7, title: 'tile_7', image: 'image_7' },
            ],
        });
    }, []);

    const collection = React.useMemo<TileCollection>(() => {
        return new TileCollection({
            filter: undefined,
            folderWidth: 0,
            sort: undefined,
            tileHeight: 0,
            tileWidth: 0,
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
            imageFit: 'none',
        });
    }, [items]);

    return (
        <div ref={ref}>
            <TileView collection={collection} />
        </div>
    );
});

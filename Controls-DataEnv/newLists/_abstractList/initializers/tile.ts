import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ITileState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

const DEFAULT_TILE_HEIGHT = 200;
const DEFAULT_TILE_WIDTH = 250;
const DEFAULT_FOLDER_WIDTH = DEFAULT_TILE_WIDTH;
const DEFAULT_IMAGE_PROPERTY = 'image';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ITileState {
    const tileMode: ITileState['tileMode'] = config.tileMode || 'static';

    return {
        tileMode,
        tileSize: config.tileSize,
        tileWidth: config.tileWidth || DEFAULT_TILE_WIDTH,
        tileHeight: config.tileHeight || DEFAULT_TILE_HEIGHT,
        tileWidthProperty: config.tileWidthProperty,
        tileScalingMode: config.tileScalingMode || 'none',
        tileFitProperty: config.tileFitProperty,

        imageProperty: config.imageProperty || DEFAULT_IMAGE_PROPERTY,
        imageWidthProperty: config.imageWidthProperty,
        imageHeightProperty: config.imageHeightProperty,

        imageUrlResolver: config.imageUrlResolver,
        folderWidth: config.folderWidth || DEFAULT_FOLDER_WIDTH,
        orientation: config.orientation || 'vertical',
    };
}

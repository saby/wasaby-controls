import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ITileState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import extract from '../../_abstractList/collection/factory/extract';

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
        tileWidth: config.tileWidth || DEFAULT_TILE_WIDTH,
        tileHeight: config.tileHeight || DEFAULT_TILE_HEIGHT,
        tileScalingMode: config.tileScalingMode || 'none',

        imageProperty: config.imageProperty || DEFAULT_IMAGE_PROPERTY,

        folderWidth: config.folderWidth || DEFAULT_FOLDER_WIDTH,
        orientation: config.orientation || 'vertical',

        ...extract<IAbstractListDataFactoryArguments>(config, [
            'tileSize',
            'tileWidthProperty',
            'tileFitProperty',
            'imageWidthProperty',
            'imageHeightProperty',
            'imageUrlResolver',
        ]),
    };
}

import type { ITileCollectionOptions } from 'Controls/tile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    'tileMode',
    'tileSize',
    'tileHeight',
    'tileWidth',
    'tileWidthProperty',
    'tileFitProperty',
    'tileScalingMode',
    'orientation',
    'itemsContainerPadding',
    'roundBorder',
    'imageProperty',
    'imageFit',
    'imageHeightProperty',
    'imageWidthProperty',
    'imageUrlResolver',
    'fallbackImage',
    'afterItemsTemplate',
    'beforeItemsTemplate',
    'usingCustomItemTemplates',
    'canShowActions',
];

export default function (state: IAbstractListState): ITileCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as ITileCollectionOptions;
}

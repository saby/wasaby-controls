/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ITileCollectionOptions } from 'Controls/tile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

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

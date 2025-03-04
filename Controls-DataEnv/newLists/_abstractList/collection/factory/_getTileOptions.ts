import type { ITileCollectionOptions } from 'Controls/tile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

const _KNOWN_OPTIONS: (keyof IAbstractListState)[] = [
    'tileMode',
    'tileSize',
    'tileHeight',
    'tileWidth',
    'tileWidthProperty',
    'tileFitProperty',
    'tileScalingMode',
    'imageProperty',
    'imageHeightProperty',
    'imageWidthProperty',
    'imageUrlResolver',
    'orientation',
];

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    ..._KNOWN_OPTIONS,
    'itemsContainerPadding',
    'roundBorder',
    'imageFit',
    'imageHeightProperty',
    'imageWidthProperty',
    'imageUrlResolver',
];

export default function (state: IAbstractListState): ITileCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as ITileCollectionOptions;
}

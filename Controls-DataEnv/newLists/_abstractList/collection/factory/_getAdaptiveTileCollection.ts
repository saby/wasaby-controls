import type { IAdaptiveTileCollectionOptions } from 'Controls/adaptiveTile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    'minItemHeight',
    'maxItemHeight',
    'minItemWidth',
    'maxItemWidth',
    'availableHeight',
    'availableWidth',
];

export default function (state: IAbstractListState): IAdaptiveTileCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as IAdaptiveTileCollectionOptions;
}

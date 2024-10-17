/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAdaptiveTileCollectionOptions } from 'Controls/adaptiveTile';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getListOptions from './_getListOptions';

export default function (state: IListState): IAdaptiveTileCollectionOptions {
    return {
        ...getListOptions(state),

        minItemHeight: undefined,
        maxItemHeight: undefined,
        minItemWidth: undefined,
        maxItemWidth: undefined,
        availableHeight: undefined,
        availableWidth: undefined,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}

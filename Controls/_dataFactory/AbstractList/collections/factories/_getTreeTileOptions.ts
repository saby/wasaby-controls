/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ITreeTileCollectionOptions } from 'Controls/treeTile';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getTileOptions from './_getTileOptions';
import getTreeOptions from './_getTreeOptions';

export default function (state: IListState): ITreeTileCollectionOptions {
    return {
        ...getTreeOptions(state),
        ...getTileOptions(state),

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}

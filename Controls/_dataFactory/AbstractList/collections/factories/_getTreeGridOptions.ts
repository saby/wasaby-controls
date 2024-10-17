/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IGridCollectionOptions } from 'Controls/grid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getGridOptions from './_getGridOptions';
import getTreeOptions from './_getTreeOptions';

export default function (state: IListState): IGridCollectionOptions {
    return {
        ...getTreeOptions(state),
        ...getGridOptions(state),

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}

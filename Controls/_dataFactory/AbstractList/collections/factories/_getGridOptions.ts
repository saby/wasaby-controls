/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IGridCollectionOptions } from 'Controls/grid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getListOptions from './_getListOptions';

export default function (state: IListState): IGridCollectionOptions {
    return {
        ...getListOptions(state),

        headerVisibility: state.headerVisibility,
        stickyHeader: state.stickyHeader,
        header: state.header,
        columns: state.columns,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}

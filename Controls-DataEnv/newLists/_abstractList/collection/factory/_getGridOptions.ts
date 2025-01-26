import type { IGridCollectionOptions } from 'Controls/grid';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = ['headerVisibility', 'stickyHeader', 'header', 'columns'];

export default function (state: IAbstractListState): IGridCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as IGridCollectionOptions;
}

import type { IGridCollectionOptions } from 'Controls/grid';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

const OPTIONS: (keyof IAbstractListState)[] = [
    'headerVisibility',
    'stickyHeader',
    'header',
    'columns',
    'getRowProps',
    'emptyView',
    'emptyViewConfig',
];

export default function (state: IAbstractListState): IGridCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
        emptyTemplate: undefined,
        emptyTemplateOptions: undefined,
    } as unknown as IGridCollectionOptions;
}

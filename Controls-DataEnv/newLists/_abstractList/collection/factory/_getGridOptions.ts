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
    const options = {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
        emptyTemplate: undefined,
        emptyTemplateOptions: undefined,
    } as unknown as IGridCollectionOptions;

    // Explorer переопределяет header при помощи PathController, поэтому эта опция перестает быть актуальной
    if (state.sliceOwnedByExplorer) {
        delete options.header;
    }

    return options;
}

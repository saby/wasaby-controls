import { GridHeaderRow } from 'Controls/grid';
import type { IGridCollectionOptions } from 'Controls/grid';
import { getRowMock, IGetRowMockParams } from './Row';
import { extractParam } from '../helpers';

export interface IGetHeaderRowMockParams extends IGetRowMockParams {
    headerColumnsConfig: IGridCollectionOptions['header'];
    isMultiline?: boolean;
}

export function getHeaderRowMock(params: IGetHeaderRowMockParams): GridHeaderRow {
    const get = (pName: keyof IGetHeaderRowMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        ...getRowMock(params),
        isMultiline: () => {
            return get('isMultiline', false);
        },
        getBounds: () => {
            return {
                row: {},
                column: {},
            };
        },
    } as unknown as GridHeaderRow;
}

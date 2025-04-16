import { GridDataRow } from 'Controls/grid';
import { getRowMock, IGetRowMockParams } from './Row';
import { extractParam } from '../helpers';

export interface IGetDataRowMockParams extends IGetRowMockParams {
    editingColumnIndex?: number;
}

export function getDataRowMock(params: IGetDataRowMockParams): GridDataRow {
    const get = (pName: keyof IGetDataRowMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        ...getRowMock(params),
        getEditingColumnIndex: () => {
            return get('editingColumnIndex', undefined);
        },
    } as GridDataRow;
}

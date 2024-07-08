import { GridGroupRow } from 'Controls/grid';
import { getRowMock, IGetRowMockParams } from './Row';
import { extractParam } from '../helpers';

export interface IGetGroupRowMockParams extends IGetRowMockParams {
    groupPaddingClasses?: string;
}

export function getGroupRowMock(params: IGetGroupRowMockParams): GridGroupRow {
    const get = (pName: keyof IGetGroupRowMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        ...getRowMock(params),
        getGroupPaddingClasses: () => {
            return get('groupPaddingClasses', undefined);
        },
    } as unknown as GridGroupRow;
}

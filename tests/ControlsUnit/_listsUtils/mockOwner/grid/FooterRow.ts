import { GridFooterRow } from 'Controls/grid';
import { getRowMock, IGetRowMockParams } from './Row';
import { extractParam } from '../helpers';

export interface IGetFooterRowMockParams extends IGetRowMockParams {
    actionsTemplateConfig?: unknown;
}

export function getFooterRowMock(params: IGetFooterRowMockParams): GridFooterRow {
    const get = (pName: keyof IGetFooterRowMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        ...getRowMock(params),
        getActionsTemplateConfig: () => {
            return get('actionsTemplateConfig', undefined);
        },
    } as GridFooterRow;
}

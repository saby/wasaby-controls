import type { TColumns, GridCollection, TColumnSeparatorSize } from 'Controls/grid';
import {
    getCollectionMock as _getOwnerMock,
    ICollectionMockParams as IOwnerMockParams,
} from '../../mockOwner/grid/Collection';
import { extractParam } from '../../mockOwner/helpers';
import { Model } from 'Types/entity';

/* eslint-disable max-len */

interface ICtorParamsMock {
    contents?: Model;
    columnSeparatorSize?: TColumnSeparatorSize;
    gridColumnsConfig: TColumns;
    columnsConfig?: TColumns;
}

function _getCtorParamsMock(params: ICtorParamsMock): Required<ICtorParamsMock> {
    return {
        contents: extractParam(
            params,
            'contents',
            new Model({
                rawData: { key: 1 },
                keyProperty: 'key',
            })
        ),
        gridColumnsConfig: params.gridColumnsConfig,
        columnsConfig: extractParam(params, 'columnsConfig', params.gridColumnsConfig),
        columnSeparatorSize: extractParam(params, 'columnSeparatorSize', null),
    };
}

function getCtorParamsMock(params: ICtorParamsMock): Required<ICtorParamsMock>;
function getCtorParamsMock<T extends GridCollection>(
    params: ICtorParamsMock & IOwnerMockParams,
    withOwner: true
): Required<ICtorParamsMock & { owner: T }>;
function getCtorParamsMock<T extends GridCollection>(
    params: ICtorParamsMock | (ICtorParamsMock & IOwnerMockParams),
    withOwner?: true
): Required<ICtorParamsMock> | Required<ICtorParamsMock & { owner: T }> {
    const ctorParams = _getCtorParamsMock(params);
    if (withOwner) {
        (ctorParams as Required<ICtorParamsMock & { owner: T }>).owner = _getOwnerMock<T>(params);
    }
    return ctorParams;
}

export { getCtorParamsMock };

/* eslint-enable max-len */

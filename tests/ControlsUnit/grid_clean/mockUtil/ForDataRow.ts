import type { TColumns, GridCollection, TColumnSeparatorSize } from 'Controls/grid';
import { Model } from 'Types/entity';

/* eslint-disable max-len */

// region Mock owner'a и параметров конструктора
interface IOwnerMockParams {
    gridColumnsConfig: TColumns;
    stickyColumnsCount?: number;
    index?: number;
    isFullGridSupport?: boolean;
    hasMultiSelectColumn?: boolean;
    hasItemActionsSeparatedCell?: boolean;
    hasColumnScroll?: boolean;
    hasSpacingColumn?: boolean;
    hasResizer?: boolean;
}

interface ICtorParamsMock {
    contents?: Model;
    columnSeparatorSize?: TColumnSeparatorSize;
    gridColumnsConfig: TColumns;
    columnsConfig?: TColumns;
}

function _getOwnerMock<T extends GridCollection>(params: IOwnerMockParams): T {
    return {
        getGridColumnsConfig: () => {
            return params.gridColumnsConfig;
        },
        hasColumnScrollReact: () => {
            return false;
        },
        getStickyColumnsCount: () => {
            return getParam(params, 'stickyColumnsCount', 0);
        },
        hasMultiSelectColumn: () => {
            return getParam(params, 'hasMultiSelectColumn', false);
        },
        hasItemActionsSeparatedCell: () => {
            return getParam(params, 'hasItemActionsSeparatedCell', false);
        },
        getIndex: () => {
            return getParam(params, 'index', 0);
        },
        hasColumnScroll: () => {
            return getParam(params, 'hasColumnScroll', false);
        },
        isFullGridSupport: () => {
            return getParam(params, 'isFullGridSupport', true);
        },
        hasSpacingColumn: () => {
            return getParam(params, 'hasSpacingColumn', false);
        },
        hasResizer: () => {
            return getParam(params, 'hasResizer', false);
        },
        notifyItemChange: jest.fn(),
        getItemEditorTemplateOptions: jest.fn(),
        getItemEditorTemplate: jest.fn(),
    } as unknown as T;
}

function _getCtorParamsMock(params: ICtorParamsMock): Required<ICtorParamsMock> {
    return {
        contents: getParam(
            params,
            'contents',
            new Model({
                rawData: { key: 1 },
                keyProperty: 'key',
            })
        ),
        gridColumnsConfig: params.gridColumnsConfig,
        columnsConfig: getParam(params, 'columnsConfig', params.gridColumnsConfig),
        columnSeparatorSize: getParam(params, 'columnSeparatorSize', null),
    };
}

// endregion

// region Вспомогательные методы, поддерживающие типизацию. Не нужно их трогать.

function getParam<TParams, TKey extends keyof TParams>(
    params: TParams,
    pName: TKey,
    defaultValue?: unknown
): TParams[TKey] {
    return (params.hasOwnProperty(pName)
        ? params[pName]
        : defaultValue) as unknown as TParams[TKey];
}

function getCtorParamsMock(params: ICtorParamsMock): Required<ICtorParamsMock>;
function getCtorParamsMock<T extends GridCollection>(
    params: ICtorParamsMock & IOwnerMockParams,
    withOwner: true
): Required<ICtorParamsMock & { owner: T }>;

function getCtorParamsMock<T extends GridCollection>(
    params: ICtorParamsMock | (ICtorParamsMock & IOwnerMockParams),
    withOwner?: true
) {
    const ctorParams = _getCtorParamsMock(params);
    if (withOwner) {
        (ctorParams as Required<ICtorParamsMock & { owner: T }>).owner = _getOwnerMock<T>(params);
    }
    return ctorParams;
}

// endregion

export { _getOwnerMock as getOwnerMock, getCtorParamsMock };
/* eslint-enable max-len */

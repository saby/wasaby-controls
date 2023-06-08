import type { GridCollection, IGridCollectionOptions } from 'Controls/grid';
import {
    ICollectionMockParams as IBaseCollectionMockParams,
    getCollectionMock as getBaseCollectionMock,
} from '../list/Collection';
import { extractParam } from '../helpers';
import { Model } from 'Types/entity';

export interface ICollectionMockParams extends IBaseCollectionMockParams {
    gridColumnsConfig: IGridCollectionOptions['columns'];
    headerConfig?: IGridCollectionOptions['header'];

    stickyColumnsCount?: IGridCollectionOptions['stickyColumnsCount'];
    index?: number;
    columnsCount?: number;
    isFullGridSupport?: boolean;
    hasMultiSelectColumn?: boolean;
    hasItemActionsSeparatedCell?: boolean;
    hasColumnScroll?: boolean;
    hasNewColumnScroll?: boolean;
    hasSpacingColumn?: boolean;
    hasResizer?: boolean;
    hasHeader?: boolean;
    hoverBackgroundStyle?: string;
    editingBackgroundStyle?: string;
    resultsPosition?: IGridCollectionOptions['resultsPosition'];
    isSticked?: boolean;
    stickyLadder?: unknown;
    stickyLadderProperties?: string[];
}

export function getCollectionMock<TData extends unknown>(
    params: ICollectionMockParams
): GridCollection<Model<TData>> {
    return {
        ...getBaseCollectionMock(params),
        getGridColumnsConfig: () => {
            return params.gridColumnsConfig;
        },
        getColumnsEnumerator: () => {
            return {
                getColumnsConfig: () => {
                    return params.gridColumnsConfig;
                },
            };
        },
        getHeaderConfig: () => {
            return params.headerConfig;
        },
        getStickyColumnsCount: () => {
            return extractParam(params, 'stickyColumnsCount', 0);
        },
        hasMultiSelectColumn: () => {
            return extractParam(params, 'hasMultiSelectColumn', false);
        },
        hasItemActionsSeparatedCell: () => {
            return extractParam(params, 'hasItemActionsSeparatedCell', false);
        },
        getIndex: () => {
            return extractParam(params, 'index', 0);
        },
        getColumnsCount: () => {
            return extractParam(params, 'columnsCount', 0);
        },
        hasColumnScroll: () => {
            return extractParam(params, 'hasColumnScroll', false);
        },
        hasNewColumnScroll: () => {
            return extractParam(params, 'hasNewColumnScroll', false);
        },
        isFullGridSupport: () => {
            return extractParam(params, 'isFullGridSupport', true);
        },
        hasSpacingColumn: () => {
            return extractParam(params, 'hasSpacingColumn', false);
        },
        hasResizer: () => {
            return extractParam(params, 'hasResizer', false);
        },

        getHoverBackgroundStyle: () => {
            return extractParam(params, 'hoverBackgroundStyle', undefined);
        },
        getEditingBackgroundStyle: () => {
            return extractParam(params, 'editingBackgroundStyle', undefined);
        },
        getResultsPosition: () => {
            return extractParam(params, 'resultsPosition', undefined);
        },
        hasHeader: () => {
            return extractParam(params, 'hasHeader', !!params.headerConfig);
        },
        isSticked: () => {
            return extractParam(params, 'isSticked', false);
        },
        getStickyLadder: () => {
            return extractParam(params, 'stickyLadder', undefined);
        },
        getStickyLadderProperties: () => {
            return extractParam(params, 'stickyLadderProperties', undefined);
        },
        getItemEditorTemplateOptions: jest.fn(),
        getItemEditorTemplate: jest.fn(),
        hasColumnScrollReact: () => {
            return false;
        },
    } as unknown as GridCollection<Model<TData>>;
}

import type { GridRow, IGridCollectionOptions, IGridOptions, IGridRowOptions } from 'Controls/grid';
import { extractParam } from '../helpers';
import { Model } from 'Types/entity';
import { getCollectionMock } from './Collection';

export interface IGetRowMockParams {
    gridColumnsConfig: IGridRowOptions['columnsConfig'];
    headerColumnsConfig?: object[];
    hasMultiSelectColumn?: boolean;
    multiSelectVisibility?: IGridRowOptions['multiSelectVisibility'];

    hoverBackgroundStyle?: string;
    editingBackgroundStyle?: string;
    fadedClass?: string;

    DisplayItemActions?: boolean;

    leftPadding?: IGridRowOptions['leftPadding'];
    rightPadding?: IGridRowOptions['rightPadding'];
    topPadding?: IGridRowOptions['topPadding'];
    bottomPadding?: IGridRowOptions['bottomPadding'];
    stickyLadder?: unknown;
    isDragged?: boolean;
    isActive?: boolean;
    isMarked?: boolean;
    isSticked?: boolean;
    rowSeparatorSize?: IGridRowOptions['rowSeparatorSize'];
    editingConfig?: IGridOptions['editingConfig'];
    shouldDisplayMarker?: boolean;
    columnIndex?: number;
    columnsCount?: number;
    isEditing?: boolean;
    hasColumnScroll?: boolean;
    itemActionsSeparatedCell?: boolean;
    isFullGridSupport?: boolean;
    isAnimatedForSelection?: boolean;
    contents?: Model;
    displayValue?: string;
    ladder?: unknown;
    searchValue?: string;
    isEditArrowVisible?: boolean;
    defaultDisplayValue?: string;
    isStickyHeader?: boolean;
    columnItems?: object[];
    hasVisibleActions?: boolean;
    shouldDisplayItemActions?: boolean;
    stickyLadderProperties?: string[];
    hasHeader?: boolean;
    hasResults?: boolean;
    resultsPosition?: IGridCollectionOptions['resultsPosition'];
    hasStickyGroup?: boolean;
    stickyLadderCellsCount?: number;
    columnScrollViewMode?: string;
}

export function getRowMock(params: IGetRowMockParams): GridRow {
    const get = (pName: keyof IGetRowMockParams, defaultValue: unknown) => {
        return extractParam(params, pName, defaultValue);
    };

    return {
        getOwner: () => {
            return getCollectionMock(params);
        },
        getGridColumnsConfig: () => {
            return params.gridColumnsConfig;
        },
        getContents: () => {
            return get('contents', undefined);
        },
        contents: get('contents', undefined),
        getDisplayValue: () => {
            return get('displayValue', undefined);
        },
        getLadder: () => {
            return get('ladder', undefined);
        },
        getStickyLadder: () => {
            return get('stickyLadder', undefined);
        },
        hasMultiSelectColumn: () => {
            return get('hasMultiSelectColumn', false);
        },
        getMultiSelectVisibility: () => {
            return get('multiSelectVisibility', 'hidden');
        },
        editArrowIsVisible: () => {
            return get('isEditArrowVisible', false);
        },
        getDefaultDisplayValue: () => {
            return get('defaultDisplayValue', undefined);
        },
        getStickyLadderProperties: () => {
            return get('stickyLadderProperties', undefined);
        },

        DisplayItemActions: get('DisplayItemActions', undefined),

        getHeaderConfig: () => {
            return get('headerColumnsConfig', undefined);
        },
        getHoverBackgroundStyle: () => {
            return get('hoverBackgroundStyle', undefined);
        },
        getEditingBackgroundStyle: () => {
            return get('editingBackgroundStyle', undefined);
        },
        getFadedClass: () => {
            return get('fadedClass', undefined);
        },
        getLeftPadding: () => {
            return get('leftPadding', 'default');
        },
        getRightPadding: () => {
            return get('rightPadding', 'default');
        },
        getTopPadding: () => {
            return get('topPadding', 'default');
        },
        getBottomPadding: () => {
            return get('bottomPadding', 'default');
        },
        isDragged: () => {
            return get('isDragged', false);
        },
        isActive: () => {
            return get('isActive', false);
        },
        isMarked: () => {
            return get('isMarked', false);
        },
        isSticked: () => {
            return get('isSticked', false);
        },
        getRowSeparatorSize: () => {
            return get('rowSeparatorSize', null);
        },
        getColumnIndex: () => {
            return get('columnIndex', 0);
        },
        getColumnsCount: () => {
            return get('columnsCount', params.gridColumnsConfig.length);
        },
        getEditingConfig: () => {
            return get('editingConfig', {});
        },
        isEditing: () => {
            return get('isEditing', false);
        },
        hasColumnScroll: () => {
            return get('hasColumnScroll', false);
        },
        hasItemActionsSeparatedCell: () => {
            return get('itemActionsSeparatedCell', false);
        },
        isFullGridSupport: () => {
            return get('isFullGridSupport', true);
        },
        isAnimatedForSelection: () => {
            return get('isAnimatedForSelection', undefined);
        },
        shouldDisplayMarker: () => {
            return get('shouldDisplayMarker', undefined);
        },
        shouldDisplayItemActions: () => {
            return get('shouldDisplayItemActions', undefined);
        },
        getSearchValue: () => {
            return get('searchValue', undefined);
        },
        isStickyHeader: () => {
            return get('isStickyHeader', false);
        },
        getColumns: () => {
            return get('columnItems', undefined);
        },
        hasVisibleActions: () => {
            return get('hasVisibleActions', false);
        },
        hasHeader: () => {
            return get('hasHeader', false);
        },
        hasResults: () => {
            return get('hasResults', false);
        },
        getResultsPosition: () => {
            return get('resultsPosition', undefined);
        },
        getGroupViewMode: () => {
            return 'default';
        },
        hasStickyGroup: () => {
            return get('hasStickyGroup', false);
        },
        getStickyLadderCellsCount: () => {
            return get('stickyLadderCellsCount', undefined);
        },
        getColumnScrollViewMode: () => {
            return get('columnScrollViewMode', undefined);
        },
        hasColumnScrollReact: () => {
            return false;
        },
    } as unknown as GridRow;
}

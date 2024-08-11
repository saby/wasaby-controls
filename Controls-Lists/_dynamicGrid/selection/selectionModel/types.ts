/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TItemKey, TColumnKey } from '../shared/types';
import { TSelectionMap } from 'Controls-Lists/_dynamicGrid/selection/shared/interface';

export interface ICellsSelectionModel {
    rootKey: TColumnKey;
    selectedKeys: TColumnKey[];
    firstColumnKey: TColumnKey;
    lastColumnKey: TColumnKey;

    isHidden: boolean;
    gridColumnStart: number | undefined;
    gridColumnEnd: number | undefined;

    hasSiblingUp: boolean;
    hasSiblingDown: boolean;
    prevItemKey?: TItemKey;
    nextItemKey?: TItemKey;
}

export interface IRowSelectionModel extends Record<TColumnKey, ICellsSelectionModel> {}

export interface IGridSelectionModel extends Record<TItemKey, IRowSelectionModel> {}

export type TColumnToRoot = Record<TItemKey, Record<TColumnKey, TColumnKey>>;

export type TSelectionBounds = {
    startItemKey: TItemKey;
    endItemKey: TItemKey;
    startColumnKey: TColumnKey;
    endColumnKey: TColumnKey;

    plainSelection: TSelectionMap;
};

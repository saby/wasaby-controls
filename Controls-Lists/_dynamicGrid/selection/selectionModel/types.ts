import { TItemKey, TColumnKey } from '../shared/types';

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

export interface ISelectionMap extends Record<TItemKey, TColumnKey[]> {}

export type TColumnToRoot = Record<TItemKey, Record<TColumnKey, TColumnKey>>;

export type TSelectionBounds = {
    startItemKey: TItemKey;
    endItemKey: TItemKey;
    startColumnKey: TColumnKey;
    endColumnKey: TColumnKey;

    plainSelection: ISelectionMap;
};

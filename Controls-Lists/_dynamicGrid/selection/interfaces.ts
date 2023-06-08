import * as React from 'react';

export type TItemKey = string;
export type TColumnKey = number;

export type TColumns = Date[];

export interface ISelection {
    rootKey: TColumnKey;
    selectedKeys: TColumnKey[];
    firstColumnKey: TColumnKey;
    lastColumnKey: TColumnKey;

    hasBorderTop: boolean;
    hasBorderBottom: boolean;
    gridColumnStart: number | undefined;
    gridColumnEnd: number | undefined;
}

export type TRowSelection = Record<TColumnKey, ISelection>;

export type THasSiblingForRowSelection = Record<
    TColumnKey,
    {
        up: boolean;
        down: boolean;
    }
>;

export type TGridRowSelection = {
    rowSelection: TRowSelection;
    hasSibling: THasSiblingForRowSelection;
};

export type TGridSelection = Record<TItemKey, TGridRowSelection>;

export type TPlainSelection = Record<TItemKey, TColumnKey[]>;

export interface IContextWithSelfRef<T> {
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}

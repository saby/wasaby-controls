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

export type TGridSelection = Record<
    TItemKey,
    {
        rowSelection: TRowSelection;
        hasSibling: Record<
            TColumnKey,
            {
                up: boolean;
                down: boolean;
            }
        >;
    }
>;

export interface IContextWithSelfRef<T> {
    contextRefForHandlersOnly: React.MutableRefObject<T>;
}

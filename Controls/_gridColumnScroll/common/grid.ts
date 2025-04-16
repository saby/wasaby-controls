import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { IGridViewProps } from 'Controls/grid';
import type { GridView } from 'Controls/grid';
import { executeSyncOrAsync } from 'UICommon/Deps';

export function getGrid() {
    if (!isLoaded('Controls/grid')) {
        executeSyncOrAsync(['Controls/listErrors'], (errs) => errs.GetGridError());
    }
    return loadSync<typeof import('Controls/grid')>('Controls/grid');
}

export function gridViewPropsAreEqual(
    prevProps: IGridViewProps,
    nextProps: IGridViewProps
): boolean {
    const grid = getGrid();
    return grid.gridViewPropsAreEqual(prevProps, nextProps);
}

export function getBaseView(): typeof GridView {
    return getGrid().GridView;
}

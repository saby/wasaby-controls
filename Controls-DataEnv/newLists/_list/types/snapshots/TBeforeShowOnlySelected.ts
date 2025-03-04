import type { ISelectionObject } from 'Controls-DataEnv/listTypes';
import type { Path } from 'Controls/dataSource';

export type TBeforeShowOnlySelected = ISelectionObject & {
    breadCrumbsItems?: Path;
};

import type { ISelectionObject } from 'Controls/interface';
import type { Path } from 'Controls/dataSource';

export type TBeforeShowOnlySelected = ISelectionObject & {
    breadCrumbsItems?: Path;
};

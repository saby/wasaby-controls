import { ISelectionObject } from 'Controls/interface';
import { Path } from 'Controls/dataSource';

export type TBeforeShowOnlySelected = ISelectionObject & {
    breadCrumbsItems?: Path;
};

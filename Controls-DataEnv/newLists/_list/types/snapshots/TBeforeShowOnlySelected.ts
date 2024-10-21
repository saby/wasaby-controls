/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ISelectionObject } from 'Controls/interface';
import type { Path } from 'Controls/dataSource';

export type TBeforeShowOnlySelected = ISelectionObject & {
    breadCrumbsItems?: Path;
};

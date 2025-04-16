import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';

export type TAppliedFrom = 'filterPopup' | 'filterPanel' | 'filterSearch';

/**
 * @private
 */
export default interface IFilterItemInternal extends IFilterDescriptionItem {
    appliedFrom?: TAppliedFrom;
    visibility?: boolean;
    textValueVisible?: boolean;
}

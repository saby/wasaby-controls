/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import {
    IFlatGetCountParams,
    getCount as getCountFlat,
} from 'Controls/_multiselection/Utils/Flat';
import {
    ITreeGetCountParams,
    getCount as getCountTree,
} from 'Controls/_multiselection/Utils/Tree';

export function getCount(
    params: IFlatGetCountParams | ITreeGetCountParams
): number | null {
    if ((params as ITreeGetCountParams).parentProperty) {
        return getCountTree(params as ITreeGetCountParams);
    } else {
        return getCountFlat(params as IFlatGetCountParams);
    }
}

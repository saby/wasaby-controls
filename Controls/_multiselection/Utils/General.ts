/**
 * @kaizen_zone b3b3d041-8fb2-4abe-a87a-caade6edf0de
 */
import { Utils as FlatUtils } from 'Controls/flatSelectionAspect';
import { Utils as HierarchyUtils } from 'Controls/hierarchySelectionAspect';

export function getCount(
    params: FlatUtils.IFlatGetCountParams | HierarchyUtils.ITreeGetCountParams
): number | null {
    if ((params as HierarchyUtils.ITreeGetCountParams).parentProperty) {
        return HierarchyUtils.getCount(params as HierarchyUtils.ITreeGetCountParams);
    } else {
        return FlatUtils.getCount(params as FlatUtils.IFlatGetCountParams);
    }
}

/**
 * @kaizen_zone 02f42333-cf50-42e8-bc08-b451cc483285
 */
import * as FlatUtils from '../SelectionStrategy/flat/Utils';
import * as HierarchyUtils from '../SelectionStrategy/hierarchy/Utils';

export function getCount(
    params: FlatUtils.IFlatGetCountParams | HierarchyUtils.ITreeGetCountParams
): number | null {
    if ((params as HierarchyUtils.ITreeGetCountParams).parentProperty) {
        return HierarchyUtils.getCount(params as HierarchyUtils.ITreeGetCountParams);
    } else {
        return FlatUtils.getCount(params as FlatUtils.IFlatGetCountParams);
    }
}

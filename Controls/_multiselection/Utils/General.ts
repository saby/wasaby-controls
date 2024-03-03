/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { Utils as FlatUtils } from 'Controls/flatSelectionAspect';
import { Utils as HierarchyUtils } from 'Controls/hierarchySelectionAspect';

export function getCount(params: FlatUtils.IFlatGetCountParams | HierarchyUtils.ITreeGetCountParams): number | null {
    if ((params as HierarchyUtils.ITreeGetCountParams).parentProperty) {
        return HierarchyUtils.getCount(params as HierarchyUtils.ITreeGetCountParams);
    } else {
        return FlatUtils.getCount(params as FlatUtils.IFlatGetCountParams);
    }
}

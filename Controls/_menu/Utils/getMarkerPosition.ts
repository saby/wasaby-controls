import { RecordSet } from 'Types/collection';
import { IMenuPopupOptions } from 'Controls/_menu/interface/IMenuPopup';
import { getIconInRoot } from 'Controls/_menu/Utils/getIconInRoot';

export function getMarkerPosition(
    items: RecordSet,
    {
        markerPosition,
        root,
        parentProperty,
    }: Pick<IMenuPopupOptions, 'root' | 'parentProperty' | 'markerPosition'>
): string {
    if (markerPosition) {
        return markerPosition;
    }
    return getIconInRoot(items, { root, parentProperty }) ? 'right' : 'left';
}

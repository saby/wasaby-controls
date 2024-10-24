import { Permission } from 'Permission/access';
import { TActionRights } from 'Controls-Actions/actions';

export function hasRights(rights: TActionRights): boolean {
    if (!rights || !rights.length) {
        return true;
    }

    return Permission.get(rights.map((right) => right.zone ?? right)).every((zone, index) => {
        const rightInfo = rights[index];
        let restriction;
        let requiredLevel;

        if (typeof rightInfo === 'object') {
            restriction = rightInfo?.restriction;
            requiredLevel = rightInfo?.requiredLevel;
        }
        if (restriction) {
            return zone.isModify() && zone.getRestriction(restriction).isRead();
        }
        if (requiredLevel === 'read') {
            return zone.isRead() || zone.getRestriction(restriction).isRead();
        }
        return zone.isModify();
    });
}

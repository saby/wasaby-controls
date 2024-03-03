/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { IExpandableOptions } from 'Controls/interface';

export default {
    _getExpanded(options: IExpandableOptions, expanded: boolean): boolean {
        if (options.hasOwnProperty('expanded')) {
            return options.expanded === undefined ? expanded : options.expanded;
        }
        return expanded;
    },
};

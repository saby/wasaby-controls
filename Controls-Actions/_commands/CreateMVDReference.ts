/**
 * Действие создания справки МВД
 * @class Controls-Actions/_commands/CreateMVDReference
 * @author Шишаков И.В.
 * @public
 */

import { constants } from 'Env/Env';
import { filterController } from 'Dashboard/new/loader';

export default class CreateMVDReference {
    execute(data: object): void {
        const filter = filterController.getFilter();
        let orgId = Number(filter.organization);
        orgId = orgId > 0 ? orgId : -1;
        if (constants.modules.EOMVD) {
            import('EOMVD/OldReportSetHelper').then((oldReportSetHelper) => {
                oldReportSetHelper.createReportSet({
                    orgId,
                    typeDoc: data.docType,
                    subTypeDoc: data.docSubType
                }, this);
            });
        }
    }
}

/**
 * Действие создания справки СТД-Р
 * @class Controls-Actions/_commands/CreateSTDR
 * @author Шишаков И.В.
 * @public
 */

import { constants } from 'Env/Env';
import { filterController } from 'Dashboard/new/loader';

export default class CreateSTDR {
    execute(): void {
        if (constants.modules.EOComplect) {
            const filter = filterController.getFilter();
            let orgId = Number(filter.organization);
            orgId = orgId > 0 ? orgId : -1;
            import('EOComplect/createFactory').then((createFactory) => {
                createFactory.createReport({
                    typeDocument: 'СправкиДляСотрудников',
                    subTypeDocument: 'СТД-Р',
                    orgId,
                    OpenByWasaby: true,
                    fillByMaxPriority: false,
                    Фиктивный: true
                }, this, {});
            });
        }
    }
}

/**
 * Действие создания справки о доходах (2-НДФЛ)
 * @class Controls-Actions/_commands/CreateSalary2NDFL
 * @author Шишаков И.В.
 * @public
 */

import { constants } from 'Env/Env';
import { filterController } from 'Dashboard/new/loader';

export default class CreateSalary2NDFL {
    execute(): void {
        if (constants.modules.EOComplect) {
            const filter = filterController.getFilter();
            let orgId = Number(filter.organization);
            orgId = orgId > 0 ? orgId : -1;
            import('EOComplect/createFactory').then((createFactory) => {
                createFactory.createReport({
                    typeDocument: 'СправкиДляСотрудников',
                    subTypeDocument: '1175018_БУ',
                    orgId,
                    OpenByWasaby: true,
                    fillByMaxPriority: false,
                    Фиктивный: true
                }, this, {});
            });
        }
    }
}

/**
 * Действие создания зарплатной справки
 * @class Controls-Actions/_commands/CreateSalaryReference
 * @author Шишаков И.В.
 * @public
 */

import { constants } from 'Env/Env';
import { filterController } from 'Dashboard/new/loader';

export default class CreateSalaryReference {
    execute(data: object): void {
        if (constants.modules.EntityChoice && constants.modules.Salary) {
            Promise.all([
                import('EntityChoice/Controller'),
                import('Salary/Report/Reference')
            ]).then(([ECController, Reference]) => {
                const filter = filterController.getFilter();
                const orgId = Number(filter.organization);
                ECController.getEntity(orgId).then((res) => {
                    const rec = res && res.getRow();
                    const isMgmtOrg = rec && !!rec.get('НашаОрганизация.УправленческийУчет');
                    Reference.create(data.referenceType, orgId, isMgmtOrg);
                });
            });
        }
    }
}


/**
 * Действие создания зарплатной справки
 * @class Controls-Actions/_commands/CreateSalaryReference
 * @author Шишаков И.В.
 * @public
 */

import { constants } from 'Env/Env';

export default class CreateSalaryReference {
    execute({docType}: {docType: string}): void {
        if (constants.modules.SalaryReports && constants.modules.Dashboard) {
            Promise.all([
                import('Dashboard/new/loader'),
                import('SalaryReports/references')
            ]).then(([{ filterController }, { openPanel }]): void => {
                const filter = filterController.getFilter();
                const orgId = (filter && filter.organization) ? Number(filter.organization) : -1;
                openPanel(this, {
                    docType,
                    organization: orgId
                });
            });
        }
    }
}


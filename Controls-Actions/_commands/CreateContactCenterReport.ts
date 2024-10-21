import { Control } from 'UI/Base';
import { TReportType } from './CreateContactCenterReport/ReportTypeEditor';
import { Date as EntityDate } from 'Types/entity';

const reportTypeToConfigMap: Record<TReportType, string> = {
    FrequentClients: 'ReclamationsStats/Reports/FrequentCustomers/FrequentCustomersReport',
    ReclamationCauses: 'ReclamationsStats/Reports/ReclamationCauses/ReclamationCausesReport',
    EmployeeStat: 'ReclamationsStats/Reports/EmployeeStatistics/EmployeeStatisticsReport',
    ExpiredByClients: 'ReclamationsStats/Reports/OverdueCustomerChats/OverdueCustomerChatsReport',
    ExpiredChatsByEmployees:
        'ReclamationsStats/Reports/OverdueEmployeeChats/OverdueEmployeeChatsReport',
    ChatLoad: 'ReclamationsStats/Reports/ChatLoad/ChatLoadReport',
    CallLoad: 'ReclamationsStats/Reports/CallLoad/CallLoadReport',
    FaqReport: 'Intent/helpers/report',
    ConsultationRates: 'ReclamationsStats/Reports/ConsultationRates/ConsultationRatesReport',
};

interface ICreateCRMReportOptions {
    reportType: TReportType;
}

/* eslint-disable ui-modules-dependencies */
/**
 * Действие создания отчета ContactCenter
 *
 * @public
 */
export default class CreateContactCenterReport {
    execute({ reportType }: ICreateCRMReportOptions, initiator: Control): void {
        if (reportType === 'FaqReport') {
            import(reportTypeToConfigMap[reportType]).then((reportHelper) => {
                return reportHelper.createReport();
            });
        } else {
            Promise.all([
                import('ReportBase/WarehouseReport/reportAPI'),
                import('Dashboard/new/loader'),
            ]).then(([reportAPI, Loader]: [unknown, unknown]) => {
                const filters = Loader.filterController.getFilter() || {};
                const startDate = filters.date ? new EntityDate(filters.date) : null;
                const endDate = filters.date ? new EntityDate(filters.dateTo) : null;
                new reportAPI.LightAPI().showReport(
                    initiator,
                    {
                        Ответственный: filters.Responsible
                            ? parseInt(filters.Responsible, 10)
                            : null,
                        ПериодНачало: startDate,
                        ПериодКонец: endDate,
                        ФильтрПериод: [startDate, endDate],
                    },
                    reportTypeToConfigMap[reportType],
                    {
                        useFilterPanel: true,
                    }
                );
            });
        }
    }
}
/* eslint-enable ui-modules-dependencies */

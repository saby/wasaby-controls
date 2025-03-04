import { Control } from 'UI/Base';
import { TReportType } from './CreateContactCenterReport/ReportTypeEditor';

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
    ConsultationRates: 'ReclamationsStats/Reports/consultationRates:Config',
};

interface ICreateCRMReportOptions {
    reportType: TReportType;
}

/* eslint-disable */
/* ui-modules-dependencies */
/**
 * Действие создания отчета ContactCenter
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
                import('Controls/dateUtils'),
                import('Types/entity'),
            ]).then(([reportAPI, Loader, dateUtils, entityLib]: unknown[]) => {
                const filters = Loader.filterController.getFilter() || {};
                const startDate = filters.date ? new entityLib.Date(filters.date) : null;
                const endDate = filters.dateTo ? new entityLib.Date(filters.dateTo) : null;
                const [startAnalyzeDate, endAnalyzeDate] = dateUtils.Range.shiftPeriod(
                    startDate,
                    endDate,
                    -1
                );
                new reportAPI.LightAPI().showReport(
                    initiator,
                    {
                        Ответственный: filters.Responsible
                            ? parseInt(filters.Responsible, 10)
                            : null,
                        ПериодНачало: startDate,
                        ПериодКонец: endDate,
                        ПериодНачалоАнализ: startAnalyzeDate,
                        ПериодНачалоКонец: endAnalyzeDate,
                        ФильтрПериод: [startDate, endDate, startAnalyzeDate, endAnalyzeDate],
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

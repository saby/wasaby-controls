import { TReportType } from './CreateTelephonyReport/ReportTypeEditor';

interface ICreateTelephonyReportOptions {
    reportType: TReportType;
}

/**
 * Действие создания отчета Telephony
 * @public
 */
export default class CreateTelephonyReport {
    execute({ reportType }: ICreateTelephonyReportOptions): void {
        let reportTypeTemplate;
        switch (reportType) {
            case 'calls-new':
                reportTypeTemplate = 'Telephony_online/Reports/CallStatistics/CallStatisticsReport';
                break;
            case 'clients-new':
                reportTypeTemplate = 'Telephony_online/Reports/CallsByClient/CallsByClientReport';
                break;
            case 'employees-new':
                reportTypeTemplate = 'Telephony_online/Reports/EmployeeLoad/EmployeeLoadReport';
                break;
            case 'outlines-new':
                reportTypeTemplate = 'Telephony_online/Reports/LineLoad/LineLoadReport';
                break;
        }

        if (reportTypeTemplate) {
            import('ReportBase/WarehouseReport/reportAPI').then(({ LightAPI }) => {
                new LightAPI().showReport(
                    null,
                    {},
                    reportTypeTemplate,
                    { useFilterPanel: true }
                );
            });
        } else {
            import('Telephony_online/Reports/Helper').then((Helper) => {
                Helper.default.open(reportType);
            });
        }
    }
}
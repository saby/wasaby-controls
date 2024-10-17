import { TOFDReportType } from './CreateOFDReport/ReportTypeEditor';

interface ICreateOFDReportOptions {
    reportType: TOFDReportType;
}

/**
 * Действие открытия панели выгрузки отчетов из ОФД
 * @public
 */
export default class CreateOFDReport {
    execute({ reportType }: ICreateOFDReportOptions): void {
        if (reportType === 'CreateErrorsReport') {
            import('OFDCore/problemsFD').then((problemsFD) => {
                problemsFD.Panel.show({opener: this}, {rnm: null});
            });
            return;
        }

        import('CashOFD/appMainPage').then(({ reportItemActivate }) => {
            reportItemActivate({ id: reportType });
        });
    }
}

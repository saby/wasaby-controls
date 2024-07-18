import {Control} from 'UI/Base';
import {IReportItem} from './OpenReportUtils';
import {Date as EntityDate} from 'Types/entity';
import {IContextValue} from 'Controls/context';

interface IOpenReportOptions {
    reportType: IReportItem;
}

/* eslint-disable */
/**
 * Действие создания отчета
 * @public
 */
export default class OpenReport {
    async execute({
                      reportType
                  }: IOpenReportOptions, initiator: Control, _, contextData: IContextValue): Promise<void> {
        const {LightAPI} = await import('ReportBase/WarehouseReport/reportAPI');

        new LightAPI().showReport(initiator, reportType.filter, reportType.config, {
            useFilterPanel: true,
            isWidget: true,
        });

    }
}
/* eslint-enable */

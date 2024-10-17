import { Control } from 'UI/Base';
import { TReportType } from './CreateBuhReport/ReportTypeEditor';
import { Date as EntityDate } from 'Types/entity';
// Журнал-ордер подобные отчеты
const JWReports = ['JournalWarrant', 'BalanceAndTurnovers', 'AccountBalance', 'AccountTurnovers'];

interface IPeriodFilterData {
    start: EntityDate;
    end: EntityDate;
}
/**
 * Получить путь до FullConfig отчета
 * @param report - название отчета
 */
function getFullConfigPath(report: string): string {
    if (JWReports.includes(report)) {
        return 'AccountingReports/Wasaby/Reports/JournalWarrant/' + report + '/FullConfig';
    } else if (report === 'Suppliers' || report === 'Buyers') {
        return 'AccountingReports/Wasaby/Reports/Debts/' + report + '/FullConfig';
    } else {
        return 'AccountingReports/Wasaby/Reports/' + report + '/FullConfig';
    }
}

/**
 * Формирование значений фильтра по периоду по умолчанию соответственно отчету
 */
function getDefaultPeriodForReports(): { [key: string]: IPeriodFilterData } {
    const currYear = new EntityDate().getFullYear();
    const currMonth = new EntityDate().getMonth();
    const currDay = new EntityDate().getDate();
    const currDayValue = new EntityDate(currYear, currMonth, currDay);
    const currMonthStartValue = new EntityDate(currYear, currMonth, 1);
    const currMonthEndValue = new EntityDate(currYear, currMonth + 1, 0);
    const lastMonth = 11;
    const lastMonthDay = 31;
    const currentYear = {
        start: new EntityDate(currYear, 0, 1),
        end: new EntityDate(currYear, lastMonth, lastMonthDay),
    };
    return {
        // Текущий год
        TurnoverSheet: currentYear,
        // Текущий месяц
        JournalWarrant: { start: currMonthStartValue, end: currMonthEndValue },
        ENS: currentYear,
        BalanceAndTurnovers: { start: currMonthStartValue, end: currMonthEndValue },
        AccountTurnovers: { start: currMonthStartValue, end: currMonthEndValue },
        CardAccount: { start: currMonthStartValue, end: currMonthEndValue },
        AccountAnalysis: { start: currMonthStartValue, end: currMonthEndValue },
        ReviseWarehouse: { start: currMonthStartValue, end: currMonthEndValue },
        TurnoversReport: { start: currMonthStartValue, end: currMonthEndValue },
        // Текущая дата
        AccountBalance: { start: currDayValue, end: currDayValue },
        ActOfReconciliation: { start: new EntityDate(currYear, 0, 1), end: currDayValue },
    };
}

/**
 * Получение значения фильтра по периоду по умолчанию
 * @param reportNameId
 */
function getPeriodFilter(reportNameId: string): IPeriodFilterData {
    return getDefaultPeriodForReports()[reportNameId];
}

interface ICreateCRMReportOptions {
    reportType: TReportType;
}

/**
 * Действие создания бухгалтерского отчета
 * @public
 */
export default class CreateCRMReport {
    async execute({ reportType }: ICreateCRMReportOptions, initiator: Control): Promise<void> {
        const { LightAPI } = await import('ReportBase/WarehouseReport/reportAPI');
        const { filterController } = await import('Dashboard/new/loader');
        const { initActOrgData, initOrgData, getOrgData, getActOrgData } = await import(
            'AccountingReports/Wasaby/orgSetter'
        );
        // инициализируем синглтон для корректной подстановки организаций
        if (reportType === 'ActOfReconciliation') {
            if (!getActOrgData()) {
                await initActOrgData();
            }
        } else {
            if (!getOrgData()) {
                await initOrgData();
            }
        }
        const filters = filterController.getFilter();
        const reportFilters = {
            Flags: { Accounting: true },
            // специальная опция для виджетов, где используются Отчеты - подгружаем данные из истории при открытии
            periodFromHistory: undefined,
            ФильтрПериод: undefined,
            ПериодНачало: undefined,
            ПериодКонец: undefined,
            ФильтрНашаОрганизация: filters?.organization ? [filters.organization] : [],
        };
        if (filters?.date && filters?.dateTo) {
            let start = filters.date;
            const end = filters.dateTo;
            // для отчета Сальдо по счету нужна дата в формате 'день', берем последний день из периода в качестве даты
            if (reportType === 'AccountBalance') {
                start = filters.dateTo;
            }
            reportFilters.ПериодНачало = start;
            reportFilters.ПериодКонец = end;
            reportFilters.ФильтрПериод = [start, end];
        } else {
            if (getPeriodFilter(reportType)) {
                const { start, end } = getPeriodFilter(reportType);
                reportFilters.periodFromHistory = true;
                reportFilters.ФильтрПериод = [start, end];
                reportFilters.ПериодНачало = start;
                reportFilters.ПериодКонец = end;
            }
        }
        const fullConfig = getFullConfigPath(reportType);
        const options = {
            useFilterPanel: true,
        };
        // Для остальных отчетов открытие сразу через панель фильтров
        new LightAPI().showReport(initiator, reportFilters, fullConfig, options);
    }
}

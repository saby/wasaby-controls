import { Control } from 'UI/Base';
import { TReportType } from './CreateCRMReport/ReportTypeEditor';
import { Date as EntityDate } from 'Types/entity';
import { RecordSet } from 'Types/entity';
import { Feature } from 'Feature/feature';
import { IContextValue } from 'Controls/context';

const reportTypeToConfigMap: Record<TReportType, string> = {
    PurchaseFunnel: 'CRMClientsList/Reports/PurchaseFunnel/PurchaseFunnelReport',
    DynamicOfActivities: 'CRMClientsList/Reports/ActivitiesDynamic/ActivitiesDynamicReport',
    PaymentsAndShipments: 'CRMClientsList/Reports/PaymentAndShipment/PaymentAndShipmentReport',
    ManagerLeads: 'CRMClientsList/Reports/ManagerLeads/ManagerLeadsReport',
    ProcessingOfScheduled: 'CRMClientsList/Reports/ProcessingPlanned/ProcessingPlannedReport',
    ProcessingOfLeads: 'CRMClientsList/Reports/ProcessingLeads/ProcessingLeadsReport',
    LeadsDynamic: 'CRMClientsList/Reports/LeadsDynamic/LeadsDynamicReport',
    SalesSources: 'CRMClientsList/Reports/SalesSources/SalesSourcesReport',
    ProcessingTask: 'CRMClientsList/Reports/ProcessingTasks/ProcessingTasksReport',
    TaskDynamic: 'CRMClientsList/Reports/TasksDynamic/TasksDynamicReport',
    ProcessingSpeedLeads: 'CRMClientsList/Reports/ProcessingSpeedLeads/ProcessingSpeedLeadsReport',
    ProcessingSpeedTasks: 'CRMClientsList/Reports/ProcessingSpeedTasks/ProcessingSpeedTasksReport',
    OverdueLeads: 'CRMClientsList/Reports/OverdueLeads/OverdueLeadsReport',
    OverdueTasks: 'CRMClientsList/Reports/OverdueTasks/OverdueTasksReport',
    LeadsInProgress: 'CRMClientsList/Reports/LeadsInProgress/LeadsInProgressReport',
    ABCAnalysis:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ABCAnalysis/ABCAnalysisReport',
    Balances: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Balances/BalancesReport',
    BalancesAnalytic:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/BalancesAnalytic/BalancesAnalyticReport',
    BuyersReturns:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/BuyersReturns/BuyersReturnsReport',
    ClientSales:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ClientSales/ClientSalesReport',
    EmployeeSales:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/EmployeeSales/EmployeeSalesReport',
    Invoice: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Invoice/InvoiceReport',
    MarkupControl:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/MarkupControl/MarkupControlReport',
    NonTradables:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/NonTradables/NonTradablesReport',
    OperationsCosts:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/OperationsCosts/OperationsCostsReport',
    PriceDynamics:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/PriceDynamics/PriceDynamicsReport',
    Product: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Product/ProductReport',
    Purchases:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Purchases/PurchasesReport',
    Reserve: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Reserve/ReserveReport',
    ReserveOutBill:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ReserveOutBill/ReserveOutBillReport',
    Sales: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Sales/SalesReport',
    SalesComparison:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SalesComparison/SalesComparisonReport',
    SecuringOrders:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SecuringOrders/SecuringOrdersReport',
    ShelfLife:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ShelfLife/ShelfLifeReport',
    StockBalances:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/StockBalances/StockBalancesReport',
    SuppliersReturns:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SuppliersReturns/SuppliersReturnsReport',
    Turnovers:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Turnovers/TurnoversReport',
    Uncalculated:
        'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Uncalculated/UncalculatedReport'
};

interface ICreateCRMReportOptions {
    reportType: TReportType;
}
/* eslint-disable */
/**
 * Действие создания отчета CRM
 *
 * @public
 */
export default class CreateCRMReport {
    async execute({reportType }: ICreateCRMReportOptions, initiator: Control, _, contextData: IContextValue): void {
        const { Utils } = await import('ReportBase/WarehouseReport/reportUtils');

        Promise.all([
            import('ReportBase/WarehouseReport/reportAPI'),
            import('Dashboard/new/loader'),
            import('CRM/Tools/Openers/ThemeList'),
            Utils.getComponentStatus('ИСТОЧНИКИ_ПРОДАЖ'),
        ]).then(
            ([
                 reportAPI,
                 Loader,
                 {openDialog},
                 salesSourcesIsOn
             ]: [unknown, unknown, unknown, unknown]) => {
                // Блокируем открытие недоступных отчетов
                if (!salesSourcesIsOn && reportType === 'SalesSources') {
                    return;
                }

                // Получаем из контекста данных ответственного, переданного с карточки сотрудника
                const employees = contextData.contentData?.getFilter().employees;

                const filters = Loader.filterController.getFilter() || {};
                const startDate = filters.date ? new EntityDate(filters.date) : null;
                const endDate = filters.date ? new EntityDate(filters.dateTo) : null;
                const reportFilters = {
                    Ответственный: employees ? parseInt(employees, 10) : (filters.employees ? parseInt(filters.employees, 10) : null),
                    ФильтрНашаОрганизация: filters.organization ? [filters.organization] : null,
                    ПериодНачало: startDate,
                    ПериодКонец: endDate,
                };
                const fullConfig = reportTypeToConfigMap[reportType];
                const options = {
                    useFilterPanel: true,
                };
                const ReportNewAPI = reportAPI.LightAPI;

                // Открываем диалог выбора темы перед открытием воронки продаж
                if (reportType === 'PurchaseFunnel') {
                    openDialog({
                        opener: initiator,
                        templateOptions: {
                            keyProperty: '@Регламент',
                            multiSelect: false,
                            expandByItemClick: true,
                            selectDescendants: true,
                            config: {
                                searchInHeader: true,
                            },
                        },
                        eventHandlers: {
                            onResult: (items: RecordSet) => {
                                reportFilters.Регламенты = [items.at(0).getKey()];
                                new ReportNewAPI().showReport(
                                    initiator,
                                    reportFilters,
                                    fullConfig,
                                    options
                                );
                            },
                        },
                    });
                } else {
                    // Для остальных отчетов открытие сразу через панель фильтров
                    new ReportNewAPI().showReport(initiator, reportFilters, fullConfig, options);
                }
            }
        );
    }
}
/* eslint-enable */

import { Memory } from 'Types/source';
import { isEqual } from 'Types/object';
import { DataSet, SbisService } from 'Types/source';
import { Permission } from 'Permission/access';
import * as rk from 'i18n!Controls-Actions';

/**
 * Интерфейс записи отчета
 * @public
 */
export interface IReportItem {
    /**
     * @cfg {String} Идентификатор
     */
    id: string;
    /**
     * @cfg {Boolean} Признак, что запись является разделом
     */
    'parent@': boolean;
    /**
     * @cfg {String} Идентификатор родительской записи
     */
    parent: string;
    /**
     * @cfg {String} Отображаемое имя
     */
    title: string;
    /**
     * @cfg {String} Путь до конфигурации отчета
     */
    config: string;
    /**
     * @cfg {Array.<String>} Список фич, под которыми доступен отчет
     */
    feature: string[];
    /**
     * @cfg {Array.<String>} Массив зон доступа. Через символ '|' указывается ограничение зоны доступа.
     */
    rights: string[];
    /**
     * @cfg {String} Путь до конфигурации отчета
     */
    action: string;
    /**
     * @cfg {String} Название компонента, к которому привязан отчет
     */
    componentName: string;
    /**
     * @cfg {Boolean} Признак проверки фич на недоступность
     */
    reverseFeatureCheck: boolean;
}

// Полный список отчетов
const REPORT_FULL_LIST = [
    {
        id: 'Business',
        'parent@': true,
        title: rk('Бизнес'),
        parent: null,
        config: null,
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'CRM',
        'parent@': true,
        title: 'CRM',
        parent: null,
        config: null,
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Tasks',
        'parent@': true,
        title: rk('Задачи'),
        parent: null,
        config: null,
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Accounting',
        'parent@': true,
        title: rk('Бухгалтерия'),
        parent: null,
        config: null,
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'CallCenter',
        'parent@': true,
        title: rk('Контакт-центр'),
        parent: null,
        config: null,
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Telephony',
        'parent@': true,
        title: rk('Телефония'),
        parent: null,
        config: null,
        feature: ['telephony_reports'],
        reverseFeatureCheck: false,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Sales',
        'parent@': null,
        parent: 'Business',
        title: rk('Продажи за период'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Sales/SalesReport',
        feature: ['whs_sales_union'],
        reverseFeatureCheck: true,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'SalesComparison',
        'parent@': null,
        parent: 'Business',
        title: rk('Сравнение продаж'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SalesComparison/SalesComparisonReport',
        feature: ['whs_sales_union'],
        reverseFeatureCheck: true,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'SalesUnion',
        'parent@': null,
        parent: 'Business',
        title: rk('Продажи'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Sales/SalesReportUnion',
        feature: ['whs_sales_union'],
        reverseFeatureCheck: false,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'ClientSales',
        'parent@': null,
        parent: 'Business',
        title: rk('Продажи по клиентам'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ClientSales/ClientSalesReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'BuyersReturns',
        'parent@': null,
        parent: 'Business',
        title: rk('Возвраты от покупателей'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/BuyersReturns/BuyersReturnsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'Invoice',
        'parent@': null,
        parent: 'Business',
        title: rk('Выставленные счета'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Invoice/InvoiceReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Выставленные счета'],
        action: null,
        componentName: null,
    },
    {
        id: 'ReserveOutBill',
        'parent@': null,
        parent: 'Business',
        title: rk('Счета в резерве'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ReserveOutBill/ReserveOutBillReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Выставленные счета'],
        action: null,
        componentName: null,
    },
    {
        id: 'ABCAnalysis',
        'parent@': null,
        parent: 'Business',
        title: rk('АВС / XYZ-анализ'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ABCAnalysis/ABCAnalysisReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'EmployeeSales',
        'parent@': null,
        parent: 'Business',
        title: rk('Продажи по сотрудникам'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/EmployeeSales/EmployeeSalesReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам'],
        action: null,
        componentName: null,
    },
    {
        id: 'SecuringOrders',
        'parent@': null,
        parent: 'Business',
        title: rk('Обеспечение заказов'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SecuringOrders/SecuringOrdersReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'Purchases',
        'parent@': null,
        parent: 'Business',
        title: rk('Закупки за период'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Purchases/PurchasesReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'SuppliersReturns',
        'parent@': null,
        parent: 'Business',
        title: rk('Возвраты поставщикам'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/SuppliersReturns/SuppliersReturnsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'BalancesAnalytic',
        'parent@': null,
        parent: 'Business',
        title: rk('Потребности'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/BalancesAnalytic/BalancesAnalyticReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Анализ запасов', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'MarkupControl',
        'parent@': null,
        parent: 'Business',
        title: rk('Контроль наценки'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/MarkupControl/MarkupControlReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по закупкам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'PriceDynamics',
        'parent@': null,
        parent: 'Business',
        title: rk('Динамика цен'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/PriceDynamics/PriceDynamicsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по закупкам', 'Catalog|ViewingBalances', 'Себестоимость'],
        action: null,
        componentName: null,
    },
    {
        id: 'Balances',
        'parent@': null,
        parent: 'Business',
        title: rk('Остатки на дату'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Balances/BalancesReport',
        feature: ['whs_balances_union'],
        reverseFeatureCheck: true,
        rights: ['Отчет по остаткам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'StockBalances',
        'parent@': null,
        parent: 'Business',
        title: rk('Остатки по складам'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/StockBalances/StockBalancesReport',
        feature: ['whs_balances_union'],
        reverseFeatureCheck: true,
        rights: ['Отчет по остаткам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'BalancesUnion',
        'parent@': null,
        parent: 'Business',
        title: rk('Остатки'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Balances/BalancesReportUnion',
        feature: ['whs_balances_union'],
        reverseFeatureCheck: false,
        rights: ['Отчет по остаткам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'Reserve',
        'parent@': null,
        parent: 'Business',
        title: rk('Зарезервированные'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Reserve/ReserveReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по остаткам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'Uncalculated',
        'parent@': null,
        parent: 'Business',
        title: rk('Непросчитанные'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Uncalculated/UncalculatedReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по списаниям', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'ShelfLife',
        'parent@': null,
        parent: 'Business',
        title: rk('По срокам годности'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/ShelfLife/ShelfLifeReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по остаткам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'NonTradables',
        'parent@': null,
        parent: 'Business',
        title: rk('Неходовые товары'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/NonTradables/NonTradablesReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по продажам', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'Turnovers',
        'parent@': null,
        parent: 'Business',
        title: rk('Обороты и динамика'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Turnovers/TurnoversReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет оборотная ведомость', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'Product',
        'parent@': null,
        parent: 'Business',
        title: rk('Товарный отчет'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Product/ProductReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет оборотная ведомость'],
        action: null,
        componentName: null,
    },
    {
        id: 'OperationsCosts',
        'parent@': null,
        parent: 'Business',
        title: rk('Расходы по операциям'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/OperationsCosts/OperationsCostsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет по списаниям'],
        action: null,
        componentName: null,
    },
    {
        id: 'PurchaseFunnel',
        'parent@': null,
        parent: 'CRM',
        title: rk('Воронка продаж'),
        config: 'CRMClientsList/Reports/purchaseFunnel:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: 'CRMClientsList/Reports/purchaseFunnel:OpenAction',
        componentName: null,
    },
    {
        id: 'ProcessingOfLeads',
        'parent@': null,
        parent: 'CRM',
        title: rk('Обработка сделок'),
        config: 'CRMClientsList/Reports/processingLeads:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'DynamicOfActivities',
        'parent@': null,
        parent: 'CRM',
        title: rk('Динамика активностей'),
        config: 'CRMClientsList/Reports/activitiesDynamic:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'PaymentsAndShipments',
        'parent@': null,
        parent: 'CRM',
        title: rk('Оплаты и отгрузки'),
        config: 'CRMClientsList/Reports/paymentAndShipment:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ManagerLeads',
        'parent@': null,
        parent: 'CRM',
        title: rk('Сделки по менеджерам'),
        config: 'CRMClientsList/Reports/managerLeads:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'SalesSources',
        'parent@': null,
        parent: 'CRM',
        title: rk('Источники продаж'),
        config: 'CRMClientsList/Reports/salesSources:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: 'ИСТОЧНИКИ_ПРОДАЖ',
    },
    {
        id: 'ProcessingOfScheduled',
        'parent@': null,
        parent: 'CRM',
        title: rk('Обработка плановых'),
        config: 'CRMClientsList/Reports/processingPlanned:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'LeadsDynamic',
        'parent@': null,
        parent: 'CRM',
        title: rk('Динамика поступления сделок'),
        config: 'CRMClientsList/Reports/leadsDynamic:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ProcessingSpeedLeads',
        'parent@': null,
        parent: 'CRM',
        title: rk('Скорость обработки сделок'),
        config: 'CRMClientsList/Reports/processingSpeedLeads:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'OverdueLeads',
        'parent@': null,
        parent: 'CRM',
        title: rk('Просроченные сделки'),
        config: 'CRMClientsList/Reports/overdueLeads:Config',
        feature: ['leads_in_progress'],
        reverseFeatureCheck: true,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'LeadsInProgress',
        'parent@': null,
        parent: 'CRM',
        title: rk('Сделки по сроку'),
        config: 'CRMClientsList/Reports/leadsInProgress:Config',
        feature: ['leads_in_progress'],
        reverseFeatureCheck: false,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ThemesBySources',
        'parent@': null,
        parent: 'CRM',
        title: rk('Темы по источникам'),
        config: 'CRMClientsList/Reports/themesBySources:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: 'ИСТОЧНИКИ_ПРОДАЖ',
    },
    {
        id: 'ProcessingTask',
        'parent@': null,
        parent: 'Tasks',
        title: rk('Обработка задач'),
        config: 'CRMClientsList/Reports/processingTasks:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'TaskDynamic',
        'parent@': null,
        parent: 'Tasks',
        title: rk('Динамика поступления задач'),
        config: 'CRMClientsList/Reports/tasksDynamic:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ProcessingSpeedTasks',
        'parent@': null,
        parent: 'Tasks',
        title: rk('Скорость обработки задач'),
        config: 'CRMClientsList/Reports/processingSpeedTasks:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'OverdueTasks',
        'parent@': null,
        parent: 'Tasks',
        title: rk('Просроченные задачи'),
        config: 'CRMClientsList/Reports/overdueTasks:Config',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'TurnoverSheet',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Оборотная ведомость'),
        config: 'AccountingReports/Wasaby/Reports/TurnoverSheet/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'BalanceAndTurnovers',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Сальдо и обороты'),
        config: 'AccountingReports/Wasaby/Reports/JournalWarrant/BalanceAndTurnovers/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'AccountBalance',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Сальдо по счету'),
        config: 'AccountingReports/Wasaby/Reports/JournalWarrant/AccountBalance/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'AccountTurnovers',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Обороты по счету'),
        config: 'AccountingReports/Wasaby/Reports/JournalWarrant/AccountTurnovers/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'CardAccount',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Карточка счета'),
        config: 'AccountingReports/Wasaby/Reports/CardAccount/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'AccountAnalysis',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Анализ счета'),
        config: 'AccountingReports/Wasaby/Reports/AccountAnalysis/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'JournalWarrant',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Журнал-ордер'),
        config: 'AccountingReports/Wasaby/Reports/JournalWarrant/JournalWarrant/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ENS',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Движение по ЕНС'),
        config: 'AccountingReports/Wasaby/Reports/ENS/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'ActOfReconciliation',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Акт сверки'),
        config: 'AccountingReports/Wasaby/Reports/ActOfReconciliation/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Suppliers',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Поставщики'),
        config: 'AccountingReports/Wasaby/Reports/Debts/Suppliers/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'Buyers',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Покупатели'),
        config: 'AccountingReports/Wasaby/Reports/Debts/Buyers/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'TurnoversBuh',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Ведомость по складу'),
        config: 'Warehouse_Stats/VDWarehouseReports/WarehouseReport/Reports/Turnovers/TurnoversReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['Отчет оборотная ведомость', 'Catalog|ViewingBalances'],
        action: null,
        componentName: null,
    },
    {
        id: 'ReviseWarehouse',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Сверка склада и бухучета'),
        config: 'AccountingReports/Wasaby/Reports/ReviseWarehouse/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: null,
        action: null,
        componentName: null,
    },
    {
        id: 'DDSDocumentReport',
        'parent@': null,
        parent: 'Accounting',
        title: rk('Движение денежных средств'),
        config: 'Registers/newDDS/_report/MainReport/FullConfig',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['РазводящаяДенег'],
        action: null,
        componentName: null,
    },
    {
        id: 'FrequentClients',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Обращения по клиентам'),
        config: 'ReclamationsStats/Reports/FrequentCustomers/FrequentCustomersReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'EmployeeStat',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Каналы чатов'),
        config: 'ReclamationsStats/Reports/EmployeeStatistics/EmployeeStatisticsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'ExpiredByClients',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Просроченные чаты по клиентам'),
        config: 'ReclamationsStats/Reports/OverdueCustomerChats/OverdueCustomerChatsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'FaqReport',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Отчет по вопросам клиентов'),
        config: 'Intent/helpers/report',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'ChatLoad',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Нагрузка по чатам'),
        config: 'ReclamationsStats/Reports/ChatLoad/ChatLoadReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'CallLoad',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Нагрузка по звонкам'),
        config: 'ReclamationsStats/Reports/CallLoad/CallLoadReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'ExpiredChatsByEmployees',
        'parent@': null,
        parent: 'CallCenter',
        title: rk('Просроченные чаты по сотрудникам'),
        config: 'ReclamationsStats/Reports/OverdueEmployeeChats/OverdueEmployeeChatsReport',
        feature: null,
        reverseFeatureCheck: null,
        rights: ['ContactCenterReports'],
        action: null,
        componentName: null,
    },
    {
        id: 'calls',
        'parent@': null,
        parent: 'Telephony',
        title: rk('Статистика звонков'),
        config: 'Telephony_online/Reports/CallStatistics/CallStatisticsReport',
        feature: ['telephony_reports'],
        reverseFeatureCheck: false,
        rights: ['Телефония'],
        action: null,
        componentName: null,
    },
    {
        id: 'clients',
        'parent@': null,
        parent: 'Telephony',
        title: rk('Звонки по клиентам'),
        config: 'Telephony_online/Reports/CallsByClient/CallsByClientReport',
        feature: ['telephony_reports'],
        reverseFeatureCheck: false,
        rights: ['Телефония'],
        action: null,
        componentName: null,
    },
    {
        id: 'employees',
        'parent@': null,
        parent: 'Telephony',
        title: rk('Загрузка сотрудников'),
        config: 'Telephony_online/Reports/EmployeeLoad/EmployeeLoadReport',
        feature: ['telephony_reports'],
        reverseFeatureCheck: false,
        rights: ['Телефония'],
        action: null,
        componentName: null,
    },
    {
        id: 'outlines',
        'parent@': null,
        parent: 'Telephony',
        title: rk('Нагрузка на линии'),
        config: 'Telephony_online/Reports/LineLoad/LineLoadReport',
        feature: ['telephony_reports'],
        reverseFeatureCheck: false,
        rights: ['Телефония'],
        action: null,
        componentName: null,
    },
];

/**
 * Возвращает источник данных с иерархическим списком всех отчетов
 * @author Чернакова Д.А.
 */
async function getReportsList(): Promise<Memory> {
    const rights = [];
    const features = [];

    // Получаем список всех ограничений и прав для проверки доступности
    REPORT_FULL_LIST.filter(
        (item: object) => item.rights !== null || item.feature !== null
    ).forEach((item: object) => {
        if (
            item.rights &&
            (rights.length === 0 || !rights.find((right) => isEqual(right, item.rights)))
        ) {
            rights.push(item.rights);
        }

        if (
            item.feature &&
            (features.length === 0 || !features.find((feature) => isEqual(feature, item.feature)))
        ) {
            features.push(item.feature);
        }
    });

    const componentsStatus = await getComponentsStatus();
    const rightsStatus = checkRights(rights);
    const featuresStatus = await checkFeatures(features);

    // Выбираем доступные отчеты
    const filteredReports = REPORT_FULL_LIST.filter((item) => {
        if (item.rights || item.feature || item.componentName) {
            const allowComponent = componentsStatus[item.componentName];
            const allowRights = rightsStatus.find((right) => isEqual(right.key, item.rights));
            const allowFeature = featuresStatus.find((feature) =>
                isEqual(feature.key, item.feature)
            );

            if (item.reverseFeatureCheck) {
                return (
                    (item.componentName ? allowComponent : true) &&
                    (item.rights ? allowRights?.allow || false : true) &&
                    (item.feature ? !allowFeature?.allow : true)
                );
            } else {
                return (
                    (item.componentName ? allowComponent : true) &&
                    (item.rights ? allowRights?.allow || false : true) &&
                    (item.feature ? allowFeature?.allow || false : true)
                );
            }
        } else {
            return true;
        }
    });

    return new Memory({
        data: filteredReports,
        keyProperty: 'id',
        filter: (item, where) => {
            return Object.keys(where).some((field) => {
                // При подтверждении выделения получаем все выделенные записи
                if (field === 'selection') {
                    const { marked, excluded } = where.selection.getRawData();
                    const itemKey = item.get('id');
                    const parentKey = item.get('parent');
                    // Исключаем разделы из выбора и выбираем все дочерние записи, учитывая отметку всех записей
                    if (!item.get('parent@')) {
                        const parentExist =
                            (marked.indexOf(parentKey) !== -1 || marked[0] === null) &&
                            excluded.indexOf(parentKey) === -1;
                        const itemExist =
                            (marked.indexOf(itemKey) !== -1 || marked[0] === null) &&
                            excluded.indexOf(itemKey) === -1 &&
                            excluded.indexOf(parentKey) === -1;
                        return parentExist || itemExist;
                    } else {
                        return false;
                    }
                } else {
                    const value = item.get(field);
                    const needed = String(where[field]).toLowerCase();
                    return String(value).toLowerCase().indexOf(needed) === 0;
                }
            });
        },
    });
}

/**
 * Метод, определяющий доступность по правам
 * @param rights список массив зон доступа
 */
function checkRights(rights: string[][]): object[] {
    const resultRights = [];
    // Проверяем все заданные права и ограничения на доступность
    rights.forEach((item) => {
        const allZones = [];
        item.forEach((area) => {
            // Получаем права на каждую зону отчета
            const [zone, restriction] = area.split('|');
            restriction
                ? allZones.push([Permission.get([zone])[0].getRestriction(restriction)])
                : allZones.push(Permission.get([zone]));
        });

        // Если есть хоть одна недоступная зона, запрещаем отчет к показу
        const deniedZone = allZones.find((zone) => !zone[0].isRead());
        resultRights.push({
            key: item,
            allow: !deniedZone,
        });
    });

    return resultRights;
}

/**
 * Метод проверяющий включенность фич
 * @param featureName название фич
 */
async function checkFeatures(features: string[][]): Promise<object[]> {
    const { Utils } = await import('ReportBase/WarehouseReport/reportUtils');
    const resultPromise = [];

    features.forEach((featureName) => {
        resultPromise.push(
            new Promise((resolve) => {
                Utils.featureIsOn(featureName).then((featureResult) => {
                    resolve({
                        key: featureName,
                        allow: featureResult,
                    });
                });
            })
        );
    });

    return Promise.all(resultPromise).then((result) => {
        return result;
    });
}

/**
 * Возвращет доступность всех компонентов
 */
function getComponentsStatus(): Promise<object> {
    return new Promise((resolve, reject) => {
        const obj = new SbisService({
            endpoint: 'Component',
        });
        obj.call('SwitchesWithConfig', {})
            .then((dataSet: DataSet) => {
                const rawStatusComponents = dataSet.getAll();
                resolve(rawStatusComponents.getRawData());
            })
            .catch((err: string) => {
                reject(err);
            });
    });
}

export { getReportsList };

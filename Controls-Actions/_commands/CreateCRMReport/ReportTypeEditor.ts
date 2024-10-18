import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import { Feature } from 'Feature/feature';
import * as rk from 'i18n!Controls-Actions';

import * as template from 'wml!Controls-Actions/_commands/CreateCRMReport/ReportTypeEditor';

export type TReportType =
    | 'PurchaseFunnel'
    | 'DynamicOfActivities'
    | 'PaymentsAndShipments'
    | 'ManagerLeads'
    | 'ProcessingOfScheduled'
    | 'ProcessingOfLeads'
    | 'LeadsDynamic'
    | 'SalesSources'
    | 'ProcessingTask'
    | 'TaskDynamic'
    | 'ABCAnalysis'
    | 'Balances'
    | 'BalancesAnalytic'
    | 'BuyersReturns'
    | 'ClientSales'
    | 'EmployeeSales'
    | 'Invoice'
    | 'MarkupControl'
    | 'NonTradables'
    | 'OperationsCosts'
    | 'PriceDynamics'
    | 'Product'
    | 'Purchases'
    | 'Reserve'
    | 'ReserveOutBill'
    | 'Sales'
    | 'SalesComparison'
    | 'SecuringOrders'
    | 'ShelfLife'
    | 'StockBalances'
    | 'SuppliersReturns'
    | 'Turnovers'
    | 'ProcessingSpeedLeads'
    | 'ProcessingSpeedTasks'
    | 'OverdueLeads'
    | 'OverdueTasks'
    | 'Uncalculated'
    | 'LeadsInProgress';

interface IOptions extends IControlOptions {
    propertyValue: TReportType;
}

const DEFAULT_CAPTION = rk('Тип отчета');

export default class ReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TReportType;
    protected _source: Memory;
    private _captionText: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
        this._setSource();
    }

    /**
     * Метод установки источника данных для выпадашки
     * @protected
     */
    protected async _setSource(): void {
        const reportList = [
            {
                id: 'CRM',
                '@parent': true,
                parent: null,
                title: 'CRM',
            },
            {
                id: 'Business',
                '@parent': true,
                parent: null,
                title: 'Бизнес',
            },
            {
                id: 'Tasks',
                '@parent': true,
                parent: null,
                title: 'Задачи',
            },
            {
                id: 'PurchaseFunnel',
                '@parent': false,
                parent: 'CRM',
                title: 'Воронка продаж',
            },
            {
                id: 'ProcessingOfLeads',
                '@parent': false,
                parent: 'CRM',
                title: 'Обработка сделок',
            },
            {
                id: 'DynamicOfActivities',
                '@parent': false,
                parent: 'CRM',
                title: 'Динамика активностей',
            },
            {
                id: 'PaymentsAndShipments',
                '@parent': false,
                parent: 'CRM',
                title: 'Оплаты и отгрузки',
            },
            {
                id: 'ManagerLeads',
                '@parent': false,
                parent: 'CRM',
                title: 'Сделки по менеджерам',
            },
            {
                id: 'ProcessingOfScheduled',
                '@parent': false,
                parent: 'CRM',
                title: 'Обработка плановых',
            },
            {
                id: 'LeadsDynamic',
                '@parent': false,
                parent: 'CRM',
                title: 'Динамика поступления сделок',
            },
            {
                id: 'ProcessingSpeedLeads',
                '@parent': false,
                parent: 'CRM',
                title: 'Скорость обработки сделок',
            },
            {
                id: 'LeadsInProgress',
                '@parent': false,
                parent: 'CRM',
                title: 'Сделки по сроку',
            },
            {
                id: 'ProcessingTask',
                '@parent': false,
                parent: 'Tasks',
                title: 'Обработка задач',
            },
            {
                id: 'TaskDynamic',
                '@parent': false,
                parent: 'Tasks',
                title: 'Динамика поступления задач',
            },
            {
                id: 'ProcessingSpeedTasks',
                '@parent': false,
                parent: 'Tasks',
                title: 'Скорость обработки задач',
            },
            {
                id: 'OverdueTasks',
                '@parent': false,
                parent: 'Tasks',
                title: 'Просроченные задачи',
            },
            {
                id: 'Sales',
                '@parent': false,
                parent: 'Business',
                title: 'Продажи за период',
            },
            {
                id: 'SalesComparison',
                '@parent': false,
                parent: 'Business',
                title: 'Сравнение продаж',
            },
            {
                id: 'ClientSales',
                '@parent': false,
                parent: 'Business',
                title: 'Продажи по клиентам',
            },
            {
                id: 'BuyersReturns',
                '@parent': false,
                parent: 'Business',
                title: 'Возвраты от покупателей',
            },
            {
                id: 'Invoice',
                '@parent': false,
                parent: 'Business',
                title: 'Выставленные счета',
            },
            {
                id: 'ReserveOutBill',
                '@parent': false,
                parent: 'Business',
                title: 'Счета в резерве',
            },
            {
                id: 'ABCAnalysis',
                '@parent': false,
                parent: 'Business',
                title: 'АВС / XYZ-анализ',
            },
            {
                id: 'EmployeeSales',
                '@parent': false,
                parent: 'Business',
                title: 'Продажи по сотрудникам',
            },
            {
                id: 'SecuringOrders',
                '@parent': false,
                parent: 'Business',
                title: 'Обеспечение заказов',
            },
            {
                id: 'Purchases',
                '@parent': false,
                parent: 'Business',
                title: 'Закупки за период',
            },
            {
                id: 'SuppliersReturns',
                '@parent': false,
                parent: 'Business',
                title: 'Возвраты поставщикам',
            },
            {
                id: 'BalancesAnalytic',
                '@parent': false,
                parent: 'Business',
                title: 'Потребности',
            },
            {
                id: 'MarkupControl',
                '@parent': false,
                parent: 'Business',
                title: 'Контроль наценки',
            },
            {
                id: 'PriceDynamics',
                '@parent': false,
                parent: 'Business',
                title: 'Динамика цен',
            },
            {
                id: 'Balances',
                '@parent': false,
                parent: 'Business',
                title: 'Остатки на дату',
            },
            {
                id: 'StockBalances',
                '@parent': false,
                parent: 'Business',
                title: 'Остатки по складам',
            },
            {
                id: 'Reserve',
                '@parent': false,
                parent: 'Business',
                title: 'Зарезервированные',
            },
            {
                id: 'Uncalculated',
                '@parent': false,
                parent: 'Business',
                title: 'Непросчитанные',
            },
            {
                id: 'ShelfLife',
                '@parent': false,
                parent: 'Business',
                title: 'По срокам годности',
            },
            {
                id: 'NonTradables',
                '@parent': false,
                parent: 'Business',
                title: 'Неходовые товары',
            },
            {
                id: 'Turnovers',
                '@parent': false,
                parent: 'Business',
                title: 'Обороты и динамика',
            },
            {
                id: 'Product',
                '@parent': false,
                parent: 'Business',
                title: 'Товарный отчет',
            },
            {
                id: 'OperationsCosts',
                '@parent': false,
                parent: 'Business',
                title: 'Расходы по операциям',
            },
        ];

        const { Utils } = await import('ReportBase/WarehouseReport/reportUtils');

        // Получаем состояние всех проверяемых фич и формируем источник
        Promise.all([
            Utils.getComponentStatus('ИСТОЧНИКИ_ПРОДАЖ'),
        ]).then(([salesSourcesIsOn]: [unknown]) => {
            if (salesSourcesIsOn) {
                reportList.push({
                    id: 'SalesSources',
                    '@parent': false,
                    parent: 'CRM',
                    title: 'Источники продаж',
                });
            }

            this._source = new Memory({
                data: reportList,
                keyProperty: 'id',
            });

            const selectedReport = reportList.find((item) => {
                return item.id === this._selectedKey;
            });
            this._captionText = selectedReport ? selectedReport.title : DEFAULT_CAPTION;
        });
    }

    /**
     * Обработчик выбора пункта выпадающего меню
     * @param _ дескриптор события
     * @param item - выбранная запись
     * @protected
     */
    protected _menuItemActivate(_: Event, item: Record): boolean | void {
        // Не обрабатываем клик и прерываем закрытие если ткнули на раздел
        if (!item.get('parent')) {
            return false;
        } else {
            this._notify('propertyValueChanged', [item.get('id')], {
                bubbling: true,
            });
            this._captionText = item.get('title');
        }
    }
}

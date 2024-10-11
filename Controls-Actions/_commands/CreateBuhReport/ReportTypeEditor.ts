import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import * as rk from 'i18n!Controls-Actions';

import * as template from 'wml!Controls-Actions/_commands/CreateBuhReport/ReportTypeEditor';

export type TReportType =
    | 'ActOfReconciliation'
    | 'AccountAnalysis'
    | 'CardAccount'
    | 'JournalWarrant'
    | 'TurnoverSheet'
    | 'BalanceAndTurnovers'
    | 'AccountTurnovers'
    | 'AccountBalance'
    | 'ENS'
    | 'Buyers'
    | 'Suppliers'
    | 'ReviseWarehouse';

interface IOptions extends IControlOptions {
    propertyValue: TReportType;
}

const DEFAULT_CAPTION = rk('Тип отчета');

export default class ReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TReportType;
    protected _source: Memory;
    protected _captionText: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
        this._setSource();
    }

    /**
     * Метод установки источника данных для выпадающего списка
     * @protected
     */
    protected _setSource(): void {
        const reportList = [
            {
                id: 2,
                '@parent': false,
                parent: null,
                title: rk('Оборотная ведомость'),
                reportName: 'TurnoverSheet',
            },
            {
                id: 3,
                '@parent': false,
                parent: null,
                title: rk('Сальдо и обороты'),
                reportName: 'BalanceAndTurnovers',
            },
            {
                id: 4,
                '@parent': false,
                parent: null,
                title: rk('Сальдо по счету'),
                needMargin: false,
                reportName: 'AccountBalance',
            },
            {
                id: 5,
                '@parent': false,
                parent: null,
                title: rk('Обороты по счету'),
                needMargin: false,
                reportName: 'AccountTurnovers',
            },
            {
                id: 6,
                '@parent': false,
                parent: null,
                title: rk('Карточка счета'),
                reportName: 'CardAccount',
            },
            {
                id: 7,
                '@parent': false,
                parent: null,
                title: rk('Анализ счета'),
                reportName: 'AccountAnalysis',
            },
            {
                id: 8,
                '@parent': false,
                parent: null,
                title: rk('Журнал-ордер'),
                reportName: 'JournalWarrant',
            },
            {
                id: 9,
                '@parent': false,
                parent: null,
                title: rk('Движение по ЕНС'),
                reportName: 'ENS',
            },
            {
                id: 10,
                '@parent': false,
                parent: null,
                title: rk('Акт сверки'),
                reportName: 'ActOfReconciliation',
            },
            {
                id: 11,
                '@parent': false,
                parent: null,
                title: rk('Поставщики'),
                reportName: 'Suppliers',
            },
            {
                id: 12,
                '@parent': false,
                parent: null,
                title: rk('Покупатели'),
                reportName: 'Buyers',
            },
            {
                id: 13,
                '@parent': false,
                parent: null,
                title: rk('Сверка склада и бухучета'),
                reportName: 'ReviseWarehouse',
            },
        ];

        // Получаем состояние всех проверяемых фич и формируем источник
        this._source = new Memory({
            data: reportList,
            keyProperty: 'id',
        });

        const selectedReport = reportList.find((item) => {
            return item.reportName === this._selectedKey;
        });
        this._captionText = selectedReport ? selectedReport.title : DEFAULT_CAPTION;
    }

    /**
     * Обработчик выбора пункта выпадающего меню
     * @param _ дескриптор события
     * @param item - выбранная запись
     * @protected
     */
    protected _menuItemActivate(_: Event, item: Record): boolean | void {
        this._notify('propertyValueChanged', [item.get('reportName')], {
            bubbling: true,
        });
        this._captionText = item.get('title');
    }
}

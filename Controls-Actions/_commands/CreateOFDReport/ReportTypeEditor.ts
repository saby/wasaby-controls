import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Actions/_commands/CreateOFDReport/ReportTypeEditor';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls-Actions';
import { Model } from 'Types/entity';

export type TOFDReportType =
    | 'CreateReport'
    | 'CreateShiftReport'
    | 'CreateProceedsReport'
    | 'CreateKKTReport'
    | 'CreateErrorsReport';

interface IOptions extends IControlOptions {
    propertyValue: TOFDReportType;
}

const DEFAULT_CAPTION = rk('Тип отчета');

export default class ReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TOFDReportType;
    protected _items: RecordSet;
    private _captionText: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
        this._setData();
    }

    protected _setData(): void {
        const items = [
            {
                id: 'CreateReport',
                title: rk('Чеки'),
            },
            {
                id: 'CreateShiftReport',
                title: rk('Смены'),
            },
            {
                id: 'CreateProceedsReport',
                title: rk('Отчет арендодателю'),
            },
            {
                id: 'CreateKKTReport',
                title: rk('Реестр касс'),
            },
            {
                id: 'CreateErrorsReport',
                title: rk('Ошибки в чеках'),
            },
            {
                id: 'CreateReportSalesByProduct',
                title: rk('Продажи по товарам'),
            },
        ];

        this._items = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });

        const selectedReport = items.find((item) => {
            return item.id === this._selectedKey;
        });

        this._captionText = selectedReport ? selectedReport.title : DEFAULT_CAPTION;
    }

    /**
     * Обработчик выбора пункта выпадающего меню
     * @param event - событие
     * @param item - выбранная запись
     * @protected
     */
    protected _onMenuItemActivateHandler(event: Event, item: Model): boolean | void {
        this._notify('propertyValueChanged', [item.get('id')], {
            bubbling: true,
        });
        this._captionText = item.get('title');
    }
}

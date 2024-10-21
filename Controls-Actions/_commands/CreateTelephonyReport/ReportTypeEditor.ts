import { RecordSet } from 'Types/collection';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Actions/_commands/CreateTelephonyReport/ReportTypeEditor';

import * as rk from 'i18n!Controls-Actions';

export type TReportType =
    | 'calls'
    | 'clients'
    | 'employees'
    | 'outlines'
    | 'calls-new'
    | 'clients-new'
    | 'employees-new'
    | 'outlines-new';

interface IOptions extends IControlOptions {
    propertyValue: TReportType;
}

export default class TelephonyReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _selectedKey: TReportType;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
        const reportsData = [
            {
                id: 'calls',
                title: rk('Звонки')
            },
            {
                id: 'clients',
                title: rk('Клиенты')
            },
            {
                id: 'employees',
                title: rk('Сотрудники')
            },
            {
                id: 'outlines',
                title: rk('Линии')
            },
            {
                id: 'heatMap',
                title: rk('Звонки по часам')
            }
        ];
        this._items = new RecordSet({
            rawData: reportsData,
            keyProperty: 'id'
        });
    }

    protected _beforeUnmount(): void {
        this._items = null;
    }

    protected _selectedKeyChangedHandler(event: Event, selectedKey: TReportType): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }
}

import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';

import * as template from 'wml!Controls-Actions/_commands/CreateContactCenterReport/ReportTypeEditor';

export type TReportType =
    | 'ReclamationCauses'
    | 'EmployeeStat'
    | 'ExpiredByClients'
    | 'FaqReport'
    | 'ChatLoad'
    | 'CallLoad'
    | 'ExpiredChatsByEmployees'
    | 'FrequentClients'
    | 'ConsultationRates';

interface IOptions extends IControlOptions {
    propertyValue: TReportType;
}

export default class ContactCenterReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TReportType;
    protected _items: RecordSet;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
        this._items = new RecordSet({
            rawData: [
                {
                    id: 'FrequentClients',
                    title: 'Обращения по клиентам',
                },{
                    id: 'ReclamationCauses',
                    title: 'Статистика обращений',
                },
                {
                    id: 'EmployeeStat',
                    title: 'Каналы чатов',
                },
                {
                    id: 'ExpiredByClients',
                    title: 'Просроченные чаты по клиентам',
                },
                {
                    id: 'FaqReport',
                    title: 'Отчет по вопросам клиентов',
                },
                {
                    id: 'ChatLoad',
                    title: 'Нагрузка по чатам',
                },
                {
                    id: 'CallLoad',
                    title: 'Нагрузка по звонкам',
                },
                {
                    id: 'ExpiredChatsByEmployees',
                    title: 'Просроченные чаты по сотрудникам',
                },
                {
                    id: 'ConsultationRates',
                    title: 'Оценки консультаций',
                },
            ],
            keyProperty: 'id',
        });
    }

    protected _beforeUnmount(): void {
        this._items = null;
    }

    protected _selectedKeyChangedHandler(_: Event, selectedKey: number): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }
}

import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/Frequent/DateMenu/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Base } from 'Controls/dateUtils';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = null;
    protected _source: Memory = null;
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [
            {
                caption: 'Дата',
                name: 'date',
                editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
                resetValue: null,
                viewMode: 'frequent',
                textValue: '',
                value: null,
                emptyText: 'Весь период',
                editorOptions: {
                    closeButtonVisibility: 'hidden',
                    dateMenuItems: new RecordSet({
                        rawData: [
                            { id: 'Today', title: 'Сегодня' },
                            { id: 'Week', title: 'На этой неделе' },
                            { id: 'Month', title: 'В этом месяце' },
                        ],
                        keyProperty: 'id',
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    extendedCaption: 'Срок',
                    selectionType: 'single',
                },
            },
            {
                caption: 'Период',
                name: 'dateRange',
                editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
                resetValue: null,
                viewMode: 'frequent',
                textValue: '',
                value: null,
                emptyText: 'Весь период',
                editorOptions: {
                    closeButtonVisibility: 'hidden',
                    dateMenuItems: new RecordSet({
                        rawData: [
                            { id: 'Today', title: 'Сегодня' },
                            { id: 'Week', title: 'На этой неделе' },
                            { id: 'Month', title: 'В этом месяце' },
                            {
                                id: 'Overdue',
                                title: 'Просроченные',
                                frequent: true,
                            },
                        ],
                        keyProperty: 'id',
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
        ];

        this._viewSource = new Memory({
            data: [
                {
                    id: 'Новиков Д.В.',
                    title: 'Новиков Д.В.',
                    date: new Date(2022, 0, 7),
                },
                {
                    id: 'Кошелев А.Е.',
                    title: 'Кошелев А.Е.',
                    date: new Date(2022, 10, 1),
                },
                {
                    id: 'Субботин А.В.',
                    title: 'Субботин А.В.',
                    date: new Date(2022, 6, 14),
                },
            ],
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                let date = true;
                let dateRange = true;
                if (queryFilter.date instanceof Array) {
                    date = Base.isDatesEqual(
                        item.get('date'),
                        queryFilter.date[0]
                    );
                }
                if (queryFilter.dateRange instanceof Array) {
                    dateRange =
                        item.get('date') > queryFilter.dateRange[0] &&
                        item.get('date') < queryFilter.dateRange[1];
                }
                return date && dateRange;
            },
        });
    }
    static _styles: string[] = ['DemoStand/Controls-demo'];
}

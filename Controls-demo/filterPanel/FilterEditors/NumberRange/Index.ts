import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterEditors/NumberRange/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: object[] = [];
    protected _source: Memory = null;
    protected _gridColumns: object[] = [
        {
            displayProperty: 'title',
        },
        {
            displayProperty: 'amount',
        },
    ];

    protected _beforeMount(): void {
        const data = [
            { department: 'Разработка', title: 'Разработка', amount: 10 },
            {
                department: 'Продвижение СБИС',
                title: 'Продвижение СБИС',
                amount: 3,
            },
            {
                department: 'Федеральная клиентская служка',
                title: 'Федеральная клиентская служка',
                amount: 30,
            },
        ];
        this._source = new Memory({
            data,
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                let addToData = true;
                for (const filterField in queryFilter) {
                    if (
                        queryFilter.hasOwnProperty(filterField) &&
                        item.get(filterField)
                    ) {
                        const filterValue = queryFilter[filterField];
                        const itemValue = item.get(filterField);
                        addToData =
                            (itemValue >= filterValue[0] || !filterValue[0]) &&
                            (itemValue <= filterValue[1] || !filterValue[1]);
                    }
                }
                return addToData;
            },
        });
        this._filterButtonSource = [
            {
                caption: 'Количество сотрудников',
                name: 'amount',
                editorTemplateName:
                    'Controls/filterPanelExtEditors:NumberRangeEditor',
                resetValue: [],
                value: [],
                textValue: '',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}

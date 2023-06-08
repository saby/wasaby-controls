import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterEditors/DropdownEditor/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: object[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        const data = [
            { department: 'Разработка', title: 'Разработка' },
            { department: 'Продвижение СБИС', title: 'Продвижение СБИС' },
            {
                department: 'Федеральная клиентская служка',
                title: 'Федеральная клиентская служка',
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
                            filterValue.includes(itemValue) ||
                            !filterValue.length;
                    }
                }
                return addToData;
            },
        });
        this._filterButtonSource = [
            {
                caption: 'Отдел',
                name: 'department',
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                resetValue: [],
                value: ['Разработка'],
                textValue: '',
                viewMode: 'basic',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'department',
                        data,
                    }),
                    displayProperty: 'title',
                    keyProperty: 'department',
                    extendedCaption: 'Статус',
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}

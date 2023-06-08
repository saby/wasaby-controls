import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ViewMode/Extended/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = [];
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            data: [
                { department: 'Разработка', title: 'Разработка' },
                { department: 'Продвижение СБИС', title: 'Продвижение СБИС' },
                {
                    department: 'Федеральная клиентская служка',
                    title: 'Федеральная клиентская служка',
                },
            ],
            keyProperty: 'department',
            // Необходимо для работы фильтрации в Memory источнике по фильтру со сложными типами (не примитивами)
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
        this._filterSource = [
            {
                name: 'department',
                value: [],
                resetValue: [],
                editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'department',
                        data: [
                            { department: 'Разработка', title: 'Разработка' },
                            {
                                department: 'Продвижение СБИС',
                                title: 'Продвижение СБИС',
                            },
                            {
                                department: 'Федеральная клиентская служба',
                                title: 'Федеральная клиентская служба',
                            },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'department',
                    extendedCaption: 'Отдел',
                },
                viewMode: 'extended',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}

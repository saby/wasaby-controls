import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/SeparatorVisibility/Index';
import { Memory } from 'Types/source';

interface IFilter {
    department: string[];
}

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
            filter: (item, queryFilter: IFilter) => {
                return (
                    queryFilter.department?.includes(item.get('id')) ||
                    !queryFilter.department?.length
                );
            },
        });
        this._filterButtonSource = [
            {
                caption: 'Отдел',
                name: 'department',
                resetValue: null,
                value: null,
                textValue: '',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                separatorVisibility: 'hidden',
                editorOptions: {
                    keyProperty: 'department',
                    displayProperty: 'title',
                    source: new Memory({
                        data,
                        keyProperty: 'department',
                    }),
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}

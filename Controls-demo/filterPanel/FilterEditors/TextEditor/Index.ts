import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/FilterEditors/TextEditor/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: object[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                {
                    department: 'Разработка',
                    title: 'Разработка',
                    isDevelopment: true,
                },
                {
                    department: 'Продвижение СБИС',
                    title: 'Продвижение СБИС',
                    isDevelopment: false,
                },
                {
                    department: 'Федеральная клиентская служка',
                    title: 'Федеральная клиентская служка',
                    isDevelopment: false,
                },
            ],
            keyProperty: 'department',
        });
        this._filterButtonSource = [
            {
                caption: '',
                name: 'isDevelopment',
                editorTemplateName: 'Controls/filterPanel:TextEditor',
                resetValue: false,
                viewMode: 'extended',
                value: false,
                editorOptions: {
                    filterValue: true,
                    extendedCaption: 'Разработка',
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}

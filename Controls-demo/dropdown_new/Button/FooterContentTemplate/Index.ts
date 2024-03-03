import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Button/FooterContentTemplate/FooterTemplate';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _menuSource: Memory = null;

    protected _beforeMount(): void {
        const items = [
            {
                id: '1',
                title: 'Запись 1',
            },
            {
                id: '2',
                title: 'Запись 2',
            },
            {
                id: '3',
                title: 'Запись 3',
            },
            {
                id: '4',
                title: 'Запись 4',
            },
        ];

        this._menuSource = new Memory({
            keyProperty: 'id',
            data: items,
        });
    }

    static _styles: string[] = ['Controls-demo/dropdown_new/Button/Index'];
}

import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Tabs/Buttons/Direction/Template');
import { Memory } from 'Types/source';
import 'css!Controls-demo/Tabs/Buttons/Buttons';

export default class Direction extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '1';
    protected _source: Memory | null = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '1',
                    icon: 'icon-Lenta',
                    iconSize: 'm',
                },
                {
                    id: '2',
                    icon: 'icon-Chat',
                    iconSize: 'm',
                },
                {
                    id: '3',
                    icon: 'icon-Send',
                    iconSize: 'm',
                },
            ],
        });
    }
}

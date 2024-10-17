import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/LookupNew/Input/MultiLine/MultiLine';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectorTemplate: TemplateFunction = null;
    protected _source: Memory = new Memory({
        keyProperty: 'id',
        data: COMPANIES,
    });
    protected _selectedKeys: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
        'Сбербанк-Финанс, ООО',
        'Петросоюз-Континент, ООО',
        'Альфа Директ сервис, ОАО',
        'АК "ТРАНСНЕФТЬ", ОАО',
        'Ромашка, ООО',
    ];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._selectorTemplate = {
            templateName: 'Controls-demo/Lookup/FlatListSelector/FlatListSelector',
            templateOptions: {
                headingCaption: 'Выберите организацию',
            },
        };
    }

    static _styles: string[] = ['Controls-demo/LookupNew/Lookup'];
}

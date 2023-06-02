import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Scroll/PartOfInterface/PartOfInterface';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

interface IItem {
    key: number;
    title: string;
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: generateData<IItem>({
                count: 150,
                entityTemplate: { title: 'number' },
                beforeCreateItemCallback(item: IItem): void {
                    item.title = `Запись #${item.key}`;
                },
            }),
        });
    }
}

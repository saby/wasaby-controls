import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Resize/Element/Element';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import 'Controls-demo/list_new/VirtualScroll/Resize/Element/ExpandingElement';

interface IItem {
    key: number;
    title: string;
    template?: string;
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _activeElement: string = '2';

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: generateData<IItem>({
                count: 10,
                entityTemplate: { title: 'number' },
                beforeCreateItemCallback(item: IItem): void {
                    if (item.key === 1) {
                        item.template =
                            'Controls-demo/list_new/VirtualScroll/Resize/Element/ExpandingElement';
                    }

                    item.title = `Запись #${item.key}`;
                },
            }),
        });
    }
}

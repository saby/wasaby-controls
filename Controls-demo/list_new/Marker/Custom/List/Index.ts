import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/list_new/Marker/Custom/List/List';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 0,
                },
            ],
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}

import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';

import { flatData } from 'Controls-demo/Fingers/Data';

import * as Template from 'wml!Controls-demo/Fingers/Alignment/Template';

export default class TocDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: flatData,
        });
    }
}

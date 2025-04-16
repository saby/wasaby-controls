import { Control, TemplateFunction } from 'UI/Base';

import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderMultilineDateTime';
import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderMultilineName';

import * as Template from 'wml!Controls-demo/gridNew/ItemsView/StickyMultiline/StickyMultiline';
import { MultilineLadder } from 'Controls-demo/gridNew/DemoHelpers/Data/MultilineLadder';
import { RecordSet } from 'Types/collection';

interface IStickyLadderColumn {
    template: string;
    width: string;
    stickyProperty?: string | string[];
    resultTemplate?: TemplateFunction;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _columns: IStickyLadderColumn[] = MultilineLadder.getColumns();
    protected _ladderProperties: string[] = ['date', 'time'];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: MultilineLadder.getData(),
        });
    }
}

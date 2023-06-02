import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { MultilineLadder } from 'Controls-demo/gridNew/DemoHelpers/Data/MultilineLadder';

import * as Template from 'wml!Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineLoadUp/Template';

interface IStickyLadderColumn {
    template: string;
    width: string;
    stickyProperty?: string | string[];
    resultTemplate?: TemplateFunction;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IStickyLadderColumn[] = MultilineLadder.getColumns();
    protected _ladderProperties: string[] = ['date', 'time'];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: MultilineLadder.getData(),
        });
    }
}

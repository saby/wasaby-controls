import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Text } from '../DataHelpers/Text';

import * as Template from 'wml!Controls-demo/gridNew/MarkerSize/Text/Text';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;
    protected _columns: IColumn[] = Text.getColumns();
    protected _padding: string[] = ['default', 's', 'l'];
    protected _markerSizes: string[] = ['content-xs'];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._source = new Memory({
            keyProperty: 'key',
            data: Text.getData(),
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}

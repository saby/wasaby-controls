import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/NoSticky/NoSticky';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

import 'css!DemoStand/Controls-demo';

interface INoStickyLadderColumn {
    template: string;
    width: string;
}

/**
 * Для документации https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: INoStickyLadderColumn[] = Tasks.getColumns();
    protected _ladderProperties: string[] = ['photo', 'date'];

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Tasks.getData(),
        });
    }
}

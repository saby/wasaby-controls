import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/NoSticky/NoSticky';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

import 'css!DemoStand/Controls-demo';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface INoStickyLadderColumn {
    template: string;
    width: string;
}

const { getData } = Tasks;

/**
 * Для документации https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: INoStickyLadderColumn[] = Tasks.getColumns();
    protected _ladderProperties: string[] = ['photo', 'date'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LadderNoSticky1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}

import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderMultilineDateTime';
import 'wml!Controls-demo/gridNew/resources/CellTemplates/LadderMultilineName';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/LadderMode/Template';
import { MultilineLadder } from 'Controls-demo/gridNew/DemoHelpers/Data/MultilineLadder';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IStickyLadderColumn {
    template: string;
    width: string;
    stickyProperty?: string | string[];
    resultTemplate?: TemplateFunction;
}

const { getData } = MultilineLadder;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IStickyLadderColumn[] = MultilineLadder.getColumnsWithoutSticky();
    protected _ladderProperties: string[] = ['date', 'time'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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

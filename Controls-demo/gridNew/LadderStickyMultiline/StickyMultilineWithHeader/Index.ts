import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineWithHeader/StickyMultilineWithHeader';
import { IHeaderCell } from 'Controls/grid';
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
    protected _columns: IStickyLadderColumn[] = MultilineLadder.getColumnsWithResults();
    protected _header: IHeaderCell[] = MultilineLadder.getHeader();
    protected _ladderProperties: string[] = ['date', 'time'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LadderStickyMultilineStickyMultilineWithHeader1: {
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

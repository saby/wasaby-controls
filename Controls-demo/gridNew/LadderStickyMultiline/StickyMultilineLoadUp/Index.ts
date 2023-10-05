import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { MultilineLadder } from 'Controls-demo/gridNew/DemoHelpers/Data/MultilineLadder';

import * as Template from 'wml!Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineLoadUp/Template';

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
    protected _columns: IStickyLadderColumn[] = MultilineLadder.getColumns();
    protected _ladderProperties: string[] = ['date', 'time'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LadderStickyMultilineStickyMultilineLoadUp: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        view: 'infinity',
                        source: 'page',
                        sourceConfig: {
                            page: 1,
                            pageSize: 10,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}

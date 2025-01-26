import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignRight/TextAlignRight';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Tasks;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Tasks.getDefaultColumns().concat([
        {
            displayProperty: 'message',
            width: '200px',
            textOverflow: 'ellipsis',
        },
    ]);

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RightTemplateWithSeparatorTextAlignRight: {
                dataFactoryName: 'Controls-demo/gridNew/Grouped/RightTemplate/CustomFactory',
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

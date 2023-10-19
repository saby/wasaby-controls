import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextVisibleFalse/TextVisibleFalse';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Tasks;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Tasks.getDefaultColumns().concat([
        {
            displayProperty: 'message',
            width: '200px',
            textOverflow: 'ellipsis',
        },
    ]);

    protected _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            groupResults: {
                'Догадкин Владимир': 2,
                'Кесарева Дарья': 5.0,
                'Корбут Антон': 1.0,
                'Крайнов Дмитрий': 4.0,
            },
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RightTemplateWithSeparatorTextVisibleFalse: {
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

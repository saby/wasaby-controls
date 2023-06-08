import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignLeft/TextAlignLeft';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { RecordSet } from 'Types/collection';

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

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Tasks.getData(),
        });
    }

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
}

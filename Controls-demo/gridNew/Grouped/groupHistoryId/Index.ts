import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/groupHistoryId/groupHistoryId';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { USER } from 'ParametersWebAPI/Scope';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '30px',
        },
        {
            displayProperty: 'state',
            width: '200px',
        },
        {
            displayProperty: 'date',
            width: '100px',
        },
    ];
    protected _groupHistoryId: string = '';
    protected readonly GROUP_HISTORY_ID_NAME: string = 'MY_NEWS';

    protected _beforeMount(): void {
        USER.set(
            'LIST_COLLAPSED_GROUP_' + this.GROUP_HISTORY_ID_NAME,
            JSON.stringify(['Крайнов Дмитрий'])
        );
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Tasks.getData(),
        });
    }

    clickHandler(event: object, idButton: string): void {
        if (idButton === '1') {
            this._groupHistoryId = this.GROUP_HISTORY_ID_NAME;
        } else {
            this._groupHistoryId = '';
        }
    }
}

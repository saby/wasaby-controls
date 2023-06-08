import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/operations/SelectionViewMode/SelectionViewMode';
import Memory from 'Controls-demo/operations/SelectionViewMode/Memory';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import 'wml!Controls-demo/operations/SelectionViewMode/resources/PersonInfo';

export default class extends Control {
    _template: TemplateFunction = template;
    _gridColumns: object[] = null;
    _viewSource: Memory = null;
    _selectionViewMode: string = 'all';

    _beforeMount(): void {
        this._gridColumns = [
            {
                template:
                    'wml!Controls-demo/operations/SelectionViewMode/resources/PersonInfo',
            },
        ];
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getListData(),
        });
    }

    static _styles: string[] = ['Controls-demo/operations/Index'];
}

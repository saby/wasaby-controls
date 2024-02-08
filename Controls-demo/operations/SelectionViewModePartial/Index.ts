import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/operations/SelectionViewModePartial/SelectionViewMode';
import { Memory } from 'Types/source';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import 'wml!Controls-demo/operations/SelectionViewModePartial/resources/PersonInfo';
import 'css!Controls-demo/operations/Index';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _gridColumns: any = null;
    protected _viewSource: any = null;
    protected _selectionViewMode: string = 'partial';

    protected _beforeMount(): void {
        this._gridColumns = [
            {
                template:
                    'wml!Controls-demo/operations/SelectionViewModePartial/resources/PersonInfo',
            },
        ];
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getListData().map((listItem) => {
                listItem.Раздел = null;
                listItem['Раздел@'] = null;
                return listItem;
            }),
        });
    }
}

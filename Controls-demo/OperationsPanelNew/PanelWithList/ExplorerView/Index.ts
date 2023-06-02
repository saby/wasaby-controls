import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/OperationsPanelNew/PanelWithList/ExplorerView/ExplorerView';
import Memory from 'Controls-demo/operations/SelectionViewMode/Memory';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import 'wml!Controls-demo/operations/SelectionViewMode/resources/PersonInfo';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _gridColumns: object[] = null;
    protected _viewSource: Memory = null;
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];
    protected _keyProperty: string = 'id';
    protected _nodeProperty: string = 'Раздел@';
    protected _parentProperty: string = 'Раздел';
    protected _childrenCountProperty: string = '';
    protected _expandedOperationsPanel: boolean;

    protected _beforeMount(): void {
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

    protected _expandedChangedHandler(e: Event, expanded: boolean): void {
        this._expandedOperationsPanel = expanded;
    }

    protected _toggleChildrenProperty(e: Event): void {
        this._childrenCountProperty = this._childrenCountProperty
            ? ''
            : 'count';
    }

    static _styles: string[] = ['Controls-demo/OperationsPanelNew/Index'];
}

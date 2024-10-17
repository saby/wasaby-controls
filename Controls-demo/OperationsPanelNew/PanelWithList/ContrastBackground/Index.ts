import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/OperationsPanelNew/PanelWithList/ContrastBackground/ContrastBackground';
import { Memory } from 'Types/source';
import { getPanelData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import 'css!Controls-demo/OperationsPanelNew/Index';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _nodeProperty: string = 'Раздел@';
    protected _parentProperty: string = 'Раздел';
    protected _keyProperty: string = 'id';
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];
    protected _panelSource: Memory = new Memory({
        keyProperty: 'id',
        data: getPanelData(),
    });
}

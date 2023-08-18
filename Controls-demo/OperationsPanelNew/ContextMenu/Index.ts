import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/OperationsPanelNew/ContextMenu/Index';
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _panelSource: Memory;
    protected _source: Memory;
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];

    protected _beforeMount(): void {
        this._panelSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'export',
                    icon: 'icon-Save',
                    title: 'Выгрузить',
                },
                {
                    id: 'sum',
                    icon: 'icon-Sum',
                    title: 'Суммировать',
                    showType: showType.MENU,
                },
            ],
        });

        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '1',
                    title: 'Element',
                },
            ],
        });
    }
}

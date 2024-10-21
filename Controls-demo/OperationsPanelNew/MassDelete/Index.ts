import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/OperationsPanelNew/MassDelete/Index';
import { Memory } from 'Types/source';
import { View } from 'Controls/baseList';
import { Model } from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _panelSource: Memory;
    protected _source: Memory;
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];
    protected _children: {
        list: View;
    };

    protected _beforeMount(): void {
        this._panelSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'remove',
                    icon: 'icon-Erase icon-error',
                    title: 'Удалить',
                },
            ],
        });

        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: 'Element',
                },
                {
                    id: 2,
                    title: 'Another element',
                },
            ],
        });
    }

    protected _itemClick(event: Event, item: Model): void {
        const id = item.get('id');
        this._selectedKeys = this._getSelectedKeys();
        if (id === 'remove') {
            this._children.list
                .removeItems({
                    selected: this._selectedKeys,
                    excluded: this._excludedKeys,
                })
                .then(() => {
                    this._selectedKeys = [];
                    this._children.list.reload();
                });
        }
    }

    protected _getSelectedKeys(): string[] {
        if (this._selectedKeys[0] == null) {
            this._selectedKeys = this._source.data.map((item) => {
                return item.id;
            });
        }
        return this._selectedKeys;
    }
}

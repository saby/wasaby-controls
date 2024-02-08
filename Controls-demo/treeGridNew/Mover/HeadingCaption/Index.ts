import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/HeadingCaption/Index';
import { CrudEntityKey, Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { ISelectionObject } from 'Controls/interface';
import { Model } from 'Types/entity';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _panelSource: Memory = null;
    private _selectedKeys: CrudEntityKey[] = [];
    private _excludedKeys: CrudEntityKey[] = [];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MoverHeadingCaption: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
        ];

        this._panelSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'move',
                    icon: 'icon-Move',
                    title: 'Переместить',
                },
            ],
        });
    }

    protected _onSelectedKeysChanged(e: SyntheticEvent, keys: CrudEntityKey[]) {
        this._selectedKeys = keys;
    }

    protected _itemClick(
        event: SyntheticEvent,
        item: Model,
        nativeEvent: Event
    ): void {
        if (item.get('id') === 'move' && this._selectedKeys?.length) {
            const selection: ISelectionObject = {
                selected: this._selectedKeys,
                excluded: this._excludedKeys,
            };
            this._children.treeGrid.moveItemsWithDialog(selection, {
                target: nativeEvent.target
            })
                .then(() => {
                    this._selectedKeys = [];
                    this._children.treeGrid.reload();
                });
        }
    }
}

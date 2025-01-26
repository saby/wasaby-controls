import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/Base/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { ISelectionObject } from 'Controls/interface';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Flat.getDataWithLongChildrenTitles();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    // FIXME пока не перевели мувер на слайсы.
    protected _viewSource: HierarchicalMemory = new ExpandedSource({
        parentProperty: 'parent',
        keyProperty: 'key',
        data: getData(),
        useMemoryFilter: true,
    });
    private _selectedKeys: CrudEntityKey[] = [];

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
        ];
    }

    protected _onSelectedKeysChanged(e: SyntheticEvent, keys: CrudEntityKey[]) {
        this._selectedKeys = keys;
    }

    protected _moveButtonClick(event: SyntheticEvent): void {
        if (this._selectedKeys?.length) {
            const selection: ISelectionObject = {
                selected: this._selectedKeys,
                excluded: [],
            };
            this._children.treeGrid.moveItemsWithDialog(selection, {
                target: event.target
            }).then(() => {
                this._selectedKeys = [];
                this._children.treeGrid.reload();
            });
        }
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MoverBase: {
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
}

import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/RootLabelVisible/RootLabelVisible';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { ISelectionObject } from 'Controls/interface';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    private _selectedKeys: CrudEntityKey[] = [];
    private _excludedKeys: CrudEntityKey[] = [];

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
                excluded: this._excludedKeys,
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
            MoverRootLabelVisible: {
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

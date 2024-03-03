import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/Extended/Extended';
import { CrudEntityKey } from 'Types/source';
import { TColumns } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import DemoSource from './DemoSource';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: TColumns;
    protected _beforeItemsMoveText: string = '';
    private _selectedKeys: [] = [];
    private _excludedKeys: CrudEntityKey[] = [];

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '1fr',
                textOverflow: 'ellipsis',
            },
        ];
    }

    protected _moveButtonClick(event: SyntheticEvent): void {
        if (this._selectedKeys.length) {
            // После перемещения выбранные ключи будут сброшены, а Memory.move не возвращает результат
            const selectedKeys = [...this._selectedKeys];
            this._children.treeGrid
                .moveItemsWithDialog(
                    {
                        selected: this._selectedKeys,
                        excluded: this._excludedKeys,
                    },
                    {
                        target: event.target,
                        viewCommandName: 'Controls/viewCommands:Reload',
                    }
                )
                .then(() => {
                    this._beforeItemsMoveText = `Перемещены элементы с id: ${selectedKeys.join(
                        ','
                    )}`;
                });
        }
    }

    protected _onSelectedKeysChanged(e: SyntheticEvent, keys: CrudEntityKey[]) {
        this._selectedKeys = keys;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MoverExtended: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
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

import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/Extended/Extended';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { TColumns } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    private _selectedKeys: [] = [];
    private _excludedKeys: CrudEntityKey[] = [];
    protected _columns: TColumns;
    protected _beforeItemsMoveText: string = '';

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '1fr',
                textOverflow: 'ellipsis',
            },
        ];
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            filter: (item, filter) => {
                const parent = filter.hasOwnProperty('parent')
                    ? filter.parent
                    : null;
                if (parent && parent.forEach) {
                    for (let i = 0; i < parent.length; i++) {
                        if (item.get('parent') === parent[i]) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return item.get('parent') === parent;
                }
            },
            parentProperty: 'parent',
        });
    }

    protected _moveButtonClick(): void {
        if (this._selectedKeys.length) {
            // После перемещения выбранные ключи будут сброшены, а Memory.move не возвращает результат
            const selectedKeys = [...this._selectedKeys];
            this._children.treeGrid
                .moveItemsWithDialog(
                    {
                        selected: this._selectedKeys,
                        excluded: this._excludedKeys,
                    },
                    'Controls/viewCommands:Reload'
                )
                .then(() => {
                    this._beforeItemsMoveText = `Перемещены элементы с id: ${selectedKeys.join(
                        ','
                    )}`;
                });
        }
    }
}

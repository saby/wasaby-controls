import { Memory, IMemoryOptions, CrudEntityKey } from 'Types/source';
import cClone from 'Core/core-clone';

export default class DemoSource extends Memory {
    protected _moduleName = 'Controls-demo/ListCommands/DemoHelpers/DemoSource';

    constructor(options: IMemoryOptions) {
        super(options);
    }

    query(query) {
        const filter = query.getWhere();
        const selection = filter.selection;
        query.where((item) => {
            const itemKey = item.get(this.getKeyProperty());
            let folderId: CrudEntityKey;
            let correct: boolean;

            if (filter.id) {
                correct = filter.id.includes(itemKey);
            } else {
                if (filter['Раздел'] !== undefined && !(filter['Раздел'] instanceof Array)) {
                    folderId = filter['Раздел'];
                } else {
                    folderId = null;
                }
                if (filter['Раздел'] instanceof Array && filter.expanded === true) {
                    correct = filter['Раздел'].includes(item.get('Раздел'));
                } else {
                    correct = item.get('Раздел') === folderId;
                }
                if (selection) {
                    correct = this._itemIsSelected(
                        itemKey,
                        selection.get('marked'),
                        selection.get('excluded')
                    );
                }

                if (correct && filter.onlyFolders) {
                    correct = item.get('Раздел@') === true;
                }
            }

            return correct;
        });
        return super.query(query);
    }

    destroy(items) {
        const itemsForRemove = cClone(items);
        const directorIndex = itemsForRemove.indexOf(1);

        if (directorIndex !== -1) {
            itemsForRemove.splice(directorIndex, 1);
        }

        return super.destroy(itemsForRemove).then((result) => {
            if (directorIndex !== -1) {
                throw new Error('Unable to remove head of department.');
            }
            return result;
        });
    }

    private _itemIsSelected(
        itemKey: CrudEntityKey,
        selectedKeys: CrudEntityKey[],
        excludedKeys: CrudEntityKey[]
    ) {
        const parentKey = this._getRecordByKey(itemKey)['Раздел'];
        const innerItemKey = '' + itemKey;
        return (
            selectedKeys.indexOf(innerItemKey) !== -1 ||
            (parentKey === null &&
                selectedKeys.indexOf(null) !== -1 &&
                excludedKeys.indexOf(innerItemKey) === -1)
        );
    }
}

import { Memory, Query, DataSet } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

function includes(collection: string[], item: string | number): boolean {
    let innerItem = item;
    if (typeof item === 'number') {
        innerItem = String(item);
    }

    return collection.includes(innerItem);
}

function getById(items: object[], id: string): object {
    for (let index = 0; index < items.length; index++) {
        if (items[index].id === id) {
            return items[index];
        }
    }
}

function getChildren(items: object[], parent: string): string[] {
    return items.filter((item) => {
        return isChildByNode(item, items, parent);
    });
}

function isChildByNode(item: object, items: object[], nodeId: string): boolean {
    let isChild = nodeId === null || nodeId === undefined;

    if (!isChild) {
        for (
            let currentItem = item;
            currentItem.Раздел !== null;
            currentItem = getById(items, currentItem.Раздел)
        ) {
            if (nodeId === currentItem.Раздел) {
                isChild = true;
                break;
            }
        }
    }

    return isChild;
}

function isSelected(item: object, items: object[], selection: Model): boolean {
    const selected = selection.get('marked');

    return (
        includes(selected, item.id) ||
        getChildren(items, item.id).filter((ch) => {
            return includes(selected, ch.id);
        }).length
    );
}

function getFullPath(items: object[], currentRoot: string): RecordSet {
    const path = [];

    for (
        let currentNode = getById(items, currentRoot);
        currentNode;
        currentNode = getById(items, currentNode.Раздел)
    ) {
        path.push(currentNode);
    }

    return new RecordSet({
        rawData: path.reverse(),
        keyProperty: 'id',
    });
}

export default class extends Memory {
    protected _moduleName: string = 'Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/Memory';
    query(query: Query): DataSet {
        const items = this._$data;
        const filter = query.getWhere();
        const selection = filter.SelectionWithPath;
        const parent = filter.Раздел instanceof Array ? filter.Раздел[0] : filter.Раздел;

        if (selection) {
            const isAllSelected =
                selection.get('marked').includes(null) && selection.get('excluded').includes(null);

            query.where((item) => {
                item = getById(items, item.get('id'));
                if (
                    (isSelected(item, items, selection) && isChildByNode(item, items, parent)) ||
                    (isAllSelected &&
                        item.Раздел === null &&
                        !includes(selection.get('excluded'), item.id))
                ) {
                    return true;
                }
            });
        } else {
            query.where((item) => {
                if (parent !== undefined) {
                    return item.get('Раздел') === parent;
                } else {
                    return item.get('Раздел') === null;
                }
            });
        }

        return super.query(...arguments).addCallback((data) => {
            const originalGetAll = data.getAll;

            data.getAll = function () {
                const result = originalGetAll.apply(this, arguments);
                const meta = result.getMetaData();

                if (parent !== undefined && parent !== null) {
                    meta.path = getFullPath(items, parent);
                    result.setMetaData(meta);
                }

                return result;
            };

            return data;
        });
    }
}

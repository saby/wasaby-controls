import { Memory, DataSet } from 'Types/source';
import { RecordSet } from 'Types/collection';

export default class HierarchyMemory extends Memory {
    private _getById(items: Object[], id: string): Object {
        return {...items.find((item) => item.id === id)};
    }

    private _getFullPath(items: Object[], currentRoot: string) {
        const path = [];
        let currentNode = this._getById(items, currentRoot);
        path.unshift(this._getById(items, currentRoot));
        while (currentNode.parent !== null) {
            currentNode = this._getById(items, currentNode.parent);
            path.unshift(currentNode);
        }
        return path;
    }

    private _getFullPathRecordSet(items: Object[], currentRoot: string): RecordSet {
        return new RecordSet({
            rawData: this._getFullPath(items, currentRoot),
            keyProperty: 'id'
        });
    }

    private _pushIfNeed(items, item, keyProperty) {
        if (items.some((it) => it[keyProperty] === item[keyProperty])) {
            return;
        }
        items.push(item);
    }

    query(query) {
        const rootData = [];
        const data = [];
        const items = {};
        const filter = query.getWhere();
        const parent = filter.parent instanceof Array ? filter.parent[0] : filter.parent;
        let parents;
        if (filter.title) {
            this._$data.forEach((item) => {
                if (item.title.toUpperCase().indexOf(filter.title.toUpperCase()) !== -1) {
                    items[item.id] = item;
                }
            });
            for (const i in items) {
                if (items.hasOwnProperty(i)) {
                    if (items[i].parent !== null) {
                        parents = this._getFullPath(this._$data, items[i].parent);
                        parents.forEach((par) => {
                            this._pushIfNeed(data, par, this._$keyProperty);
                        });
                        this._pushIfNeed(data, items[i], this._$keyProperty);
                    } else {
                        this._pushIfNeed(rootData, items[i], this._$keyProperty);
                    }
                }
            }
            rootData.forEach((rootItem) => {
                return this._pushIfNeed(data, rootItem, this._$keyProperty);
            });
            return Promise.resolve(
                new DataSet({
                    rawData: data,
                    adapter: this.getAdapter(),
                    keyProperty: 'id'
                })
            );
        } else {
            query.where((item) => {
                if (filter.parent && filter.parent.forEach) {
                    for (let j = 0; j < filter.parent.length; j++) {
                        if (item.get('parent') === filter.parent[j]) {
                            return true;
                        }
                    }
                    return false;
                }
                if (parent !== undefined) {
                    return item.get('parent') === parent;
                }
                return true;
            });
            return super.query.apply(this, arguments).then((innerData) => {
                const originResult = innerData.getAll();

                innerData.getAll = () => {
                    const newResult = originResult.clone();
                    const meta = originResult.getMetaData();

                    if (parent !== undefined && parent !== null) {
                        meta.path = this._getFullPathRecordSet(this._$data, parent);
                    }

                    newResult.setMetaData(meta);
                    return newResult;
                };
                return Promise.resolve(innerData);
            });
        }
    }
}

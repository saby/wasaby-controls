import { Memory, DataSet, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as cClone from 'Core/core-clone';

function getById(items, id, keyProperty) {
    for (let i = 0; i < items.length; i++) {
        if (items[i][keyProperty] === id) {
            return cClone(items[i]);
        }
    }
}

function getFullPath(items, currentRoot, needRecordSet, keyProperty) {
    const path = [];
    let currentNode = getById(items, currentRoot, keyProperty);
    path.unshift(getById(items, currentRoot, keyProperty));
    while (currentNode.parent !== null) {
        currentNode = getById(items, currentNode.parent, keyProperty);
        path.unshift(currentNode);
    }
    if (needRecordSet) {
        return new RecordSet({
            rawData: path,
            keyProperty,
        });
    }
    return path;
}

function pushIfNeed(items, item, keyProperty) {
    if (
        items.some((it) => {
            return it[keyProperty] === item[keyProperty];
        })
    ) {
        return;
    }
    items.push(item);
}

class TreeMemory extends Memory {
    constructor(options) {
        super(options);
        this._$keyProperty = options.keyProperty || 'id';
    }

    query(query?: Query): Promise<DataSet> {
        return new Promise((resolve) => {
            const rootData = [];
            const data = [];
            const items = {};
            let parents;
            const filter = query.getWhere();
            const parent = filter.parent instanceof Array ? filter.parent[0] : filter.parent;
            if (filter.title) {
                this._$data.forEach((item) => {
                    if (item.title.toUpperCase().indexOf(filter.title.toUpperCase()) !== -1) {
                        items[item[this._$keyProperty || 'id']] = item;
                    }
                });
                for (const i in items) {
                    if (items.hasOwnProperty(i)) {
                        if (items[i].parent !== null) {
                            parents = getFullPath(
                                this._$data,
                                items[i].parent,
                                false,
                                this._$keyProperty || 'id'
                            );
                            parents.forEach((par) => {
                                pushIfNeed(data, par, this._$keyProperty);
                            });
                            pushIfNeed(data, items[i], this._$keyProperty);
                        } else {
                            pushIfNeed(rootData, items[i], this._$keyProperty);
                        }
                    }
                }
                rootData.forEach((rootItem) => {
                    return pushIfNeed(data, rootItem, this._$keyProperty);
                });
                resolve(
                    new DataSet({
                        rawData: data,
                        adapter: this.getAdapter(),
                        keyProperty: this._$keyProperty || 'id',
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

                    if (filter.historyKeys) {
                        return filter.historyKeys.includes(item.getData().id);
                    }

                    if (parent !== undefined) {
                        return item.get('parent') === parent;
                    }
                    return true;
                });
                super.query.apply(this, arguments).then((innerData) => {
                    const originalGetAll = innerData.getAll;

                    const items = this._$data;
                    const keyProperty = this._$keyProperty || 'id';
                    innerData.getAll = function () {
                        const originResult = originalGetAll.apply(this, arguments);
                        const meta = originResult.getMetaData();

                        if (parent !== undefined && parent !== null) {
                            meta.path = getFullPath(items, parent, true, keyProperty);
                        }

                        originResult.setMetaData(meta);
                        return originResult;
                    };

                    resolve(innerData);
                });
            }
        });
    }
}

export = TreeMemory;

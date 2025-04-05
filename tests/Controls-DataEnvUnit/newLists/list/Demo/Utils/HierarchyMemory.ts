import { Memory, DataSet, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import type { TItem } from '../Data/RussiaSubjects';
import { PARENT_PROPERTY, KEY_PROPERTY, DISPLAY_PROPERTY } from '../Data/RussiaSubjects';

export default class HierarchyMemory extends Memory {
    private _getById(items: TItem[], id: TItem[typeof PARENT_PROPERTY]): TItem {
        return { ...items.find((item) => item[KEY_PROPERTY] === id) } as TItem;
    }

    private _getFullPath(items: TItem[], currentRoot: TItem[typeof PARENT_PROPERTY]) {
        const path = [];
        let currentNode = this._getById(items, currentRoot);
        path.unshift(this._getById(items, currentRoot));
        while (currentNode[PARENT_PROPERTY] !== null) {
            currentNode = this._getById(items, currentNode[PARENT_PROPERTY]);
            path.unshift(currentNode);
        }
        return path;
    }

    private _getFullPathRecordSet(items: TItem[], currentRoot: string): RecordSet {
        return new RecordSet({
            rawData: this._getFullPath(items, currentRoot),
            keyProperty: KEY_PROPERTY,
        });
    }

    private _pushIfNeed(items: TItem[], item: TItem) {
        if (items.some((it) => it[KEY_PROPERTY] === item[KEY_PROPERTY])) {
            return;
        }
        items.push(item);
    }

    query(query: Query<{ [PARENT_PROPERTY]: any }>) {
        const rootData: TItem[] = [];
        const data: TItem[] = [];
        const items: { [k: string]: TItem } = {};
        const filter = query.getWhere() as unknown as {
            [PARENT_PROPERTY]: any[] | string;
            [DISPLAY_PROPERTY]?: string;
        };
        const parentFilter = filter[PARENT_PROPERTY];
        const displayPropertyFilter = filter[DISPLAY_PROPERTY];
        const parent = parentFilter instanceof Array ? parentFilter[0] : parentFilter;
        let parents;
        if (displayPropertyFilter) {
            this._$data.forEach((item: TItem) => {
                if (
                    item[DISPLAY_PROPERTY].toUpperCase().indexOf(
                        displayPropertyFilter.toUpperCase()
                    ) !== -1
                ) {
                    items[item[KEY_PROPERTY]] = item;
                }
            });
            for (const i in items) {
                if (items.hasOwnProperty(i)) {
                    if (items[i][PARENT_PROPERTY] !== null) {
                        parents = this._getFullPath(this._$data, items[i][PARENT_PROPERTY]);
                        parents.forEach((par) => {
                            this._pushIfNeed(data, par);
                        });
                        this._pushIfNeed(data, items[i]);
                    } else {
                        this._pushIfNeed(rootData, items[i]);
                    }
                }
            }
            rootData.forEach((rootItem) => {
                return this._pushIfNeed(data, rootItem);
            });
            return Promise.resolve(
                new DataSet({
                    rawData: data,
                    adapter: this.getAdapter(),
                    keyProperty: KEY_PROPERTY,
                })
            );
        } else {
            query.where((item: Record) => {
                if (filter[PARENT_PROPERTY] && parentFilter instanceof Array) {
                    for (let j = 0; j < filter[PARENT_PROPERTY].length; j++) {
                        if (item.get('parent') === filter[PARENT_PROPERTY][j]) {
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
            return super.query.apply(this, arguments as any).then((innerData) => {
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

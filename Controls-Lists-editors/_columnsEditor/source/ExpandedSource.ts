import { DataSet, Memory, Query } from 'Types/source';
import { ITreeControlItem } from 'Controls-Lists-editors/_columnsEditor/utils/markup';
const DISPLAY_PROPERTY = 'title';

/**
 * Источник для того, чтобы узлы отображались в раскрытом виде
 * @private
 */
export default class ExpandedSource extends Memory {
    protected _moduleName: string = 'Controls-Lists-editors/_columnsEditor/source/ExpandedSource';

    private getItem(items: ITreeControlItem[], key: string | number): ITreeControlItem {
        const item = items.find((item) => item.key === key);
        return { ...item };
    }

    private getParents(items: ITreeControlItem[], root: string | number): ITreeControlItem[] {
        const parents = [];
        let node = this.getItem(items, root);
        parents.unshift(node);
        while (node.parent !== null) {
            node = this.getItem(items, node.parent);
            parents.unshift(node);
        }
        return parents;
    }

    private addItem(items: ITreeControlItem[], itemToAdd: ITreeControlItem, keyProperty: string) {
        if (items.some((item: ITreeControlItem) => item[keyProperty] === itemToAdd[keyProperty])) {
            return;
        }
        items.push(itemToAdd);
    }

    query(query: Query): Promise<DataSet> {
        const rootData: ITreeControlItem[] = [];
        const filteredData: ITreeControlItem[] = [];
        const rawData: ITreeControlItem[] = [];
        const filter = query.getWhere();
        let parents;
        if (filter[DISPLAY_PROPERTY]) {
            const data: ITreeControlItem[] = this._$data;
            const keyProperty: string = this.getKeyProperty();
            data.forEach((item: ITreeControlItem) => {
                if (
                    item[DISPLAY_PROPERTY].toUpperCase().indexOf(
                        filter[DISPLAY_PROPERTY].toUpperCase()
                    ) !== -1
                ) {
                    rawData.push(item);
                }
            });
            for (let i = 0; i < rawData.length; i++) {
                const item: ITreeControlItem = rawData[i];
                if (item.parent !== null) {
                    parents = this.getParents(data, item.parent);
                    parents.forEach((parent) => {
                        this.addItem(filteredData, parent, keyProperty);
                    });
                    this.addItem(filteredData, item, keyProperty);
                } else {
                    this.addItem(rootData, item, keyProperty);
                }
            }
            rootData.forEach((rootItem: ITreeControlItem) => {
                return this.addItem(filteredData, rootItem, keyProperty);
            });
            return Promise.resolve(
                new DataSet({
                    rawData: filteredData,
                    adapter: this.getAdapter(),
                    keyProperty,
                })
            );
        } else {
            const newQuery = query.where(() => {
                return true;
            });
            return super.query(newQuery);
        }
    }
}

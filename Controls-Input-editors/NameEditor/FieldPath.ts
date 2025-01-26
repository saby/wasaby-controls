import { Model } from 'Types/entity';
import { IFieldItem } from 'Controls/dataFactory';

export class FieldPath {
    constructor(private data: IFieldItem[]) {}

    findItem(id: number): IFieldItem {
        return this.data.find((item) => item.Id === id);
    }

    getPath(id: number, includeCurrent: boolean) {
        let val = this.findItem(id);
        if (!val) return [];

        const path = includeCurrent ? [val] : [];

        while (val.Parent) {
            val = this.findItem(val.Parent);
            if (!val) break;
            path.unshift(val);
        }

        return path.map(
            (item) =>
                new Model({
                    rawData: item,
                    keyProperty: 'Id',
                })
        );
    }
}

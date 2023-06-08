import { DataSet, HierarchicalMemory, Query } from 'Types/source';
import { Model, Record } from 'Types/entity';

export const getData = () => {
    return [
        {
            id: 1,
            title: 'node 1',
            count: 1,
            node: true,
            parent: null,
        },
        {
            id: 11,
            title: 'node 11',
            count: 1,
            node: true,
            parent: 1,
        },
        {
            id: 111,
            title: 'node 111',
            count: 1,
            node: true,
            parent: 11,
        },
        {
            id: 1111,
            title: 'leaf 1 for node 111',
            count: 1,
            node: null,
            parent: 111,
        },
        {
            id: 1112,
            title: 'leaf 2 for node 111',
            count: 1,
            node: null,
            parent: 111,
        },
        {
            id: 112,
            title: 'leaf 1 for node 11',
            count: 1,
            node: null,
            parent: 11,
        },
        {
            id: 113,
            title: 'leaf 2 for node 11',
            count: 1,
            node: null,
            parent: 11,
        },
        {
            id: 2,
            title: 'node 2',
            count: 1,
            node: true,
            parent: null,
        },
    ];
};

export class Source extends HierarchicalMemory {
    private _needUpdateDate: boolean = false;

    read(key: any, meta?: object): Promise<Record> {
        const item = this.data.find((i) => {
            return i.id === key;
        });
        if (this._needUpdateDate) {
            item.count += 1;
            this._needUpdateDate = false;
        }

        return super.read(key, meta);
    }

    query(query?: Query): Promise<DataSet> {
        let parents: number[] = (query.getWhere() as { parent: number[] })
            .parent;
        if (!Array.isArray(parents)) {
            parents = [parents];
        }

        let result = 0;
        this.data.forEach((item) => {
            // Если требуется обновление данных, то проверяем входит ли текущий итем данных в массив parents
            // или он является дочерним одного из запрашиваемых parents и если это так то инкрементим count итема
            if (
                this._needUpdateDate &&
                (parents.includes(item.id) || parents.includes(item.parent))
            ) {
                item.count += 1;
            }

            result += item.count;
        });

        this._needUpdateDate = false;

        return super.query(query).then((dataSet) => {
            return updateResults(dataSet, result);
        });
    }

    setNeedUpdateDate(): void {
        this._needUpdateDate = true;
    }
}

function updateResults(dataSet: DataSet, result: number): DataSet {
    const rawData = dataSet.getRawData();
    rawData.meta.results = new Model({
        keyProperty: 'id',
        rawData: {
            id: 'results',
            title: 'Итого',
            count: result,
        },
    });

    dataSet.setRawData(rawData);
    return dataSet;
}

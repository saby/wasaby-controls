import { DataSet, Memory, Query } from 'Types/source';

interface IItem {
    key: number;
    title: string;
}

export default class DemoSource extends Memory {
    protected _moduleName: string = 'Controls-demo/list_new/Navigation/Cut/Recount/DemoSource';
    query(query?: Query): Promise<DataSet> {
        // берем элементы с конца, чтобы добавленные элементы были в начале списка,
        // как это нужно в стандартах
        const countAllItems = this.data.length;
        query.offset(countAllItems - query.getLimit());

        return super.query(query).then((dataSet) => {
            const newData: { items: IItem[]; meta: any } = {
                ...dataSet.getRawData(),
            };
            // сортируем элементы в обратном порядке, чтобы добавленные элементы были в начале списка,
            // как это нужно в стандартах
            newData.items = newData.items
                .sort((a, b) => {
                    return b.key - a.key;
                })
                .filter((it) => {
                    return !!it;
                });
            return this._prepareQueryResult(newData, query);
        });
    }
}

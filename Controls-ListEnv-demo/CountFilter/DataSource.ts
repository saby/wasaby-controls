import { Memory, DataSet, Query } from 'Types/source';

const divisorMap = {
    today: 365,
    week: 51,
    month: 12,
    year: 1,
};

export default class DataSource extends Memory {
    query(query?: Query): Promise<DataSet> {
        let count;
        const where = { ...query.getWhere() };
        if (where?.CalcCountBy) {
            count = where.CalcCountBy;
            delete where.CalcCountBy;
        }
        query.where(where);
        return super.query.call(this, query).then((result) => {
            if (count) {
                const divisor = divisorMap[count] || 100;
                const newItems = result.getAll();
                newItems.forEach((item) => {
                    const newCount = Math.round(item.get('count') / divisor) || null;
                    item.set('count', newCount);
                });
            }
            return result;
        });
    }
}

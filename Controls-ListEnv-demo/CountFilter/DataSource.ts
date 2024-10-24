import { Memory, DataSet, Query } from 'Types/source';
import { compare } from 'Types/entity';

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
            if (count instanceof Array) {
                const diff = compare.dateDifference(count[0], count[1], compare.DateUnits.Day);
                if (diff === 0) {
                    count = 'today';
                } else if (diff < 8) {
                    count = 'week';
                } else if (diff < 32) {
                    count = 'month';
                } else if (diff > 363 && diff < 367) {
                    count = 'year';
                }
            }
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

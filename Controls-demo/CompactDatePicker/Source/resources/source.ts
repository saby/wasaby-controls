import { dateFromSql, dateToSql, TO_SQL_MODE } from 'Types/formatter';
import { RecordSet } from 'Types/collection';
import { Memory, Query } from 'Types/source';
import { Base as dateUtils } from 'Controls/dateUtils';

const getDataFromServer = (limit: number, month: Date): Promise => {
    const items = [];
    // Создаем данные на каждый месяц
    for (let i = 0; i < limit; i++) {
        const extDataItems = [];
        month.setMonth(month.getMonth() + 1);
        const daysInMonth = dateUtils.getDaysInMonth(month);
        for (let day = 0; day < daysInMonth; day++) {
            extDataItems.push({
                isMarked: day === 4,
                mainCounter: day % 4 === 0 && 3,
            });
        }
        items.push({
            id: dateToSql(month, TO_SQL_MODE.DATE),
            extData: new RecordSet({
                rawData: extDataItems,
            }),
        });
    }
    return Promise.resolve(items);
};

class Source extends Memory {
    protected _$keyProperty: string = 'id';
    query(query: Query) {
        // Получаем правила фильтрации данных
        const where = query.getWhere();
        // Получаем количество загружаемых месяцев
        const limit = query.getLimit() || 1;

        // Получаем месяц, с которого началась загрузка данных
        const month = dateFromSql(where['id>=']);

        const adapter = this.getAdapter().forTable();
        // Имитируем запрос на сервер
        return getDataFromServer(limit, month).then((items) => {
            this._each(items, (item) => {
                adapter.add(item);
            });
            // Возвращаем подготовленные данные
            return this._prepareQueryResult({
                items: adapter.getData(),
            });
        });
    }
}

export default Source;

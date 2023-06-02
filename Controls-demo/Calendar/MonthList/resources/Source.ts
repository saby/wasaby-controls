import {Deferred} from 'Types/deferred';
import { dateFromSql, dateToSql, TO_SQL_MODE } from 'Types/formatter';
import { RecordSet } from 'Types/collection';
import { Memory, Query } from 'Types/source';
import { Base as dateUtils } from 'Controls/dateUtils';

class Source extends Memory {
    protected _moduleName: string =
        'ControlsDemo.Calendar.MonthList.SourceRecordSet';
    protected $protected: object = {
        _dataSetItemsProperty: 'items',
        _dataSetTotalProperty: 'total',
    };

    protected _$keyProperty: string = 'id';

    protected _isRed: boolean = true;

    query(query: Query) {
        const offset = query.getOffset();
        const where = query.getWhere();
        const limit = query.getLimit() || 1;
        const executor = (() => {
            const adapter = this.getAdapter().forTable();
            const monthEqual = where['id~'];
            const monthGt = where['id>='];
            const monthLt = where['id<='];
            const deferred = new Deferred();
            let items = [];
            let month = monthEqual || monthGt || monthLt;
            let extData;
            let daysInMonth;

            if (month) {
                month = dateFromSql(month);
            } else {
                month = dateUtils.getStartOfMonth(new Date());
            }

            month.setMonth(month.getMonth() + offset);

            if (monthLt) {
                month.setMonth(month.getMonth() - limit);
            } else if (monthGt) {
                month.setMonth(month.getMonth() + 1);
            }

            for (let i = 0; i < limit; i++) {
                extData = [];
                daysInMonth = dateUtils.getDaysInMonth(month);
                for (let d = 0; d < daysInMonth; d++) {
                    extData.push({
                        isMarked: d % 2,
                        color: this._isRed ? 'red' : 'blue',
                    });
                }
                extData = new RecordSet({
                    rawData: extData,
                });
                items.push({
                    id: dateToSql(month, TO_SQL_MODE.DATE),
                    extData,
                });
                month.setMonth(month.getMonth() + 1);
            }

            this._each(items, (item) => {
                adapter.add(item);
            });
            items = this._prepareQueryResult({
                items: adapter.getData(),
                total: monthEqual ? { before: true, after: true } : true,
            });

            setTimeout(() => {
                deferred.callback(items);
            }, 300);

            return deferred;
        }).bind(this);

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }

    changeData() {
        this._isRed = !this._isRed;
    }
}

export default Source;

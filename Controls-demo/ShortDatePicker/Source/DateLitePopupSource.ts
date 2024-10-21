import { Memory } from 'Types/source';
import { Deferred } from 'Types/deferred';
import formatter = require('Types/formatter');
import { Base as dateUtils } from 'Controls/dateUtils';
import { Query, DataSet } from 'Types/source';

class DateLitePopupSource extends Memory {
    private _$keyProperty: string = 'id';

    query(query: Query): DataSet {
        const offset = query.getOffset();
        const where = query.getWhere();
        const limit = query.getLimit() || 1;
        const executor = function () {
            const adapter = this.getAdapter().forTable();
            const monthEqual = where['id~'];
            const monthGt = where['id>='];
            const monthLt = where['id<='];
            const deferred = new Deferred();
            let month = monthEqual || monthGt || monthLt;
            let items = [];

            if (month) {
                month = formatter.dateFromSql(month);
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
                items.push({
                    id: formatter.dateToSql(month, formatter.TO_SQL_MODE.DATE),
                    extData: i % 2,
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
        }.bind(this);

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }
}

export default DateLitePopupSource;

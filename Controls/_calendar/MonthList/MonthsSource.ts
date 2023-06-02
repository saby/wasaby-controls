/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import {Deferred} from 'Types/deferred';
import { Date as WSDate } from 'Types/entity';
import { Memory, Query, IMemoryOptions } from 'Types/source';
import ITEM_TYPES from './ItemTypes';
import { TemplateFunction } from 'UI/Base';
import monthListUtils from './Utils';
import { Base as dateUtils } from 'Controls/dateUtils';
import { DataSet } from 'Types/source';

/**
 * Источник данных который возвращает данные для построения календарей в списочных контролах.
 * Каждый элемент это месяц.
 *
 * @class Controls/_calendar/MonthList/MonthSource
 * @extends Types/source:Base
 * @private
 */

export default class MonthsSource extends Memory {
    _moduleName: 'Controls._calendar.MonthList.MonthsSource';

    $protected: {
        _dataSetItemsProperty: 'items';
        _dataSetMetaProperty: 'meta';
    };

    _$keyProperty: 'id';

    _hasHeader: boolean = false;
    protected _dateConstructor: Function;
    protected _displayedRanges: [Date, Date][];
    protected _viewMode: string;
    protected _order: string;
    private _stubTemplate: TemplateFunction;
    private _hasBeforeItems: boolean = true;

    constructor(
        options: IMemoryOptions & {
            header: boolean;
            stubTemplate: TemplateFunction;
            dateConstructor: Function;
            displayedRanges: [Date, Date][];
            viewMode: string;
        }
    ) {
        super(options);
        this._hasHeader = options.header;
        this._stubTemplate = options.stubTemplate;
        this._dateConstructor = options.dateConstructor || WSDate;

        this._displayedRanges =
            options.displayedRanges || this._getDefaultDisplayedRanges();
        this._viewMode = options.viewMode;
        this._order = options.order;
    }

    private _getDefaultDisplayedRanges(): [Date, Date][] {
        // Ограничиваем период с 1400 года по (текущий год + 1000)
        const lastMonth = 11;
        return [
            [
                new Date(dateUtils.MIN_YEAR_VALUE, 0),
                new Date(dateUtils.MAX_YEAR_VALUE, lastMonth),
            ],
        ];
    }

    getItemsData(
        limit: number,
        month: Date,
        monthLt?: string,
        monthGt?: string
    ): { items: []; month: Date } {
        const adapter = this.getAdapter().forTable();
        let items = [];
        let delta: number = 1;
        let monthHeader: Date;
        let period: Date[];

        // Проверяем, что месяц непоследний отображаемый, иначе нужно указать в items, что сверху данных больше нет.
        // Заголовок - это отдельный элемент, поэтому если он есть - месяц не является последним элементом.
        const monthBefore = new Date(month.getFullYear(), month.getMonth() - 1);
        if (
            this._order === 'asc' &&
            !this._isDisplayed(monthBefore) &&
            !this._hasHeader
        ) {
            const hiddenPeriod = this._getHiddenPeriod(monthBefore);
            if (hiddenPeriod[0] === null) {
                this._hasBeforeItems = false;
            }
        }
        if (this._order === 'desc') {
            delta *= -1;
        }
        if (monthLt) {
            delta *= -1;
            month = this._shiftRange(month, delta);
        }

        if (monthGt && !this._hasHeader) {
            month = this._shiftRange(month, delta);
        }

        for (let i = 0; i < limit; i++) {
            if (this._hasHeader && delta < 0) {
                monthHeader = this._shiftRange(month, 1);
                if (this._isDisplayed(monthHeader)) {
                    this._pushHeader(items, monthHeader);
                }
            }

            if (this._isDisplayed(month)) {
                items.push({
                    id: monthListUtils.dateToId(month),
                    date: month,
                    type: ITEM_TYPES.body,
                });
            } else {
                period = this._getHiddenPeriod(month, delta);
                // для заглушки от минус бесконечности до даты используем в качестве id дату конца(period[1])
                if (this._stubTemplate) {
                    items.push({
                        id: monthListUtils.dateToId(period[0] || period[1]),
                        date: period[0] || period[1],
                        startValue: period[0],
                        endValue: period[1],
                        type: ITEM_TYPES.stub,
                    });
                }
                if (i === 0 && !period[0]) {
                    this._hasBeforeItems = false;
                }
                month = delta > 0 ? period[1] : period[0];
            }

            if (this._hasHeader && delta > 0 && month) {
                monthHeader = this._shiftRange(month, delta);
                if (this._isDisplayed(monthHeader)) {
                    this._pushHeader(items, monthHeader);
                }
            }

            if (!month) {
                break;
            }
            month = this._shiftRange(month, delta);
        }

        if (monthLt) {
            items = items.reverse();
        }

        this._each(items, (item) => {
            adapter.add(item);
        });
        return {
            items: adapter.getData(),
            month,
        };
    }

    query(query: Query): Promise<DataSet> {
        const offset = query.getOffset();
        const where = query.getWhere();
        const limit = query.getLimit() || 1;

        const executor = () => {
            const monthEqual = where['id~'];
            const monthGt = where['id>='];
            const monthLt = where['id<='];
            let month = monthEqual || monthGt || monthLt;
            this._hasBeforeItems = true;

            month = monthListUtils.idToDate(month, this._dateConstructor);

            month = this._shiftRange(month, offset);

            const items = this.getItemsData(limit, month, monthLt, monthGt);
            month = items.month;

            return this._prepareQueryResult(
                {
                    items: items.items,
                    meta: {
                        total: monthEqual
                            ? {
                                  before: this._hasBeforeItems,
                                  after: Boolean(month),
                              }
                            : Boolean(month),
                    },
                },
                null
            );
        };

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }

    private _pushHeader(items: unknown[], month: Date): void {
        items.push({
            id: 'h' + monthListUtils.dateToId(month),
            date: month,
            type: ITEM_TYPES.header,
        });
    }

    private _isDisplayed(date: Date): boolean {
        if (!this._displayedRanges || !this._displayedRanges.length) {
            return true;
        }
        for (const range of this._displayedRanges) {
            // Строим ленту до тех пор, пока мы не дошли до конца периода, указанного в displayedRanges
            // При проверке, какая дата больше, даты переводятся в формат Unix-времени, т.е. количество секунд прошедшее
            // c 1970 года. Даты раньше 1970 года переводятся в отрицательное число.
            // Если в displayedRanges передали null, то лента должна строится бесконечно. Соотвественно, если мы будем
            // проверять date > null, дата преобразуется в Unix, а null в ноль. Результатом проверки будет false в тех
            // случаях, когда дата раньше 1970 (отрицательное число мньше, чем 0).
            // Добавляем проверку на null.
            const startRange = range[0];
            const endRange = range[1];
            if (
                this._viewMode === 'year' &&
                (
                    (startRange === null || date.getFullYear() >= startRange.getFullYear()) &&
                    (endRange === null || date.getFullYear() <= endRange.getFullYear())
                )
            ) {
                return true;
            }
            if (
                (date >= startRange || startRange === null) &&
                (date <= endRange || endRange === null)
            ) {
                return true;
            }
        }

        return false;
    }

    private _getHiddenPeriod(date: Date): Date[] {
        let range: Date[] = [];
        for (let i = 0; i < this._displayedRanges.length; i++) {
            range = this._displayedRanges[i];
            // См. коммент в методе _isDisplayed. Та же самая ситуация, только мы наоборот ищем период, который не
            // попадает в displayedRanges
            if (date < range[0] && range[0] !== null) {
                return [
                    i === 0
                        ? null
                        : this._shiftRange(this._displayedRanges[i - 1][1], 1),
                    this._shiftRange(range[0], -1),
                ];
            }
        }
        return [range[1] ? this._shiftRange(range[1], 1) : date, null];
    }

    private _shiftRange(date: Date, delta: number): Date {
        if (this._viewMode === 'month') {
            return new this._dateConstructor(
                date.getFullYear(),
                date.getMonth() + delta
            );
        }
        return new this._dateConstructor(date.getFullYear() + delta, 0);
    }
}

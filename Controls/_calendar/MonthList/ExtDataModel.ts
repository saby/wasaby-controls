/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { factory as chainFactory } from 'Types/chain';
import { Date as WSDate } from 'Types/entity';
import { ICrud, Query, DataSet, QueryNavigationType } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';
import { Range } from 'Controls/dateUtils';
import monthListUtils from './Utils';
import { IDateConstructorOptions } from 'Controls/interface';

export interface IOptions extends IDateConstructorOptions {
    viewMode: string;
    source: ICrud;
    filter: object;
    onUpdateDataCallback: Function;
    holidaysGetter: object;
}

export type TItems = RecordSet<Record>;

export default class ExtDataModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;
    protected _data: object = {};
    protected _pendingData: number[] = [];
    protected _holidaysData: object = {};
    protected _viewMode: string;
    protected _source: ICrud;
    protected _filter: object = {};
    protected _holidaysGetter: object;
    protected _onUpdateDataCallback: Function;
    protected _dateConstructor: Function;

    constructor(options: IOptions) {
        super(options);
        this._viewMode = options.viewMode;
        this._source = options.source;
        this._filter = options.filter;
        this._holidaysGetter = options.holidaysGetter;
        this._onUpdateDataCallback = options.onUpdateDataCallback;
        this._dateConstructor = options.dateConstructor || WSDate;
    }

    invalidatePeriod(start: Date, end: Date): void {
        const loadedDates = this._getLoadedDatesIds().map((dateId) => {
            return monthListUtils.idToDate(dateId, this._dateConstructor);
        });

        for (const date of loadedDates) {
            if (date >= start && date <= end) {
                delete this._data[monthListUtils.dateToId(date)];
            }
        }
    }

    enrichItems(dates: number[]): Promise<TItems> {
        const loadedDatesIds: number[] = this._getLoadedDatesIds().map((dateId) => {
            return monthListUtils.idToDate(dateId).getTime();
        });
        const loadedHolidaysDatesIds: number[] = this._getLoadedHolidaysDatesIds().map((dateId) => {
            return monthListUtils.idToDate(dateId).getTime();
        });
        const newDatesIds: number[] = dates.filter((date) => {
            return loadedDatesIds.indexOf(date) === -1 && this._pendingData.indexOf(date) === -1;
        });
        const newHolidaysDatesIds: number[] = dates.filter((date) => {
            return (
                loadedHolidaysDatesIds.indexOf(date) === -1 &&
                this._pendingData.indexOf(date) === -1
            );
        });

        this._pendingData = newDatesIds;
        let startValue: Date;
        let endValue: Date;
        if (newDatesIds.length || newHolidaysDatesIds.length) {
            startValue = new this._dateConstructor(Math.min.apply(null, newDatesIds));
            endValue = new this._dateConstructor(Math.max.apply(null, newDatesIds));
            const sourcePromise = newDatesIds.length
                ? this._getSourcePromise(startValue, endValue)
                : Promise.resolve();
            const holidaysPromise = newHolidaysDatesIds.length
                ? this._getHolidaysPromises(startValue, endValue)
                : Promise.resolve();
            return Promise.all([sourcePromise, holidaysPromise]);
        } else {
            return Promise.resolve(null);
        }
    }

    private _getSourcePromise(startValue: Date, endValue: Date) {
        if (!this._source) {
            return Promise.resolve(null);
        }
        return this._source
            .query(this._getQuery(startValue, endValue))
            .then(this._updateData.bind(this));
    }

    private _getHolidaysPromises(startValue: Date, endValue: Date) {
        if (!this._holidaysGetter) {
            return Promise.resolve(this);
        }
        return this._holidaysGetter.getHolidays(startValue, endValue).then((items) => {
            this.updateHolidaysData(items);
        });
    }

    getData(dateId: string): object {
        return this._data[monthListUtils.getClearDateId(dateId)];
    }

    getHolidaysData(dateId: string): object {
        return this._holidaysData[monthListUtils.getClearDateId(dateId)];
    }

    private _getQuery(start: Date, end: Date): Query {
        let length: number = Range.getPeriodLengthInMonths(start, end);
        const query: Query = new Query();

        if (this._viewMode === 'year') {
            end.setMonth(11);
            length = Range.getPeriodLengthInMonths(start, end);
        }
        start.setMonth(start.getMonth() - 1);

        query.meta({ navigationType: QueryNavigationType.Position });

        return query
            .where({ 'id>=': monthListUtils.dateToId(start), ...this._filter })
            .limit(length);
    }

    private _updateData(items: DataSet, isInitial: boolean = false): void {
        this._pendingData = [];
        // В PrefetchProxy в кэш могут задать Recordset вместо DataSet'а
        const richItems = items.getAll ? items.getAll() : items;
        this.updateData(richItems, isInitial);
        return richItems;
    }

    updateInitialData(position: Date): void {
        const items = this._source.getInitialData(position);
        this._updateData(items, true);
    }

    updateData(items: TItems, isInitial: boolean = false): TItems {
        const extData: object = {};

        if (this._viewMode === 'year') {
            chainFactory(items).each((item, index) => {
                const year: number = parseInt(item.getId().split('-')[0], 10);
                if (!extData[year]) {
                    extData[year] = [item.get('extData')];
                } else {
                    extData[year].push(item.get('extData'));
                }
            });
            for (const year of Object.keys(extData)) {
                this._data[monthListUtils.dateToId(new Date(parseInt(year, 10), 0))] =
                    extData[year];
            }
        } else {
            chainFactory(items).each((item, index) => {
                this._data[item.getId()] = item.get('extData');
            });
        }
        this._onUpdateDataCallback?.(isInitial);

        this._nextVersion();
        return items;
    }

    updateHolidaysData(items) {
        if (this._viewMode === 'year') {
            const extData = [];
            chainFactory(items).each((item) => {
                const year: number = parseInt(item.getId().split('-')[0], 10);
                if (!extData[year]) {
                    extData[year] = [item.get('holidaysData')];
                } else {
                    extData[year].push(item.get('holidaysData'));
                }
            });
            for (const year of Object.keys(extData)) {
                this._holidaysData[monthListUtils.dateToId(new Date(parseInt(year, 10), 0))] =
                    extData[year];
            }
        } else {
            chainFactory(items).each((item) => {
                this._holidaysData[item.getId()] = item.get('holidaysData');
            });
        }
        this._nextVersion();
        this._onUpdateDataCallback?.();
        return items;
    }

    protected _getLoadedDatesIds(): string[] {
        return Object.keys(this._data);
    }

    protected _getLoadedHolidaysDatesIds(): string[] {
        return Object.keys(this._holidaysData);
    }
}

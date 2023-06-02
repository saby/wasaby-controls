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
}

export type TItems = RecordSet<Record>;

export default class ExtDataModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;
    protected _data: object = {};
    protected _viewMode: string;
    protected _source: ICrud;
    protected _filter: object = {};
    protected _dateConstructor: Function;

    constructor(options: IOptions) {
        super(options);
        this._viewMode = options.viewMode;
        this._source = options.source;
        this._filter = options.filter;
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
        if (!this._source) {
            return Promise.resolve(null);
        }

        const loadedDatesIds: number[] = this._getLoadedDatesIds().map(
            (dateId) => {
                return monthListUtils.idToDate(dateId).getTime();
            }
        );
        const newDatesIds: number[] = dates.filter((date) => {
            return loadedDatesIds.indexOf(date) === -1;
        });
        let start: Date;
        let end: Date;

        if (newDatesIds.length) {
            start = new this._dateConstructor(
                Math.min.apply(null, newDatesIds)
            );
            end = new this._dateConstructor(Math.max.apply(null, newDatesIds));
            return this._source
                .query(this._getQuery(start, end))
                .then(this._updateData.bind(this));
        } else {
            return Promise.resolve(null);
        }
    }

    getData(dateId: string): object {
        return this._data[monthListUtils.getClearDateId(dateId)];
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

    private _updateData(items: DataSet): void {
        // В PrefetchProxy в кэш могут задать Recordset вместо DataSet'а
        const richItems = items.getAll ? items.getAll() : items;
        this.updateData(richItems);
        return richItems;
    }

    updateInitialData(): void {
        const items = this._source.getInitialData();
        this._updateData(items);
    }

    updateData(items: TItems): TItems {
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
                this._data[
                    monthListUtils.dateToId(new Date(parseInt(year, 10), 0))
                ] = extData[year];
            }
        } else {
            chainFactory(items).each((item, index) => {
                this._data[item.getId()] = item.get('extData');
            });
        }
        this._nextVersion();
        return items;
    }

    protected _getLoadedDatesIds(): string[] {
        return Object.keys(this._data);
    }
}

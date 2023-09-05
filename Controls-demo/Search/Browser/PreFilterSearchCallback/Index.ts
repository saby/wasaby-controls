import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Search/Browser/PreFilterSearchCallback/Index';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { query } from 'Application/Env';

function generateData(count: number, title: string, anotherTitle: string): object[] {
    const data = [];
    for (let i = 0; i <= count; i++) {
        data.push({ id: i, title: i % 2 === 0 ? title : anotherTitle });
    }
    return data;
}

const DATA_COUNT = 1000;

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _source: Memory;
    protected _navigation: object;

    protected _searchValue: string;
    protected _queryTimeout: string;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: generateData(DATA_COUNT, 'Разработка', 'Администрация'),
            keyProperty: 'id',
            filter: (item, query) => {
                return (
                    !query.title ||
                    item.get('title').toLowerCase().includes(query.title.toLowerCase())
                );
            },
        });

        // Эмуляция задержки при получении данных через локальный источник
        const originQuery = this._source.query;
        this._queryTimeout = query.get.timeout ? query.get.timeout : '1000';
        this._source.query = (query) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(originQuery.call(this._source, query));
                }, this._queryTimeout);
            });
        };

        this._navigation = {
            view: 'infinity',
            source: 'page',
            sourceConfig: {
                pageSize: 25,
                page: 0,
                hasMore: false,
            },
        };
    }

    protected _filterOnSearchCallback(searchValue: string, item: Model): boolean {
        return item.get('title').toLowerCase().includes(searchValue.toLowerCase());
    }
}

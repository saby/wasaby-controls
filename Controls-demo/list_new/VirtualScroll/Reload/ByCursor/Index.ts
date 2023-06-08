import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Reload/ByCursor/ByCursor';
import { DataSet, Memory, Query } from 'Types/source';
import { slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { INavigationOptionValue, INavigationPositionSourceConfig } from 'Controls/interface';

interface IItem {
    key: number;
    title: string;
}

class PositionSourceMock extends Memory {
    query(query?: Query<unknown>): Promise<DataSet> {
        const filter = query.getWhere();
        const limit = query.getLimit();

        const isPrepend = typeof filter['key<='] !== 'undefined';
        const isAppend = typeof filter['key>='] !== 'undefined';
        const isPosition = typeof filter['key~'] !== 'undefined';
        const items: IItem[] = [];
        let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

        if (isPrepend) {
            position -= limit;
        }

        for (let i = 0; i < limit; i++, position++) {
            items.push({
                key: position,
                title: `Запись #${position}`,
            });
        }

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items,
                    meta: {
                        total: isPosition ? { before: true, after: true } : true,
                    },
                },
                null
            )
        );
    }
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: PositionSourceMock;
    protected _navigation: INavigationOptionValue<INavigationPositionSourceConfig> =
        this._getNavigation(0);

    protected _beforeMount(): void {
        this._source = new PositionSourceMock({ keyProperty: 'key' });
    }

    protected _changePosition(_: Event, correction: number): void {
        if (!correction) {
            this._navigation = this._getNavigation(60);
        } else {
            const newPosition = (this._navigation.sourceConfig.position as number) + correction;
            this._navigation = this._getNavigation(newPosition);
        }
    }

    private _getNavigation(
        position: number
    ): INavigationOptionValue<INavigationPositionSourceConfig> {
        return {
            source: 'position',
            view: 'infinity',
            sourceConfig: {
                field: 'key',
                position,
                direction: 'bothways',
                limit: 20,
            },
        };
    }

    protected _slowDownSource(): void {
        slowDownSource(this._source, 500);
    }
}

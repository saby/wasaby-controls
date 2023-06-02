import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { object } from 'Types/util';
import controlTemplate = require('wml!Controls-demo/Browser/ListConfigurations/ListConfigurations');
import { Memory } from 'Types/source';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import { TKey } from 'Controls/interface';
import { IListConfiguration } from 'Controls/browser';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: TKey[] = [];
    protected _excludedKeys: TKey[] = [];
    protected _listConfigurations: IListConfiguration[];

    protected _beforeMount(): Promise<void> | void {
        const firstListSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    id: 0,
                    title: 'Sasha',
                },
                {
                    id: 1,
                    title: 'Sergey',
                },
                {
                    id: 2,
                    title: 'Dmitry',
                },
            ],
            filter: memorySourceFilter('title'),
        });
        const secondListSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    id: 3,
                    title: 'Yaroslavl',
                },
                {
                    id: 4,
                    title: 'Moscow',
                },
                {
                    id: 5,
                    title: 'Kostroma',
                },
            ],
            filter: memorySourceFilter('title'),
        });
        this._listConfigurations = [
            {
                id: 'firstList',
                source: firstListSource,
                keyProperty: 'id',
                searchParam: 'title',
            },
            {
                id: 'secondList',
                source: secondListSource,
                keyProperty: 'id',
                searchParam: 'title',
            },
        ];
    }

    private _filterChanged(
        event: SyntheticEvent,
        filter: object,
        listId: string
    ): void {
        this._listConfigurations = object.clone(this._listConfigurations);
        this._getListConfig(listId).filter = filter;
    }

    private _getListConfig(listId: string): IListConfiguration {
        return this._listConfigurations.find(({ id }) => {
            return id === listId;
        });
    }
    static _styles: string[] = [
        'Controls-demo/Browser/ListConfigurations/ListConfigurations',
    ];
}

export default Demo;

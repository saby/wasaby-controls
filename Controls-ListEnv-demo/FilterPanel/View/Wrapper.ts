import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Wrapper';
import { ILoadDataResult } from 'Controls/dataSourceOld';
import { Memory } from 'Types/source';
import * as memorySourceFilter
    from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import { IFilterItem } from 'Controls/filter';

const listData = [
    {
        id: 0,
        name: 'Александр',
        city: 'Ярославль',
    },
    {
        id: 1,
        name: 'Алексей',
        city: 'Рыбинск',
    },
    {
        id: 2,
        name: 'Дмитрий',
        city: 'Ярославль',
    },
    {
        id: 3,
        name: 'Андрей',
        city: 'Рыбинск',
    },
];

const cityFilterData = [
    {
        city: 'Ярославль',
    },
    {
        city: 'Рыбинск',
    },
    {
        city: 'Москва',
    },
];

const namesFilterData = [
    {
        name: 'Александр',
    },
    {
        name: 'Алексей',
    },
    {
        name: 'Дмитрий',
    },
    {
        name: 'Андрей',
    },
];

interface IReceivedState {
    loadResults: ILoadDataResult;
}

export default class WidgetWrapper extends Control<IControlOptions, IReceivedState> {
    protected _template: TemplateFunction = template;
    protected _prefetchResults: unknown = null;

    protected _beforeMount(): void | Promise<void> {
        const listSource = new Memory({
            data: listData,
            keyProperty: 'id',
            filter: memorySourceFilter(),
        });
        const filterSource = [
            {
                name: 'name',
                caption: 'Имя',
                value: null,
                resetValue: null,
                viewMode: 'basic',
                textValue: '',
                editorOptions: {
                    source: new Memory({
                        data: namesFilterData,
                        keyProperty: 'name',
                        filter: memorySourceFilter(),
                    }),
                    keyProperty: 'name',
                    displayProperty: 'name',
                },
                editorTemplateName: 'Controls/filterPanel:ListEditor',
            },
            {
                name: 'city',
                caption: 'Город проживания',
                value: null,
                resetValue: null,
                viewMode: 'basic',
                textValue: '',
                editorOptions: {
                    source: new Memory({
                        data: cityFilterData,
                        keyProperty: 'city',
                        filter: memorySourceFilter(),
                    }),
                    keyProperty: 'city',
                    displayProperty: 'city',
                },
                editorTemplateName: 'Controls/filterPanel:ListEditor',
            },
        ] as IFilterItem[];

        return import('Controls/dataSourceOld')
            .then(
                ({ DataLoader }) =>
                    new DataLoader().load([
                        {
                            source: listSource,
                            filterButtonSource: filterSource,
                            keyProperty: 'id',
                        },
                    ]) as Promise<unknown>
            )
            .then(([loadResults]) => {
                this._prefetchResults = loadResults;
            });
    }
}

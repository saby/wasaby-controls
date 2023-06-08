import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Browser/ListConfigurations/Operations/ListConfigurations');
import { Memory } from 'Types/source';
import { TKey } from 'Controls/interface';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: TKey[] = [];
    protected _excludedKeys: TKey[] = [];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        const firstListSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    id: 0,
                    title: 'Александр',
                },
                {
                    id: 1,
                    title: 'Сергей',
                },
                {
                    id: 2,
                    title: 'Дмитрий',
                },
            ],
            filter: MemorySourceFilter(),
        });
        const secondListSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    id: 3,
                    title: 'Андрей',
                },
                {
                    id: 4,
                    title: 'Алексей',
                },
                {
                    id: 5,
                    title: 'Александр',
                },
            ],
            filter: MemorySourceFilter(),
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
    static _styles: string[] = [
        'Controls-demo/Browser/ListConfigurations/ListConfigurations',
    ];
}

export default Demo;

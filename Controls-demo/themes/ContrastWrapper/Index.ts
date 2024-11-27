import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { RecordSet } from 'Types/collection';
import { TItemActionShowType } from 'Controls/itemActions';
import { Data } from 'Controls-demo/themes/ContrastWrapper/Data';

import * as RootColumnTemplate from 'wml!Controls-demo/themes/ContrastWrapper/RootColumnTemplate';
import * as Template from 'wml!Controls-demo/themes/ContrastWrapper/ContrastWrapper';
import { Model } from 'Types/entity';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _rootSource: Memory;
    protected _rootColumns: IColumn[];
    protected _items: RecordSet;
    protected _buttonStyles: string[] = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'unaccented',
        'default',
        'pale',
    ];

    protected _beforeMount(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._rootSource = new Memory({
            keyProperty: 'key',
            data: Data.getRootData(),
        });
        this._rootColumns = [
            {
                displayProperty: 'title',
                width: '500px',
                template: RootColumnTemplate,
                templateOptions: {
                    nestedSource: new Memory({
                        keyProperty: 'key',
                        data: Data.getData(),
                    }),
                    nestedColumns: Data.getColumns(),
                    itemActions: [
                        {
                            id: 1,
                            icon: 'icon-Erase icon-error',
                            title: 'delete',
                            showType: TItemActionShowType.TOOLBAR,
                        },
                    ],
                    dataLoadCallback: this._dataLoadCallback,
                    header: Data.getHeader(),
                },
            },
        ];
    }

    private _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: this._generateResults(items),
        });
    }

    private _generateResults(items: RecordSet): Model {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'population', type: 'real' },
                { name: 'square', type: 'real' },
                { name: 'populationDensity', type: 'real' },
            ],
        });

        const data = Countries.getResults().full[0];

        results.set('population', data.population);
        results.set('square', data.square);
        results.set('populationDensity', data.populationDensity);
        return results;
    }
}

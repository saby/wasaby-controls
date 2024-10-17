import { Control, TemplateFunction } from 'UI/Base';
import { Memory as DefaultMemory } from 'Types/source';
import { register } from 'Types/di';
import { Model } from 'Types/entity';

import Memory from './Memory';
import { slowDownSource } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/LoadingIndicator/Both/Both';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = null;
    protected _keyProperty: string = 'key';
    protected _groupProperty: string = undefined;
    protected _filter: Object = null;
    protected _navigation: object = {
        view: 'infinity',
        source: 'position',
        sourceConfig: {
            field: 'key',
            position: 0,
            direction: 'bothways',
            limit: 15,
        },
    };
    private _fastFilterData: any;
    protected _indicatorsWithMsg: boolean = false;

    protected _beforeMount(): void {
        this._viewSource = new Memory({ keyProperty: this._keyProperty });
        this._filter = {};
        this._fastFilterData = [
            {
                name: 'filter',
                value: null,
                resetValue: null,
                emptyText: 'Все',
                editorOptions: {
                    source: new DefaultMemory({
                        keyProperty: 'id',
                        data: [
                            { id: 'few-items', title: 'Мало записей' },
                            { id: 'more-items', title: 'Много записей' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
    }

    protected _afterMount(): void {
        const urlParams = new URLSearchParams(window.location.search);
        this._indicatorsWithMsg = !!urlParams.get('indicators-with-msg');
        const loadingTimeout = urlParams.get('loading-timeout');
        slowDownSource(this._viewSource, Number(loadingTimeout) || 2000);
    }

    protected _onReload(): void {
        this._viewSource = new Memory({
            keyProperty: this._keyProperty,
            model: 'LoadingIndicator/Both/MyModel',
        });
        slowDownSource(this._viewSource, 2500);
    }

    protected _addEmptyGroup(): void {
        this._groupProperty = 'group';
    }
}

// export default Object.assign(connectToDataContext(Demo), {
//     g_etLoadConfi_g(): Record<string, IDataConfig<IListDataFactoryArguments>> {
//         return {
//             listData: {
//                 dataFactoryName: 'Controls/dataFactory:List',
//                 dataFactoryArguments: {
//                     displayProperty: 'title',
//                     source: new Memory({ keyProperty: 'key' }),
//                     navigation: {
//                         view: 'infinity',
//                         source: 'position',
//                         sourceConfig: {
//                             field: 'key',
//                             position: 0,
//                             direction: 'bothways',
//                             limit: 15,
//                         },
//                     },
//                     filter: {},
//                     searchParam: 'title',
//                     minSearchLength: 3,
//                     filterButtonSource: fastFilterData
//                 },
//             },
//         };
//     },
// });

class MyModel extends Model {}
register('LoadingIndicator/Both/MyModel', MyModel, { instantiate: false });

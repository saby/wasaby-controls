import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/DemandToInfinity/DemandToInfinity';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _dataArray: unknown = generateData({
        count: 30,
        entityTemplate: { title: 'lorem' },
    });
    protected _view: 'demand' | 'infinity' = 'demand';
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
    protected _switchNavigation(): void {
        this._view = this._view === 'demand' ? 'infinity' : 'demand';
    }
}

// export default Object.assign(connectToDataContext(Demo), {
//     g_etLoadConfi_g(): Record<string, IDataConfig<IListDataFactoryArguments>> {
//         return {
//             DemandToInfinity: {
//                 dataFactoryName: 'Controls/dataFactory:List',
//                 dataFactoryArguments: {
//                     displayProperty: 'title',
//                     source: new Memory({
//                         keyProperty: 'key',
//                         data: getData(),
//                     }),
//                     navigation: {
//                         source: 'page',
//                         view: 'demand',
//                         sourceConfig: {
//                             pageSize: 3,
//                             page: 0,
//                             hasMore: false,
//                         },
//                         viewConfig: {
//                             pagingMode: 'basic',
//                         },
//                     },
//                 },
//             },
//         };
//     },
// });

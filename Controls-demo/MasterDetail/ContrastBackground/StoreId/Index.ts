import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-demo/MasterDetail/ContrastBackground/StoreId/Index';
import { SyntheticEvent } from 'UI/Vdom';
import * as cClone from 'Core/core-clone';
import { connectToDataContext } from 'Controls/context';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';
import { master } from 'Controls-demo/MasterDetail/Data';

function getMasterData() {
    return cClone(master);
}

interface IOptions extends IControlOptions {
    _dataOptionsValue: { detail: unknown };
}

class Demo extends Control<IOptions> {
    protected _template: TemplateFunction = Template;
    protected _gridColumns: object[] = [
        {
            displayProperty: 'name',
            width: '70%',
        },
        {
            displayProperty: 'count',
            width: '30%',
        },
    ];

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._options._dataOptionsValue.detail.setFilter({
            myOpt: key,
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo', 'Controls-demo/MasterDetail/Demo'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getMasterData(),
                    }),
                    markerVisibility: 'visible',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'name',
                    source: new DemoSource({ keyProperty: 'id' }),
                    filter: {
                        myOpt: '0',
                    },
                },
            },
        };
    },
});

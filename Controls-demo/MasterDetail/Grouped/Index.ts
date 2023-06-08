import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import * as Template from 'wml!Controls-demo/MasterDetail/Grouped/Grouped';
import { Master } from '../DataHelpers/Master';
import { IHeaderCell, IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

function getMasterData() {
    return Master.getData();
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _markedKey: 0;
    protected _columns: IColumn[] = Master.getColumns();
    protected _header: IHeaderCell[] = Master.getHeader();

    protected _onMarkedKeyChanged(e: SyntheticEvent<Event>, key: number): void {
        this._options._dataOptionsValue.detail.setFilter({
            myOpt: key,
        });
    }

    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        parentProperty: 'Раздел',
                        keyProperty: 'id',
                        data: getMasterData(),
                    }),
                    markerVisibility: 'visible',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    root: null,
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({ keyProperty: 'id' }),
                    filter: {
                        myOpt: '0',
                    },
                },
            },
        };
    }
});

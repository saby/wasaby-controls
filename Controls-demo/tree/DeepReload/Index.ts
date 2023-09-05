import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

import * as Template from 'wml!Controls-demo/tree/DeepReload/DeepReload';

function getData() {
    return data;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _expandedItems: CrudEntityKey[] = [];
    protected _collapsedItems: CrudEntityKey[] = [];

    /**
     * При deepReload=true смена source, filter, sorting, навигации, root
     * не сбросит раскрытые узлы при перезагрузке.
     * В этом методе подменяем source
     * @private
     */
    protected _changeSource(): void {
        this._options._dataOptionsValue.listData.setState({
            source: new ExpandedSource({
                keyProperty: 'key',
                data: getData(),
                parentProperty: 'parent',
                useMemoryFilter: true,
            })
        })
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'visible',
                    deepReload: true,
                },
            },
        };
    }
});

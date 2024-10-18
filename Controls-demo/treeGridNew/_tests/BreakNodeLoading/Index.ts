import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/_tests/BreakNodeLoading/BreakNodeLoading';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import HierarchicalMemoryWithBreakNodeLoading from './DemoSource';
import { connectToDataContext, IContextValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextValue;
}

const { getData } = Flat;

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown[] = Flat.getColumns();

    protected _buttonClick(): void {
        const source = this._options._dataOptionsValue._testsBreakNodeLoading.source;
        if (source.isLoadingBreak()) {
            source.restoreLoading();
        }
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            _testsBreakNodeLoading: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemoryWithBreakNodeLoading({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});

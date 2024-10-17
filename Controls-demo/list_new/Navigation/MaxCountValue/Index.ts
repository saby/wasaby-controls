import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MaxCountValue/MaxCountValue';
import { changeSourceData } from '../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import DemoSource from './DemoSource';
import InitialMemory from './InitialMemory';

const { data2 } = changeSourceData();

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;

    protected _onChangeSource() {
        const source = new DemoSource({
            keyProperty: 'key',
            data: data2,
        });
        source.queryNumber = 0;
        this._options._dataOptionsValue.NavigationMaxCountValue.setState({
            source,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationMaxCountValue: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new InitialMemory({
                        keyProperty: 'key',
                        data: [],
                    }),
                    navigation: {
                        source: 'page',
                        view: 'maxCount',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                        },
                        viewConfig: {
                            maxCountValue: 6,
                        },
                    },
                },
            },
        };
    },
});

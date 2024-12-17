import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ChangeSourceFromNull/ChangeSourceFromNull';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;

    protected _setSource(e: SyntheticEvent) {
        this._options._dataOptionsValue.ChangeSourceFromNull.setState({
            source: new Memory({
                keyProperty: 'key',
                data: getData(),
            }),
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ChangeSourceFromNull: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'key',
                    displayProperty: 'title',
                    source: null,
                },
            },
        };
    },
});

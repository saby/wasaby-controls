import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/Global/Global';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { getFewCategories as getData, slowDownSource } from '../../DemoHelpers/DataCatalog';
import { URL } from 'Browser/Transport';

const queryParam = URL.getQueryParam('timeout');
const TIMEOUT = queryParam !== '' ? Number(queryParam) : 0;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;

    protected _reloadList(): void {
        const source = this.props._dataOptionsValue.LoadingIndicatorGlobal.source;
        slowDownSource(source, TIMEOUT);
        this._children.list.reload();
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorGlobal: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});

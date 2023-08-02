import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndFooter/HasHeaderAndFooter';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue
}

function getData() {
    return generateData({
        count: 200,
        entityTemplate: { title: 'lorem' },
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: [] = [{ displayProperty: 'title' }];
    protected _header: [] = [{ caption: 'Заголовок' }];

    protected _beforeMount(props: IProps): void {
        const source = props._dataOptionsValue.listData.source;
        const loadingTimeout = new URLSearchParams(window?.location?.search).get('loading-timeout');
        slowDownSource(source, Number(loadingTimeout) || 2000);
    }

    protected _onReload(): void {
        this._children.list.reload();
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 20,
                            page: 5,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
});

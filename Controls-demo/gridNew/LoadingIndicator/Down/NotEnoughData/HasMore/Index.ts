import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/HasMore/HasMore';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextValue } from 'Controls/context';
import { URL } from 'Browser/Transport';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextValue;
}

function getData() {
    return generateData({
        count: 50,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = item.key + 1 + ') Запись с id = ' + item.key;
        },
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: [] = [{ displayProperty: 'title' }];

    protected _afterMount(props: IProps): void {
        const loadingTimeout = URL.getQueryParam('loading-timeout') || 2000;
        const source = props._dataOptionsValue.NotEnoughDataHasMore.source;
        slowDownSource(source, Number(loadingTimeout));
    }

    protected _onReload(): void {
        this._children.list.reload();
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NotEnoughDataHasMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    },
});

import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotHasMore/NotHasMore';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData(count: number) {
    return generateData({
        count,
        entityTemplate: { title: 'lorem' },
    });
}

function getSource(): Memory {
    return new Memory({
        keyProperty: 'key',
        data: getData(10),
    });
}

function getBigSource(): Memory {
    return new Memory({
        keyProperty: 'key',
        data: getData(100),
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];

    protected _onReload(): void {
        this._children.list.reload();
    }

    protected _onReloadWithMoreData(): void {
        const slice = this._options._dataOptionsValue.LoadingIndicatorBothNotEnoughDataNotHasMore;
        slice.setState({
            source: getBigSource(),
            navigation: {
                source: 'page',
                view: 'infinity',
                sourceConfig: {
                    pageSize: 20,
                    page: 2,
                    hasMore: false,
                },
            },
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorBothNotEnoughDataNotHasMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
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
    },
});

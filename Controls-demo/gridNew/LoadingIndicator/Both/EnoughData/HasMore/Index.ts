import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/HasMore/HasMore';
import { Memory } from 'Types/source';
import { URL } from 'Browser/Transport';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { INavigationOptionValue, INavigationPageSourceConfig } from 'Controls/interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return generateData({
        count: 80,
        entityTemplate: { title: 'lorem' },
    });
}

function getNewData() {
    return generateData({
        count: 80,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.new = true;
        },
    });
}

function initSource(newItems: boolean = false): Memory {
    const source = new Memory({
        keyProperty: 'key',
        data: newItems ? getNewData() : getData(),
    });
    slowDownSource(source, 2000);
    return source;
}

function getNavigation() {
    const page = URL.getQueryParam('page');

    return {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            pageSize: 20,
            page: page ? Number(page) : 2,
            hasMore: false,
        },
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: [] = [{ displayProperty: 'title' }];
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig>;
    protected _gridVisible: boolean = true;

    protected _onReload(): void {
        this._options._dataOptionsValue.LoadingIndicatorBothEnoughDataHasMore.setState({
            source: initSource(true),
        });
    }

    protected _onReloadWithNewNavigation(): void {
        const newNavigation: INavigationOptionValue<INavigationPageSourceConfig> = {
            ...getNavigation(),
        };
        newNavigation.sourceConfig.pageSize = 10;
        this._options._dataOptionsValue.LoadingIndicatorBothEnoughDataHasMore.setState({
            navigation: newNavigation,
        });
        this._children.list.reload(false, newNavigation.sourceConfig);
    }

    protected _onToggleGridVisibility(): void {
        this._gridVisible = !this._gridVisible;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorBothEnoughDataHasMore: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: initSource(),
                    navigation: getNavigation(),
                },
            },
        };
    },
});

import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/reload/Template';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { ExtendedSlice } from 'Controls-demo/list_new/reload/CustomFactory';

interface IItem {
    title: string;
    key: number | string;
}

function getData(): IItem[] {
    return generateData({
        count: 300,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с идентификатором ${item.key}`;
        },
    });
}

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue & { reload: ExtendedSlice };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _position: number = 0;
    protected _reloadsCount: number = 0;

    protected _reload() {
        const slice = this._options._dataOptionsValue.reload;
        this._reloadsCount++;
        slice.setState({
            reloadsCount: this._reloadsCount
        });
        this._children.list.reload(true);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            reload: {
                dataFactoryName: 'Controls-demo/list_new/reload/CustomFactory',
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
                            page: 0,
                            pageSize: 50,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    },
});

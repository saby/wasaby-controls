import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/DigitPaging/MinElements/MinElements';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { generateData } from '../../../DemoHelpers/DataCatalog';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

interface IItem {
    title: string;
    key: number | string;
}

function getData(elementsCount: number = 5): Record<string, any> {
    return generateData({
        count: elementsCount,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с идентификатором ${item.key} и каким то не очень длинным текстом`;
        },
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    private _elementsCount: number = 5;

    protected _onUpdateElementsCount() {
        this._elementsCount = this._elementsCount === 5 ? 6 : 5;
        this._options._dataOptionsValue.NavigationDigitPagingMinElements3.setState({
            source: new Memory({
                keyProperty: 'key',
                data: getData(this._elementsCount),
            }),
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationDigitPagingMinElements3: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'pages',
                        sourceConfig: {
                            pageSize: 10,
                            hasMore: false,
                            page: 0,
                        },
                        viewConfig: {
                            totalInfo: 'basic',
                        },
                    },
                },
            },
        };
    },
});

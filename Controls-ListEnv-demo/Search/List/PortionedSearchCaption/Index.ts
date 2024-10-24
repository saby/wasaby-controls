import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { URL } from 'Browser/Transport';

import * as Template from 'wml!Controls-ListEnv-demo/Search/List/PortionedSearchCaption/PortionedSearchCaption';
import PortionedSearchMemory from 'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchMemory';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const queryParam = URL.getQueryParam('timeout');
const TIMEOUT = queryParam !== '' ? Number(queryParam) : 5000;

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;

    protected _beforeMount(): void {
        this.props._dataOptionsValue.SearchingPortionedSearch.source.setLongLoad(true);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchingPortionedSearch: {
                dataFactoryName:
                    'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchCustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PortionedSearchMemory({
                        direction: 'down',
                        keyProperty: 'key',
                        longLoadTimeout: TIMEOUT,
                    }),
                    filter: {},
                    searchParam: 'title',
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'forward',
                            limit: 20,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                    minSearchLength: 3,
                },
            },
        };
    },
});

import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/Up/Up';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { URL } from 'Browser/Transport';

const queryParam = URL.getQueryParam('timeout');
const TIMEOUT = queryParam !== '' ? Number(queryParam) : 0;

interface IItem {
    title: string;
    key: string | number;
}

function getData(): IItem[] {
    return generateData<{
        key: string | number;
        title: string;
    }>({
        count: 100,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись списка с id = ${item.key}.`;
        },
    });
}

function getSource(): Memory {
    const source = new Memory({
        keyProperty: 'key',
        data: getData(),
    });
    slowDownSource(source, TIMEOUT);
    return source;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorUp: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            direction: 'bothways',
                            pageSize: 20,
                            page: 6,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    }

    protected _saveItems = (items: RecordSet) => {
        this._items = items;
    };

    protected _removeTopItem = () => {
        this._items.removeAt(0);
    };

    protected _changeTopItem = () => {
        this._items
            .at(0)
            .set(
                'title',
                'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. ' +
                    'Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст. Длинный текст.'
            );
    };
}

import * as React from 'react';
import { generateData } from '../../../../DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View } from 'Controls/columns';
import { Container as ScrollContainer } from 'Controls/scroll';
import { BaseItem } from 'Controls-Templates/itemTemplates';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
const NUMBER_OF_ITEMS = 20;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string; height: number }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". `;
            item.height = item.key % 6 ? 50 : 300;
        },
    });
}

export default class Demo extends React.Component {
    protected _items: RecordSet;
    protected _itemsReadyCallback = (items: RecordSet) => {
        this._items = items;
    };
    protected _moveItem = (item: Model) => {
        const index = this._items.getIndex(item);
        this._items.move(index, 0);
    };
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewColumnsModeAdaptive: {
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
                            pageSize: 5,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
    render() {
        return (
            <ScrollContainer className={'controlsDemo__height800'}>
                <View
                    storeId={'ColumnsViewColumnsModeAdaptive'}
                    columnsMode={'adaptive'}
                    columnsCount={5}
                    itemsReadyCallback={this._itemsReadyCallback}
                    itemTemplate={(props) => (
                        <BaseItem
                            {...props}
                            borderVisibility={'visible'}
                            paddingLeft={'s'}
                            paddingTop={'s'}
                            style={{ height: props.item.contents.get('height') + 'px' }}
                        >
                            <span>{props.item.contents.get('title')}</span>
                            <button onClick={() => this._moveItem(props.item.contents)}>
                                В начало
                            </button>
                        </BaseItem>
                    )}
                />
            </ScrollContainer>
        );
    }
}

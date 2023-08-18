import * as React from 'react';
import { View } from 'Controls/adaptiveTile';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import 'css!DemoStand/Controls-demo';
import { INavigationOptionValue, INavigationPageSourceConfig } from 'Controls/interface';

const DATA = [
    {
        key: '1',
        caption: 'Первый',
    },
    {
        key: '2',
        caption: 'Второй',
    },
    {
        key: '3',
        caption: 'Третий',
    },
    {
        key: '4',
        caption: 'Четвертый',
    },
    {
        key: '5',
        caption: 'Пятый',
    },
    {
        key: '6',
        caption: 'Шестой',
    },
    {
        key: '7',
        caption: 'Седьмой',
    },
    {
        key: '8',
        caption: 'Восьмой',
    },
];

interface IState {
    source: Memory;
    longSource: Memory;
    loadMode: boolean;
    itemsCount: number;
    availableHeight: number;
    availableWidth: number;
    navigation: INavigationOptionValue<INavigationPageSourceConfig>;
}

const LONG_DATA_COUNT = 100;
function getLongData(): Object[] {
    const data = [];
    for (let i = 1; i <= LONG_DATA_COUNT; i++) {
        data.push({
            key: i,
            caption: `Запись №${i}`,
        });
    }
    return data;
}

const ITEM_TEMPLATE = React.memo(({ styleProp, className, item }) => {
    return (
        <div
            className={
                className +
                ' controls-roundedCorner_size_m controls-background-unaccented controls-padding-m'
            }
            style={styleProp}
        >
            {item.contents.get('caption')}
        </div>
    );
});

export default class Index extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loadMode: false,
            itemsCount: 1,
            availableHeight: 300,
            availableWidth: 600,
            source: new Memory({
                data: DATA.slice(0, 1),
                keyProperty: 'key',
            }),
            longSource: new Memory({
                data: getLongData(),
                keyProperty: 'key',
            }),
            navigation: {
                source: 'page',
                view: 'infinity',
                sourceConfig: {
                    page: 0,
                    pageSize: 4,
                    hasMore: false,
                },
            },
        };
    }
    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper'}>
                <div>
                    <div>
                        <button
                            data-qa="height-1"
                            onClick={() => {
                                return this.setState({ availableHeight: 200 });
                            }}
                            disabled={this.state.availableHeight === 200}
                        >
                            Высоты хватает на 1 запись
                        </button>
                        <button
                            data-qa="height-2"
                            onClick={() => {
                                return this.setState({ availableHeight: 300 });
                            }}
                            disabled={this.state.availableHeight === 300}
                        >
                            Высоты хватает на 2 записи
                        </button>
                        <button
                            data-qa="height-3"
                            onClick={() => {
                                return this.setState({ availableHeight: 400 });
                            }}
                            disabled={this.state.availableHeight === 400}
                        >
                            Высоты хватает на 3 записи
                        </button>
                    </div>
                    <div>
                        <button
                            data-qa="width-1"
                            onClick={() => {
                                return this.setState({ availableWidth: 300 });
                            }}
                            disabled={this.state.availableWidth === 300}
                        >
                            Ширина под 1 запись
                        </button>
                        <button
                            data-qa="width-2"
                            onClick={() => {
                                return this.setState({ availableWidth: 400 });
                            }}
                            disabled={this.state.availableWidth === 400}
                        >
                            Ширина между 1 и 2 записями
                        </button>
                        <button
                            data-qa="width-3"
                            onClick={() => {
                                return this.setState({ availableWidth: 600 });
                            }}
                            disabled={this.state.availableWidth === 600}
                        >
                            Ширина под 2 записи
                        </button>
                        <button
                            data-qa="width-4"
                            onClick={() => {
                                return this.setState({ availableWidth: 800 });
                            }}
                            disabled={this.state.availableWidth === 800}
                        >
                            Ширина между 2 и 3 записями
                        </button>
                        <button
                            data-qa="width-5"
                            onClick={() => {
                                return this.setState({ availableWidth: 1700 });
                            }}
                            disabled={this.state.availableWidth === 1700}
                        >
                            Большая ширина
                        </button>
                    </div>
                    <div>
                        <button
                            data-qa="remove-item"
                            disabled={this.state.loadMode || this.state.itemsCount <= 1}
                            onClick={() => {
                                this.setState({
                                    itemsCount: this.state.itemsCount - 1,
                                    source: new Memory({
                                        data: DATA.slice(0, this.state.itemsCount - 1),
                                        keyProperty: 'key',
                                    }),
                                });
                            }}
                        >
                            Удалить запись
                        </button>
                        <button
                            data-qa="add-item"
                            disabled={this.state.loadMode || this.state.itemsCount >= DATA.length}
                            onClick={() => {
                                this.setState({
                                    itemsCount: this.state.itemsCount + 1,
                                    source: new Memory({
                                        data: DATA.slice(0, this.state.itemsCount + 1),
                                        keyProperty: 'key',
                                    }),
                                });
                            }}
                        >
                            Добавить запись
                        </button>
                        <button
                            data-qa="load-on"
                            disabled={this.state.loadMode}
                            onClick={() => {
                                this.setState({
                                    loadMode: true,
                                });
                            }}
                        >
                            Включить загрузку
                        </button>
                        <button
                            data-qa="load-off"
                            disabled={!this.state.loadMode}
                            onClick={() => {
                                this.setState({
                                    loadMode: false,
                                });
                            }}
                        >
                            Выключить загрузку
                        </button>
                    </div>
                    <Container
                        className={`controlsDemo_bordered
                                    controlsDemo_fixedWidth${this.state.availableWidth}
                                    controlsDemo__height${this.state.availableHeight}`}
                        scrollOrientation="horizontal"
                        horizontalScrollMode="buttons"
                        smoothScrolling={true}
                        content={
                            <View
                                source={
                                    this.state.loadMode ? this.state.longSource : this.state.source
                                }
                                navigation={this.state.loadMode && this.state.navigation}
                                minItemHeight={100}
                                maxItemHeight={284}
                                minItemWidth={284}
                                maxItemWidth={584}
                                availableHeight={this.state.availableHeight}
                                availableWidth={this.state.availableWidth}
                                itemTemplate={ITEM_TEMPLATE}
                            />
                        }
                    ></Container>
                </div>
            </div>
        );
    }
}

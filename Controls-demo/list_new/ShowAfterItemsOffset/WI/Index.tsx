import * as React from 'react';

import { RecordSet } from 'Types/collection';

import { ItemsView as ListView, IVirtualScrollConfig } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import 'css!Controls-demo/list_new/ShowAfterItemsOffset/WI/style';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { AddButton } from 'Controls/list';
import { getActionsForContacts } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

const ITEMS_COUNT = 30;

interface IItem {
    key: number;
    title: string;
}

function ContentBottomPaddingDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const [hasFooter, setHasFooter] = React.useState(false);
    const [hasPagingMode, setHasPagingMode] = React.useState(false);
    const items = React.useMemo(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: generateData({
                keyProperty: 'key',
                count: ITEMS_COUNT,
                beforeCreateItemCallback: (item: IItem) => {
                    item.title = `Запись с ключом ${item.key}.`;
                },
            }),
        });
    }, []);

    const virtualScrollConfig = React.useMemo<IVirtualScrollConfig>(() => {
        return { pageSize: 10 };
    }, []);

    const getListViewProps = React.useMemo(() => {
        const resultProps = {};
        if (hasFooter) {
            resultProps.footerTemplate = () => {
                return <AddButton caption={'Add record'} />;
            };
        }

        if (hasPagingMode) {
            resultProps.navigation = {
                source: 'page',
                view: 'infinity',
                sourceConfig: {
                    pageSize: 10,
                    page: 0,
                    hasMore: false,
                },
                viewConfig: {
                    pagingMode: 'basic',
                },
            };
        }

        return resultProps;
    }, [hasFooter, hasPagingMode]);
    const divStyle = {
        display: 'flex',
    };
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <button
                onClick={() => {
                    setHasFooter(!hasFooter);
                }}
            >
                {`Подвал выведен в списке: ${hasFooter}`}
            </button>
            <button
                onClick={() => {
                    setHasPagingMode(!hasPagingMode);
                }}
            >
                {`Панель пейджинга выведена в списке: ${hasPagingMode}`}
            </button>
            <div style={divStyle}>
                <div>
                    <span>Нет опций на ухе</span>
                    <ScrollContainer
                        className={
                            'controlsDemo__height300 controlsDemo_fixedWidth300 Controls-demo_ContentBottomPaddingDemo-scrollContainer'
                        }
                    >
                        <ListView
                            items={items}
                            virtualScrollConfig={virtualScrollConfig}
                            keyProperty={'key'}
                            displayProperty={'title'}
                            bottomPaddingMode={'additional'}
                            moveMarkerOnScrollPaging={true}
                            {...getListViewProps}
                        />
                    </ScrollContainer>
                </div>
                <div>
                    <span>Опции записи выводятся на ухе (под строкой)</span>
                    <ScrollContainer
                        className={
                            'controlsDemo__height300 controlsDemo_fixedWidth300 Controls-demo_ContentBottomPaddingDemo-scrollContainer'
                        }
                    >
                        <ListView
                            items={items}
                            virtualScrollConfig={virtualScrollConfig}
                            keyProperty={'key'}
                            displayProperty={'title'}
                            bottomPaddingMode={'additional'}
                            itemActions={getActionsForContacts()}
                            itemActionsPosition={'outside'}
                            {...getListViewProps}
                        />
                    </ScrollContainer>
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(ContentBottomPaddingDemo);

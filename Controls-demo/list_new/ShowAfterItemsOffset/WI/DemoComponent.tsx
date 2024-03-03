import * as React from 'react';

import { RecordSet } from 'Types/collection';

import { ItemsView as ListView, IVirtualScrollConfig } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { TBottomPaddingMode } from 'Controls/baseList';
import { TItemActionsPosition } from 'Controls/interface';

const ITEMS_COUNT = 20;

interface IItem {
    key: number;
    title: string;
}

interface IBottomPaddingDemoComponentProps {
    itemActionsPosition: TItemActionsPosition;
    bottomPaddingMode: TBottomPaddingMode;
}

function BottomPaddingDemoComponent(
    props: IBottomPaddingDemoComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
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
    const divStyle = {
        display: 'flex',
    };
    const getListViewProps = React.useMemo(() => {
        const resultProps = {};

        if (props.bottomPaddingMode === 'actions') {
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
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <div style={divStyle}>
                <div>
                    <ScrollContainer
                        className={'controlsDemo__height200 controlsDemo_fixedWidth300 '}
                        style={{ border: '1px dashed black' }}
                    >
                        <>
                            <ListView
                                items={items}
                                virtualScrollConfig={virtualScrollConfig}
                                keyProperty={'key'}
                                displayProperty={'title'}
                                bottomPaddingMode={props.bottomPaddingMode}
                                itemActions={getActionsForContacts()}
                                itemActionsPosition={props.itemActionsPosition}
                                {...getListViewProps}
                            />
                            {props.bottomPaddingMode === 'none' ? (
                                <span style={{ display: 'flex', justifyContent: 'center' }}>
                                    Контент под списком
                                </span>
                            ) : null}
                        </>
                    </ScrollContainer>
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(BottomPaddingDemoComponent);

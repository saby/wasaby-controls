import * as React from 'react';

import { Memory } from 'Types/source';

import { Button } from 'Controls/buttons';
import { View as ListView } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const ITEMS_COUNT = 25;

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

function getData() {
    return generateData({
        keyProperty: 'key',
        count: ITEMS_COUNT,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
}

function DisplayListWithBothWaysLoadingDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const [visibleList, setVisibleList] = React.useState(false);

    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth500'}>
            <Button
                caption={'Toggle list visibility'}
                onClick={() => {
                    setTimeout(() => {
                        setVisibleList((prev) => !prev);
                    }, 200);
                }}
            />

            {visibleList && (
                <ScrollContainer className={'controlsDemo__height500'}>
                    <ListView storeId={'LoadingIndicatorBoth'} />
                </ScrollContainer>
            )}
        </div>
    );
}

export default Object.assign(React.forwardRef(DisplayListWithBothWaysLoadingDemo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorBoth: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                        sourceConfig: {
                            pageSize: 8,
                            page: 4,
                            hasMore: false,
                        },
                        source: 'page',
                        view: 'infinity',
                    },
                },
            },
        };
    },
});

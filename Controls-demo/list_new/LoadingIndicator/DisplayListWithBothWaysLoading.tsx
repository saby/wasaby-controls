import * as React from 'react';

import { Memory } from 'Types/source';

import { Button } from 'Controls/buttons';
import { View as ListView } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import { INavigationOptionValue, INavigationPageSourceConfig } from 'Controls/interface';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const ITEMS_COUNT = 25;

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

function DisplayListWithBothWaysLoadingDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const [visibleList, setVisibleList] = React.useState(false);
    const source = React.useMemo(() => {
        return new Memory({
            keyProperty: 'key',
            data: generateData({
                keyProperty: 'key',
                count: ITEMS_COUNT,
                beforeCreateItemCallback: (item: IItem) => {
                    item.title = `Запись с ключом ${item.key}.`;
                },
            }),
        });
    }, []);
    const navigation = React.useMemo<INavigationOptionValue<INavigationPageSourceConfig>>(() => {
        return {
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
        };
    }, []);

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
                    <ListView source={source} navigation={navigation} displayProperty={'title'} />
                </ScrollContainer>
            )}
        </div>
    );
}

export default React.forwardRef(DisplayListWithBothWaysLoadingDemo);

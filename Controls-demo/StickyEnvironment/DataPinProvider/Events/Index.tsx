import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { useContent } from 'UICore/Jsx';
import { Memory } from 'Types/source';
import {
    IEdgesData,
    DataPinContainer,
    DataPinProviderReact as DataPinProvider,
} from 'Controls/stickyEnvironment';
import {
    View as ListView,
    ItemTemplate as ListItemTemplate,
    IItemTemplateProps,
} from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';

import 'css!Controls-demo/StickyEnvironment/DataPinProvider/Events/Events';

const _dataArray: { key: number; title: string }[] = generateData<{
    key: number;
    title: string;
}>({
    count: 1000,
    entityTemplate: { title: 'lorem' },
});

const virtualScrollConfig = {
    page: 50,
    pageSize: 50,
};

const ItemTemplateContents = React.memo(
    React.forwardRef((props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const item = props.item.contents;

        const dataPinContent = useContent(
            (_p, dataPinContentRef: React.ForwardedRef<HTMLDivElement>) => {
                return <strong ref={dataPinContentRef}>Запись с id="{item.get('key')}"</strong>;
            },
            [item]
        );

        return (
            <div ref={ref}>
                <DataPinContainer data={item.get('key')} content={dataPinContent} />
                {item.get('title')}
                <i data-qa="Controls-Demo_StickyEnvironment__hooks">h</i>
            </div>
        );
    })
);

const ItemTemplate = React.memo(
    React.forwardRef((props: IItemTemplateProps, ref): React.ReactElement => {
        return (
            <ListItemTemplate
                {...props}
                forwardedRef={ref}
                contentTemplate={ItemTemplateContents}
            />
        );
    })
);

const MemoizedScrollingListView = React.memo(() => {
    return (
        <ScrollContainer className="Controls-demo__StickyEnvironment_DataPinProvider_Events_ScrollContainer">
            <ListView
                storeId="DataPinProviderEvents"
                virtualScrollConfig={virtualScrollConfig}
                itemTemplate={ItemTemplate}
            />
        </ScrollContainer>
    );
});

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [edgeData, setEdgeData] = React.useState<{ top?: number; bottom?: number }>({});
    const onEdgesDataChanged = React.useCallback(
        (data: IEdgesData): void => {
            const nextEdgeData = {
                top: (data.top.above || data.top.below) as number,
                bottom: data.bottom.above as number,
            };
            if (edgeData.top !== nextEdgeData.top || edgeData.bottom !== nextEdgeData.bottom) {
                setEdgeData(nextEdgeData);
            }
        },
        [edgeData, setEdgeData]
    );

    return (
        <div
            ref={ref}
            className={`controls-demo_Wrapper controlsDemo_fixedWidth500 ${props.className}`}
        >
            <div data-qa="controls-demo__text_top">Top edge data id: {edgeData.top}</div>
            <div data-qa="controls-demo__text_bottom">Bottom edge data id: {edgeData.bottom}</div>
            <DataPinProvider onEdgesDataChanged={onEdgesDataChanged} content={undefined}>
                <MemoizedScrollingListView />
            </DataPinProvider>
        </div>
    );
}

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            DataPinProviderEvents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            page: 10,
                            pageSize: 50,
                            hasMore: false,
                        },
                    },
                    source: new Memory({
                        keyProperty: 'key',
                        data: _dataArray,
                    }),
                    keyProperty: 'key',
                },
            },
        };
    },
});

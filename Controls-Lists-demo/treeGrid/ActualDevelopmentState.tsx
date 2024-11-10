import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments, ListSlice } from 'Controls-Lists/dataFactory';
import { HierarchicalMemory as Source, ICrud } from 'Types/source';
import { Cars } from './Moks/ActualDevData';
import { Component } from 'Controls-Lists/treeGrid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { HeadingPath as BreadCrumbsView } from 'Controls-ListEnv/breadcrumbs';
import DemoBlock from './ActualDevelopmentState/Block';
import DemoLayout from './ActualDevelopmentState/Layout';
import logSliceStateHelper from './ActualDevelopmentState/logSliceStateHelper';
import { DataContext } from 'Controls-DataEnv/context';

import 'css!Controls-Lists-demo/treeGrid/ActualDevelopmentState';

const STORE_ID_NEW_LIST = 'BaseTreeGridViewNew';

function removeItemFromSource(slice: ListSlice, key: number): void {
    if (slice.state.source) {
        (slice.state.source as ICrud).read(key).then((record) => {
            if (record) {
                return (slice.state.source as ICrud).destroy(key).then(() => {
                    slice.reload();
                });
            }
        });
    }
}

function ActualDevelopmentState(_props: {}, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const slice = React.useContext(DataContext)[STORE_ID_NEW_LIST] as unknown as ListSlice;
    const [logs, setLogs] = React.useState<string[]>([]);

    const addToLog = React.useCallback((value: string) => {
        setLogs((current) => [...current, value]);
    }, []);

    return (
        <DemoLayout
            ref={ref}
            mainContent={
                <>
                    <DemoBlock
                        boxShadow={false}
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <h2>Новый список со слайсом и collectionType</h2>
                    </DemoBlock>
                    <DemoBlock minHeight={24} title="BreadCrumbs [connected]">
                        <BreadCrumbsView storeId={STORE_ID_NEW_LIST} />
                    </DemoBlock>
                    <DemoBlock minHeight={24} title="actions">
                        <>
                            <button
                                onClick={() => {
                                    removeItemFromSource(slice, 1);
                                }}
                            >
                                Удалить папку "Audi"
                            </button>
                            &nbsp;
                            <button
                                onClick={() => {
                                    removeItemFromSource(slice, 1001);
                                }}
                            >
                                Удалить запись "Audi A1"
                            </button>
                            &nbsp;
                            <button
                                onClick={() => {
                                    removeItemFromSource(slice, 1002);
                                }}
                            >
                                Удалить запись "Audi A3"
                            </button>
                        </>
                    </DemoBlock>

                    <DemoBlock title="TreeGrid [connected]">
                        <ScrollContainer className="ControlsListsDemo-maxHeight-200">
                            <Component
                                storeId={STORE_ID_NEW_LIST}
                                changeRootByItemClick={true}
                                onItemClick={(item) => {
                                    addToLog(`onItemClick(${item.getKey()})`);
                                }}
                            />
                        </ScrollContainer>
                    </DemoBlock>
                    <DemoBlock title="log">
                        <div>
                            {logs && logs.length ? (
                                <button onClick={() => setLogs([])}>clear log</button>
                            ) : null}
                            <div className="tw-overflow-y-auto ControlsListsDemo-maxHeight-200">
                                {logs.map((logItem, index) => {
                                    const key = `item_${index}`;
                                    return <div key={key}>{logItem}</div>;
                                })}
                            </div>
                        </div>
                    </DemoBlock>
                </>
            }
            rightContent={
                <DemoBlock
                    title="ListState"
                    style={{
                        marginTop: 97,
                    }}
                >
                    <pre>{logSliceStateHelper(slice)}</pre>
                </DemoBlock>
            }
        />
    );
}

const ActualDevelopmentStateForwardedMemo = React.memo(React.forwardRef(ActualDevelopmentState));

// @ts-ignore
ActualDevelopmentStateForwardedMemo.getLoadConfig = (): Record<
    string,
    IDataConfig<IListDataFactoryArguments>
> => {
    return {
        [STORE_ID_NEW_LIST]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Source({
                    keyProperty: 'key',
                    data: Cars.getData(),
                    parentProperty: 'parent',
                }),
                navigation: {
                    source: 'page',
                    view: 'demand',
                    sourceConfig: {
                        pageSize: 10,
                        page: 0,
                        hasMore: false,
                    },
                },
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                columns: Cars.getColumns(),

                markerVisibility: 'visible',
                multiSelectVisibility: 'visible',
                collectionType: 'TreeGrid',
                itemActions: 'Controls-Lists-demo/treeGrid/Moks/ItemActions',
            },
        },
    };
};

export default ActualDevelopmentStateForwardedMemo;

import * as React from 'react';
import { type IDataConfig, type IListMobileDataFactoryArguments } from 'Controls-Lists/dataFactory';

import { Component } from 'Controls-Lists/treeGrid';
import { Container as ScrollContainer } from 'Controls/scroll';
import 'Controls/treeGrid';
import { HeadingPath as BreadCrumbsView } from 'Controls-ListEnv/breadcrumbs';
import DemoBlock from './ActualDevelopmentState/Block';
import DemoLayout from './ActualDevelopmentState/Layout';

import 'css!Controls-Lists-demo/treeGrid/ActualDevelopmentState';

const STORE_ID_NEW_LIST = 'BaseTreeGridViewNew';

function ActualDevelopmentState(_props: {}, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const [logs, setLogs] = React.useState([]);

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

                    <DemoBlock title="TreeGrid [connected]">
                        <ScrollContainer className="ControlsListsDemo-maxHeight-200">
                            <Component storeId={STORE_ID_NEW_LIST} changeRootByItemClick={true} />
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
        />
    );
}

const ActualDevelopmentStateForwardedMemo = React.memo(React.forwardRef(ActualDevelopmentState));

// @ts-ignore
ActualDevelopmentStateForwardedMemo.getLoadConfig = (): Record<
    string,
    IDataConfig<IListMobileDataFactoryArguments>
> => {
    return {
        [STORE_ID_NEW_LIST]: {
            dataFactoryName: 'Controls-Lists/dataFactory:ListMobile',
            dataFactoryArguments: {
                collectionEndpoint: {
                    address: 'http://localhost:7070/MainService/service/',
                    contract:
                        'DjinniSbisCrmCollectionStorageOfHClientListViewModelClientCollectionFilter',
                },
                observerEndpoint: {
                    address: 'http://localhost:7070/MainService/service/',
                    contract: 'DjinniSbisCrmHierarchyCollectionOfHClientListViewModel',
                },
                collectionStorageEndpoint: {
                    address: 'http://localhost:7070/MainService/service/',
                    contract: 'DjinniSbisCrmClientCollectionStorageProvider',
                },
                filter: {
                    include_anchor: false,
                    ignore_parent_id: false,
                    removed: 0,
                    contact_data_limit: 0,
                    include_our_org: false,
                    sort_by_id: true,
                    tags: [],
                    uuids: [],
                    pks: [],
                    entrepreneurs: [],
                    requisites: [],
                    folder_kind: [],
                    folder_pks: [],
                    contact_data_types: [],
                },
                pagination: {
                    limit: 15,
                },
                collectionType: 'TreeGrid',
                displayProperty: 'title',
                columns: [
                    {
                        key: 'name',
                        displayProperty: 'name',
                    },
                    {
                        key: 'legal_address',
                        displayProperty: 'legal_address',
                    },
                    {
                        key: 'id',
                        displayProperty: 'id',
                    },
                ],
                multiSelectVisibility: 'visible',
            },
        },
    };
};

export default ActualDevelopmentStateForwardedMemo;

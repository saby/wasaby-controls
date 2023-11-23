import type { IDataConfig, IListMobileDataFactoryArguments } from 'Controls-Lists/dataFactory';

import * as React from 'react';
import { Component } from 'Controls-Lists/treeGrid';
import { HeadingPath } from 'Controls-ListEnv/breadcrumbs';
import 'Controls/treeGrid';

const STORE_MOBILE_ID = 'BaseTreeGridView2';

export type TPoorViewProps = {};

export type TPoorViewRef = React.ForwardedRef<HTMLDivElement>;

function PoorView(props: TPoorViewProps, ref: TPoorViewRef): JSX.Element {
    return (
        <div ref={ref}>
            <HeadingPath storeId={STORE_MOBILE_ID} />
            <Component storeId={STORE_MOBILE_ID} changeRootByItemClick={true} />
        </div>
    );
}

const PoorViewForwardedMemo = React.memo(React.forwardRef(PoorView));
PoorViewForwardedMemo.getLoadConfig = (): Record<
    string,
    IDataConfig<IListMobileDataFactoryArguments>
> => {
    return {
        [STORE_MOBILE_ID]: {
            dataFactoryName: 'Controls-Lists/dataFactory:ListMobile',
            dataFactoryArguments: {
                collectionEndpoint: {
                    address: 'http://localhost:7070/MainService/service/',
                    contract: 'HPhonebookCollectionProvider',
                },
                observerEndpoint: {
                    address: 'http://localhost:7070/MainService/service/',
                    contract: 'HCollectionOfPhonebookContact',
                },
                filter: {
                    include_anchor: false,
                    only_favorites: false,
                },
                pagination: {
                    limit: 200,
                },
                viewportSize: 300,
                keyProperty: 'ident',
                parentProperty: 'parent',
                nodeProperty: 'node_type',
                collectionType: 'TreeGrid',
                displayProperty: 'title',
                columns: [
                    {
                        displayProperty: 'name',
                    },
                    {
                        displayProperty: 'address',
                    },
                    {
                        displayProperty: 'id',
                    },
                ],
                multiSelectVisibility: 'visible',
            },
        },
    };
};
export default PoorViewForwardedMemo;

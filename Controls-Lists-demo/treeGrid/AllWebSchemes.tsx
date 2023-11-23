import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-Lists/dataFactory';
import { default as Source } from './Moks/ExpandedSource';
import { Flat } from './Moks/DataMock';
import { Component } from 'Controls-Lists/treeGrid';
import { View } from 'Controls/treeGrid';
import 'Controls/treeGrid';

const STORE_ID_OLD_LIST = 'BaseTreeGridViewOld';
const STORE_ID_OLD_LIST_WITH_COLLECTION = 'BaseTreeGridViewOldCollection';
const STORE_ID_NEW_LIST = 'BaseTreeGridViewNew';

const BASE_DATA_FACTORY_ARGS: IListDataFactoryArguments = {
    displayProperty: 'title',
    source: new Source({
        keyProperty: 'key',
        data: Flat.getData(),
        parentProperty: 'parent',
    }),
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
    columns: Flat.getColumns(),
    multiSelectVisibility: 'visible',
};

function AllWebSchemes(props: {}, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    return (
        <div ref={ref}>
            <div className="tw-flex tw-justify-between">
                <div
                    style={{
                        width: '30%',
                    }}
                >
                    <h2>Старый список со слайсом без collectionType</h2>
                    {/*@ts-ignore*/}
                    <View storeId={STORE_ID_OLD_LIST} />
                </div>
                <div
                    style={{
                        width: '30%',
                    }}
                >
                    <h2>Старый список со слайсом и collectionType</h2>
                    {/*@ts-ignore*/}
                    <View storeId={STORE_ID_OLD_LIST_WITH_COLLECTION} />
                </div>
                <div
                    style={{
                        width: '30%',
                    }}
                >
                    <h2>Новый список со слайсом и collectionType</h2>
                    <Component storeId={STORE_ID_NEW_LIST} />
                </div>
            </div>

            <br />

            <div className="tw-flex tw-justify-between">
                <div
                    style={{
                        width: '30%',
                    }}
                >
                    <h2>Старый список без слайса</h2>
                    {/*@ts-ignore*/}
                    <View
                        {...BASE_DATA_FACTORY_ARGS}
                        selectedKeys={selectedKeys}
                        onSelectedKeysChanged={setSelectedKeys}
                    />
                </div>
                <div
                    style={{
                        width: '30%',
                    }}
                />
                <div
                    style={{
                        width: '30%',
                    }}
                />
            </div>
        </div>
    );
}

const AllWebSchemesForwardedMemo = React.memo(React.forwardRef(AllWebSchemes));

// @ts-ignore
AllWebSchemesForwardedMemo.getLoadConfig = (): Record<
    string,
    IDataConfig<IListDataFactoryArguments>
> => {
    return {
        [STORE_ID_OLD_LIST]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                ...BASE_DATA_FACTORY_ARGS,
            },
        },
        [STORE_ID_OLD_LIST_WITH_COLLECTION]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                ...BASE_DATA_FACTORY_ARGS,
                collectionType: 'TreeGrid',
            },
        },
        [STORE_ID_NEW_LIST]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                ...BASE_DATA_FACTORY_ARGS,
                collectionType: 'TreeGrid',
            },
        },
    };
};

export default AllWebSchemesForwardedMemo;

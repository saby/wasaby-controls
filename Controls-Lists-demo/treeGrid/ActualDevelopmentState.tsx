import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-Lists/dataFactory';
import { HierarchicalMemory as Source } from 'Types/source';
import { Flat } from './Moks/ActualDevData';
import * as filter from './Moks/filterTrue';
import { Component } from 'Controls-Lists/treeGrid';
import 'Controls/treeGrid';
import { HeadingPath as BreadCrumbsView } from 'Controls-ListEnv/breadcrumbs';

const STORE_ID_NEW_LIST = 'BaseTreeGridViewNew';

const BASE_DATA_FACTORY_ARGS: IListDataFactoryArguments = {
    displayProperty: 'title',
    source: new Source({
        keyProperty: 'key',
        data: Flat.getData(),
        parentProperty: 'parent',
        filter,
    }),
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
    columns: Flat.getColumns(),

    markerVisibility: 'hidden',
    multiSelectVisibility: 'hidden',
};

function ActualDevelopmentState(props: {}, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    return (
        <div ref={ref}>
            <h2>Новый список со слайсом и collectionType</h2>
            <br />
            <br />
            <BreadCrumbsView storeId={STORE_ID_NEW_LIST}/>
            <br />
            <Component storeId={STORE_ID_NEW_LIST} changeRootByItemClick={true} />
        </div>
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
                ...BASE_DATA_FACTORY_ARGS,
                collectionType: 'TreeGrid',
            },
        },
    };
};

export default ActualDevelopmentStateForwardedMemo;

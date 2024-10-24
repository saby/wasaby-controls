import * as React from 'react';
import { HierarchicalMemory as Memory } from 'Types/source';

import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import { IListDataFactoryArguments } from 'Controls-DataEnv/list';

import { HeadingPath } from 'Controls-ListEnv/breadcrumbs';
import { Component } from 'Controls-Lists/explorer';

const STORE_ID = 'grid_simple';
const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';

const Simple = React.memo(
    React.forwardRef(function Simple(
        _props: {},
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.JSX.Element {
        return (
            <div ref={ref}>
                <ViewModeButton viewMode="tile" />
                <ViewModeButton viewMode="table" />
                <HeadingPath storeId={STORE_ID} />
                <Component storeId={STORE_ID} />
            </div>
        );
    })
);

function ViewModeButton(props: Pick<AbstractListSlice['state'], 'viewMode'>) {
    const slice = useStrictSlice<AbstractListSlice>(STORE_ID);

    return (
        <button
            onClick={() => {
                slice.setState({ viewMode: props.viewMode });
            }}
        >
            {props.viewMode}
        </button>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Simple.getLoadConfig = (): Record<string, IDataConfig<IListDataFactoryArguments>> => ({
    [STORE_ID]: {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            isLatestInteractorVersion: true,
            collectionType: 'TreeGrid',
            displayProperty: 'first_name',
            source: SOURCE,
            columns: COLUMNS,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
            viewMode: 'table',
        },
    },
});

const SOURCE = new Memory({
    keyProperty: KEY_PROPERTY,
    parentProperty: 'parent',
    data: [
        {
            [KEY_PROPERTY]: 1,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: true,
            first_name: 'Nealson',
            last_name: 'Maleham',
            email: 'nmaleham0@dell.com',
        },
        {
            [KEY_PROPERTY]: 11,
            [PARENT_PROPERTY]: 1,
            [NODE_PROPERTY]: false,
            first_name: 'Lucky',
            last_name: 'Echallie',
            email: 'lechallie1@meetup.com',
        },
        {
            [KEY_PROPERTY]: 111,
            [PARENT_PROPERTY]: 11,
            [NODE_PROPERTY]: null,
            first_name: 'Wheeler',
            last_name: 'Bengochea',
            email: 'wbengochea2@cbc.ca',
        },
        {
            [KEY_PROPERTY]: 112,
            [PARENT_PROPERTY]: 11,
            [NODE_PROPERTY]: null,
            first_name: 'Jeana',
            last_name: 'Cheltnam',
            email: 'jcheltnam3@mediafire.com',
        },
        {
            [KEY_PROPERTY]: 12,
            [PARENT_PROPERTY]: 1,
            [NODE_PROPERTY]: null,
            first_name: 'Jock',
            last_name: 'Dowell',
            email: 'jdowell4@sitemeter.com',
        },
        {
            [KEY_PROPERTY]: 2,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: true,
            first_name: 'Cash',
            last_name: 'Cardenoza',
            email: 'ccardenoza5@trellian.com',
        },
        {
            [KEY_PROPERTY]: 3,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: false,
            first_name: 'Kirbie',
            last_name: 'Sherred',
            email: 'ksherred6@yahoo.co.jp',
        },
        {
            [KEY_PROPERTY]: 4,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Isiahi',
            last_name: 'Portis',
            email: 'iportis7@auda.org.au',
        },
        {
            [KEY_PROPERTY]: 5,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Locke',
            last_name: 'Kanzler',
            email: 'lkanzler8@fc2.com',
        },
        {
            [KEY_PROPERTY]: 6,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Blondy',
            last_name: 'Artis',
            email: 'bartis9@smh.com.au',
        },
    ],
});

const COLUMNS = [
    {
        key: 'first_name',
        displayProperty: 'first_name',
    },
    {
        key: 'last_name',
        displayProperty: 'last_name',
    },
    {
        key: 'email',
        displayProperty: 'email',
    },
];

export default Simple;

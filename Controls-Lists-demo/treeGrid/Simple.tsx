import * as React from 'react';
import { Component } from 'Controls-Lists/treeGrid';
import { Memory } from 'Types/source';

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
                <Component storeId={STORE_ID} />
            </div>
        );
    })
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Simple.getLoadConfig = () => ({
    [STORE_ID]: {
        dataFactoryName: 'Controls/dataFactory:List',
        dataFactoryArguments: {
            collectionType: 'TreeGrid',
            source: SOURCE,
            columns: COLUMNS,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
        },
    },
});

const SOURCE = new Memory({
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
    keyProperty: KEY_PROPERTY,
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

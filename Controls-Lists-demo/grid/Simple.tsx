import * as React from 'react';
import { Component } from 'Controls-Lists/grid';
import { Memory } from 'Types/source';

const STORE_ID = 'grid_simple';
const KEY_PROPERTY = 'key';

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
            collectionType: 'Grid',
            source: SOURCE,
            columns: COLUMNS,
        },
    },
});

const SOURCE = new Memory({
    data: [
        {
            [KEY_PROPERTY]: 1,
            first_name: 'Ariadne',
            last_name: 'Bushell',
            email: 'abushell0@1688.com',
        },
        {
            [KEY_PROPERTY]: 2,
            first_name: 'Ric',
            last_name: 'Heersma',
            email: 'rheersma1@nymag.com',
        },
        { [KEY_PROPERTY]: 3, first_name: 'Jake', last_name: 'Sheaf', email: 'jsheaf2@yale.edu' },
        {
            [KEY_PROPERTY]: 4,
            first_name: 'Joela',
            last_name: 'Spafford',
            email: 'jspafford3@cyberchimps.com',
        },
        {
            [KEY_PROPERTY]: 5,
            first_name: 'Neron',
            last_name: 'Unitt',
            email: 'nunitt4@kickstarter.com',
        },
    ],
    keyProperty: KEY_PROPERTY,
});

const COLUMNS = [
    {
        key: KEY_PROPERTY,
        displayProperty: KEY_PROPERTY,
    },
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

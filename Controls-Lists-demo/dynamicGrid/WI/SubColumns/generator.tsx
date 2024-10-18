import * as React from 'react';
import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    StaticHeaderRenderComponent,
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
    StaticColumnRenderComponent,
    DynamicFooterRenderComponent,
    StaticFooterRenderComponent,
} from './renders';
import { IDynamicColumnConfig, IDynamicHeaderConfig } from 'Controls-Lists/dynamicGrid';

export function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '250px',
            render: <StaticColumnRenderComponent />,
        },
    ];
}

export function getStaticHeaders(): IHeaderConfig[] {
    return [
        {
            key: 'staticHeader',
            render: <StaticHeaderRenderComponent />,
        },
    ];
}

export function getDynamicColumn(): IDynamicColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        width: '150px',
        render: null,
        subColumns: [
            {
                key: 'success',
                getCellProps: () => ({ backgroundStyle: 'success' }),
                render: <DynamicColumnsRenderComponent />,
            },
            {
                key: 'danger',
                getCellProps: () => ({ backgroundStyle: 'danger' }),
                render: <DynamicColumnsRenderComponent />,
            },
        ],
    };
}

export function getDynamicHeader(): IDynamicHeaderConfig {
    return {
        render: <DynamicHeaderRenderComponent />,
        superHeaders: [
            {
                key: 'Super',
                colspanCallback: () => 2,
                getCellProps: () => {
                    return {
                        halign: 'center',
                    };
                },
                render: <DynamicHeaderRenderComponent caption={'Super'} />,
            },
        ],
        subHeaders: [
            {
                key: 'Success',
                render: <DynamicHeaderRenderComponent caption={'Success'} />,
            },
            {
                key: 'Danger',
                render: <DynamicHeaderRenderComponent caption={'Danger'} />,
            },
        ],
    };
}

export function getDynamicFooter(): IFooterConfig {
    return {
        render: <DynamicFooterRenderComponent />,
    };
}

export function getStaticFooter(): IFooterConfig[] {
    return [
        {
            key: 'staticFooter',
            render: <StaticFooterRenderComponent />,
        },
    ];
}

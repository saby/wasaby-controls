import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    StaticHeaderRenderComponent,
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
    StaticColumnRenderComponent,
} from './renders';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';

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
        width: '60px',
        render: <DynamicColumnsRenderComponent />,
    };
}

export function getDynamicHeader(): IHeaderConfig {
    return {
        render: <DynamicHeaderRenderComponent />,
    };
}

import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    StaticColumnsRenderComponent,
    StaticHeaderRenderComponent,
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
} from './renders';

export function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '55px',
            render: <StaticColumnsRenderComponent />,
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

export function getDynamicColumn(): IColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        width: '300px',
        render: <DynamicColumnsRenderComponent />,
        getCellProps: () => {
            return {};
        },
    };
}

export function getDynamicHeader(): IHeaderConfig {
    return {
        render: <DynamicHeaderRenderComponent />,
    };
}

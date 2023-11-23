import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    StaticColumnsRenderComponent,
    StaticHeaderRenderComponent,
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
    StaticFooterRenderComponent,
    DynamicFooterRenderComponent,
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

export function getStaticFooter(): IFooterConfig[] {
    return [
        {
            key: 'staticFooter',
            render: <StaticFooterRenderComponent />,
        },
    ];
}

export function getDynamicColumn(): IColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        width: '300px',
        minWidth: '20px',
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

export function getDynamicFooter(): IFooterConfig {
    return {
        render: <DynamicFooterRenderComponent />,
    };
}

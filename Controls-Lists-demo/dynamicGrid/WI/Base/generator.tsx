import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    StaticHeaderRenderComponent,
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
    StaticColumnRenderComponent,
    StaticFooterRenderComponent,
    DynamicFooterRenderComponent,
} from './renders';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';

export function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '200px',
            render: <StaticColumnRenderComponent />,
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

export function getDynamicFooter(): IFooterConfig {
    return {
        width: 'auto',
        getCellProps: (props) => {
            return { valign: 'center', halign: 'center' };
        },
        render: <DynamicFooterRenderComponent />,
    };
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
        width: 'auto',
        getCellProps: (item, key) => {
            const column = item.get('dynamicColumnsData').getRecordById(key);
            const rowGrade = item.get('job');
            const isGradeAchieved = column.get('data').includes(rowGrade);
            return {
                halign: 'center',
                valign: 'center',
                backgroundStyle: isGradeAchieved ? 'success' : 'danger',
            };
        },
        render: <DynamicColumnsRenderComponent />,
    };
}

export function getDynamicHeader(): IHeaderConfig {
    return {
        width: 'auto',
        getCellProps: () => ({ backgroundStyle: 'primary' }),
        render: <DynamicHeaderRenderComponent />,
    };
}

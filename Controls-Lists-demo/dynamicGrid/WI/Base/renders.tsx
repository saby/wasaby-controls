import * as React from 'react';
import { Record as EntityRecord } from 'Types/entity';
import { IDynamicCellRenderProps } from 'Controls-Lists/dynamicGrid';

export function DynamicColumnsRenderComponent(
    props: IDynamicCellRenderProps<string, EntityRecord>
): React.ReactElement {
    const { columnData } = props;

    return <div>{columnData ? columnData.get('data') : '?'}</div>;
}

export function StaticHeaderRenderComponent(): React.ReactElement {
    return <div>Статическая шапка</div>;
}

export function StaticColumnRenderComponent(): React.ReactElement {
    return <div>Статическая колонка</div>;
}

export function DynamicHeaderRenderComponent(): React.ReactElement {
    return <div>header</div>;
}

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

export function DynamicHeaderRenderComponent({
    caption,
    renderValues,
}: {
    caption: string;
    renderValues: { value: number };
}): React.ReactElement {
    return <div>{caption || renderValues.value}</div>;
}

export function StaticFooterRenderComponent(): React.ReactElement {
    return <div>footer</div>;
}

export function DynamicFooterRenderComponent(): React.ReactElement {
    return <div>dynamic footer</div>;
}

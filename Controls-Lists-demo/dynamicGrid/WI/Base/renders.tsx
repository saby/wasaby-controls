import { IDynamicCellRenderProps, useDynamicHeaderData } from 'Controls-Lists/dynamicGrid';
import * as React from 'react';
import { Record as EntityRecord } from 'Types/entity';
import { useItemData } from 'Controls/gridRender';

export function DynamicColumnsRenderComponent(
    props: IDynamicCellRenderProps<string, EntityRecord>
): React.ReactElement {
    const { columnData, item } = props;

    const rowGrade = item.get('job');
    const isGradeAchieved = columnData.get('data').includes(rowGrade);
    return (
        <div className={'controlsListsDemo__dynamicGridBase-dataCell'}>
            {isGradeAchieved ? (
                <span className={'controlsListsDemo__dynamicGridBase-greenMark'}>&#10003;</span>
            ) : (
                <span className={'controlsListsDemo__dynamicGridBase-redMark'}>&#10005;</span>
            )}
        </div>
    );
}

export function StaticHeaderRenderComponent(): React.ReactElement {
    return <div>Категория работника</div>;
}

export function StaticColumnRenderComponent(): React.ReactElement {
    const { renderValues, item } = useItemData(['job']);

    return (
        <div className={'controlsListsDemo__dynamicGridBase-staticColumnCell'}>
            {renderValues.job}
        </div>
    );
}
export function StaticFooterRenderComponent(): React.ReactElement {
    return (
        <div className={'controlsListsDemo__dynamicGridBase-staticColumnCell'}>
            Текущая категория
        </div>
    );
}

export function DynamicFooterRenderComponent(): React.ReactElement {
    const footerData = useDynamicHeaderData();

    return (
        <div className={'controlsListsDemo__dynamicGridBase-dynamicFooterCell'}>
            {footerData.get('currentCategory')}
        </div>
    );
}

export function DynamicHeaderRenderComponent(): React.ReactElement {
    const headerData = useDynamicHeaderData();

    return (
        <div className={'controlsListsDemo__dynamicGridBase-dynamicHeaderCell'}>
            {headerData?.get('name')}
        </div>
    );
}

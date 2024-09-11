import * as React from 'react';
import { IItemProps } from 'Controls/_grid/RenderReact/Item';
import { default as OldItemTemplate } from 'Controls/_grid/RenderReact/Item';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';

export function getReactViewProps(props: IItemProps, rowProps: IRowComponentProps) {
    return {
        highlightOnHover: props.highlightOnHover,
        cursor: props.cursor,
        backgroundStyle: props.backgroundColorStyle,
        className: props.className,
        contentTemplate: props.contentTemplate,
        itemActionsClass: props.itemActionsClass,
        hoverBackgroundStyle: props.hoverBackgroundStyle || rowProps.hoverBackgroundStyle,
        fontWeight: props.fontWeight,
    };
}

function ItemTemplateReact(props: IItemProps): React.ReactElement {
    const { originalRowComponent, rowProps } = props;
    return <>{React.cloneElement(originalRowComponent, getReactViewProps(props, rowProps))}</>;
}

function ItemTemplate(props: IItemProps): React.ReactElement {
    if (props.item.isReactView()) {
        return <ItemTemplateReact {...props} />;
    }
    return <OldItemTemplate {...props} />;
}

export default React.memo(ItemTemplate);

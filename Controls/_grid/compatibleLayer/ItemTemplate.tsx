import * as React from 'react';
import { IItemProps } from 'Controls/_grid/RenderReact/Item';
import { default as OldItemTemplate } from 'Controls/_grid/RenderReact/Item';

export function getReactViewProps(props: IItemProps) {
    return {
        highlightOnHover: props.highlightOnHover,
        cursor: props.cursor,
        backgroundStyle: props.backgroundColorStyle,
        className: props.className,
    };
}

function ItemTemplateReact(props: IItemProps): React.ReactElement {
    const { originalRowComponent } = props;
    return <>{React.cloneElement(originalRowComponent, getReactViewProps(props))}</>;
}

function ItemTemplate(props: IItemProps): React.ReactElement {
    if (props.item.isReactView()) {
        return <ItemTemplateReact {...props} />;
    }
    return <OldItemTemplate {...props} />;
}

export default React.memo(ItemTemplate);

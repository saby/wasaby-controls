import * as React from 'react';
import { IItemProps } from 'Controls/_treeGrid/renderReact/Item';
import { default as OldItemTemplate } from 'Controls/_treeGrid/renderReact/Item';
import { getGridItemTemplateProps } from 'Controls/grid';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';

function getReactViewProps(props: IItemProps, rowProps: IRowComponentProps) {
    return {
        ...getGridItemTemplateProps(props, rowProps),
        expanderIcon: props.expanderIcon,
        expanderSize: props.expanderSize,
        fontColorStyle: props.fontColorStyle,
        levelIndentSize: props.levelIndentSize,
        withoutLevelPadding: props.withoutLevelPadding,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        actionsClassName: props.itemActionsClass,
        marker: props.marker,
        markerClassName: props.markerClassName,
        markerSize: props.markerSize,
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

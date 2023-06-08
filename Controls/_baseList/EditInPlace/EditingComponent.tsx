/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { createElement } from 'UICore/Jsx';

import { Highlight } from 'Controls/baseDecorator';
import { CollectionItem } from 'Controls/display';
import type { GridDataCell } from 'Controls/grid';
import BaseEditingComponent, { IEventHandlers } from './BaseEditingComponent';

export interface IEditingComponentProps extends TInternalProps, IEventHandlers {
    item?: CollectionItem;
    itemData?: CollectionItem;
    column?: GridDataCell;

    viewTemplate?: React.FunctionComponent;
    editorTemplate: React.FunctionComponent;

    align?: string;
    tooltip?: string;
    value: string | number | null;
    enabled?: boolean;
    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';
    inputBorderVisibility?: 'partial' | 'hidden';
    size?: 'default' | 's' | 'm' | 'l';
}

function EditorWrapper(props: {
    editorTemplate: React.FunctionComponent;
    item: CollectionItem;
    column: GridDataCell;
}) {
    return createElement(
        props.editorTemplate,
        {
            item: props.item,
            column: props.column,
            validateOnFocusOut: false,
        },
        { class: 'controls-EditingTemplateText__editor' }
    );
}

function DefaultView(props: { item: CollectionItem; value: string | number }) {
    if (props.value !== null && props.item.searchValue) {
        return <Highlight highlightedValue={props.item.searchValue} value={String(props.value)} />;
    } else {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{typeof props.value === 'undefined' ? null : props.value}</>;
    }
}

interface IViewWrapperProps {
    viewTemplate: React.FunctionComponent;
    item: CollectionItem;
    column: GridDataCell;
    value: string | number | null;
}

function ViewWrapper(props: IViewWrapperProps) {
    const item = props.item;

    if (props.viewTemplate) {
        return createElement(props.viewTemplate, {
            item: props.item,
            column: props.column,
        });
    }

    return <DefaultView item={item} value={props.value} />;
}

function EditingComponent(props: IEditingComponentProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const item = props.item || props.itemData;

    const viewRender = (
        <ViewWrapper
            viewTemplate={props.viewTemplate}
            item={item}
            column={props.column}
            value={props.value}
        />
    );
    const editorRender = (
        <EditorWrapper editorTemplate={props.editorTemplate} item={item} column={props.column} />
    );
    const inputBackgroundVisibility =
        props.inputBackgroundVisibility || (props.enabled ? 'onhover' : 'hidden');
    return (
        <BaseEditingComponent
            ref={ref}
            viewRender={viewRender}
            editorRender={editorRender}
            editing={(props.column || item).isEditing()}
            editingMode={item.getEditingConfig()?.mode}
            className={props.attrs?.className}
            withPadding={item['[Controls/_display/grid/EmptyRow]']}
            active={item.isActive() && !item.isEditing()}
            halign={props.align}
            tooltip={(props.tooltip || props.value) as string}
            inputBackgroundVisibility={inputBackgroundVisibility}
            inputBorderVisibility={props.inputBorderVisibility}
            fontSize={props.size || 'default'}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
        />
    );
}

export default React.memo(React.forwardRef(EditingComponent));

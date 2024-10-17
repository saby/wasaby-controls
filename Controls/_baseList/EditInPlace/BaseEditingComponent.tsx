/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';

import {
    getEditorViewRenderClassName,
    getEditorClassName,
    IGetEditorViewClassNameParams,
} from 'Controls/display';

// События, на которые подписывается Controls/popupTargets:InfoboxTarget
export interface IEventHandlers {
    onMouseDown?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    onTouchStart?: Function;
    onClick?: Function;
}

export interface IBaseEditingComponentProps extends IEventHandlers, IGetEditorViewClassNameParams {
    viewRender: React.ReactElement;
    editorRender: React.ReactElement;

    isReact?: boolean;

    editing: boolean;
    tooltip?: string;
    halign?: string;
    className?: string;
}

function getTitle(props: IBaseEditingComponentProps): string | undefined {
    return props.tooltip !== undefined && props.tooltip !== null ? String(props.tooltip) : null;
}

function ViewWrapper(
    props: IBaseEditingComponentProps & {
        ignoreWrappersForViewRender?: boolean;
    }
): JSX.Element {
    return props.ignoreWrappersForViewRender ? (
        props.viewRender
    ) : (
        <div title={getTitle(props)} className={getEditorViewRenderClassName(props)}>
            <div className={'controls-EditingTemplateText__inner'}>{props.viewRender}</div>
        </div>
    );
}

function EditingComponent(
    props: IBaseEditingComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    // Попытка избавиться от лишних div. Судя по всему, при editingMode === 'cell' это можно
    // абсолютно законно сделать, т.к. дополнительные дивы не дают ничего, кроме замедления.
    const ignoreWrappersForViewRender =
        props.editingMode === 'cell' && props.isReact && !props.editing;

    let className = getEditorClassName(props.halign, props.editingMode);
    if (props.className) {
        className += ` ${props.className}`;
    }

    if (ignoreWrappersForViewRender) {
        className += ` ${getEditorViewRenderClassName(props)}`;
    }

    return (
        <div
            className={className}
            ref={ref}
            title={ignoreWrappersForViewRender ? getTitle(props) : undefined}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onMouseLeave={(e) => {
                return props.onMouseLeave?.(e);
            }}
            onTouchStart={(e) => {
                return props.onTouchStart?.(e);
            }}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            data-qa={`editing_component-${props.editing ? 'editor_render' : 'view_render'}`}
        >
            {props.editing ? (
                props.editorRender
            ) : (
                <ViewWrapper {...props} ignoreWrappersForViewRender={ignoreWrappersForViewRender} />
            )}
        </div>
    );
}

export default React.memo(React.forwardRef(EditingComponent));

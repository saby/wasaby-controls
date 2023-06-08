/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import {
    getEditorViewRenderClassName,
    getEditorClassName,
    IGetEditorViewClassNameParams,
} from 'Controls/display';

// События, на которые подписывается Controls/popup:InfoboxTarget
export interface IEventHandlers {
    onMouseDown?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    onTouchStart?: Function;
    onClick?: Function;
}

export interface IBaseEditingComponentProps
    extends IEventHandlers,
        IGetEditorViewClassNameParams {
    viewRender: React.ReactElement;
    editorRender: React.ReactElement;

    editing: boolean;
    tooltip?: string;
    halign?: string;
    className?: string;
}

function ViewWrapper(props: IBaseEditingComponentProps): JSX.Element {
    const className = getEditorViewRenderClassName(props);
    const title = props.tooltip !== undefined && props.tooltip !== null ? String(props.tooltip) : null;
    return (
        <div title={title} className={className}>
            <div className={'controls-EditingTemplateText__inner'}>
                {props.viewRender}
            </div>
        </div>
    );
}

function EditingComponent(
    props: IBaseEditingComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    let className = getEditorClassName(props.halign, props.editingMode);
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <div
            className={className}
            ref={ref}
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
            data-qa={`editing_component-${
                props.editing ? 'editor_render' : 'view_render'
            }`}
        >
            {props.editing ? props.editorRender : <ViewWrapper {...props} />}
        </div>
    );
}

export default React.memo(React.forwardRef(EditingComponent));

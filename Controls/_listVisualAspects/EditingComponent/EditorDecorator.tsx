import * as React from 'react';
import { getEditorViewRenderClassName, IGetEditorViewClassNameParams } from 'Controls/display';
import { IHeight, TBackgroundStyle } from 'Controls/interface';
import { importer, lazy } from 'UI/Async';

const TagTemplate = lazy(() => importer('Controls/Application/TagTemplate/TagTemplateReact'));

export type StyleType = 'info' | 'danger' | 'primary' | 'success' | 'warning' | 'secondary';

export interface IEditorDecoratorConnectedProps {
    baseline?: 'default' | 'inherit';
    borderVisibility?: 'partial' | 'hidden';
    contrastBackground?: boolean;
    horizontalPadding?: 'null' | 'xs';
    fontSize?: 'default' | 's' | 'm' | 'l';
    textAlign?: 'left' | 'right' | 'center';

    leftFieldTemplate?: React.ReactNode;
    backgroundStyle?: TBackgroundStyle;
    inlineHeight?: IHeight;
    tagStyle?: StyleType;
    tagClick?: (event: React.SyntheticEvent, tag: HTMLElement) => void;
    tagHover?: (event: React.SyntheticEvent, tag: HTMLElement) => void;
    className?: string;

    children?: React.ReactNode;
}

interface IEditorDecoratorProps
    extends IGetEditorViewClassNameParams,
        IEditorDecoratorConnectedProps {
    title?: string;
}

const EditorDecorator = React.memo(
    React.forwardRef((props: IEditorDecoratorProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const { children, title } = props;
        return (
            <div ref={ref} title={title} className={getEditorViewRenderClassName(props)}>
                {children}
            </div>
        );
    })
);

// Публичная обертка, которая позволяет внутри render для не редактируемых ячеек добавить стили
// редактируемого поля
const EditorDecoratorConnected = React.memo(
    React.forwardRef(
        (props: IEditorDecoratorConnectedProps, ref: React.ForwardedRef<HTMLDivElement>) => {
            const { children, leftFieldTemplate, baseline = 'default' } = props;
            const tag = React.useRef();

            const tagClickHandler = React.useCallback(
                (event: React.MouseEvent<HTMLElement>): void => {
                    props.tagClick?.(event, tag.current as unknown as HTMLElement);
                },
                [props.tagClick, tag]
            );
            const tagHoverHandler = React.useCallback(
                (event: React.MouseEvent<HTMLElement>): void => {
                    props.tagHover?.(event, tag.current as unknown as HTMLElement);
                },
                [props.tagHover, tag]
            );

            return (
                <EditorDecorator
                    {...props}
                    editingMode={'cell'}
                    baseline={baseline}
                    inputBorderVisibility={props.borderVisibility}
                    inputBackgroundVisibility={props.contrastBackground ? 'onhover' : 'hidden'}
                    withPadding={props.horizontalPadding === 'xs' ? true : false}
                    backgroundStyle={props.backgroundStyle ? props.backgroundStyle : 'none'}
                    className={`${
                        (props.backgroundStyle && props.contrastBackground
                            ? 'controls-EditorDecoratorConnected-has-contrast-background '
                            : '') + props.className
                    }`}
                    ref={ref}
                >
                    {leftFieldTemplate}
                    {children}
                    {props.tagStyle && (
                        <TagTemplate
                            tagStyle={props.tagStyle}
                            className={`controls-Render_tag_padding-right${
                                props.horizontalPadding !== 'null' ? '-empty' : ''
                            }`}
                            ref={tag}
                            onClick={tagClickHandler}
                            onMouseEnter={tagHoverHandler}
                        />
                    )}
                </EditorDecorator>
            );
        }
    )
);

export { EditorDecorator, EditorDecoratorConnected };

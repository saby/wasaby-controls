/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { StickyGroupedBlock, StickyMode, StickyPosition } from 'Controls/stickyBlock';
import { IShadowProps, TBackgroundStyle } from 'Controls/interface';

export interface IBaseCellComponentProps extends IShadowProps {
    // wrapper
    className?: string;
    style?: React.CSSProperties;
    tooltip?: string;
    title?: string;
    tabIndex?: number;
    'data-qa'?: string;
    dataQa?: string;
    dataName?: string;
    'data-name'?: string;
    href?: string;
    attributes?: Record<string, string>;
    qaCellKey?: string;

    // content
    contentRender?: React.ReactElement;

    // events
    onClick?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onMouseOver?: React.MouseEventHandler;

    // sticky
    isSticky?: boolean;
    stickyMode?: StickyMode;
    stickyPosition?: StickyPosition;
    fixedBackgroundStyle?: TBackgroundStyle;
    stickiedBackgroundStyle?: TBackgroundStyle;
    pixelRatioBugFix?: boolean;
    subPixelArtifactFix?: boolean;
    fixedZIndex?: number;
    fixedClassName?: string;
}

/*
 * Компонент ячейки
 */
function Base(
    props: IBaseCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement | HTMLLinkElement>
): React.ReactElement {
    const attrs: Record<string, string> = {};

    if (props.qaCellKey) {
        attrs['qa-cell-key'] = props.qaCellKey;
    }

    const wrapperRenderProps = {
        className: props.className,
        style: props.style,
        tabIndex: props.tabIndex,
        'data-qa': props['data-qa'] || props.dataQa,
        'data-name': props['data-name'],
        ...props.attributes,
        ...attrs,

        // ref
        ref,

        // optional href
        href: props.href || null,

        // events
        onClick: props.onClick,
        onMouseDown: props.onMouseDown,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,
        onMouseOver: props.onMouseOver,
    };

    if (props.isSticky) {
        const stickyWrapperRenderProps = {
            position: props.stickyPosition,
            mode: props.stickyMode,
            tooltip: props.tooltip || props.title,
            zIndex: null,
            fixedZIndex: props.fixedZIndex || null,
            fixedClassName: props.fixedClassName,
            backgroundStyle: props.stickiedBackgroundStyle,
            fixedBackgroundStyle: props.fixedBackgroundStyle,
            shadowVisibility: props.shadowVisibility,
            pixelRatioBugFix: props.pixelRatioBugFix,
            subPixelArtifactFix: props.subPixelArtifactFix,
        };
        return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Неправильный тип для "ref" в компоненте StickyGroupedBlock
            <StickyGroupedBlock {...wrapperRenderProps} {...stickyWrapperRenderProps}>
                {props.contentRender}
            </StickyGroupedBlock>
        );
    }

    const CellTag = props.href ? 'a' : 'div';

    return (
        // @ts-ignore-next-line
        <CellTag {...wrapperRenderProps} title={props.tooltip || props.title}>
            {props.contentRender}
        </CellTag>
    );
}

export default React.forwardRef(Base);

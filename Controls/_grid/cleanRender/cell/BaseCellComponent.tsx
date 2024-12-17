/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { StickyGroupedBlock, StickyMode, StickyPosition } from 'Controls/stickyBlock';
import { TBackgroundStyle } from 'Controls/interface';
import { TColumnSeparatorSize } from 'Controls/baseGrid';

export interface IBaseCellComponentProps {
    // wrapper
    className?: string;
    style?: React.CSSProperties;
    tooltip?: string;
    title?: string;
    tabIndex?: number;
    'data-qa'?: string;
    dataQa?: string;

    // content
    contentRender?: React.ReactElement;
    render?: React.ReactElement;
    hideContentRender?: boolean;

    // events
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;

    // sticky
    isSticky?: boolean;
    stickyMode?: StickyMode;
    stickyPosition?: StickyPosition;
    fixedBackgroundStyle?: TBackgroundStyle;
    stickiedBackgroundStyle?: TBackgroundStyle;
    shadowVisibility?: string;
    pixelRatioBugFix?: boolean;
    subPixelArtifactFix?: boolean;
    fixedZIndex?: number;

    leftSeparatorSize?: TColumnSeparatorSize;
    rightSeparatorSize?: TColumnSeparatorSize;
}

/*
 * Компонент ячейки
 */
function BaseCellComponent(
    props: IBaseCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperRenderProps = {
        className: props.className,
        style: props.style,
        tabIndex: props.tabIndex,
        'data-qa': props['data-qa'],

        // ref
        ref,

        // events
        onClick: props.onClick,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,
    };
    const { contentRender, isSticky } = props;

    if (isSticky) {
        const stickyWrapperRenderProps = {
            position: props.stickyPosition,
            mode: props.stickyMode,
            tooltip: props.tooltip,
            zIndex: null,
            fixedZIndex: props.fixedZIndex || null,
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
                {contentRender}
            </StickyGroupedBlock>
        );
    }

    return (
        <div {...wrapperRenderProps} title={props.tooltip || props.title}>
            {contentRender}
        </div>
    );
}

export default React.memo(React.forwardRef(BaseCellComponent));

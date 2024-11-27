/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { default as BaseCellComponent, IBaseCellComponentProps } from './BaseCellComponent';
import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import { IHorizontalCellPadding } from 'Controls/_grid/dirtyRender/cell/interface';
import { getHorizontalPaddingsClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';
import { getColumnScrollClasses as getColumnScrollClassesUtil } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnScroll';
import { getBackgroundColorStyleClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';
import { TBackgroundStyle } from 'Controls/interface';

export interface IFooterCellConfig {
    // колспан
    startColumn?: number;
    endColumn?: number;
}

export interface IFooterCellComponentProps extends IBaseCellComponentProps, IFooterCellConfig {
    shouldAddFooterPadding: boolean;
    padding: IHorizontalCellPadding;
    isFirstCell: boolean;
    isLastCell: boolean;

    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    backgroundColorStyle?: TBackgroundStyle;
}

// wrapper render utils

function getMinHeightClasses(
    shouldAddFooterPadding: IFooterCellComponentProps['shouldAddFooterPadding']
) {
    return shouldAddFooterPadding
        ? ' controls-ListView__footer__itemActionsV_outside'
        : ' controls-GridReact__footer__cell_min-height';
}

function getStyle(
    props: Pick<IFooterCellComponentProps, 'style' | 'startColumn' | 'endColumn'>
): React.CSSProperties | undefined {
    const { startColumn, endColumn } = props;
    if (startColumn && endColumn) {
        return {
            ...props.style,
            gridColumn: `${startColumn} / ${endColumn}`,
        };
    }
    return props.style;
}

function FooterEmptyCellComponent() {
    return null;
}

// content render utils
function getContentRender(
    props: Pick<IFooterCellComponentProps, 'contentRender'>
): React.ReactElement {
    const { contentRender } = props;

    // Если задан рендер контента, то используем его
    if (contentRender) {
        return contentRender;
    }

    return <FooterEmptyCellComponent />;
}

function getColumnScrollClasses(
    props: Pick<
        IFooterCellComponentProps,
        | 'columnScrollViewMode'
        | 'columnScrollSelectors'
        | 'columnScrollIsFixedCell'
        | 'columnScrollIsFixedToEnd'
        | 'hasColumnResizer'
        | 'isSingleColspanedCell'
        | 'isActsAsRowTemplate'
    >
) {
    return getColumnScrollClassesUtil(props);
}

function getBaseClasses(className: IFooterCellComponentProps['className']) {
    let baseClasses =
        'js-controls-GridReact__cell controls-ListView__footer controls-GridReact__footer-cell';

    baseClasses += ' tw-box-border tw-flex tw-items-baseline';

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getFirstLastCellClasses(isFirstCell: boolean, isLastCell: boolean) {
    let classes = '';
    if (isFirstCell) {
        classes += ' controls-GridReact__cell_first';
    }

    if (isLastCell) {
        classes += ' controls-GridReact__cell_last';
    }
    return classes;
}

function getPaddingClasses(padding: IFooterCellComponentProps['padding']): string {
    return getHorizontalPaddingsClasses(padding.left, padding.right);
}

function FooterCellComponent(
    props: IFooterCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { className, tooltip, backgroundColorStyle } = props;

    const wrapperRenderClassName =
        getBaseClasses(className) +
        getPaddingClasses(props.padding) +
        getBackgroundColorStyleClasses(backgroundColorStyle) +
        getFirstLastCellClasses(props.isFirstCell, props.isLastCell) +
        getMinHeightClasses(props.shouldAddFooterPadding) +
        getColumnScrollClasses(props);

    const wrapperRenderStyle = getStyle(props);

    const contentRender = (
        <>
            {props.beforeContentRender ?? null}
            {getContentRender(props)}
        </>
    );

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(FooterCellComponent);

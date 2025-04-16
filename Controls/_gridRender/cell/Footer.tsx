/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { default as BaseCell, IBaseCellComponentProps } from './Base';
import { getBaseCellProps } from 'Controls/_gridRender/cell/utils/Base';
import { IHorizontalCellPadding, TCellType } from 'Controls/_gridRender/cell/interface/ICell';
import { getHorizontalPaddingsClasses } from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { getColumnScrollClasses as getColumnScrollClassesUtil } from 'Controls/_gridRender/cell/utils/Classes/ColumnScroll';
import { getCellPositionClasses } from 'Controls/_gridRender/cell/utils/Classes/CellPosition';
import { getBackgroundColorStyleClasses } from 'Controls/_gridRender/cell/utils/Classes/BackgroundColorStyle';
import { TBackgroundStyle } from 'Controls/interface';

export interface IFooterCellConfig {
    // колспан
    startColumn?: number;
    endColumn?: number;
}

export interface IFooterCellComponentProps extends IBaseCellComponentProps, IFooterCellConfig {
    shouldAddFooterPadding: boolean;
    padding: IHorizontalCellPadding | null;
    isFirstCell: boolean;
    isLastCell: boolean;

    // компонент, размещаемый перед contentRender
    beforeContentRender?: React.ReactElement;

    backgroundColorStyle?: TBackgroundStyle;

    decorationStyle?: string;
    cellType?: TCellType;
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        | 'columnScrollViewMode'
        | 'columnScrollSelectors'
        | 'columnScrollIsFixedCell'
        | 'columnScrollIsFixedToEnd'
        | 'hasColumnResizer'
        | 'isSingleColspanedCell'
        | 'isActsAsRowTemplate'
    >
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return getColumnScrollClassesUtil(props);
}

function getBaseClasses(
    className: IFooterCellComponentProps['className'],
    cellType: IFooterCellComponentProps['cellType'],
    decorationStyle: IFooterCellComponentProps['decorationStyle']
) {
    let baseClasses =
        'js-controls-GridReact__cell controls-ListView__footer controls-GridReact__footer-cell';

    if (cellType === 'checkbox') {
        return `${baseClasses} controls-Grid__row-cell-checkbox-${decorationStyle}`;
    }

    baseClasses += ' tw-box-border tw-flex tw-items-baseline';

    if (className) {
        baseClasses += ` ${className}`;
    }

    return baseClasses;
}

function getPaddingClasses(padding: IFooterCellComponentProps['padding']): string {
    if (!padding) {
        return '';
    }
    return getHorizontalPaddingsClasses(padding.left, padding.right);
}

function Footer(
    props: IFooterCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { className, cellType, decorationStyle, tooltip, backgroundColorStyle } = props;

    const wrapperRenderClassName =
        getBaseClasses(className, cellType, decorationStyle) +
        getPaddingClasses(props.padding) +
        getBackgroundColorStyleClasses(backgroundColorStyle) +
        getCellPositionClasses(props) +
        getMinHeightClasses(props.shouldAddFooterPadding) +
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getColumnScrollClasses(props);

    const wrapperRenderStyle = getStyle(props);

    const contentRender = (
        <>
            {props.beforeContentRender ?? null}
            {getContentRender(props)}
        </>
    );

    return (
        <BaseCell
            {...getBaseCellProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            style={wrapperRenderStyle}
            tooltip={tooltip}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(Footer);

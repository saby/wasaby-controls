/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { TGridVPaddingSize } from 'Controls/interface';
import { default as BaseCell } from 'Controls/_gridRender/cell/Base';
import { getBaseCellProps } from 'Controls/_gridRender/cell/utils/Base';
import { getColspanRowspanStyles } from 'Controls/_gridRender/cell/utils/Styles/GridSpan';
import { IEmptyCellComponentProps } from 'Controls/_gridRender/cell/interface/IEmptyCellComponent';
import {
    getHorizontalPaddingsClasses,
    getVerticalPaddingsClasses,
} from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { getBaselineClasses } from 'Controls/_gridRender/cell/utils/Classes/Baseline';
import { getBorderRadiusClasses } from 'Controls/_gridRender/cell/utils/Classes/Border';
import { getAlignClasses } from 'Controls/_gridRender/cell/utils/Classes/Align';
import { getColumnSeparatorClasses } from 'Controls/_gridRender/cell/utils/Classes/ColumnSeparator';
import { getEmptyContentRenderClasses } from 'Controls/_gridRender/cell/utils/Classes/Empty';
import { getColumnScrollClasses } from 'Controls/_gridRender/cell/utils/Classes/ColumnScroll';

function getStyles(props: IEmptyCellComponentProps): React.CSSProperties {
    return { ...props.style, ...getColspanRowspanStyles(props) };
}

function getBaseClasses(props: IEmptyCellComponentProps): string {
    // ' controls-Grid__row-cell__content' +
    let baseClasses =
        'controls-Grid__row-cell js-controls-Grid__row-cell js-controls-GridReact__cell' +
        ' controls-BaseControl__emptyTemplate controls-GridView__emptyTemplate__cell' +
        ' tw-flex tw-h-full tw-w-full tw-items-center';

    // decorationStyle classes
    if (props.decorationStyle) {
        baseClasses += ` controls-GridReact__cell-${props.decorationStyle}`;
    }

    // cursor classes
    baseClasses += ` tw-cursor-${props.cursor}`;

    // edit in place classes
    if (props.editing) {
        baseClasses += ' controls-Grid__row-cell-editing';
    }

    // colspan classes
    // TODO: use startColspanIndex/endColspanIndex
    if (props.colspan && props.colspan > 1) {
        baseClasses += ' js-controls-Grid__cell_colspaned';
    }

    return baseClasses;
}

// TODO этот стиль используется только здесь. Мб можно объединить с controls-background-?
function getBackgroundColorStyleClasses(
    backgroundColorStyle: IEmptyCellComponentProps['backgroundColorStyle'],
    isSingleCell: IEmptyCellComponentProps['isSingleCell']
) {
    return !isSingleCell && backgroundColorStyle
        ? ` controls-Grid__row-cell-background-${backgroundColorStyle}`
        : '';
}

function getSeparatorClasses(props: IEmptyCellComponentProps): string {
    return getColumnSeparatorClasses({
        leftSeparatorSize: props.leftSeparatorSize,
    });
}

function getCheckboxClasses(cellType: IEmptyCellComponentProps['cellType']): string {
    return cellType === 'checkbox' ? ' controls-GridView__emptyTemplate__checkBoxCell' : '';
}

function getMinHeightClasses(
    isSingleCell: IEmptyCellComponentProps['isSingleCell'],
    paddingTop: TGridVPaddingSize,
    paddingBottom: TGridVPaddingSize,
    decorationStyle: string
): string {
    if (isSingleCell) {
        return '';
    }
    const size = paddingTop === 'null' && paddingBottom === 'null' ? 'small' : 'default';
    const style =
        paddingTop === 'default' && paddingBottom === 'default' ? decorationStyle : 'default';
    return ` controls-Grid__row-cell_${size}_style-${style}_min_height`;
}

function getEmptyCellAlignClasses(props: IEmptyCellComponentProps): string {
    if (props.cellType === 'checkbox') {
        return '';
    }
    return props.flexAlignment
        ? ` tw-box-border tw-justify-${props.halign}`
        : getAlignClasses(props.halign) +
              ' tw-items-baseline tw-min-w-0 tw-shrink tw-box-border' +
              getBaselineClasses(props.valign, 'default', 'default');
}

function getContentRender(props: IEmptyCellComponentProps): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const className = getEmptyContentRenderClasses(props.contentRenderProps);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return props.wrapContentRender !== false ? (
        <div className={className}>{props.contentRender}</div>
    ) : (
        props.contentRender || null
    );
}

/**
 * Чистый рендер ячейки пустого представления
 * @param props
 * @param ref
 * @constructor
 */
function Empty(
    props: IEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperClassName =
        getBaseClasses(props) +
        getEmptyCellAlignClasses(props) +
        getSeparatorClasses(props) +
        getBorderRadiusClasses(props) +
        getHorizontalPaddingsClasses(props.paddingLeft, props.paddingRight) +
        getVerticalPaddingsClasses(props.paddingTop, props.paddingBottom) +
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getMinHeightClasses(
            props.isSingleCell,
            props.paddingTop,
            props.paddingBottom,
            props.decorationStyle
        ) +
        getCheckboxClasses(props.cellType) +
        getBackgroundColorStyleClasses(props.backgroundColorStyle, props.isSingleCell) +
        getColumnScrollClasses(props);
    const inlineStyle = getStyles(props);
    const contentRender = getContentRender(props);

    return (
        <BaseCell
            {...getBaseCellProps(props)}
            ref={ref}
            className={wrapperClassName}
            style={inlineStyle}
            contentRender={contentRender}
        />
    );
}

export default React.forwardRef(Empty);

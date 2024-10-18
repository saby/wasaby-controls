/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { IBaseGroupTemplate } from 'Controls/baseList';
import BaseCellComponent, {
    IBaseCellComponentProps,
} from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/BaseCell';
import GroupContentRender from 'Controls/_grid/cleanRender/cell/contentRenders/GroupContentRender';
import { default as DefaultCellComponent } from 'Controls/_grid/dirtyRender/cell/CellComponent';
import {
    getBackgroundColorStyleClasses,
    getHoverBackgroundColorStyleClasses,
} from 'Controls/_grid/cleanRender/cell/utils/Classes/BackgroundColorStyle';
import { getColumnScrollClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/ColumnScroll';
import { TFontColorStyle } from 'Controls/_interface/IFontColorStyle';
import { TFontSize } from 'Controls/_interface/IFontSize';
import { TFontWeight } from 'Controls/_interface/IFontWeight';
import { TTextTransform } from 'Controls/_interface/ITextTransform';
import { TCellType } from 'Controls/_grid/dirtyRender/cell/interface';
import { TBackgroundStyle, TCursor } from 'Controls/interface';

export interface IGroupCellComponentProps extends IBaseCellComponentProps, IBaseGroupTemplate {
    customTemplateProps?: object;
    expanded?: boolean;
    expanderPosition?: string;
    rightTemplateProps?: object;
    textRender?: string | React.ReactElement;

    // sticky
    headerFixedPosition?: string;

    // Должно уйти в будущем, для этого надо поправить компонент группировки
    decorationStyle?: string; // default или master
    isFirstItem?: boolean;
    leftPaddingClassName?: string;
    rightPaddingClassName?: string;
    rightTemplateCondition?: boolean;
    // Растягивание шаблона справа.  Применяется в гриде при скролле колонок
    rightTemplateStretch?: boolean;

    // colspan
    startColspanIndex?: number; // ?
    endColspanIndex?: number;

    // тип ячейки
    cellType?: TCellType;

    // Флаг скрытого заголовка группы
    isHiddenGroup?: boolean;

    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    isFirstDataColumn?: boolean;

    isGroupNode?: boolean;

    // hover
    hoverBackgroundStyle?: TBackgroundStyle;
    highlightOnHover?: boolean;
    isStickyLadderCell?: boolean;

    // cursor
    cursor?: TCursor;
}

function getStyle(
    props: Pick<IGroupCellComponentProps, 'style' | 'startColspanIndex' | 'endColspanIndex'>
): React.CSSProperties | undefined {
    const { startColspanIndex, endColspanIndex } = props;
    if (startColspanIndex && endColspanIndex) {
        return {
            ...props.style,
            gridColumn: `${startColspanIndex} / ${endColspanIndex}`,
        };
    }
    return {
        ...props.style,
    };
}

function getBaseClasses({
    isFirstColumn,
    isLastColumn,
}: {
    isFirstColumn: IGroupCellComponentProps['isFirstColumn'];
    isLastColumn: IGroupCellComponentProps['isLastColumn'];
}): string {
    // controls-ListView__groupContent_height в groupContentRender
    let baseClasses =
        'controls-GridReact__cell js-controls-GridReact__cell js-controls-Grid__row-cell tw-flex';

    if (isFirstColumn) {
        baseClasses += ' controls-GridReact__cell_first';
    }

    if (isLastColumn) {
        baseClasses += ' controls-GridReact__cell_last';
    }

    return baseClasses;
}

function getCursorClasses(cursor: TCursor = 'pointer') {
    return ` tw-cursor-${cursor}`;
}

function getAlignClasses() {
    return ' tw-items-center';
}

function getPaddingClasses(props: IGroupCellComponentProps) {
    const leftPaddingClassName = props.leftPaddingClassName
        ? ` ${props.leftPaddingClassName}`
        : ` controls-padding_left-${props.paddingLeft}`;
    const hasRightTemplate = !!props.rightTemplate && props.rightTemplateCondition !== false;

    const rightPaddingClassName = props.rightPaddingClassName
        ? ` ${props.rightPaddingClassName}`
        : ` controls-padding_right-${props.paddingRight}`;

    let paddingClasses = ` controls-padding_top-${
        props.paddingTop ?? 's'
    } controls-padding_bottom-${props.paddingBottom ?? '2xs'} `;

    //Отступ слева нужен:
    // 1) Узел ввиде группы - isGroupNode
    // 2) Если первая ячейка обычной группировки - isFirstCell

    if (props.isFirstCell || props.isGroupNode) {
        paddingClasses += leftPaddingClassName;
    }

    // Отступ справа нужен:
    // 1) Если узел ввиде группы - isGroupNode
    // 2) Если последняя ячейка обычной группировки - isLastCell

    if (!hasRightTemplate && (props.isGroupNode || props.isLastCell)) {
        paddingClasses += rightPaddingClassName;
    }

    return paddingClasses;
}

function getContentTextStylingClasses(
    templateFontColorStyle?: TFontColorStyle,
    templateFontSize?: TFontSize,
    templateFontWeight?: TFontWeight,
    templateTextTransform?: TTextTransform
): string {
    let classes = '';
    if (templateFontSize) {
        classes += ` controls-fontsize-${templateFontSize}`;
    } else {
        classes += ' controls-ListView__groupContent-text_default';
    }
    if (templateFontColorStyle) {
        classes += ` controls-text-${templateFontColorStyle}`;
    } else {
        classes += ' controls-ListView__groupContent-text_color_default';
    }
    if (templateFontWeight) {
        classes += ` controls-fontweight-${templateFontWeight}`;
    }
    if (templateTextTransform) {
        classes +=
            ` controls-ListView__groupContent_textTransform_${templateTextTransform}` +
            ` controls-ListView__groupContent_textTransform_${templateTextTransform}_${
                templateFontSize || 's'
            }`;
    }
    return classes;
}

/**
 * Модифицирует объект с пропсами для ячейки данных в строке иерархической группировки
 * @param props
 */
function preparePropsForHierarchyGroupDataCell(props: IGroupCellComponentProps) {
    const newProps = { ...props };
    newProps.topSeparatorSize = 'null';
    newProps.bottomSeparatorSize = 'null';
    // В иерархической группировке всегда добавляются опции записи
    // newProps.actionsVisibility = 'hidden';
    newProps['data-qa'] = 'cell';
    return newProps;
}

function getCheckboxClasses(
    cellType: IGroupCellComponentProps['cellType'],
    decorationStyle: IGroupCellComponentProps['decorationStyle']
) {
    if (cellType === 'checkbox') {
        return ` controls-Grid__row-cell-checkbox-${decorationStyle}`;
    }
    return '';
}

function getGroupContentWrapperClasses(
    isFirstColumn: IGroupCellComponentProps['isFirstColumn'],
    isLastColumn: IGroupCellComponentProps['isLastColumn']
): string {
    let classes = ' controls-ListView__GroupContentWrapper';

    if (isFirstColumn) {
        classes += ' controls-ListView__GroupContentWrapper_first';
    }
    if (isLastColumn) {
        classes += ' controls-ListView__GroupContentWrapper_last';
    }

    return classes;
}

/**
 * Рендер ячейки данных в строке иерархической группировки
 * @param props
 * @constructor
 */
function HierarchyGroupDataCellComponent(props: IGroupCellComponentProps): React.ReactElement {
    const preparedProps = preparePropsForHierarchyGroupDataCell(props);
    const classes =
        props.className +
        ' ' +
        getContentTextStylingClasses(
            preparedProps.fontColorStyle,
            preparedProps.fontSize,
            preparedProps.fontWeight,
            preparedProps.textTransform
        );
    return <DefaultCellComponent {...preparedProps} className={classes} />;
}

/**
 * Рендер контента заголовка группы.
 * @param props
 */
function getContentRender(props: IGroupCellComponentProps): React.ReactElement | null {
    if (props.isHiddenGroup) {
        return null;
    }
    return (
        <GroupContentRender
            backgroundStyle={props.backgroundStyle}
            contentRender={props.contentRender}
            customTemplateProps={props.customTemplateProps}
            decorationStyle={props.decorationStyle}
            endColspanIndex={props.endColspanIndex}
            expanded={props.expanded}
            expanderPosition={props.expanderPosition}
            expanderVisible={props.expanderVisible}
            fontColorStyle={props.fontColorStyle}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            halign={props.halign}
            headerFixedPosition={props.headerFixedPosition}
            iconSize={props.iconSize}
            iconStyle={props.iconStyle}
            isFirstItem={props.isFirstItem}
            isSticky={props.isSticky}
            leftPaddingClassName={props.leftPaddingClassName}
            rightPaddingClassName={props.rightPaddingClassName}
            rightTemplate={props.rightTemplate}
            rightTemplateCondition={props.rightTemplateCondition}
            rightTemplateProps={props.rightTemplateProps}
            rightTemplateStretch={props.rightTemplateStretch}
            startColspanIndex={props.startColspanIndex}
            separatorVisible={props.separatorVisible}
            textRender={props.textRender}
            textTransform={props.textTransform}
            textVisible={props.textVisible}
            className={props.className}
        />
    );
}

/**
 * Рендер ячейки, содержащей заголовок группы
 * @param props
 * @param ref
 * @constructor
 */
function GroupCellComponent(
    props: IGroupCellComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    let wrapperRenderClassName =
        getBaseClasses({
            isFirstColumn: props.isFirstColumn,
            isLastColumn: props.isLastColumn,
        }) +
        getAlignClasses() +
        getCursorClasses(props.cursor) +
        getPaddingClasses(props) +
        getColumnScrollClasses(props) +
        getCheckboxClasses(props.cellType, props.decorationStyle) +
        getHoverBackgroundColorStyleClasses({
            hoverBackgroundStyle: props.hoverBackgroundStyle,
            highlightOnHover: props.highlightOnHover,
            isStickyLadderCell: props.isStickyLadderCell,
        }) +
        getGroupContentWrapperClasses(props.isFirstColumn, props.isLastColumn);

    if (!props.isSticky) {
        wrapperRenderClassName += getBackgroundColorStyleClasses(props.backgroundStyle);
    }

    if (props.isGroupNode && !props?.groupNodeConfig && !props.isFirstDataColumn) {
        return <HierarchyGroupDataCellComponent {...props} className={wrapperRenderClassName} />;
    }

    const wrapperRenderStyle = getStyle(props);

    const contentRender = getContentRender(props);

    return (
        <BaseCellComponent
            {...getBaseCellComponentProps(props)}
            ref={ref}
            className={wrapperRenderClassName}
            contentRender={contentRender}
            data-qa={'cell'}
            style={wrapperRenderStyle}
            tabIndex={props.tabIndex}
            fixedZIndex={props.fixedZIndex}
            tooltip={undefined}
            onMouseEnter={undefined}
            onMouseMove={undefined}
            isSticky={props.isSticky || props.stickied} // Правильно isSticky, stickied - исп. в CellComponent
        />
    );
}

export default React.memo(React.forwardRef(GroupCellComponent));

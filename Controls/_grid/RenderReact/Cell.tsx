/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import * as React from 'react';

import { createElement, delimitProps, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';

import { InfoboxTarget } from 'Controls/popupTargets';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    TTagStyle,
} from 'Controls/interface';
import { TCursor } from 'Controls/list';
import { getEditorClassName } from 'Controls/display';

import DataCell from 'Controls/_baseGrid/display/DataCell';
import Row from 'Controls/_baseGrid/display/Row';
import { EditArrowComponent, IEditArrowProps } from 'Controls/listVisualAspects';
import { TCellHorizontalAlign } from 'Controls/_baseGrid/display/interface/IColumn';

interface IPropsCompatibility {
    itemData: Row | DataCell;
    gridColumn: DataCell;
    colData: DataCell;
}

export interface ICellProps
    extends TInternalProps,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions {
    column: DataCell;
    item: Row;

    children?: React.ReactElement;
    contentTemplate: React.Component | React.FunctionComponent;
    beforeContentTemplate: React.Component | React.FunctionComponent;
    afterContentTemplate: React.Component | React.FunctionComponent;

    tagStyle: TTagStyle;

    itemActionsTemplate: React.Component | React.FunctionComponent;
    itemActionsClass: string;

    ladderWrapper: React.Component | React.FunctionComponent;
    multiSelectTemplate: React.Component | React.FunctionComponent;

    hoverBackgroundStyle: string;
    backgroundColorStyle: string;
    highlightOnHover: boolean;
    editable: boolean;
    cursor: TCursor;
    align: TCellHorizontalAlign;

    onTagClick: (event: React.BaseSyntheticEvent, item: Row, columnIndex: number) => void;
    onTagHover: (event: React.BaseSyntheticEvent, item: Row, columnIndex: number) => void;

    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onClick?: Function;
    onMouseDown?: Function;
    onMouseUp?: Function;
    onKeyDown?: Function;
    className?: string;
}

// Обёртка над EditArrowComponent, в которой мы набираем опции из модели
function EditArrowWrapper(
    props: IEditArrowProps & ICellProps & { forwardedRef: React.ForwardedRef<HTMLDivElement> }
): React.ReactElement {
    const backgroundStyle = props.column.getEditArrowBackgroundStyle(
        props.editArrowBackgroundStyle,
        props.highlightOnHover,
        props.hoverBackgroundStyle,
        props.editable
    );

    return (
        <EditArrowComponent
            ref={props.forwardedRef}
            textOverflow={props.textOverflow}
            backgroundStyle={backgroundStyle}
        />
    );
}

// Возвращает функциональный компонент для передачи в contentTemplate прикладнику
function getEditArrowTemplate(props: Partial<ICellProps>): React.ForwardedRef<React.ReactElement> {
    return React.forwardRef((editArrowTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        return props.column.shouldDisplayEditArrow() ? (
            <EditArrowWrapper forwardedRef={ref} {...props} {...editArrowTemplateProps} />
        ) : null;
    });
}

interface ITooltipContentProps {
    onMouseMove: Function;
    onMouseDown: Function;
    onMouseLeave: Function;
    onTouchStart: Function;
    onClick: Function;
}

const CellContentRender = React.forwardRef(function (
    props: ICellProps & ITooltipContentProps & { className?: string },
    ref
): JSX.Element {
    const CellContentRender = props.column.getCellContentRender();
    return (
        <CellContentRender
            value={props.column.getDisplayValue()}
            ref={ref}
            highlightedValue={props.column.getSearchValue()}
            fontSize={props.column.config.fontSize || props.fontSize}
            fontWeight={props.column.config.fontWeight || props.fontWeight}
            fontColorStyle={props.column.config.fontColorStyle || props.fontColorStyle}
            displayTypeOptions={props.column.config.displayTypeOptions}
            textOverflow={props.column.config.textOverflow}
            column={props.column}
            tooltip={props.column.getTextOverflowTitle()}
            className={props.className ? ` ${props.className}` : ''}
            $wasabyRef={props.$wasabyRef}
            onMouseMove={props.onMouseMove}
            onMouseDown={props.onMouseDown}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            onClick={props.onClick}
        />
    );
});

function TooltipTemplate(props: ICellProps): JSX.Element {
    const content = (infoboxProps: TInternalProps & ITooltipContentProps) => {
        if (props.column.hasCellContentRender()) {
            return (
                <CellContentRender
                    {...props}
                    onMouseMove={infoboxProps.onMouseMove}
                    onMouseDown={infoboxProps.onMouseDown}
                    onMouseLeave={infoboxProps.onMouseLeave}
                    onTouchStart={infoboxProps.onTouchStart}
                    onClick={infoboxProps.onClick}
                    $wasabyRef={infoboxProps.$wasabyRef}
                    ref={infoboxProps.forwardedRef}
                    className={props.column.getTooltipOverflowClasses()}
                />
            );
        }

        return (
            <div
                ref={infoboxProps.$wasabyRef}
                onMouseDown={(e) => {
                    return infoboxProps.onMouseDown?.(e);
                }}
                onMouseMove={(e) => {
                    return infoboxProps.onMouseMove?.(e);
                }}
                onMouseLeave={(e) => {
                    return infoboxProps.onMouseLeave?.(e);
                }}
                onClick={(e) => {
                    return infoboxProps.onClick?.(e);
                }}
                onTouchStart={(e) => {
                    return infoboxProps.onTouchStart?.(e);
                }}
            >
                {props.column.getDefaultDisplayValue()}
            </div>
        );
    };

    const popupTemplate = (templateProps: TInternalProps) => {
        return (
            <div className={templateProps.attrs?.className} ref={templateProps.$wasabyRef}>
                {props.column.getTooltip()}
            </div>
        );
    };

    return <InfoboxTarget content={content} template={popupTemplate} />;
}

function Content(props: ICellProps & { wasabyContext: Record<string, unknown> }): JSX.Element {
    const column = props.column;

    if (column.config?.editorTemplate && column.isEditing()) {
        return (
            <div className={getEditorClassName(props.align, props.item.getEditingConfig()?.mode)}>
                {createElement(
                    column.config.editorTemplate as unknown as React.Component,
                    {
                        column,
                        item: column.getOwner(),
                    } as object,
                    { class: 'controls-EditingTemplateText__editor' }
                )}
            </div>
        );
    }

    if (column['[Controls/_display/grid/DataCell]'] && column.config?.reactContentTemplate) {
        // Скрытая возможность передать вместо опции column.template опцию column.contentTemplate, чтобы убрать вызов
        // в прикладном шаблоне платформенной обертки (минус слой) и убрать создание через createElement (он сильно
        // тормозит отрисовку).
        // Всё это дает прирост к скорости отрисовки ~15%.
        // Глобально будем переводить всех на такой подход в рамках оптимизации шаблонов грида.
        // По мотивам: https://online.sbis.ru/opendoc.html?guid=ce54e19c-c655-4d24-814c-0bacce6530f6&client=3
        return (
            <column.config.reactContentTemplate
                item={props.item}
                column={props.column}
                stickyProperty={props.stickyProperty}
                ladderWrapper={props.ladderWrapper}
                expanderTemplate={props.expanderTemplate}
            />
        );
    }

    if (props.contentTemplate) {
        return createElement(
            props.contentTemplate,
            {
                item: column.getOwner(),
                column,
                gridColumn: column,
                itemData: column,
                colData: column,
                editable: props.editable,
                highlightOnHover: props.highlightOnHover,
                hoverBackgroundStyle: props.hoverBackgroundStyle,
                itemActionsTemplate: props.itemActionsTemplate,
                itemActionsClass: props.itemActionsClass,
                ladderWrapper: props.ladderWrapper,
                stickyProperty: props.stickyProperty,
                multiSelectTemplate: props.multiSelectTemplate,
                expanderTemplate: props.expanderTemplate,
                editArrowTemplate: getEditArrowTemplate({
                    ...props,
                    column,
                }),
            } as object,
            undefined,
            undefined,
            props.wasabyContext
        ) as JSX.Element;
    }

    // Проверяем после props.contentTemplate, т.к. если задан contentTemplate, то прикладники именно его и задали
    // а children может просто скопом прилететь в дополнение.
    // Если хотят только children, то contentTemplate не должен быть задан
    if (props.children) {
        return props.children;
    }

    if (column.config?.tooltipProperty) {
        return <TooltipTemplate {...props} />;
    }

    if (column.hasCellContentRender()) {
        return <CellContentRender {...props} className={undefined} />;
    }

    return <>{column.getDefaultDisplayValue()}</>;
}

export default React.memo(function CellContent(props: ICellProps): React.ReactElement {
    const { clearProps, $wasabyRef, userAttrs, context } = delimitProps(props);
    propsCompatibility(clearProps as ICellProps & IPropsCompatibility);

    const column = clearProps.column;

    let classes =
        column.getContentClasses(
            props.backgroundColorStyle,
            props.cursor,
            props.highlightOnHover,
            props.editable,
            props.hoverBackgroundStyle
        ) + ' ';
    classes += column.getContentTextStylingClasses(
        props.fontColorStyle,
        props.fontSize,
        props.fontWeight
    );
    if (userAttrs.hasOwnProperty('className') || props.hasOwnProperty('className')) {
        classes += ` ${userAttrs.className || props.className}`;
        delete userAttrs.className;
    }
    let style = wasabyAttrsToReactDom({
        style: column.getContentStyles(),
    }).style;
    if (userAttrs.style) {
        // теперь в атрибутах style всегда объект, поэтому спредим
        style = { ...style, ...userAttrs.style };
    }
    const dataQa = userAttrs['data-qa'] || `${column.listElementName}_content`;

    const shouldDisplayEditArrow = column.shouldDisplayEditArrow(props.contentTemplate);
    const editArrowTemplate = shouldDisplayEditArrow && (
        <EditArrowWrapper {...props} textOverflow={column.config.textOverflow} />
    );

    const beforeContentTemplate =
        props.beforeContentTemplate && createElement(props.beforeContentTemplate, clearProps);
    const afterContentTemplate =
        props.afterContentTemplate && createElement(props.afterContentTemplate, clearProps);

    const tagTemplate = column.TagCell && column.shouldDisplayTag(props.tagStyle) && (
        <div
            className={column.getTagClasses(props.tagStyle)}
            data-qa={'controls-tag'}
            onClick={(event) => {
                return (
                    props.onTagClick &&
                    props.onTagClick(event, column.getOwner(), column.getColumnIndex())
                );
            }}
            onMouseEnter={(event) => {
                return (
                    props.onTagHover &&
                    props.onTagHover(event, column.getOwner(), column.getColumnIndex())
                );
            }}
        />
    );

    return (
        <div
            // tabIndex={-1} позволяет нативно получать фокус по клику и не получать фокус по табу.
            tabIndex={-1}
            {...userAttrs}
            className={classes}
            style={style}
            data-qa={dataQa}
            ref={$wasabyRef}
            key={'cellContent_' + column.getInstanceId()}
            onMouseEnter={(e) => {
                return props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                return props.onMouseLeave?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                return props.onMouseUp?.(e);
            }}
            onKeyDown={(e) => {
                return props.onKeyDown?.(e);
            }}
        >
            {beforeContentTemplate}
            {<Content {...clearProps} wasabyContext={context} />}
            {editArrowTemplate}
            {afterContentTemplate}
            {tagTemplate}
        </div>
    );
});

function propsCompatibility(props: ICellProps & IPropsCompatibility): void {
    if (props.gridColumn) {
        props.column = props.gridColumn;
    }
    if (props.colData) {
        props.column = props.colData;
    }
    if (props.itemData) {
        if (props.itemData['[Controls/_display/CollectionItem]']) {
            props.item = props.itemData as Row;
        } else {
            props.column = props.itemData as DataCell;
        }
    }
}

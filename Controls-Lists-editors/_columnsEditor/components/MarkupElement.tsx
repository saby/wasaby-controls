import { BoundingRectContext } from 'FrameEditor/player';
import { ResizingLine } from 'Controls/dragnDrop';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { AddWidgetButton } from 'FrameEditor/controls';
import {
    ADD_ON_RIGHT_MODE,
    ADD_ON_LEFT_MODE,
    FIT_WIDTH,
    MIN_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import 'Controls-editors/dropdown';
import { InformationLineElement } from 'Controls-Lists-editors/_columnsEditor/components/InformationLine';
import { Checkbox } from 'Controls/checkbox';
import { SelectionContext } from 'Controls-Lists-editors/_columnsEditor/context/SelectionContext';
import { DragNDropContext } from 'Controls-Lists-editors/_columnsEditor/context/DragNDropContext';
import {
    IPopupEditorProps,
    openPopupEditor,
} from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { IColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import rk = require('i18n!Controls-Lists-editors');

interface IInformationLineProps {
    width: IColumnWidth;
    rightCellPadding: string | null;
    leftCellPadding: string | null;
    isMainColumn?: boolean;
    offsetTop?: number;
}

interface ISize {
    offsetHeight: number;
    offsetWidth: number;
}

interface IMarkupElement {
    id: number;
    popupEditorProps: IPopupEditorProps;
    /**
     * Размеры элемента разметки. Необходимы при монтировании компонента
     */
    size: ISize;
    onDeleteButtonClick?: Function;
    onLeftAddButtonClick?: Function;
    onRightAddButtonClick?: Function;
    onCheckboxClick?: Function;
    onResize?: Function;
    style?: object;
    onMouseMove?: Function;
    onMouseDown?: Function;
    resizeLinePosition?: 'none' | 'left' | 'right';
    actionsOffset?: number;
    deleteIcon?: string;
    deleteButtonTooltip?: string;
    informationLineProps?: IInformationLineProps;
    initZIndex: number;
}

/**
 * Режим взаимного расположения кнопок удаления колонки и отметки чекбоксом
 * @variant onBelow кнопка удаления под чекбоксом
 * @variant onRight кнопка удаления справа от чекбокса
 * @variant hidden обе кнопки скрыты
 * @default onRight
 */
type TFittingMode = 'onBelow' | 'onRight' | 'hidden';

export default function MarkupElement(props: IMarkupElement) {
    const {
        id,
        popupEditorProps,
        onDeleteButtonClick,
        onLeftAddButtonClick,
        onRightAddButtonClick,
        style,
        onMouseDown,
        onMouseMove,
        onResize,
        onCheckboxClick,
        informationLineProps,
        size,
        initZIndex,
        actionsOffset = 0,
        resizeLinePosition = 'left',
        deleteIcon = 'icon-Erase',
        deleteButtonTooltip = rk('Удалить колонку'),
    } = props;
    const boundingRectContext = React.useContext(BoundingRectContext);
    const markupElementRef = React.useRef(null);
    const widgetHTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const widgetOffsetTop = widgetHTMLElement?.offsetTop;
    const addWidgetButtonStyle = { top: `calc(50% + ${actionsOffset / 2}px)` };
    const checkboxStyle = {
        top: `calc(var(--offset_2xs) + ${actionsOffset}px)`,
    };
    const cellPaddingLeft = popupEditorProps.value.cellPadding?.left;
    const bottomOffset = `calc(-1 * (var(--offset_2xs) + var(--border-thickness) + ${
        widgetOffsetTop ?? 0
    }px + ${informationLineProps?.offsetTop || 0}px))`;
    const leftOffset = `calc(-1 * var(--offset_${cellPaddingLeft ?? 'm'}) / 2)`;
    const informationLineStyle = {
        offsetAnchor: `bottom ${bottomOffset} left ${leftOffset}`,
    };
    const highlightContainerStyle = {
        height: `${size.offsetHeight}px`,
    };
    const fittingMode: TFittingMode = React.useMemo(() => {
        const width = size.offsetWidth || 0;
        if (Math.round(width) < MIN_COLUMN_WIDTH) {
            return 'hidden';
        } else if (width < FIT_WIDTH) {
            return 'onBelow';
        } else return 'onRight';
    }, [size.offsetWidth]);
    const deleteButtonStyle = {
        top: `calc(${
            fittingMode === 'onBelow' ? 'calc(var(--height_checkbox) + var(--offset_2xs))' : '0px'
        } + ${actionsOffset}px)`,
    };
    const selection = React.useContext(SelectionContext);
    const dragContext = React.useContext(DragNDropContext);
    const [selected, setSelected] = React.useState(selection[id] ?? false);
    const [dragElement, setDragElement] = React.useState(dragContext);
    const [zIndex, setZIndex] = React.useState<number>(initZIndex);
    const zIndexStyle = React.useMemo(() => {
        return {
            zIndex,
        };
    }, [zIndex]);
    React.useEffect(() => {
        setSelected(selection[id] ?? false);
    }, [selection]);
    React.useEffect(() => {
        setDragElement(dragContext);
    }, [dragContext]);
    const columnEditorPopupContainer = widgetHTMLElement?.querySelector(
        '.columnValueListRestrictiveContainer'
    );
    const onClick = React.useCallback(() => {
        if (popupEditorProps) {
            openPopupEditor({
                id,
                ...popupEditorProps,
                columnEditorPopupContainer,
                elementRef: markupElementRef,
            });
        }
    }, [popupEditorProps, markupElementRef]);
    const highlightBorders = React.useCallback(() => {
        const highlightContainerElement = markupElementRef.current?.querySelector(
            '.ControlsListsEditors_columnsDesignTime-markup_element-highlight'
        );
        if (
            highlightContainerElement &&
            highlightContainerElement.classList.contains(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border'
            )
        ) {
            highlightContainerElement.classList.remove(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border'
            );
            highlightContainerElement.classList.add(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border_bold'
            );
        }
    }, [markupElementRef]);
    const removeBordersHighlight = React.useCallback(() => {
        const highlightContainerElement = markupElementRef.current?.querySelector(
            '.ControlsListsEditors_columnsDesignTime-markup_element-highlight'
        );
        if (
            highlightContainerElement &&
            highlightContainerElement.classList.contains(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border_bold'
            )
        ) {
            highlightContainerElement.classList.remove(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border_bold'
            );
            highlightContainerElement.classList.add(
                'ControlsListsEditors_columnsDesignTime-markup_element-highlight-border'
            );
        }
    }, [markupElementRef]);
    const mouseMove = React.useCallback(
        (event) => {
            if (dragElement && event.target === markupElementRef.current) {
                const offsetX = event.nativeEvent.offsetX;
                const width = markupElementRef.current?.offsetWidth;
                onMouseMove?.(dragElement, id, offsetX, width);
            }
        },
        [id, dragElement, onMouseMove]
    );
    return (
        <div
            ref={markupElementRef}
            onMouseDown={(event) => {
                popupEditorProps.opener.close();
                if (id !== 0) {
                    onMouseDown?.(event, {
                        width: markupElementRef.current?.offsetWidth,
                        id,
                    });
                }
            }}
            onMouseMove={mouseMove}
            onClick={onClick}
            className={'tw-relative ControlsListsEditors_columnsDesignTime-markup_element '}
            style={{ ...style, ...zIndexStyle }}
        >
            {informationLineProps ? (
                <InformationLineElement
                    style={informationLineStyle}
                    {...informationLineProps}
                    containerWidth={size.offsetWidth}
                    onSpotMouseOver={() => {
                        markupElementRef.current?.classList.remove(
                            'ControlsListsEditors_columnsDesignTime-markup_element'
                        );
                    }}
                    onSpotMouseOut={() => {
                        markupElementRef.current?.classList.add(
                            'ControlsListsEditors_columnsDesignTime-markup_element'
                        );
                    }}
                />
            ) : null}
            {onDeleteButtonClick && !dragElement && fittingMode !== 'hidden' ? (
                <div
                    style={deleteButtonStyle}
                    title={deleteButtonTooltip}
                    className={`tw-absolute ControlsListsEditors_columnsDesignTime-markup_element-close_button-${fittingMode}`}
                >
                    <Button
                        icon={deleteIcon}
                        iconSize={'s'}
                        inlineHeight={'m'}
                        viewMode={'outlined'}
                        buttonStyle={'danger'}
                        iconStyle={'danger'}
                        className={
                            'ControlsListsEditors_columnsDesignTime-markup_element-close_button tw-relative'
                        }
                        onClick={(event) => {
                            popupEditorProps.opener.close();
                            event.stopPropagation();
                            onDeleteButtonClick?.(id);
                        }}
                    />
                </div>
            ) : null}
            {onCheckboxClick && !dragElement && fittingMode !== 'hidden' ? (
                <Checkbox
                    size={'m'}
                    viewMode={'outlined'}
                    className={` tw-absolute ControlsListsEditors_columnsDesignTime-markup_element_checkbox ${
                        !selected || !markupElementRef.current?.offsetWidth
                            ? 'tw-invisible'
                            : 'ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
                    }`}
                    onValueChanged={(value: boolean) => {
                        popupEditorProps.opener.close();
                        onCheckboxClick?.(id, value, selection);
                        setSelected(value);
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    customEvents={['onValueChanged']}
                    value={selected}
                    style={checkboxStyle}
                />
            ) : null}
            {onLeftAddButtonClick && !dragElement ? (
                <div
                    style={addWidgetButtonStyle}
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-add_button-left tw-absolute'
                    }
                >
                    <AddWidgetButton
                        className={
                            'tw-absolute ControlsListsEditors_columnsDesignTime-markup_element-add_button '
                        }
                        onClick={(event) => {
                            popupEditorProps.opener.close();
                            event.stopPropagation();
                            onLeftAddButtonClick?.(id, ADD_ON_LEFT_MODE);
                        }}
                    />
                </div>
            ) : null}
            {onRightAddButtonClick && !dragElement ? (
                <div
                    style={addWidgetButtonStyle}
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-add_button-right tw-absolute'
                    }
                >
                    <AddWidgetButton
                        className={
                            'tw-absolute ControlsListsEditors_columnsDesignTime-markup_element-add_button '
                        }
                        onClick={(event) => {
                            popupEditorProps.opener.close();
                            event.stopPropagation();
                            onRightAddButtonClick?.(id, ADD_ON_RIGHT_MODE);
                        }}
                    />
                </div>
            ) : null}
            {!dragElement ? (
                <div
                    style={highlightContainerStyle}
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-highlight ControlsListsEditors_columnsDesignTime-markup_element-highlight-border'
                    }
                />
            ) : null}
            {dragElement && dragElement.id === id ? (
                <div
                    className={'ControlsListsEditors_columnsDesignTime-markup_drag-object'}
                    style={highlightContainerStyle}
                ></div>
            ) : null}
            {resizeLinePosition !== 'none' && size.offsetWidth > 0 ? (
                <ResizingLine
                    orientation={'horizontal'}
                    areaStyle={'editor'}
                    onOffset={(offset: number) => {
                        markupElementRef.current?.classList.remove(
                            'ControlsListsEditors_columnsDesignTime-markup_element-is-resizing'
                        );
                        removeBordersHighlight();
                        onResize?.(id, resizeLinePosition, popupEditorProps.value.width)(offset);
                        setZIndex(initZIndex);
                    }}
                    onDragMove={() => {
                        markupElementRef.current?.classList.add(
                            'ControlsListsEditors_columnsDesignTime-markup_element-is-resizing'
                        );
                        highlightBorders();
                        if (zIndex === initZIndex) {
                            setZIndex(initZIndex + 1);
                        }
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    customEvents={['onOffset', 'onDragMove']}
                    className={` ControlsListsEditors_columnsDesignTime-markup_element-resizeLine ControlsListsEditors_columnsDesignTime-markup_element-resizeLine-${resizeLinePosition}`}
                    onMouseOver={() => {
                        setZIndex(initZIndex + 1);
                        highlightBorders();
                    }}
                    onMouseOut={() => {
                        setZIndex(initZIndex);
                        removeBordersHighlight();
                    }}
                />
            ) : null}
        </div>
    );
}

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

/**
 * Интерфейс элемента разметки
 */
interface IMarkupElement {
    /**
     * Уникальный идентификатор
     */
    id: number;
    /**
     * Параметры для редактора типа
     */
    popupEditorProps: IPopupEditorProps;
    /**
     * Размеры элемента разметки. Необходимы при монтировании компонента
     */
    size: ISize;
    /**
     * Обработчик клика по кнопке "Удалить"
     */
    onDeleteButtonClick?: Function;
    /**
     * Обработчик клика по кнопке "Добавить элемент слева"
     */
    onLeftAddButtonClick?: Function;
    /**
     * Обработчик клика по кнопке "Добавить элемент справа"
     */
    onRightAddButtonClick?: Function;
    /**
     * Обработчик клика по чекбоксу
     */
    onCheckboxClick?: Function;
    /**
     * Обработчик ручного изменения ширины
     */
    onResize?: Function;
    /**
     * Дополнительные настройки стиля
     */
    style?: object;
    /**
     * Обработчик события onMouseMove
     */
    onMouseMove?: Function;
    /**
     * Обработчик события onMouseDown
     */
    onMouseDown?: Function;
    /**
     * Положение инструмента изменения ширины
     */
    resizeLinePosition?: 'none' | 'left' | 'right';
    /**
     * Отступ сверху кнопок
     */
    actionsOffset?: number;
    /**
     * Иконка кнопки удаления
     */
    deleteIcon?: string;
    /**
     * Тултип иконки удаления
     */
    deleteButtonTooltip?: string;
    /**
     * Параметры соответствующего элемента информационной полосы
     */
    informationLineProps?: IInformationLineProps;
    initZIndex: number;
    qaMarkupKey?: string;
}

/**
 * Режим взаимного расположения кнопок удаления колонки и отметки чекбоксом
 * @variant onBelow кнопка удаления под чекбоксом
 * @variant onRight кнопка удаления справа от чекбокса
 * @variant hidden обе кнопки скрыты
 * @default onRight
 */
type TFittingMode = 'onBelow' | 'onRight' | 'hidden';

/**
 * Элемент разметки
 * @param {IMarkupElement} props Пропсы элемента
 * @category component
 * @public
 */
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
        qaMarkupKey,
        actionsOffset = 0,
        resizeLinePosition = 'left',
        deleteIcon = 'icon-Erase',
        deleteButtonTooltip = rk('Удалить колонку'),
    } = props;
    const boundingRectContext = React.useContext(BoundingRectContext);
    const markupElementRef = React.useRef(null);
    const widgetHTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const widgetOffsetTop = widgetHTMLElement?.offsetTop;
    const addWidgetButtonStyle = React.useMemo(() => {
        return { top: `calc(50% + ${actionsOffset / 2}px)` };
    }, [actionsOffset]);
    const checkboxStyle = React.useMemo(() => {
        return {
            top: `calc(var(--offset_2xs) + ${actionsOffset}px)`,
        };
    }, [actionsOffset]);
    const cellPaddingLeft = popupEditorProps.value.cellPadding?.left;
    const bottomOffset = React.useMemo(() => {
        return `calc(-1 * (var(--offset_2xs) + var(--border-thickness) + ${
            widgetOffsetTop ?? 0
        }px + ${informationLineProps?.offsetTop || 0}px))`;
    }, [widgetOffsetTop, informationLineProps?.offsetTop]);
    const leftOffset = React.useMemo(() => {
        return `calc(-1 * var(--offset_${cellPaddingLeft ?? 'm'}) / 2)`;
    }, [cellPaddingLeft]);
    const informationLineStyle = React.useMemo(() => {
        return {
            offsetAnchor: `bottom ${bottomOffset} left ${leftOffset}`,
        };
    }, [bottomOffset, leftOffset]);
    const highlightContainerStyle = React.useMemo(() => {
        return {
            height: `${size.offsetHeight}px`,
        };
    }, [size.offsetHeight]);
    const fittingMode: TFittingMode = React.useMemo(() => {
        const width = size.offsetWidth || 0;
        if (Math.round(width) < MIN_COLUMN_WIDTH) {
            return 'hidden';
        } else if (width < FIT_WIDTH) {
            return 'onBelow';
        } else return 'onRight';
    }, [size.offsetWidth]);
    const deleteButtonStyle = React.useMemo(() => {
        return {
            top: `calc(${
                fittingMode === 'onBelow'
                    ? 'calc(var(--height_checkbox) + var(--offset_2xs))'
                    : '0px'
            } + ${actionsOffset}px)`,
        };
    }, [fittingMode, actionsOffset]);
    const selection = React.useContext(SelectionContext);
    const dragContext = React.useContext(DragNDropContext);
    const selected = React.useMemo(() => {
        return selection[id] ?? false;
    }, [selection, id]);
    const [zIndex, setZIndex] = React.useState<number>(initZIndex);
    const [highlightBorders, setHighlightBorders] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [isEnabled, setIsEnabled] = React.useState(true);
    const zIndexStyle = React.useMemo(() => {
        return {
            zIndex,
        };
    }, [zIndex]);
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
    }, [popupEditorProps, markupElementRef, id, columnEditorPopupContainer]);
    const mouseMove = React.useCallback(
        (event) => {
            if (dragContext && event.target === markupElementRef.current) {
                const offsetX = event.nativeEvent.offsetX;
                const width = markupElementRef.current?.offsetWidth;
                onMouseMove?.(dragContext, id, offsetX, width);
            }
        },
        [id, dragContext, onMouseMove]
    );

    const mouseDown = React.useCallback(
        (event) => {
            popupEditorProps.opener.close();
            if (id !== 0) {
                onMouseDown?.(event, {
                    width: markupElementRef.current?.offsetWidth,
                    id,
                });
            }
        },
        [id, onMouseDown, popupEditorProps.opener]
    );

    const onCheckboxValueChange = React.useCallback(
        (value: boolean) => {
            popupEditorProps.opener.close();
            onCheckboxClick?.(id, value, selection);
        },
        [onCheckboxClick, id, selection, popupEditorProps.opener]
    );
    const leftAddButtonClick = React.useCallback(
        (event) => {
            popupEditorProps.opener.close();
            event.stopPropagation();
            onLeftAddButtonClick?.(id, ADD_ON_LEFT_MODE);
        },
        [onLeftAddButtonClick, id, popupEditorProps.opener]
    );
    const rightAddButtonClick = React.useCallback(
        (event) => {
            popupEditorProps.opener.close();
            event.stopPropagation();
            onRightAddButtonClick?.(id, ADD_ON_RIGHT_MODE);
        },
        [onRightAddButtonClick, id, popupEditorProps.opener]
    );
    const deleteButtonClick = React.useCallback(
        (event) => {
            popupEditorProps.opener.close();
            event.stopPropagation();
            onDeleteButtonClick?.(id);
        },
        [onDeleteButtonClick, id, popupEditorProps.opener]
    );
    const resizeEnd = React.useCallback(
        (offset: number) => {
            setIsResizing(false);
            setHighlightBorders(false);
            onResize?.(id, resizeLinePosition, popupEditorProps.value.width)(offset);
            setZIndex(initZIndex);
        },
        [onResize, id, initZIndex, resizeLinePosition, popupEditorProps.value.width]
    );
    const resize = React.useCallback(() => {
        setIsResizing(true);
        setHighlightBorders(true);
        if (zIndex === initZIndex) {
            setZIndex(initZIndex + 1);
        }
    }, [initZIndex, zIndex]);
    const resizeLineMouseOver = React.useCallback(() => {
        setZIndex(initZIndex + 1);
        setHighlightBorders(true);
    }, [initZIndex]);
    const resizeLineMouseOut = React.useCallback(() => {
        setZIndex(initZIndex);
        setHighlightBorders(false);
    }, [initZIndex]);
    const attrs = React.useMemo(() => {
        if (qaMarkupKey) {
            return {
                'qa-markup-key': qaMarkupKey,
            };
        } else return {};
    }, [qaMarkupKey]);
    return (
        <div
            ref={markupElementRef}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
            onClick={onClick}
            className={`tw-relative ${
                isEnabled ? 'ControlsListsEditors_columnsDesignTime-markup_element' : ''
            } ${
                isResizing
                    ? 'ControlsListsEditors_columnsDesignTime-markup_element-is-resizing'
                    : ''
            }`}
            data-qa={'ControlsListsEditors_columnsDesignTime-markup_element'}
            {...attrs}
            style={{ ...style, ...zIndexStyle }}
        >
            {informationLineProps ? (
                <InformationLineElement
                    style={informationLineStyle}
                    {...informationLineProps}
                    containerWidth={size.offsetWidth}
                    onSpotMouseOver={() => {
                        setIsEnabled(false);
                    }}
                    onSpotMouseOut={() => {
                        setIsEnabled(true);
                    }}
                />
            ) : null}
            {onDeleteButtonClick && !dragContext && fittingMode !== 'hidden' ? (
                <div
                    style={deleteButtonStyle}
                    title={deleteButtonTooltip}
                    className={`tw-absolute ControlsListsEditors_columnsDesignTime-markup_element-close_button-${fittingMode}`}
                >
                    <Button
                        icon={deleteIcon}
                        iconSize={'s'}
                        inlineHeight={'m'}
                        viewMode={'squared'}
                        buttonStyle={'danger'}
                        iconStyle={'danger'}
                        className={
                            'ControlsListsEditors_columnsDesignTime-markup_element-close_button tw-relative'
                        }
                        data-qa={
                            'ControlsListsEditors_columnsDesignTime-markup_element-close_button'
                        }
                        onClick={deleteButtonClick}
                    />
                </div>
            ) : null}
            {onCheckboxClick && !dragContext && fittingMode !== 'hidden' ? (
                <Checkbox
                    size={'m'}
                    viewMode={'outlined'}
                    data-qa={'ControlsListsEditors_columnsDesignTime-markup_element_checkbox'}
                    className={` tw-absolute ControlsListsEditors_columnsDesignTime-markup_element_checkbox ${
                        !selected || !markupElementRef.current?.offsetWidth
                            ? 'tw-invisible'
                            : 'ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
                    }`}
                    onValueChanged={onCheckboxValueChange}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    customEvents={['onValueChanged']}
                    value={selected}
                    style={checkboxStyle}
                />
            ) : null}
            {onLeftAddButtonClick && !dragContext ? (
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
                        dataQa={
                            'ControlsListsEditors_columnsDesignTime-markup_element-add_button-left'
                        }
                        onClick={leftAddButtonClick}
                    />
                </div>
            ) : null}
            {onRightAddButtonClick && !dragContext ? (
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
                        dataQa={
                            'ControlsListsEditors_columnsDesignTime-markup_element-add_button-right'
                        }
                        onClick={rightAddButtonClick}
                    />
                </div>
            ) : null}
            {!dragContext ? (
                <div
                    style={highlightContainerStyle}
                    className={`ControlsListsEditors_columnsDesignTime-markup_element-highlight ControlsListsEditors_columnsDesignTime-markup_element-highlight-border${
                        highlightBorders ? '_bold' : ''
                    }`}
                />
            ) : null}
            {dragContext && dragContext.id === id ? (
                <div
                    className={'ControlsListsEditors_columnsDesignTime-markup_drag-object'}
                    style={highlightContainerStyle}
                ></div>
            ) : null}
            {resizeLinePosition !== 'none' && size.offsetWidth > 0 ? (
                <ResizingLine
                    orientation={'horizontal'}
                    areaStyle={'editor'}
                    onOffset={resizeEnd}
                    onDragMove={resize}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    customEvents={['onOffset', 'onDragMove']}
                    className={` ControlsListsEditors_columnsDesignTime-markup_element-resizeLine ControlsListsEditors_columnsDesignTime-markup_element-resizeLine-${resizeLinePosition}`}
                    data-qa={`ControlsListsEditors_columnsDesignTime-markup_element-resizeLine-${resizeLinePosition}`}
                    onMouseOver={resizeLineMouseOver}
                    onMouseOut={resizeLineMouseOut}
                />
            ) : null}
        </div>
    );
}

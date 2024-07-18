import { BoundingRectContext, HighlightContainer } from 'FrameEditor/player';
import { ResizingLine } from 'Controls/dragnDrop';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { AddWidgetButton } from 'FrameControls/columnsLayoutEditors';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { ObjectType } from 'Meta/types';
import {
    DEFAULT_COLUMN_PARAMS,
    ADD_ON_RIGHT_MODE,
    ADD_ON_LEFT_MODE,
    FIT_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    parseColumnWidth,
    resizeHandler,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import 'Controls-editors/dropdown';
import {
    getColumnEditorMetaType,
    getMainColumnEditorMetaType,
} from 'Controls-Lists-editors/_columnsEditor/utils/meta';
import { InformationLineElement } from 'Controls-Lists-editors/_columnsEditor/components/InformationLine';
import { Checkbox } from 'Controls/checkbox';
import { SelectionContext } from 'Controls-Lists-editors/_columnsEditor/context/SelectionContext';

interface IMarkupElement {
    id: number;
    onDeleteButtonClick?: Function;
    onAddButtonClick?: Function;
    onReplaceColumnClick?: Function;
    onCheckboxClick?: Function;
    onEdit: Function;
    style?: object;
    className?: string;
    highlightContainerStyle?: object;
    markupValue: object;
    dragObjectId?: number;
    onMouseMove?: Function;
    onMouseDown?: Function;
    resizeLinePosition?: 'left' | 'right';
    isMainColumn?: boolean;
    elementWidth: number;
    columnEditorOpener: ObjectEditorOpener;
    areAllColumns?: boolean;
}

interface IOpenColumnEditor {
    id: number;
    onEdit: Function;
    markupValue: object;
    columnEditorOpener: ObjectEditorOpener;
    onReplaceColumnClick?: Function;
    columnEditorPopupContainer?: Element | null;
}

/**
 * Режим взаимного расположения кнопок удаления колонки и отметки чекбоксом
 * @variant onBelow кнопка удаления под чекбоксом
 * @variant onRight кнопка удаления справа от чекбокса
 * @default onRight
 */
type TFittingMode = 'onBelow' | 'onRight';

function getDefaultProperties(onReplaceColumnClick: Function, columnId: number) {
    if (columnId === 0) {
        return getMainColumnEditorMetaType();
    }
    return getColumnEditorMetaType(onReplaceColumnClick);
}

function openColumnEditor(props: IOpenColumnEditor) {
    const defaultProperties = getDefaultProperties(props.onReplaceColumnClick, props.id);
    const opener = props.columnEditorOpener;
    opener.open({
        metaType: ObjectType.id(String(props.id)).attributes(defaultProperties).title('Колонка'),
        value: {
            ...props.markupValue,
            caption: {
                default: props.markupValue.columnValue.caption,
                custom:
                    props.markupValue.caption !== props.markupValue.columnValue.caption
                        ? props.markupValue.caption
                        : '',
            },
            width: props.markupValue.width,
            textOverflow: !props.markupValue.textOverflow
                ? true
                : props.markupValue.textOverflow === DEFAULT_COLUMN_PARAMS.textOverflow,
            align: props.markupValue.align ?? DEFAULT_COLUMN_PARAMS.align,
            columnValue: {
                caption: props.markupValue.columnValue.caption,
                displayProperty: props.markupValue.columnValue.displayProperty,
            },
            columnSeparatorSize: props.markupValue.columnSeparatorSize,
        },
        // TODO Вынести обработчик onChange в отдельную функцию
        onChange: (value: object) => {
            let newHeaderProperties = {};
            if (props.id !== 0) {
                newHeaderProperties = {
                    align: value.align,
                    textOverflow: !value.textOverflow
                        ? 'ellipsis'
                        : DEFAULT_COLUMN_PARAMS.textOverflow,
                    caption: value.caption.custom || value.caption.default,
                };
            }
            const newColumnProperties = {
                columnSeparatorSize: value.columnSeparatorSize,
            };
            if (props.id !== 0) {
                newColumnProperties.displayProperty = value.columnValue.displayProperty;
            }
            if (value.width !== props.markupValue.width) {
                newColumnProperties.width = value.width;
            }
            if (props.id !== 0) {
                newColumnProperties.displayProperty = value.columnValue.displayProperty;
                if (value.columnValue.caption !== value.caption.default) {
                    newHeaderProperties.caption = value.columnValue.caption;
                    value.caption = {
                        default: value.columnValue?.caption,
                        custom: '',
                    };
                }
            }
            props.onEdit(props.id)(newColumnProperties, newHeaderProperties);
        },
        popupOptions: {
            opener: null,
            target: props.columnEditorPopupContainer,
            direction: { vertical: 'center', horizontal: 'center' },
        },
        autoSave: true,
    });
}

export default function MarkupElement(props: IMarkupElement) {
    const {
        id,
        onDeleteButtonClick,
        onAddButtonClick,
        onEdit,
        style,
        highlightContainerStyle,
        markupValue,
        onReplaceColumnClick,
        onMouseDown,
        onMouseMove,
        dragObjectId,
        onCheckboxClick,
        elementWidth,
        columnEditorOpener,
        areAllColumns = false,
        resizeLinePosition = 'left',
        isMainColumn = false,
    } = props;
    const boundingRectContext = React.useContext(BoundingRectContext);
    const markupElementRef = React.useRef(null);
    const widgetHTMLElement = boundingRectContext.getHtmlElementByElementId('widget');
    const widgetOffsetTop = widgetHTMLElement?.offsetTop;
    const cellPaddingLeft = markupValue.cellPadding?.left;
    const bottomOffset = `calc(-1 * (var(--offset_2xs) + var(--border-thickness) + ${
        widgetOffsetTop ?? 0
    }px))`;
    const leftOffset = `calc(-1 * var(--offset_${cellPaddingLeft ?? 'm'}) / 2)`;
    const informationLineStyle = {
        offsetAnchor: `bottom ${bottomOffset} left ${leftOffset}`,
    };
    const fittingMode: TFittingMode = React.useMemo(() => {
        if (elementWidth < FIT_WIDTH) {
            return 'onBelow';
        } else return 'onRight';
    }, [elementWidth]);
    const selection = React.useContext(SelectionContext);
    const [selected, setSelected] = React.useState(selection[id] ?? false);
    React.useEffect(() => {
        setSelected(selection[id] ?? false);
    }, [selection]);

    const onResize = React.useCallback(
        (direction: 'left' | 'right', gridTemplateWidth: string) => {
            return (offset: number) => {
                const vectorSign = direction === 'left' ? -1 : 1;
                const headersHTML = widgetHTMLElement?.getElementsByClassName(
                    'controls-Grid__header-cell'
                );
                const columnHTML = boundingRectContext.getElementBoundingRect(headersHTML[id]);
                const gridHTML = boundingRectContext.getElementBoundingRect(
                    widgetHTMLElement?.querySelector('.controls-Grid')
                );
                const newColumnProperties = {
                    width: resizeHandler({
                        columnHTMLWidth: columnHTML.width,
                        columnTemplateWidth: gridTemplateWidth,
                        offset: offset * vectorSign,
                        containerWidth: gridHTML.width,
                        isMainColumn,
                    }),
                };
                props.onEdit(props.id)(newColumnProperties);
            };
        },
        [props, id, widgetHTMLElement, boundingRectContext]
    );
    const columnEditorPopupContainer = widgetHTMLElement?.querySelector(
        '.columnValueListRestrictiveContainer'
    );
    const [highlighted, setHighlighted] = React.useState(false);
    const backgroundClassName = React.useMemo(() => {
        let className = '';
        if (highlighted) {
            className += ' ControlsListsEditors_columnsDesignTime-markup_background-color';
        }
        return className;
    }, [highlighted]);
    const onClick = React.useCallback(() => {
        openColumnEditor({
            id,
            onEdit,
            markupValue,
            columnEditorOpener,
            onReplaceColumnClick,
            columnEditorPopupContainer,
        });
    }, [markupValue, onReplaceColumnClick, onEdit, columnEditorOpener]);
    const mouseMove = React.useCallback(
        (event) => {
            if (dragObjectId && event.target === markupElementRef.current) {
                const offsetX = event.nativeEvent.offsetX;
                const width = markupElementRef.current?.offsetWidth;
                onMouseMove?.(id, offsetX, width);
            }
        },
        [id, dragObjectId]
    );
    return (
        <div
            ref={markupElementRef}
            onMouseOver={() => {
                setHighlighted(true);
            }}
            onMouseOut={() => {
                setHighlighted(false);
            }}
            onMouseDown={(event) => {
                if (id !== 0) {
                    onMouseDown?.(event, {
                        width: markupElementRef.current?.offsetWidth,
                        id,
                    });
                }
            }}
            onMouseMove={mouseMove}
            onClick={onClick}
            className={'ControlsListsEditors_columnsDesignTime-markup_element '}
            style={style}
        >
            <InformationLineElement
                width={parseColumnWidth(markupValue.width)}
                rightCellPadding={markupValue.cellPadding?.right ?? 'm'}
                leftCellPadding={markupValue.cellPadding?.left ?? 'm'}
                style={informationLineStyle}
                isMainColumn={isMainColumn}
            />
            {id !== 0 && !dragObjectId ? (
                <Button
                    icon={'icon-Erase'}
                    iconSize={'s'}
                    inlineHeight={'m'}
                    viewMode={'outlined'}
                    buttonStyle={'danger'}
                    iconStyle={'danger'}
                    className={`ControlsListsEditors_columnsDesignTime-markup_element-close_button ControlsListsEditors_columnsDesignTime-markup_element-close_button-${fittingMode}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onDeleteButtonClick?.(id);
                    }}
                />
            ) : null}
            {id !== 0 && !dragObjectId ? (
                <Checkbox
                    size={'m'}
                    viewMode={'outlined'}
                    className={`ControlsListsEditors_columnsDesignTime-markup_element_checkbox ${
                        !selected || elementWidth === 0
                            ? 'tw-invisible'
                            : 'ControlsListsEditors_columnsDesignTime-markup_element_checkbox-selected'
                    }`}
                    onValueChanged={(value: boolean) => {
                        onCheckboxClick?.(id, value);
                        setSelected(value);
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    customEvents={['onValueChanged']}
                    value={selected}
                />
            ) : null}
            {id !== 0 && !dragObjectId && !areAllColumns ? (
                <AddWidgetButton
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-add_button ControlsListsEditors_columnsDesignTime-markup_element-add_button-left '
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        onAddButtonClick?.(id, ADD_ON_LEFT_MODE);
                    }}
                />
            ) : null}
            {!dragObjectId && !areAllColumns ? (
                <AddWidgetButton
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-add_button ControlsListsEditors_columnsDesignTime-markup_element-add_button-right '
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        onAddButtonClick?.(id, ADD_ON_RIGHT_MODE);
                    }}
                />
            ) : null}
            {!dragObjectId ? (
                <HighlightContainer
                    highlighted={highlighted}
                    style={highlightContainerStyle}
                    className={`ControlsListsEditors_columnsDesignTime-markup_element-highlight ${backgroundClassName}`}
                />
            ) : null}
            {dragObjectId && dragObjectId === id ? (
                <div className={'ControlsListsEditors_columnsDesignTime-markup_drag-object'}></div>
            ) : null}
            {!isMainColumn || resizeLinePosition === 'right' ? (
                <ResizingLine
                    orientation={'horizontal'}
                    areaStyle={'editor'}
                    onOffset={onResize(resizeLinePosition, markupValue.width)}
                    customEvents={['onOffset']}
                    className={` ControlsListsEditors_columnsDesignTime-markup_element-resizeLine ControlsListsEditors_columnsDesignTime-markup_element-resizeLine-${resizeLinePosition}`}
                />
            ) : null}
        </div>
    );
}

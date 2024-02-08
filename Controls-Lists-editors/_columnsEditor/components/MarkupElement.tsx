import { HighlightContainer } from 'FrameEditor/player';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { AddWidgetButton } from 'FrameControls/columnsLayoutEditors';
import ObjectEditorOpener from 'Controls-editors/objectEditorOpener';
import { StringType, ObjectType } from 'Meta/types';
import 'Controls-editors/dropdown';
import * as rk from 'i18n!Controls';
interface IMarkupElement {
    id: number;
    onDelete?: Function;
    onAdd?: Function;
    onEdit: Function;
    style?: object;
    className?: string;
    highlightContainerStyle?: object;
    markupValue: object;
}
const RIGHT_MODE = 'right';
const LEFT_MODE = 'left';

interface IOpenColumnEditor {
    id: number;
    onEdit: Function;
    markupValue: object;
}

function openColumnEditor(props: IOpenColumnEditor) {
    const defaultProperties = {
        caption: StringType.id('caption').title(rk('Значение')).order(-1),
        width: StringType.oneOf([])
            .id('width')
            .editor('Controls-Lists-editors/columnsEditor:ColumnWidthEditor', {})
            .title(rk('Ширина'))
            .optional(),
    };
    const opener = new ObjectEditorOpener();
    opener.open({
        metaType: ObjectType.id(String(props.id)).attributes(defaultProperties),
        value: {
            ...props.markupValue,
            width: props.markupValue.width,
        },
        onChange: (value: object) => {
            const newHeaderProperties = {};
            const newColumnProperties = {};
            if (value.caption !== props.markupValue.caption) {
                newHeaderProperties.caption = value.caption;
            }
            if (value.width !== props.markupValue.width) {
                newColumnProperties.width = value.width;
            }
            props.onEdit(props.id)(newColumnProperties, newHeaderProperties);
        },
        popupOptions: {
            opener: null,
            minWidth: 400,
            maxWidth: 800,
        },
        autoSave: true,
    });
}

export default function MarkupElement(props: IMarkupElement) {
    const { id, onDelete, onAdd, onEdit, style, highlightContainerStyle, markupValue } = props;
    const [highlighted, setHighlighted] = React.useState(false);
    return (
        <div
            onMouseOver={() => {
                setHighlighted(true);
            }}
            onMouseOut={() => {
                setHighlighted(false);
            }}
            onClick={() => {
                openColumnEditor({ id, onEdit, markupValue });
            }}
            className={'ControlsListsEditors_columnsDesignTime-markup_element '}
            style={style}
        >
            {id !== 0 ? (
                <Button
                    icon={'icon-Erase'}
                    iconSize={'s'}
                    viewMode={'link'}
                    iconStyle={'danger'}
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-close_button '
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete?.(id);
                    }}
                />
            ) : null}
            {id !== 0 ? (
                <AddWidgetButton
                    className={
                        'ControlsListsEditors_columnsDesignTime-markup_element-add_button ControlsListsEditors_columnsDesignTime-markup_element-add_button-left '
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        onAdd?.(id, LEFT_MODE);
                    }}
                />
            ) : null}
            <AddWidgetButton
                className={
                    'ControlsListsEditors_columnsDesignTime-markup_element-add_button ControlsListsEditors_columnsDesignTime-markup_element-add_button-right '
                }
                onClick={(event) => {
                    event.stopPropagation();
                    onAdd?.(id, RIGHT_MODE);
                }}
            />
            <HighlightContainer
                highlighted={highlighted}
                style={highlightContainerStyle}
                className={'ControlsListsEditors_columnsDesignTime-markup_element-highlight '}
            />
        </div>
    );
}

import { Fragment, ReactElement, useEffect, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { PropertyGrid, IPropertyGridProperty } from 'Controls/propertyGrid';
import * as translate from 'i18n!Controls';
import { IButtonStyle, parseStyleInClassName } from 'Controls-Input/buttonConnected';

const CAPTION_COLUMN_OPTIONS = {
    width: '24%',
};
const ITEMS_CONTAINER_PADDING = {
    top: 'none',
    bottom: 'none',
    left: 'none',
    right: 'none',
};

interface IStyleEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent: ReactElement;
}

interface IStyleEditorState {
    viewMode: string;
    buttonStyle: string;
    inlineHeight: string;
}

function generateClassName(value: IStyleEditorState): string {
    let buttonMode: string;
    if (value.viewMode === 'link') {
        buttonMode = 'linkButton';
    } else {
        buttonMode = 'button';
    }

    return `controls-${buttonMode}-style` +
        ` controls-${buttonMode}_${value.viewMode}-style` +
        ` controls-${buttonMode}_${value.viewMode}-${value.buttonStyle}-style` +
        ` controls-button_size-${value.inlineHeight}`;
}

export function StyleEditor(props: IStyleEditorProps) {
    const {value, onChange, LayoutComponent = Fragment} = props;
    const [style, setStyle] = useState<IButtonStyle>(() => {
        return parseStyleInClassName(value);
    });
    useEffect(() => {
        setStyle(parseStyleInClassName(value));
    }, [value]);

    const typeDescription: IPropertyGridProperty[] = [
        {
            name: 'viewMode',
            type: 'string',
            caption: translate('Форма'),
            editorOptions: {
                editorStyle: style
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:ViewModeEditor',
        },
        {
            name: 'buttonStyle',
            type: 'string',
            caption: translate('Цвет'),
            editorOptions: {
                editorStyle: style
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:ButtonStyleEditor',
        },
        {
            name: 'inlineHeight',
            type: 'string',
            caption: translate('Размер'),
            editorOptions: {
                editorStyle: style
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:InlineHeightEditor',
        }
    ];
    const editingObject = style;

    const editingObjectChangedHandler = (editingObject: IButtonStyle) => {
        onChange?.(generateClassName(editingObject));
        setStyle(editingObject);
    };

    return <LayoutComponent title={null}>
        <PropertyGrid
            editingObject={editingObject}
            typeDescription={typeDescription}
            onEditingObjectChanged={editingObjectChangedHandler}
            captionColumnOptions={CAPTION_COLUMN_OPTIONS}
            itemsContainerPadding={ITEMS_CONTAINER_PADDING}
        />
    </LayoutComponent>;
}
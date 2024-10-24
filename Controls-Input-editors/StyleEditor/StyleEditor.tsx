import { Fragment, ReactElement, useEffect, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { PropertyGrid, IPropertyGridProperty } from 'Controls/propertyGrid';
import * as translate from 'i18n!Controls';
import { IButtonStyle } from 'Controls-Input/buttonConnected';

function getFontColorStyle(viewMode: string, buttonStyle: string) {
    if (viewMode === 'filled') {
        if (['unaccented', 'default'].includes(buttonStyle)) {
            return 'default';
        }
        return 'contrast';
    } else if (viewMode === 'outlined') {
        return 'default';
    }
    return buttonStyle;
}

function getIconStyle(viewMode: string, buttonStyle: string) {
    if (viewMode === 'filled') {
        if (['unaccented', 'default'].includes(buttonStyle)) {
            return 'default';
        }
        return 'contrast';
    } else if (viewMode === 'outlined') {
        return 'default';
    }
    return buttonStyle;
}

function parseStyleInClassName(
    name?: string,
    defaultStyle: IButtonStyle = {
        viewMode: 'outlined',
        buttonStyle: 'primary',
        inlineHeight: 'm',
    }
): IButtonStyle {
    if (name) {
        const regStyleValue = name.match(/controls-([^_]+)_([^-]+)-([^-]+)-style/);
        const viewMode = regStyleValue?.[2] || defaultStyle.viewMode;
        const buttonStyle = regStyleValue?.[3] || defaultStyle.buttonStyle;
        const inlineHeight =
            name.match(/controls-button_size-(\w+)/)?.[1] || defaultStyle.inlineHeight;
        return {
            viewMode,
            buttonStyle,
            inlineHeight,
            fontColorStyle: getFontColorStyle(viewMode, buttonStyle),
            iconStyle: getIconStyle(viewMode, buttonStyle),
            fontSize: inlineHeight === '5xl' ? '3xl' : inlineHeight === 'm' ? 'm' : 'xl',
            iconSize: inlineHeight === '5xl' ? 'l' : inlineHeight === 'm' ? 's' : 'm',
        };
    }
    return {
        ...defaultStyle,
        fontColorStyle: getFontColorStyle(defaultStyle.viewMode, defaultStyle.buttonStyle),
        iconStyle: getIconStyle(defaultStyle.viewMode, defaultStyle.buttonStyle),
        fontSize: defaultStyle.inlineHeight,
        iconSize:
            defaultStyle.inlineHeight === '5xl'
                ? 'l'
                : defaultStyle.inlineHeight === 'm'
                ? 's'
                : 'm',
    };
}

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

    return (
        `controls-${buttonMode}-style` +
        ` controls-${buttonMode}_${value.viewMode}-style` +
        ` controls-${buttonMode}_${value.viewMode}-${value.buttonStyle}-style` +
        ` controls-button_size-${value.inlineHeight}`
    );
}

export function StyleEditor(props: IStyleEditorProps) {
    const { value, onChange, LayoutComponent = Fragment } = props;
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
                editorStyle: style,
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:ViewModeEditor',
        },
        {
            name: 'buttonStyle',
            type: 'string',
            caption: translate('Цвет'),
            editorOptions: {
                editorStyle: style,
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:ButtonStyleEditor',
        },
        {
            name: 'inlineHeight',
            type: 'string',
            caption: translate('Размер'),
            editorOptions: {
                editorStyle: style,
            },
            editorTemplateName: 'Controls-Input-editors/buttonStyleEditor:InlineHeightEditor',
        },
    ];
    const editingObject = style;

    const editingObjectChangedHandler = (editingObject: IButtonStyle) => {
        onChange?.(generateClassName(editingObject));
        setStyle(editingObject);
    };

    return (
        <LayoutComponent title={null}>
            <PropertyGrid
                editingObject={editingObject}
                typeDescription={typeDescription}
                onEditingObjectChanged={editingObjectChangedHandler}
                captionColumnOptions={CAPTION_COLUMN_OPTIONS}
                itemsContainerPadding={ITEMS_CONTAINER_PADDING}
            />
        </LayoutComponent>
    );
}

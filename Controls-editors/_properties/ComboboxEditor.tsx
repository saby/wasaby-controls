import { Fragment, memo, ReactElement, useCallback, useMemo } from 'react';
import { TemplateFunction } from 'UI/Base';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Memory } from 'Types/source';
import { ItemTemplate } from 'Controls/dropdown';
import { default as Combobox } from 'Controls/ComboBox';
import { useContent } from 'UICore/Jsx';
import { IInputPlaceholderOptions } from 'Controls/interface';
import 'css!Controls-editors/_properties/ComboboxEditor';

export interface IComboboxItems<T> {
    value: T;
    caption: string;
}

interface IComboboxEditorProps<T>
    extends IPropertyGridPropertyEditorProps<T | undefined>,
        IInputPlaceholderOptions {
    Control?: ReactElement | TemplateFunction;
    itemTemplate?: ReactElement | TemplateFunction;
    items: IComboboxItems<T>[];
    defaultValue?: T;
    readOnly?: boolean;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    dataQa?: string;
}

function InnerItemTemplate(props, Control): JSX.Element {
    const contentTemplate = (
        <Control
            className="controls-padding_top-m controls-ComboboxEditor-Control"
            direction={props.item.item.get('value')}
        />
    );
    return (
        <ItemTemplate
            {...props}
            className={`${props.className} ${
                props.item.isMarked() ? 'controls-background-unaccented' : ''
            } controls-ComboboxEditor-item`}
            contentTemplate={contentTemplate}
            roundBorder={false}
            multiLine={true}
            marker={false}
        />
    );
}

/**
 * Реакт компонент, редактор, позволяющий выбрать значение из списка
 * @class Controls-editors/_properties/ComboboxEditor
 * @public
 */
export const ComboboxEditor = memo(<T extends any>(props: IComboboxEditorProps<T>): JSX.Element => {
    const {
        type,
        value,
        onChange,
        LayoutComponent = Fragment,
        items,
        defaultValue,
        placeholder,
        readOnly,
        placeholderVisibility,
        fontSize,
        fontWeight,
        fontFamily,
        dataQa,
    } = props;
    const resolvedReadOnly = type?.isDisabled() || readOnly;
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: items || [] });
    }, [items]);

    const onValueChanged = useCallback(
        (newValue) => {
            onChange(
                items.find((item) => {
                    return item.value === newValue;
                })?.value
            );
        },
        [items, onChange]
    );

    const itemTemplate = useContent(
        (outerProps: object) => {
            if (props.itemTemplate) {
                return <props.itemTemplate {...outerProps} />;
            }

            return InnerItemTemplate(outerProps, props.Control);
        },
        [props.Control]
    );

    const style = useMemo(() => {
        const lineHeight = 1.2;
        return fontFamily ? { fontFamily, lineHeight } : {};
    }, [fontFamily]);

    return (
        <LayoutComponent>
            <div className="tw-contents" style={style}>
                <Combobox
                    source={source}
                    selectedKey={value || defaultValue}
                    dropdownClassName="controls-ComboboxEditor-dropdownContainer"
                    itemsSpacing="s"
                    readOnly={resolvedReadOnly}
                    displayProperty="caption"
                    keyProperty="value"
                    itemTemplate={itemTemplate}
                    placeholder={placeholder}
                    placeholderVisibility={placeholderVisibility}
                    onSelectedKeyChanged={onValueChanged}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    dataQa={dataQa}
                />
            </div>
        </LayoutComponent>
    );
});

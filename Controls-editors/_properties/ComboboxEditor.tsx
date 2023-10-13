import { Fragment, memo, ReactElement, useCallback, useMemo } from 'react';
import { TemplateFunction } from 'UI/Base';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Memory } from 'Types/source';
import { Combobox, ItemTemplate } from 'Controls/dropdown';
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
    Control: ReactElement | TemplateFunction;
    items: IComboboxItems<T>[];
    defaultValue?: T;
    readOnly?: boolean;
}

function InnerItemTemplate(props, Control): JSX.Element {
    props.itemData.itemClassList = 'controls-ComboboxEditor-item ' + props.itemData.itemClassList;
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
                props.item.treeItem.isMarked() ? 'controls-background-unaccented' : ''
            }`}
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
    } = props;
    const resolvedReadOnly = type.isDisabled() || readOnly;
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: items || [] });
    }, [items]);

    const onValueChanged = useCallback((value) => {
        onChange(
            items.find((item) => {
                return item.value === value;
            })?.value
        );
    }, []);

    const itemTemplate = useContent(
        (outerProps) => InnerItemTemplate(outerProps, props.Control),
        [props.Control]
    );

    return (
        <LayoutComponent>
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
                customEvents={['onSelectedKeyChanged']}
            />
        </LayoutComponent>
    );
});

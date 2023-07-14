import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Memory } from 'Types/source';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { Combobox as SelectorControl } from 'Controls/dropdown';
import 'css!Controls-editors/_properties/EnumbEditor';

export interface IEnumComboboxOption<T> {
    value: T;
    caption: string;
}

interface IEnumComboboxEditorProps<T> extends IPropertyEditorProps<T | undefined> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: Readonly<IEnumComboboxOption<T>[]>;
    isEmptyText?: boolean;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_properties/EnumEditor
 * @public
 */
export const EnumComboboxEditor = memo(<T extends any>(props: IEnumComboboxEditorProps<T>): JSX.Element => {
    const {type, value, onChange, isEmptyText = true, options = [], LayoutComponent = Fragment} = props;
    const readOnly = type.isDisabled();
    const source = useMemo(() => {
        return new Memory({keyProperty: 'value', data: options || []});
    }, [options]);

    const required = type.isRequired();

    const onValueChanged = useCallback(
        (value) => {
            const newKey = value;
            const newValue =
                newKey === null
                    ? null
                    : options.find((item) => {
                        return item.caption === newKey;
                    }).value;

            onChange(newValue);
        },
        [onChange, options]
    );

    return (
        <LayoutComponent>
            <SelectorControl
                data-qa="controls-PropertyGrid__editor_enum"
                className={'controls-PropertyGrid__editor_enum'}
                source={source}
                closeMenuOnOutsideClick={true}
                selectedKey={value}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="value"
                emptyKey={null}
                emptyText={(required || !isEmptyText) ? undefined : rk('Не выбрано')}
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
            />
        </LayoutComponent>
    );
});

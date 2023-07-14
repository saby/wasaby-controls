import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Memory } from 'Types/source';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { Selector as SelectorControl } from 'Controls/dropdown';
import 'css!Controls-editors/_properties/EnumbEditor';

export interface IEnumOption<T> {
    value: T;
    caption: string;
}

interface IEnumEditorProps<T> extends IPropertyEditorProps<T | undefined> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: Readonly<IEnumOption<T>[]>;
    emptyField?: string;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_properties/EnumEditor
 * @public
 */
export const EnumEditor = memo(<T extends any>(props: IEnumEditorProps<T>): JSX.Element => {
    const { type, value, onChange, options = [], LayoutComponent = Fragment, emptyField } = props;
    const readOnly = type.isDisabled();
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: options || [] });
    }, [options]);

    const required = type.isRequired();

    const onValueChanged = useCallback(
        (value) => {
            const newKey = value[0];
            const newValue =
                newKey === null
                    ? null
                    : options.find((item) => {
                          return item.value === newKey;
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
                selectedKeys={[value]}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="value"
                emptyKey={emptyField ? null : undefined}
                emptyText={emptyField}
                onSelectedKeysChanged={onValueChanged}
                customEvents={['onSelectedKeysChanged']}
            />
        </LayoutComponent>
    );
});

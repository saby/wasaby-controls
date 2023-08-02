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
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_properties/EnumEditor
 * @public
 */
export const EnumEditor = memo(<T extends any>(props: IEnumEditorProps<T>): JSX.Element => {
    const { type, value, onChange, options = [], LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();
    const required = type.isRequired();
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: options || [] });
    }, [options]);

    const onValueChanged = useCallback((value) => {
        onChange(
            options.find((item) => {
                return item.value === value[0];
            })?.value
        );
    }, []);

    const selectedKeys = useMemo(() => {
        return value !== undefined ? [value] : value;
    }, [value]);

    return (
        <LayoutComponent>
            <SelectorControl
                data-qa="controls-PropertyGrid__editor_enum"
                className={'controls-PropertyGrid__editor_enum'}
                source={source}
                closeMenuOnOutsideClick={true}
                selectedKeys={selectedKeys}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="value"
                emptyKey={!required && ''}
                emptyText={!required && rk('Не выбрано')}
                onSelectedKeysChanged={onValueChanged}
                customEvents={['onSelectedKeysChanged']}
            />
        </LayoutComponent>
    );
});

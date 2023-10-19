import * as rk from 'i18n!Controls';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Memory } from 'Types/source';
import { Selector as SelectorControl } from 'Controls/dropdown';
import 'css!Controls-editors/_properties/EnumbEditor';

const CUSTOM_EVENTS = ['onSelectedKeysChanged'];

export interface IEnumOption<T> {
    value: T;
    caption: string;
}

interface IEnumEditorProps<T> extends IPropertyGridPropertyEditorProps<T | undefined> {
    options?: Readonly<IEnumOption<T>[]>;
    emptyField?: string;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_dropdown/EnumEditor
 * @public
 */
export const EnumEditor = memo(<T extends any>(props: IEnumEditorProps<T>): JSX.Element => {
    const { type, value, onChange, options = [], LayoutComponent = Fragment, emptyField } = props;
    const readOnly = type.isDisabled();
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: options || [] });
    }, [options]);

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
                selectedKeys={[value === undefined ? null : value]}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="value"
                emptyKey={emptyField || value === undefined ? null : undefined}
                emptyText={value === undefined ? rk('Не выбрано') : emptyField}
                onSelectedKeysChanged={onValueChanged}
                customEvents={CUSTOM_EVENTS}
            />
        </LayoutComponent>
    );
});

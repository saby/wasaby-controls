import { Fragment, memo, useCallback, useMemo, useEffect } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Selector as SelectorControl } from 'Controls/dropdown';
import 'css!Controls-editors/_properties/EnumbEditor';
import { Enum } from 'Types/collection';
import { EnumAdapter } from 'Controls/source';

interface ICollectionEnumEditorProps<TMetaType>
    extends IPropertyGridPropertyEditorProps<Enum<TMetaType> | string> {
    value: Enum<TMetaType> | string;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк. Использует Types/collection:Enum
 * @class Controls-editors/_dropdown/CollectionEnumEditor
 * @public
 */
export const CollectionEnumEditor = memo(
    <TMetaType extends string>(props: ICollectionEnumEditorProps<TMetaType>): JSX.Element => {
        const { metaType, value, onChange, LayoutComponent = Fragment } = props;
        const readOnly = metaType?.isDisabled();
        const valueIsString = typeof value === 'string';

        const optionsList = useMemo(() => {
            const types = metaType?.getTypes?.() || {};
            return Object.values(types).map((type) => type.getTitle());
        }, [metaType]);

        const enumInstance = useMemo(() => {
            return new Enum<string>({
                dictionary: optionsList,
                index: 0,
            });
        }, [optionsList]);

        const onEnumValueChange = useCallback(() => {
            const newValue = valueIsString ? enumInstance.getAsValue() : value;
            onChange?.(newValue);
        }, [enumInstance, valueIsString, onChange, value]);

        useEffect(() => {
            const enumInst = valueIsString ? enumInstance : value;
            enumInst.subscribe('onChange', onEnumValueChange);
            return () => enumInst.unsubscribe('onChange', onEnumValueChange);
        }, [valueIsString, onEnumValueChange, value, enumInstance]);

        return (
            <LayoutComponent>
                <EnumAdapter enum={valueIsString ? enumInstance : value} readOnly={readOnly}>
                    <SelectorControl displayProperty="title" />
                </EnumAdapter>
            </LayoutComponent>
        );
    }
);

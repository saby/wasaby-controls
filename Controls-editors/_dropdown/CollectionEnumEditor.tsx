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

        const titles = useMemo(() => {
            const types = metaType?.getTypes?.() || {};
            return Object.values(types).map((type) => type.getTitle());
        }, [metaType]);

        const titleKeyMap = useMemo(() => {
            const types = metaType?.getTypes?.() ?? {};
            const result: Record<string, string> = {};
            for (const key in types) {
                if (types.hasOwnProperty(key)) {
                    const title = types[key].getTitle();
                    result[title] = key;
                }
            }
            return result;
        }, [metaType]);

        const enumInstance = useMemo(() => {
            const types = metaType?.getTypes?.() ?? {};
            return new Enum<string>({
                dictionary: titles,
                index: Object.keys(types).indexOf(value),
            });
        }, [metaType, titles, value]);

        const onEnumValueChange = useCallback(() => {
            const newValue = valueIsString ? titleKeyMap[enumInstance.getAsValue()] : value;
            onChange?.(newValue);
        }, [valueIsString, titleKeyMap, enumInstance, value, onChange]);

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

import { useMemo, useCallback } from 'react';
import { EnumEditor } from 'Controls-editors/dropdown';
import { IReturnValueFieldDescription } from './dataTypes';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface IDataObjectReturnValueEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    items?: readonly IReturnValueFieldDescription[];
}

/**
 * Редактор, позволяющий выбрать поле из типа возвращаемого значения.
 * @remark
 * ЭКСПЕРИМЕНТ - не использовать
 * @param {IArgumentsEditorProps} props
 * @return {JSX.Element | null}
 */
function DataObjectReturnValueEditor(props: IDataObjectReturnValueEditorProps) {
    const { items } = props;
    const enumItems = useMemo(() => {
        if (!items || !Array.isArray(items)) {
            return [];
        }
        return items.map((entry) => {
            return {
                value: entry.name,
                caption: entry.description,
            };
        });
    }, [props.items]);

    const onChange = useCallback((value) => {
        props?.onChange?.([value]);
    }, []);

    const value = useMemo(() => {
        if (Array.isArray(props.value)) {
            return props.value[0];
        }
    }, [props.value]);

    return <EnumEditor {...props} options={enumItems} onChange={onChange} value={value} />;
}

export { DataObjectReturnValueEditor };

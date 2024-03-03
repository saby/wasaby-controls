import { useCallback, useMemo } from 'react';
import { NameBindingType } from 'Controls/interface';
import { IPropertyGrid, PropertyGrid } from 'Controls-editors/propertyGrid';
import { useConnectedValue } from 'Controls-Input/useConnectedValue';
import { createAdapter, IAdapter } from './_adaptor/factory';

export interface IPropertyGridProps<RuntimeInterface extends object>
    extends Omit<IPropertyGrid<RuntimeInterface>, 'value' | 'onChange'> {
    /**
     * Привязка к полю объекта в контексте данных
     */
    name: NameBindingType;
}

/**
 * Редактор свойств объекта, работающий с контекстом напрямую
 * @class Controls-editors/_propertyGridConnected/PropertyGrid
 * @demo ???
 * @implements Controls-editors/object-type/IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @public
 */
function PropertyGridConnected<RuntimeInterface extends object>(
    props: IPropertyGridProps<RuntimeInterface>
) {
    const { metaType, sort, captionColumnWidth, name } = props;
    const { value: connectedValue, onChange: onConnectedChange } = useConnectedValue(name);

    const adapter = useMemo((): IAdapter => {
        return createAdapter(connectedValue);
    }, [name]);

    const value = useMemo(() => {
        return adapter.get();
    }, [name, connectedValue]);

    const onChange = useCallback(
        (value) => {
            adapter.set(value);
            onConnectedChange(adapter.get());
        },
        [name]
    );

    return (
        <PropertyGrid
            metaType={metaType}
            value={value}
            onChange={onChange}
            sort={sort}
            captionColumnWidth={captionColumnWidth}
        />
    );
}

export { PropertyGridConnected };

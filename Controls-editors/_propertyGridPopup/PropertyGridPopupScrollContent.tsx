import { memo, useCallback, useEffect, useState } from 'react';
import { PropertyGrid, IPropertyGrid } from 'Controls-editors/propertyGrid';

function PropertyGridPopupScrollContent<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface>
) {
    const { metaType, sort } = props;

    const [localValue, setLocalValue] = useState(props.value);

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

    const onChange = useCallback((val: RuntimeInterface) => {
        setLocalValue(val);
        props.onChange(val);
    }, []);

    return (
        <PropertyGrid metaType={metaType} sort={sort} value={localValue} onChange={onChange} />
    );
}

export default memo(PropertyGridPopupScrollContent);

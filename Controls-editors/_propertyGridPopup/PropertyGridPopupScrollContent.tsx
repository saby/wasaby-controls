import { memo, useCallback, useEffect, useState, forwardRef, ForwardedRef } from 'react';
import { PropertyGrid, IPropertyGrid } from 'Controls-editors/propertyGrid';

function PropertyGridPopupScrollContent<RuntimeInterface extends object>(
    props: IPropertyGrid,
    ref: ForwardedRef<unknown>
) {
    const { metaType, sort } = props;

    const [localValue, setLocalValue] = useState(props.value);

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

    const onChange = useCallback(
        (val: RuntimeInterface) => {
            setLocalValue(val);
            props.onChange(val);
        },
        [props.onChange]
    );

    return (
        <PropertyGrid
            ref={ref}
            validationControllerClass={props.validationControllerClass}
            metaType={metaType}
            sort={sort}
            value={localValue}
            onChange={onChange}
            className={'PropertyGridPopup__PropertyGridPopup'}
        />
    );
}

export default memo(forwardRef(PropertyGridPopupScrollContent));

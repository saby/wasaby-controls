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

    const onChange = useCallback(
        (val: RuntimeInterface) => {
            setLocalValue(val);
            props.onChange(val);
        },
        [props.onChange]
    );

    // TODO: Временно пересоздаем ПГ при изменении мета-типа
    const PgWithMetaType = useCallback(
        (props) => <PropertyGrid metaType={metaType} {...props} />,
        [metaType]
    );

    return (
        <PgWithMetaType
            metaType={metaType}
            sort={sort}
            value={localValue}
            onChange={onChange}
            className={'PropertyGridPopup__PropertyGridPopup'}
        />
    );
}

export default memo(PropertyGridPopupScrollContent);

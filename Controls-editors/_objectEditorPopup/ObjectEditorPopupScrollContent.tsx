import { memo, useCallback, useEffect, useState } from 'react';
import { IObjectEditorGridProps } from './IObjectEditorPopupProps';
import ObjectEditorGrid from './ObjectEditorGrid';

function ObjectEditorPopupScrollContent<RuntimeInterface extends object>(
    props: IObjectEditorGridProps<RuntimeInterface>
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
        <ObjectEditorGrid metaType={metaType} sort={sort} value={localValue} onChange={onChange} />
    );
}

export default memo(ObjectEditorPopupScrollContent);

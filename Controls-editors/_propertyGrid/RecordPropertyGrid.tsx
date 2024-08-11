import { memo, useMemo, forwardRef, useCallback, cloneElement, ReactElement } from 'react';

import { IEditorProps, ObjectMeta } from 'Meta/types';

import { Record } from 'Types/entity';
import { factory } from 'Types/chain';

/**
 * HOC-компонент для работы с Record значением в Controls-editors/propertyGrid:PropertyGrid
 * @public
 * @class Controls-editors/_propertyGrid/RecordPropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/RecordPropertyGrid/Index
 * @implements Meta/types/IEditorProps
 * @author Сиряков М.К.
 */
const RecordPropertyGrid = forwardRef(function RecordPropertyGrid<RuntimeInterface extends Record>(
    props: IEditorProps<RuntimeInterface> & {
        children: ReactElement;
        metaType?: ObjectMeta<RuntimeInterface>;
    },
    forwardedRef
) {
    const { value, onChange } = props;

    const objectFromRecord = useMemo(() => {
        return factory(value).toObject();
    }, [value, value?.getVersion()]);

    const preparedOnChange = useCallback(
        (newValue: object) => {
            const preparedValue = value.clone();
            const recordFields = Object.keys(factory(preparedValue).toObject());
            const objectFields = Object.keys(newValue);
            const fieldsSet = new Set([...recordFields, ...objectFields]);
            for (const field of fieldsSet) {
                const value =
                    newValue[field] || props.metaType?.getAttributes()[field]?.getDefaultValue();
                preparedValue.set(field, value);
            }
            onChange(preparedValue);
        },
        [value, value?.getVersion(), onChange]
    );

    return cloneElement(props.children, {
        ...props.children.props,
        ref: forwardedRef,
        value: objectFromRecord,
        metaType: props.metaType,
        onChange: preparedOnChange,
    });
});

export default memo(RecordPropertyGrid);

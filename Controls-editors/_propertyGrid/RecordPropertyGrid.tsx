import { memo, forwardRef, cloneElement, ReactElement } from 'react';
import { IEditorProps, ObjectMeta } from 'Meta/types';
import { Record } from 'Types/entity';

/**
 * HOC-компонент для работы с Record значением в Controls-editors/propertyGrid:PropertyGrid
 * @public
 * @class Controls-editors/_propertyGrid/RecordPropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/RecordPropertyGrid/Index
 * @implements Meta/types/IEditorProps
 * @author Сиряков М.К.
 * @deprecated Нужно использовать Controls-editors/propertyGrid:PropertyGrid
 */
const RecordPropertyGrid = forwardRef(function RecordPropertyGrid<RuntimeInterface extends Record>(
    props: IEditorProps<RuntimeInterface> & {
        children: ReactElement;
        metaType?: ObjectMeta<RuntimeInterface>;
    },
    forwardedRef
) {
    const { value, onChange, metaType } = props;

    return cloneElement(props.children, {
        ...props.children.props,
        ref: forwardedRef,
        value,
        onChange,
        metaType,
    });
});

export default memo(RecordPropertyGrid);

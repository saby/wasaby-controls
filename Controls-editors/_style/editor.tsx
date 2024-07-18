import { memo } from 'react';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import type { ObjectMeta } from 'Meta/types';
import { IPropertyEditorProps, ObjectType } from 'Meta/types';

const STYLE_PROPERTY_GRID_ROW = {
    display: 'block',
    gridColumnEnd: 4,
    gridColumnStart: 1,
};

const StyleEditor = memo(function StyleEditor({
    type,
    value,
    onChange,
}: IPropertyEditorProps<object>) {
    // Очищаем origin, что бы не строился редактор этот ещё раз для тех же атрибутов
    const attributesWithoutOrigin = {};
    Object.entries((type as ObjectMeta<object>).attributes()).forEach(([key, meta]) => {
        attributesWithoutOrigin[key] = meta.clone({ origin: undefined });
    });
    const ownType = ObjectType.attributes(attributesWithoutOrigin);
    return (
        <div style={STYLE_PROPERTY_GRID_ROW}>
            <PropertyGrid metaType={ownType} value={value} onChange={onChange} />
        </div>
    );
});
export default StyleEditor;

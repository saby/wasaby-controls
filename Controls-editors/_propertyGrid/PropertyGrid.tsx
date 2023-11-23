import { IPropertyGrid } from './IPropertyGrid';
import { memo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @public
 * @class Controls-editors/_propertyGrid/PropertyGrid
 * @demo Controls-editors-demo/PropertyGrid/BaseEditorsGrid/Index
 * @implements Controls-editors/object-type/IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @author Парамонов В.С.
 */
function PropertyGrid<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface> & { className?: string }
) {
    const { metaType, sort, value, onChange, captionColumnWidth } = props;

    return (
        <div
            data-qa="controls_objectEditorGrid"
            className={`controls_PropertyGrid_objectEditorGrid ${props.className || ''}`}
            style={
                captionColumnWidth
                    ? {
                          gridTemplateColumns: `${captionColumnWidth} minmax(50%, 1fr)`,
                      }
                    : undefined
            }
        >
            <ObjectTypeEditor
                metaType={metaType}
                sort={sort}
                value={value}
                onChange={onChange}
                EditorLayoutComponent={PropertyGridEditorLayout}
                GroupHeaderComponent={PropertyGridGroupHeader}
            />
        </div>
    );
}

export default memo(PropertyGrid);

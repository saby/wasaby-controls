import { IPropertyGrid } from './IPropertyGrid';
import { memo } from 'react';
import PropertyGridEditorLayout from './PropertyGridEditorLayout';
import PropertyGridGroupHeader from './PropertyGridGroupHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGrid/PropertyGrid';

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @class Controls-editors/_propertyGrid/PropertyGrid
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function PropertyGrid<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface> & { className?: string }
) {
    const { metaType, sort, value, onChange } = props;

    return (
        <div
            data-qa="controls_objectEditorGrid"
            className={`objectEditorGrid ${props.className || ''}`}
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

import { delimitProps } from 'UICore/Jsx';
import { IObjectEditorGridProps } from './IObjectEditorPopupProps';
import { memo } from 'react';
import ObjectEditorGridEditorLayout from './ObjectEditorGridEditorLayout';
import ObjectEditorGridHeader from './ObjectEditorGridHeader';
import { ObjectTypeEditor } from 'Controls-editors/object-type';

/**
 * Реакт компонент, для отображения редактора объектов в сетке со сквозным выравниванием
 * @class Controls-editors/_objectEditorPopup/ObjectEditorGrid
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function ObjectEditorGrid<RuntimeInterface extends object>(
    props: IObjectEditorGridProps<RuntimeInterface>
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
                EditorLayoutComponent={ObjectEditorGridEditorLayout}
                GroupHeaderComponent={ObjectEditorGridHeader}
            />
        </div>
    );
}

export default memo(ObjectEditorGrid);

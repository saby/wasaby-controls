import { IPropertyGrid } from 'Controls-editors/propertyGrid';
import { memo } from 'react';
import PopupHeaderObjectEditorLayoutEditorLayout from './PopupHeaderObjectEditorLayoutEditorLayout';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGridPopup/PopupHeaderObjectEditorLayout/PopupHeaderObjectEditorLayout';

function PopupHeaderObjectEditorLayout<RuntimeInterface extends object>(
    props: IPropertyGrid<RuntimeInterface>
) {
    const { metaType, sort, value, onChange } = props;

    return (
        <div
            data-qa="controls_objectTypeEditorPopup_header_objectEditor"
            className="objectTypeEditorPopup__headerObjectTypeEditor"
        >
            <ObjectTypeEditor
                metaType={metaType}
                sort={sort}
                value={value}
                onChange={onChange}
                EditorLayoutComponent={PopupHeaderObjectEditorLayoutEditorLayout}
            />
        </div>
    );
}

export default memo(PopupHeaderObjectEditorLayout);

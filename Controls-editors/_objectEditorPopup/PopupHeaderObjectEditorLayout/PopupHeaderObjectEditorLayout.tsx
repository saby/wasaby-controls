import { IObjectEditorGridProps } from '../IObjectEditorPopupProps';
import { memo } from 'react';
import PopupHeaderObjectEditorLayoutEditorLayout from './PopupHeaderObjectEditorLayoutEditorLayout';
import { ObjectTypeEditor } from 'Controls-editors/object-type';
import 'css!Controls-editors/_objectEditorPopup/PopupHeaderObjectEditorLayout/PopupHeaderObjectEditorLayout';

/**
 * Реакт компонент, для отображения редактора объектов заголовке попапа
 * @class Controls-editors/_objectEditorPopup/ObjectEditorGrid
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function PopupHeaderObjectEditorLayout<RuntimeInterface extends object>(
    props: IObjectEditorGridProps<RuntimeInterface>
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

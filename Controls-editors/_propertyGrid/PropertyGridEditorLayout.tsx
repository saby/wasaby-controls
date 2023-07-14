import * as React from 'react';
import { Label as LabelControl } from 'Controls/input';
import { IEditorLayoutProps } from 'Controls-editors/object-type';

/**
 * Реакт компонент, для отрисовки редактора внутри проперти грида (для реализации сквозного выравнивания между редакторами)
 * @class Controls-editors/_propertyGrid/PropertyGridEditorLayout
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function PropertyGridEditorLayout({
    title,
    children,
    description,
    required
}: IEditorLayoutProps) {
    return (
        <div
            className="controls_PropertyGrid__editor_layout"
            title={description}
        >
            {title ? (
                <LabelControl
                    caption={title}
                    attrs={{ className: 'controls_ObjectEditorPopup__editor_layout__title' }}
                    required={required}
                />
            ) : null}
            <div className="controls_PropertyGrid__editor_layout__editor">
                {children}
            </div>
        </div>
    );
}

const _ = React.memo(PropertyGridEditorLayout);

export default _;

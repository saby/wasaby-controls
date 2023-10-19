import * as React from 'react';
import { Label as LabelControl } from 'Controls/input';
import { IPropertyGridEditorLayout } from './IPropertyGrid';

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
    required,
    titlePosition = 'left',
}: IPropertyGridEditorLayout) {
    const wrapperClassName =
        'controls_PropertyGrid__editor_layout ' +
        `controls_PropertyGrid__editor_layout-${titlePosition}`;

    const labelClassName =
        'controls_PropertyGrid__editor_layout__title ' +
        `controls_PropertyGrid__editor_layout__title-${titlePosition}`;

    const editorClassName =
        'controls_PropertyGrid__editor_layout__editor ' +
        `controls_PropertyGrid__editor_layout__editor-title-${titlePosition}`;

    return (
        <div className={wrapperClassName} title={description || title}>
            {title && titlePosition !== 'none' ? (
                <LabelControl
                    caption={title}
                    attrs={{ className: labelClassName }}
                    required={required}
                />
            ) : null}
            <div className={editorClassName}>{children}</div>
        </div>
    );
}

const _ = React.memo(PropertyGridEditorLayout);

export default _;

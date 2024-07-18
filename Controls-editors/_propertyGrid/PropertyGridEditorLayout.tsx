import { ReactElement, useContext } from 'react';
import { Label as LabelControl } from 'Controls/input';
import { IPropertyGridEditorLayout } from './IPropertyGrid';
import { EditorsHierarchyContext } from 'Controls-editors/object-type';

export function LayoutHierarchyPadding(): ReactElement {
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    return (
        <>
            {[...Array(hierarchyLevel || 0)].map(() => (
                <div className={'tw-inline-block controls-padding_left-xl'} />
            ))}
        </>
    );
}

function Label({
    title,
    titlePosition,
    disabled,
    required,
}: IPropertyGridEditorLayout): ReactElement | null {
    const labelClassName = `controls_PropertyGrid__editor_layout__title 
                            controls_PropertyGrid__editor_layout__title-${titlePosition}`;

    return title && titlePosition !== 'none' ? (
        <div className={labelClassName}>
            <LayoutHierarchyPadding />
            <LabelControl
                caption={title}
                required={required && !disabled}
                className={'controls_PropertyGrid__editor_layout__label'}
            />
        </div>
    ) : null;
}

function Editor({ titlePosition, children, title }: IPropertyGridEditorLayout): ReactElement {
    const editorClassName = `controls_PropertyGrid__editor_layout__editor 
                             controls_PropertyGrid__editor_layout__editor-title-${titlePosition}`;
    return (
        <div className={editorClassName}>
            {!title || titlePosition === 'none' ? <LayoutHierarchyPadding /> : null}
            {children}
        </div>
    );
}

/**
 * Реакт компонент, для отрисовки редактора внутри проперти грида (для реализации сквозного выравнивания между редакторами)
 * @class Controls-editors/_propertyGrid/PropertyGridEditorLayout
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function PropertyGridEditorLayout(props: IPropertyGridEditorLayout) {
    const wrapperClassName =
        'controls_PropertyGrid__editor_layout ' +
        `controls_PropertyGrid__editor_layout-${props.titlePosition}`;

    return (
        <div className={wrapperClassName} title={props.description || props.title}>
            <Label {...props} />
            <Editor {...props} />
        </div>
    );
}

export default PropertyGridEditorLayout;

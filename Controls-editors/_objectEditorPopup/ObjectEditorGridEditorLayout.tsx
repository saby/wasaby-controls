import * as React from 'react';
import { Label as LabelControl } from 'Controls/input';
import { IEditorLayoutProps } from 'Controls-editors/object-type';

function ObjectEditorGridEditorLayout({ title, children, description }: IEditorLayoutProps) {
    return (
        <div className="controls_ObjectEditorPopup__editor_layout" title={description}>
            {title ? (
                <LabelControl
                    caption={title}
                    className="controls_ObjectEditorPopup__editor_layout__title"
                />
            ) : null}
            <div className="controls_ObjectEditorPopup__editor_layout__editor">{children}</div>
        </div>
    );
}

const _ = React.memo(ObjectEditorGridEditorLayout);

export default _;

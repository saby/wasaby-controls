import * as React from 'react';
import { IEditorLayoutProps } from 'Controls-editors/object-type';

function ObjectEditorGridEditorLayout({
  children,
  description,
}: IEditorLayoutProps) {
    return (
        <div
            title={description}
        >
            {children}
        </div>
    );
}

const _ = React.memo(ObjectEditorGridEditorLayout);

export default _;

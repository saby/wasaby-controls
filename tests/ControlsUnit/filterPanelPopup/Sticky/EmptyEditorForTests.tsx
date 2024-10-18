import * as React from 'react';
import { BaseEditor, IBaseEditor } from 'Controls/filterPanel';

function EmptyEditor(props: IBaseEditor, ref): React.ReactElement {
    return (
        <BaseEditor
            ref={ref}
            {...props}
            editorTemplate={() => {
                return <span />;
            }}
        />
    );
}

export default React.forwardRef(EmptyEditor);

import * as React from 'react';
import { BaseEditor, IBaseEditor } from 'Controls/filterPanel';

function Span() {
    return <span />;
}

function EmptyEditor(props: IBaseEditor, ref): React.ReactElement {
    const onExtendedCaptionClick = React.useCallback(() => {
        props.onPropertyValueChanged({
            value: !props.resetValue,
            textValue: 'test',
            viewMode: 'basic',
        });
    }, [props.onPropertyValueChanged, props.resetValue]);
    return (
        <BaseEditor
            ref={ref}
            {...props}
            editorTemplate={Span}
            onExtendedCaptionClick={onExtendedCaptionClick}
        />
    );
}

export default React.forwardRef(EmptyEditor);

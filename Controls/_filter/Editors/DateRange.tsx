import * as React from 'react';
import { delimitProps } from 'UICore/Jsx';
import Async from 'Controls/Container/Async';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDateRangeEditorOptions } from 'Controls/filterDateRangeEditor';

export interface IDateRangeEditorProps extends IDateRangeEditorOptions {
    onTextValueChanged?: Function;
    onRangeChanged?: Function;
}

export default React.forwardRef(function DateRangeEditor(
    props: IDateRangeEditorProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const { clearProps } = delimitProps(props);
    return (
        <Async
            templateName="Controls/filterDateRangeEditor"
            onTextValueChanged={function() {
                const event = new SyntheticEvent(null, {
                    type: 'textValueChanged',
                });
                (props.onTextvaluechanged || props.onTextValueChanged)?.(event, ...arguments);
            }}
            onRangeChanged={function() {
                const event = new SyntheticEvent(null, {
                    type: 'rangeChanged',
                });
                (props.onRangechanged || props.onRangeChanged)(event, ...arguments);
            }}
            customEvents={['onTextValueChanged', 'onRangeChanged']}
            templateOptions={{
                ...clearProps,
                ref,
                onRangeChanged: null,
                onTextValueChanged: null}}
        ></Async>
    );
});

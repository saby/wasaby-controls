/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import {
    default as WorkByKeyboardContext,
    IWorkByKeyboardContext,
} from 'Controls/WorkByKeyboard/Context';

interface IContextConsumerOptions {
    getContextValue?: (context) => void;
    content?: TemplateFunction;
    children?: React.ReactElement;
}

export default React.forwardRef(function ContextConsumer(props: IContextConsumerOptions, _) {
    const context = React.useContext<IWorkByKeyboardContext>(WorkByKeyboardContext);
    React.useEffect(() => {
        if (props?.getContextValue && context) {
            props.getContextValue(context.workByKeyboard);
        }
    }, [context?.workByKeyboard?.status]);
    const clearProps = {...props};
    delete clearProps.getContextValue;
    delete clearProps.content;
    delete clearProps.children;
    if (props.content) {
        return <props.content {...context} {...clearProps} />;
    }
    if (props.children) {
        if (typeof props.children === 'function') {
            return props.children({...context, ...clearProps});
        }
        return React.cloneElement(props.children, {
            ...context,
            ...clearProps,
        });
    }
});

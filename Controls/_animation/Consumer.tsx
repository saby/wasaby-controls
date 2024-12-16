import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { AnimationContext, IAnimationContainerContextValue } from './Context';

interface IContextConsumerOptions {
    getContextValue?: (context) => void;
    content?: TemplateFunction;
    children?: React.ReactElement;
}

export default React.forwardRef(function ContextConsumer(props: IContextConsumerOptions, _) {
    const context = React.useContext<IAnimationContainerContextValue>(AnimationContext);
    React.useEffect(() => {
        if (props?.getContextValue && context) {
            props.getContextValue(context.animation);
        }
    }, [context?.animation]);
    const clearProps = { ...props };
    delete clearProps.content;
    delete clearProps.children;
    if (props.content) {
        return <props.content {...context} {...clearProps} />;
    }
    if (props.children) {
        return React.cloneElement(props.children, {
            ...context,
            ...clearProps,
        });
    }
});

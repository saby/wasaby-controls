/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { default as WrapperVariablesContext, IWrapperVariablesContext } from './Context';

interface IContextConsumerOptions {
    getContextValue?: (context: IWrapperVariablesContext) => void;
    content?: TemplateFunction;
    children?: React.ReactElement;
}

/**
 * Класс, получающий значения из контекста, заданных на Controls.themes:wrapper
 * @class Controls/_themes/ContextConsumer
 * @public
 */
export default React.forwardRef(function ContextConsumer(props: IContextConsumerOptions, _) {
    const context = React.useContext<IWrapperVariablesContext>(WrapperVariablesContext);
    React.useEffect(() => {
        if (props?.getContextValue && context) {
            props.getContextValue(context);
        }
    }, [context?.variables, context?.className]);

    if (!props.children && !props.content) {
        return null;
    }
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

/**
 * Получить данные, хранящиеся в контексте
 * @function Controls/_themes/ContextConsumer#getContextValue
 */

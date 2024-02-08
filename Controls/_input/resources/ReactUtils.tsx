import { cloneElement, ReactElement } from 'react';

interface IContentProps {
    [name: string]: unknown;
}

function getContent(Content, props: IContentProps = {}): ReactElement | string {
    if (!Content) {
        return Content;
    }
    if (
        Content.isWasabyTemplate ||
        typeof Content === 'function' ||
        typeof Content?.render === 'function'
    ) {
        return <Content {...props} />;
    }
    if (typeof Content === 'string' || Content instanceof String) {
        return Content.toString();
    }
    if (typeof Content === 'object') {
        let className = Content.props?.className || Content.props?.props?.className || '';
        if (props.className) {
            className += ` ${props.className}`;
        }
        const contentProps = {
            ...Content.props?.props,
            ...Content.props,
            ...props,
            className,
        };
        return cloneElement(Content, {
            ...contentProps,
            props: contentProps,
        });
    }
    return Content;
}

export { getContent };

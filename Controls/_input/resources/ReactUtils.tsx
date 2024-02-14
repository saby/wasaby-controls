import { cloneElement, ReactElement } from 'react';

interface IContentProps {
    [name: string]: unknown;
}

function getContent(Content, props: IContentProps = {}): ReactElement | string {
    if (!Content) {
        return Content;
    }
    if (Content.isWasabyTemplate || typeof Content === 'function') {
        return <Content {...props} />;
    }
    if (typeof Content === 'string' || Content instanceof String) {
        return Content.toString();
    }
    if (typeof Content === 'object') {
        let className = Content.props?.className || '';
        if (props.className) {
            className += ` ${props.className}`;
        }
        return cloneElement(Content, {
            ...Content.props,
            ...props,
            className,
        });
    }
    return Content;
}

export { getContent };

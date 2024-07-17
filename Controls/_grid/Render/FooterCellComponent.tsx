import * as React from 'react';
import { TemplateFunction } from 'UICommon/base';
import { TJsxProps, delimitProps } from 'UICore/Jsx';

import FooterCell from 'Controls/_baseGrid/display/FooterCell';
import { getUserClassName } from '../utils/getUserArgsCompatible';

interface IProps extends TJsxProps {
    column: FooterCell;

    children?: React.ReactElement;
    contentTemplate?: TemplateFunction;
    height?: 'default' | 'auto';
    needItemActionsSpacing?: boolean;
    className?: string;
    beforeContentTemplate?: React.ReactElement;
    afterContentTemplate?: React.ReactElement;
}

function FooterCellComponent(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    if (!props.children && !props.contentTemplate) {
        return null;
    }
    const { clearProps, userAttrs } = delimitProps(props);

    const className =
        props.column.getContentClasses(props.height, props.needItemActionsSpacing) +
        ` ${getUserClassName(props)}`;
    delete userAttrs.className;

    const beforeContentTemplate =
        props.beforeContentTemplate && React.cloneElement(props.beforeContentTemplate, props);
    const afterContentTemplate =
        props.afterContentTemplate && React.cloneElement(props.afterContentTemplate, props);

    const content = props.children ? (
        React.cloneElement(props.children, clearProps)
    ) : (
        <props.contentTemplate {...clearProps} />
    );
    return (
        <div ref={ref} className={className} {...userAttrs}>
            {beforeContentTemplate}
            <div className={'controls-GridView__footer__cell__inner-content-wrapper'}>
                {content}
            </div>
            {afterContentTemplate}
        </div>
    );
}

export default React.forwardRef(FooterCellComponent);

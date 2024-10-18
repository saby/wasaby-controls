import * as React from 'react';
import { Logger } from 'UI/Utils';
import { TInternalProps } from 'UICore/Executor';
import { createElement } from 'UICore/Jsx';
import { RecordSet } from 'Types/collection';

interface IProps extends TInternalProps {
    className?: string;
    innerClassName?: string;
    style?: React.CSSProperties;
    template: React.Component | React.FunctionComponent;
    item: { getItemTemplateOptions: Function };
    items: RecordSet;
    filter: object;
    templateProps?: object;
}

// todo перейти на новый синтаксис в стиле React,
//  после https://online.sbis.ru/opendoc.html?guid=2bd8442c-51ae-4567-a9f0-3e9db8d85e33&client=3
function EmptyTemplate(props: IProps) {
    const contentTemplateProps: object = {
        ...props.templateProps,
        item: props.item,
        items: props.items,
        filter: props.filter,
    };
    return createElement(props.template, contentTemplateProps, undefined, undefined, props.context);
}

function EmptyWrapper(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const className: string =
        (props.className ? `${props.className} ` : '') + 'controls-BaseControl__emptyTemplate';
    const innerClassName: string =
        (props.innerClassName ? `${props.innerClassName} ` : '') +
        'controls-BaseControl__emptyTemplate__contentWrapper';

    if (!props.template) {
        Logger.error('EmptyWrapper.template should be a React/WML template function.', this);
        return null;
    }

    const templateProps = {
        ...props.templateProps,
        ...props.item?.getItemTemplateOptions?.(),
    };

    return (
        <div ref={ref} className={className} style={props.style}>
            <div className={innerClassName}>
                <EmptyTemplate
                    template={props.template}
                    templateProps={templateProps}
                    context={props.context}
                    item={props.item}
                    items={props.items}
                    filter={props.filter}
                />
            </div>
        </div>
    );
}

export default React.forwardRef(EmptyWrapper);

/**
 * Обёртка вокруг пустого представления, позволяюбщая корректно расположить его во вьюпорте
 * @class Controls/_baseList/Render/EmptyWrapper
 * @private
 */

/**
 * @name Controls/_baseList/Render/EmptyWrapper#template
 * @cfg {React.ReactElement} Шаблон пустого представления
 */

/**
 * @name Controls/_baseList/Render/EmptyWrapper#templateProps
 * @cfg {object} свойства для передачи в Шаблон пустого представления
 */

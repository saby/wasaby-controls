/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';

import { createElement, delimitProps } from 'UICore/Jsx';
import { TemplateFunction } from 'UI/base';
import { Money, Date, Number } from 'Controls/baseDecorator';
import { ITrackedPropertiesItem } from 'Controls/interface';

export interface ITrackedPropertiesTemplateProps {
    trackedValues: Record<string, unknown>;
    trackedProperties: ITrackedPropertiesItem[];
    paddingSize?: string;
    position?: 'left' | 'right';
    children?: React.ReactNode;
    content?: TemplateFunction;
    className?: string;
}

export interface IRenderProps {
    value: unknown;
    fontSize?: string;
    fontColorStyle?: string;
    fontWeight?: string;
}

const DefaultContent = React.memo((props: ITrackedPropertiesTemplateProps) => {
    return (
        <div className={'ws-flexbox'}>
            {props.trackedProperties.map(
                (config: ITrackedPropertiesItem, index: number) => {
                    const Render =
                        getWasabyTemplate(config.template) ||
                        getRenderFunction(config.displayType);
                    return (
                        <div className={index ? 'controls-padding_left-m' : ''}>
                            <Render
                                key={config.propertyName}
                                {...(config.templateOptions || {})}
                                value={props.trackedValues[config.propertyName]}
                            />
                        </div>
                    );
                }
            )}
        </div>
    );
});

const StringRender = React.memo((props: IRenderProps) => {
    return (
        <div
            className={`controls-fontsize-${props.fontSize || 'm'}
                         controls-text-${props.fontColorStyle}
                         controls-fontweight-${props.fontWeight || 'default'}`}
        >
            {props.value?.toString()}
        </div>
    );
});

// Обратная совместимость. До отказа от wml
const getWasabyTemplate = (template) => {
    if (!template) {
        return null;
    }
    return (props = {}) => {
        return createElement(template, { ...props });
    };
};

const getRenderFunction = (
    displayType: string
): React.FunctionComponent<IRenderProps> => {
    switch (displayType) {
        case 'money':
            return Money;
        case 'number':
            return Number;
        case 'date':
            return Date;
        default: {
            return StringRender;
        }
    }
};

// Обратная совместимость. До отказа от wml
const WasabyContent = (props) => {
    return createElement(props.content, { ...props });
};

const Content = React.memo(
    ({
        paddingSize = 'default',
        ...props
    }: ITrackedPropertiesTemplateProps) => {
        const paddingClassName = `controls-ListView__item-rightPadding_${paddingSize}
                              controls-ListView__item-leftPadding_${paddingSize}`;
        return (
            <div
                className={
                    'controls-ListView__TrackedPropertiesTemplate_content ' +
                    paddingClassName
                }
            >
                {props.children ? props.children : null}
                {!props.children && props.content ? (
                    <WasabyContent {...props} />
                ) : null}
                {!props.children && !props.content ? (
                    <DefaultContent {...props} />
                ) : null}
            </div>
        );
    }
);

export default React.memo(
    ({ position = 'left', ...props }: ITrackedPropertiesTemplateProps) => {
        const { clearProps } = delimitProps(props);

        let className = `controls-ListView__TrackedPropertiesTemplate controls-ListView__TrackedPropertiesTemplate_${position}`;
        if (props.className) {
            className += ` ${props.className}`;
        }

        return (
            <div className={className}>
                <Content {...clearProps} />
            </div>
        );
    }
);

/**
 * Шаблон для отображения отслеживаемых свойств записей списка.
 * @class Controls/_list/TrackedPropertiesTemplate
 * @public
 * @demo Controls-demo/list_new/TrackedProperties/Index
 * @see Controls/_interface/ITrackedProperties#trackedProperties
 * @see Controls/_interface/ITrackedProperties#trackedPropertiesTemplate
 */

/**
 * @name Controls/_list/TrackedPropertiesTemplate#position
 * @cfg {left|right} Положение шаблона.
 * @default left
 * @demo Controls-demo/list_new/TrackedProperties/TrackedPropertiesTemplate/Index
 * @see Controls/_interface/ITrackedProperties#trackedPropertiesTemplate
 */

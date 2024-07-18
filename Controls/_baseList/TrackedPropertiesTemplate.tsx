/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import * as React from 'react';

import { createElement, delimitProps } from 'UICore/Jsx';
import { TemplateFunction } from 'UI/base';
import { Money, Date, Number } from 'Controls/baseDecorator';
import { ITrackedPropertiesItem } from 'Controls/interface';
import { getStickyHeadersHeight, StickyBlock } from 'Controls/stickyBlock';

import { CollectionContext } from 'Controls/_baseList/CollectionContext';
import { ICellPadding } from 'Controls/grid';

interface ITrackedValuesProps {
    trackedValues: Record<string, unknown>;
}

export interface ITrackedPropertiesTemplateProps {
    trackedProperties: ITrackedPropertiesItem[];
    contentAlign?: string;
    paddingSize?: string;
    cellPadding?: ICellPadding;
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

const DefaultContent = React.memo(
    (props: ITrackedPropertiesTemplateProps & ITrackedValuesProps) => {
        return (
            <div className={'ws-flexbox'}>
                {props.trackedProperties.map((config: ITrackedPropertiesItem, index: number) => {
                    const Render =
                        getWasabyTemplate(config.template) || getRenderFunction(config.displayType);
                    return (
                        <div
                            key={config.propertyName}
                            className={index ? 'controls-padding_left-m' : ''}
                        >
                            <Render
                                {...(config.templateOptions || {})}
                                value={props.trackedValues[config.propertyName]}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
);

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

const getRenderFunction = (displayType: string): React.FunctionComponent<IRenderProps> => {
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

function useWatchTrackedValues(): Record<string, string> {
    const collection = React.useContext(CollectionContext);
    const [trackedValues, setTrackedValues] = React.useState(collection.getTrackedValues());

    React.useEffect(() => {
        const handler = (_event, newTrackedValues) => setTrackedValues(newTrackedValues);
        collection.subscribe('trackedValuesChanged', handler);
        return () => {
            collection.unsubscribe('trackedValuesChanged', handler);
        };
    }, [collection]);

    return trackedValues;
}

const Content = React.memo(function TrackedPropertiesContentComponent({
    position = 'left',
    paddingSize = 'default',
    ...props
}: ITrackedPropertiesTemplateProps & ITrackedValuesProps) {
    let classes = 'controls-ListView__TrackedPropertiesTemplate_content ';
    let trapezeClass = 'controls-ListView__TrackedPropertiesTemplate_content_trapeze ';

    if (position === 'right') {
        classes += `controls-ListView__item-rightPadding_${paddingSize} `;
        classes += `controls-ListView__item-leftPadding_${paddingSize} `;
        trapezeClass += 'controls-ListView__TrackedPropertiesTemplate_content_trapeze_null ';
    } else {
        trapezeClass += 'controls-ListView__TrackedPropertiesTemplate_content_trapeze_default ';
    }

    return (
        <div className={classes} style={{ marginTop: props.marginTop + 'px' }}>
            <div className={trapezeClass}></div>
            {props.children ? props.children : null}
            {!props.children && props.content ? <WasabyContent {...props} /> : null}
            {!props.children && !props.content ? <DefaultContent {...props} /> : null}
        </div>
    );
});

export interface ITrackedPropertiesContext {
    stickyBlockContextClasses?: string;
    authorContentTemplateContextClasses?: string;
}

export const TrackedPropertiesContext = React.createContext<ITrackedPropertiesContext>({});

interface ITrackedPropertiesComponentWrapperProps extends ITrackedPropertiesTemplateProps {
    trackedPropertiesTemplate: React.FunctionComponent<
        ITrackedPropertiesTemplateProps & ITrackedValuesProps
    >;
}

// Обертка, которая отслеживает изменение trackedValues и прокидывает их дальше
// От нее можно избавиться, если концептуально переписать использование trackedTemplate.
// сейчас прикладники пишут <ws:trackedTemplate> {{trackedTemplate.trackedValues}} </ws:trackedTemplate>,
// без обертки сюда не прокинуть опции
export default function TrackedPropertiesComponentWrapper(
    props: ITrackedPropertiesComponentWrapperProps
) {
    const trackedValues = useWatchTrackedValues();

    const stickyBlockContextClasses = `controls-ListView__item-leftPadding_${
        props.paddingSize ?? 'default'
    } `;
    const authorContentTemplateContextClasses = '';

    const context = React.useMemo<ITrackedPropertiesContext>(() => {
        const value: ITrackedPropertiesContext = {
            stickyBlockContextClasses,
            authorContentTemplateContextClasses,
        };

        return value;
    }, []);

    return (
        props.trackedPropertiesTemplate && (
            <TrackedPropertiesContext.Provider value={context}>
                <props.trackedPropertiesTemplate {...props} trackedValues={trackedValues} />
            </TrackedPropertiesContext.Provider>
        )
    );
}

export const TrackedPropertiesComponent = React.memo(function TrackedPropertiesComponent({
    ...props
}: ITrackedPropertiesTemplateProps & ITrackedValuesProps) {
    const stickyBlockContextClasses =
        React.useContext(TrackedPropertiesContext).stickyBlockContextClasses;
    const authorContentTemplateContextClasses =
        React.useContext(TrackedPropertiesContext).authorContentTemplateContextClasses;

    const { clearProps } = delimitProps(props);

    const ref = React.useRef<HTMLDivElement | null>();
    const [offset, setOffset] = React.useState(0);
    let stickyElementsHeight = 0;
    let className = 'controls-ListView__TrackedPropertiesTemplate ';
    if (props.className) {
        className += `${props.className} `;
    }

    if (props.position === 'right') {
        className += 'controls-ListView__TrackedPropertiesTemplate_grid_start_end_default ';
        className += `controls-ListView__TrackedPropertiesTemplate_${props.position} `;
    } else {
        className += `${stickyBlockContextClasses} `;
    }

    React.useLayoutEffect(() => {
        if (ref.current) {
            stickyElementsHeight = getStickyHeadersHeight(ref.current, 'top', 'fixed') || 0;
            if (offset !== stickyElementsHeight) {
                setOffset(stickyElementsHeight);
            }
        }
    });

    return (
        <>
            <div
                ref={ref}
                className={className}
                data-qa={'tracked-properties'}
                style={{ top: offset + 'px' }}
            >
                <Content {...clearProps} />
            </div>
            {props.position === 'right' ? (
                ''
            ) : (
                <div className={`${authorContentTemplateContextClasses}`}></div>
            )}
        </>
    );
});

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

import { useMemo } from 'react';
import Async from 'Controls/Container/Async';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';

interface IAdditionalColumnProps {
    item: Model;
    counterTemplate?: string | TemplateFunction;
    mainCounterProperty?: string;
    mainCounterStyleProperty?: string;
    mainCounterTooltip?: string;
    mainCounterTooltipProperty?: string;
    additionalTextProperty?: string;
    additionalTextStyleProperty?: string;
    additionalCounterTooltip?: string;
    additionalTextTooltipProperty?: string;
}

function DecoratorNumber(
    props: IAdditionalColumnProps & {
        value: number;
        tooltip: string;
    }
): JSX.Element {
    const templateOptions = useMemo(() => {
        return {
            value: props.value,
            precision: 3,
            fontSize: 'm',
            tooltip: props.tooltip,
        };
    }, [props.value, props.tooltip]);

    return <Async templateName="Controls/baseDecorator:Number" templateOptions={templateOptions} />;
}

function CounterTemplate(props: IAdditionalColumnProps): JSX.Element {
    const templateOptions = {
        ...props,
        item: props.collectionItem,
    };
    if (props.counterTemplate.charAt) {
        return <Async templateName={props.counterTemplate} templateOptions={templateOptions} />;
    } else {
        return <props.counterTemplate {...templateOptions} />;
    }
}

function MainCounterProperty(props: IAdditionalColumnProps): JSX.Element {
    const { item, mainCounterProperty, mainCounterStyleProperty } = props;
    const mainCounter = item.get(mainCounterProperty);
    if (mainCounter) {
        return (
            <div
                className={`controls-EditorList__additional-column
            controls-text-${item.get(mainCounterStyleProperty) || 'primary'} controls-fontsize-m`}
                data-qa="controls-EditorList__additionalCounter"
            >
                {mainCounter.charAt ? (
                    mainCounter
                ) : (
                    <DecoratorNumber
                        {...props}
                        tooltip={
                            props.mainCounterTooltip ||
                            props.item.get(props.mainCounterTooltipProperty)
                        }
                        value={props.item.get(props.mainCounterProperty)}
                    />
                )}
            </div>
        );
    }
    return null;
}

function AdditionalTextProperty(props: IAdditionalColumnProps): JSX.Element {
    const {
        item,
        mainCounterProperty,
        additionalTextProperty,
        additionalTextStyleProperty,
        additionalTextTooltipProperty,
    } = props;
    const mainCounter = !!item.get(mainCounterProperty);
    const addText = item.get(additionalTextProperty);
    const addTooltip = props.additionalCounterTooltip || item.get(additionalTextTooltipProperty);
    if (addText) {
        return (
            <>
                {mainCounter ? (
                    <div className="controls-EditorList__additional-columns__separator">|</div>
                ) : null}
                <div
                    className={`controls-EditorList__additional-column
              controls-fontsize-m controls-text-${
                  item.get(additionalTextStyleProperty) ||
                  item.get('additionalTextStyleProperty') ||
                  'label'
              }`}
                    data-qa="controls-EditorList__mainCounter"
                >
                    {addText.charAt ? (
                        addText
                    ) : (
                        <DecoratorNumber {...props} value={addText} tooltip={addTooltip} />
                    )}
                </div>
            </>
        );
    }
    return null;
}

/**
 * Шаблон для отображения дополнительного контента элемента списка.
 * @private
 */
export default function AdditionalContentTemplate(props: IAdditionalColumnProps): JSX.Element {
    const { item, additionalTextProperty, counterTemplate, mainCounterProperty } = props;
    if (additionalTextProperty && item.get(additionalTextProperty) !== undefined) {
        let className = '';
        if (
            !counterTemplate &&
            (item.get(mainCounterProperty) || item.get(additionalTextProperty))
        ) {
            className += 'controls-ListEditor__additionalTemplate controls-padding_left-s';
        } else if (counterTemplate) {
            className += 'controls-ListEditor__additionalTemplate';
        }
        if (props.attrs?.className) {
            className += ` ${props.attrs.className}`;
        }
        return (
            <div className={className}>
                {counterTemplate ? (
                    <CounterTemplate {...props} className="controls-padding_left-s" />
                ) : (
                    <>
                        <MainCounterProperty {...props} />
                        <AdditionalTextProperty {...props} />
                    </>
                )}
            </div>
        );
    }
    return null;
}

import Async from 'Controls/Container/Async';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';

interface IAdditionalColumnProps {
    item: Model;
    counterTemplate?: string | TemplateFunction;
    mainCounterProperty?: string;
    mainCounterTooltip?: string;
    additionalTextProperty?: string;
    additionalCounterTooltip?: string;
}

function DecoratorNumber(
    props: IAdditionalColumnProps & {
        value: number;
        tooltip: string;
    }
): JSX.Element {
    const templateOptions = {
        value: props.value,
        precision: 3,
        fontSize: 'm',
        tooltip: props.tooltip,
    };

    return (
        <Async
            templateName="Controls/baseDecorator:Number"
            templateOptions={templateOptions}
        />
    );
}

function CounterTemplate(props: IAdditionalColumnProps): JSX.Element {
    const templateOptions = {
        ...props,
        item: props.collectionItem,
    };
    if (props.counterTemplate.charAt) {
        return (
            <Async
                templateName={props.counterTemplate}
                templateOptions={templateOptions}
            />
        );
    } else {
        return <props.counterTemplate {...templateOptions} />;
    }
}

function MainCounterProperty(props: IAdditionalColumnProps): JSX.Element {
    const { item, mainCounterProperty } = props;
    const mainCounter = item.get(mainCounterProperty);
    if (mainCounter) {
        return (
            <div
                className={`controls-EditorList__additional-column
            controls-text-${
                item.get('mainCounterStyleProperty') || 'primary'
            } controls-fontsize-m`}
                data-qa="controls-EditorList__additionalCounter"
            >
                {mainCounter.charAt ? (
                    mainCounter
                ) : (
                    <DecoratorNumber
                        {...props}
                        tooltip={props.mainCounterTooltip}
                        value={props.item.get(props.mainCounterProperty)}
                    />
                )}
            </div>
        );
    }
    return null;
}

function AdditionalTextProperty(props: IAdditionalColumnProps): JSX.Element {
    const { item, mainCounterProperty, additionalTextProperty } = props;
    const mainCounter = !!item.get(mainCounterProperty);
    const addText = item.get(additionalTextProperty);
    if (addText) {
        return (
            <>
                {mainCounter ? (
                    <div className="controls-EditorList__additional-columns__separator">
                        |
                    </div>
                ) : null}
                <div
                    className={`controls-EditorList__additional-column
              controls-fontsize-m controls-text-${
                  item.get('additionalTextStyleProperty') || 'label'
              }`}
                    data-qa="controls-EditorList__mainCounter"
                >
                    {addText.charAt ? (
                        addText
                    ) : (
                        <DecoratorNumber
                            {...props}
                            value={addText}
                            tooltip={props.additionalCounterTooltip}
                        />
                    )}
                </div>
            </>
        );
    }
    return null;
}

export default function AdditionalContentTemplate(
    props: IAdditionalColumnProps
): JSX.Element {
    const {
        item,
        additionalTextProperty,
        counterTemplate,
        mainCounterProperty,
    } = props;
    if (
        additionalTextProperty &&
        item.get(additionalTextProperty) !== undefined
    ) {
        const className =
            counterTemplate ||
            item.get(mainCounterProperty) ||
            item.get(additionalTextProperty)
                ? 'controls-ListEditor__additionalTemplate'
                : '';
        return (
            <div className={className}>
                {counterTemplate ? (
                    <CounterTemplate {...props} />
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

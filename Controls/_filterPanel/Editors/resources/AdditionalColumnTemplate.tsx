import AdditionalContentTemplate from './AdditionalContentTemplate';

export default function AdditionalColumnTemplate(props): JSX.Element {
    const tplProps = props.column.getTemplateOptions();
    return (
        <AdditionalContentTemplate
            additionalTextProperty={props.column.config.additionalTextProperty}
            mainCounterProperty={props.column.config.mainCounterProperty}
            item={props.item.contents}
            collectionItem={props.item}
            counterTemplate={tplProps.counterTemplate}
            mainCounterTooltip={tplProps.mainCounterTooltip}
            additionalCounterTooltip={tplProps.additionalCounterTooltip}
        />
    );
}

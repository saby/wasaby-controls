import AdditionalContentTemplate from './AdditionalContentTemplate';

/**
 * Шаблон колонки для отображения дополнительного контента элемента списка.
 * @private
 */
export default function AdditionalColumnTemplate(props): JSX.Element {
    const tplProps = props.column.getTemplateOptions();
    return (
        <AdditionalContentTemplate
            additionalTextProperty={props.column.config.additionalTextProperty}
            mainCounterProperty={props.column.config.mainCounterProperty}
            additionalTextStyleProperty={tplProps.additionalTextStyleProperty}
            mainCounterStyleProperty={tplProps.mainCounterStyleProperty}
            item={props.item.contents}
            collectionItem={props.item}
            counterTemplate={tplProps.counterTemplate}
            mainCounterTooltip={tplProps.mainCounterTooltip}
            additionalCounterTooltip={tplProps.additionalCounterTooltip}
        />
    );
}

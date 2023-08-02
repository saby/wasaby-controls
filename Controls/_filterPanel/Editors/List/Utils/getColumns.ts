import { IListEditorOptions } from '../interface/IList';
import { IColumn } from 'Controls/grid';
import TitleColumn from 'Controls/_filterPanel/Editors/resources/TitleColumn';
import ImageColumn from 'Controls/_filterPanel/Editors/resources/ImageColumn';
import AdditionalColumnTemplate from 'Controls/_filterPanel/Editors/resources/AdditionalColumnTemplate';

export default function setColumns(
    {
        displayProperty,
        keyProperty,
        imageProperty,
        imageTemplateName,
        titleTemplateName,
        imageTemplate,
        additionalTextProperty,
        additionalTextStyleProperty,
        mainCounterProperty,
        mainCounterStyleProperty,
        markerStyle,
        counterTemplate,
        titleTemplate,
        fontSize,
        fontWeight,
        mainCounterTooltip,
        additionalCounterTooltip,
        emptyKey,
    }: IListEditorOptions,
    getTextValueForItem: Function
): object[] {
    const defaultColumnConfig: IColumn = {
        fontSize: fontSize || (markerStyle !== 'primary' ? 'm' : 'l'),
        fontWeight,
        backgroundColorStyle: markerStyle !== 'primary' ? 'master' : undefined
    };
    const titleConfig = {
        ...defaultColumnConfig,
        width: '1fr',
        displayProperty,
        reactContentTemplate: TitleColumn,
        textOverflow: 'ellipsis',
        templateOptions: {
            titleTemplate,
            titleTemplateName,
            markerStyle,
            getTextValueForItem,
        }
    };
    const columns: IColumn[] = [titleConfig];
    if (imageProperty || imageTemplateName || imageTemplate) {
        columns.unshift({
            ...defaultColumnConfig,
            reactContentTemplate: ImageColumn,
            imageProperty,
            displayProperty,
            width: 'auto',
            compatibleWidth: '30px',
            cellPadding: {
                right: 'null',
            },
            templateOptions: {
                emptyKey,
                imageTemplateName,
                imageTemplate,
                getTextValueForItem,
                titleTemplate,
                titleTemplateName,
                markerStyle,
            },
        });
    }
    if (additionalTextProperty) {
        columns.push({
            ...defaultColumnConfig,
            additionalTextProperty,
            mainCounterProperty,
            reactContentTemplate: AdditionalColumnTemplate,
            width: 'auto',
            align: 'right',
            templateOptions: {
                mainCounterTooltip,
                additionalCounterTooltip,
                counterTemplate,
                additionalTextStyleProperty,
                mainCounterStyleProperty,
            }
        });
    }
    return columns;
}

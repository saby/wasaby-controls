import { IListEditorOptions } from '../interface/IList';
import TitleColumn from 'Controls/_filterPanel/Editors/resources/TitleColumn';
import ImageColumn from 'Controls/_filterPanel/Editors/resources/ImageColumn';

export default function setColumns(
    {
        displayProperty,
        keyProperty,
        imageProperty,
        imageTemplateName,
        titleTemplateName,
        imageTemplate,
        additionalTextProperty,
        mainCounterProperty,
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
    const tileConfig = {
        displayProperty,
        additionalTextProperty,
        mainCounterProperty,
        keyProperty,
        textOverflow: 'ellipsis',
        fontSize: fontSize || (markerStyle !== 'primary' ? 'm' : 'l'),
        fontWeight,
        backgroundColorStyle: markerStyle !== 'primary' ? 'master' : undefined,
        reactContentTemplate: TitleColumn,
        templateOptions: {
            emptyKey,
            mainCounterTooltip,
            additionalCounterTooltip,
            counterTemplate,
            titleTemplate,
            titleTemplateName,
            markerStyle,
            getTextValueForItem,
        },
    };
    const columns = [tileConfig];
    if (imageProperty || imageTemplateName || imageTemplate) {
        const templateOptions = {
            ...tileConfig.templateOptions,
            ...{
                imageTemplateName,
                imageTemplate,
            },
        };
        columns.unshift({
            ...tileConfig,
            ...{
                reactContentTemplate: ImageColumn,
                imageProperty,
                width: 'auto',
                compatibleWidth: '30px',
                cellPadding: {
                    right: 'null',
                },
                templateOptions,
            },
        });
    }
    return columns;
}

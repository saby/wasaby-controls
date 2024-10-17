import { IListEditorOptions } from '../interface/IList';
import { IColumn } from 'Controls/grid';
import TitleColumn from 'Controls/_filterPanel/Editors/resources/TitleColumn';
import ImageColumn from 'Controls/_filterPanel/Editors/resources/ImageColumn';

export default function getColumns(
    {
        displayProperty,
        keyProperty,
        multiSelect,
        imageProperty,
        imageTemplateName,
        titleTemplateName,
        imageTemplate,
        additionalTextProperty,
        additionalTextStyleProperty,
        additionalTextTooltipProperty,
        mainCounterProperty,
        mainCounterStyleProperty,
        mainCounterTooltipProperty,
        markerStyle,
        contrastBackground,
        counterTemplate,
        titleTemplate,
        fontSize,
        fontWeight,
        mainCounterTooltip,
        additionalCounterTooltip,
        emptyKey,
        showEditArrow,
        editArrowVisibilityCallback,
    }: IListEditorOptions,
    handleEditArrowClick: Function,
    isStickyItemSticked: boolean,
    textValue: string
): object[] {
    const defaultColumnConfig: IColumn = {
        fontSize: fontSize || (markerStyle !== 'primary' ? 'm' : 'l'),
        fontWeight,
        displayProperty,
        additionalTextProperty,
        mainCounterProperty,
        templateOptions: {
            titleTemplate,
            titleTemplateName,
            markerStyle,
            mainCounterTooltip,
            additionalCounterTooltip,
            counterTemplate,
            additionalTextStyleProperty,
            mainCounterStyleProperty,
            additionalTextTooltipProperty,
            mainCounterTooltipProperty,
            handleEditArrowClick,
            showEditArrow,
            editArrowVisibilityCallback,
            contrastBackground,
            backgroundColorStyle:
                (!multiSelect && markerStyle !== 'primary') || contrastBackground === false
                    ? 'filterPanel'
                    : 'master',
            isStickyItemSticked,
            textValue,
        },
    };
    const titleConfig = {
        ...defaultColumnConfig,
        width: '1fr',
        reactContentTemplate: TitleColumn,
        textOverflow: 'ellipsis',
    };
    const columns: IColumn[] = [titleConfig];
    if (imageProperty || imageTemplateName || imageTemplate) {
        columns.unshift({
            ...defaultColumnConfig,
            reactContentTemplate: ImageColumn,
            imageProperty,
            width: 'auto',
            compatibleWidth: '30px',
            cellPadding: {
                right: 'null',
            },
            templateOptions: {
                emptyKey,
                imageTemplateName,
                imageTemplate,
                ...defaultColumnConfig.templateOptions,
            },
        });
    }
    return columns;
}

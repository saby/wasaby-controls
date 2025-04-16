import { WidgetType, TextStyleType } from 'Meta/types';

export const IItemTemplateType = WidgetType.appendStyles({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore //TODO убрать, когда поправят типы в appendStyles
    controlsItemTemplateEditorSelectorCaption: TextStyleType,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    controlsItemTemplateEditorSelectorDescription: TextStyleType,
});

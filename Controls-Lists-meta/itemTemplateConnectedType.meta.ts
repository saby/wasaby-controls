import { WidgetType, TextStyleType } from 'Meta/types';

const itemTemplateConnectedType = WidgetType.appendStyles({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore //TODO убрать, когда поправят типы в appendStyles
    controlsItemTemplateEditorSelectorCaption: TextStyleType,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    controlsItemTemplateEditorSelectorDescription: TextStyleType,
});

export default itemTemplateConnectedType;

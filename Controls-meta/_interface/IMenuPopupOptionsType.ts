import { BooleanType, ObjectType, StringType, UnionType } from 'Types/meta';
import { IMenuPopupOptions } from 'Controls/menu';
import { IMenuControlOptionsType } from '../_menu/IMenuControlOptionsType';
import { ISearchOptionsType } from './ISearchOptionsType';
import { TemplateFunctionType } from './TemplateFunctionType';
import { IFooterItemDataType } from './IFooterItemDataType';
import { TIMenuPopupTriggerType } from './TIMenuPopupTriggerType';

export const IMenuPopupOptionsType = ObjectType.id(
    'Controls/meta:IMenuPopupOptionsType'
).attributes<IMenuPopupOptions>({
    ...IMenuControlOptionsType.attributes(),
    ...ISearchOptionsType.attributes(),
    headerContentTemplate: UnionType.of([
        TemplateFunctionType,
        StringType,
    ]).optional(),
    footerContentTemplate: UnionType.of([
        TemplateFunctionType,
        StringType,
    ]).optional(),
    closeButtonVisibility: BooleanType.optional(),
    footerItemData: IFooterItemDataType.optional(),
    trigger: TIMenuPopupTriggerType,
    draggable: BooleanType,
});

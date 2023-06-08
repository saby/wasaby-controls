import * as rk from 'i18n!Controls';
import { BooleanType, ObjectType, StringType } from 'Types/meta';
import { IMenuBaseOptions } from 'Controls/menu';
import { IControlOptionsType } from '../_interface/IControlOptionsType';
import { IHierarchyOptionsType } from '../_interface/IHierarchyOptionsType';
import { IIconSizeOptionsType } from '../_interface/IIconSizeOptionsType';
import { IGroupedOptionsType } from '../_dropdown/IGroupedOptionsType';
import { IItemTemplateOptionsType } from '../_interface/IItemTemplateOptionsType';
import { IMultiSelectableOptionsType } from '../_interface/IMultiSelectableOptionsType';
import { IFontColorStyleOptionsType } from '../_interface/IFontColorStyleOptionsType';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';
import { TSelectedKeysType } from '../_interface/TSelectedKeysType';
import { IItemPaddingType } from './IItemPaddingType';

export const IMenuBaseOptionsType = ObjectType.id(
    'Controls/meta:IMenuBaseOptionsType'
).attributes<IMenuBaseOptions>({
    ...IControlOptionsType.attributes(),
    ...IHierarchyOptionsType.attributes(),
    ...IIconSizeOptionsType.attributes(),
    ...IGroupedOptionsType.attributes(),
    ...IItemTemplateOptionsType.attributes(),
    ...IMultiSelectableOptionsType.attributes(),
    ...IFontColorStyleOptionsType.attributes(),

    keyProperty: null,
    root: null,
    displayProperty: StringType.description(
        rk(
            'Устанавливает имя поля элемента, значение которого будет отображено.'
        )
    ),
    selectedAllText: null,
    emptyText: StringType.description(
        rk(
            'Добавляет пустой элемент в список с заданным текстом. Ключ пустого элемента по умолчанию null, для изменения значения ключа используйте emptyKey.'
        )
    ),
    emptyKey: null,
    itemPadding: IItemPaddingType,
    multiSelect: BooleanType.optional(),
    emptyTemplate: TemplateFunctionType,
    excludedKeys: TSelectedKeysType.optional(),
});

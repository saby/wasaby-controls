import { ArrayType, BooleanType, FunctionType, ObjectType, StringType, NullType } from 'Types/meta';
import { IMenuControlOptions } from 'Controls/menu';
import { IMenuBaseOptionsType } from './IMenuBaseOptionsType';
import { ISourceOptionsType } from '../_interface/ISourceOptionsType';
import { IBackgroundStyleOptionsType } from '../_interface/IBackgroundStyleOptionsType';
import { ISelectorDialogOptionsType } from '../_interface/ISelectorDialogOptionsType';
import { INavigationOptionsINavigationSourceConfigType } from '../_interface/INavigationOptionsType/INavigationOptionsINavigationSourceConfigType';
import { IFilterOptionsType } from '../_interface/IFilterOptionsType';
import { RecordSetType } from '../_interface/RecordSetType';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';
import { IItemActionType } from '../_interface/IItemActionType';
import { TItemActionVisibilityCallbackType } from '../_interface/TItemActionVisibilityCallbackType';
import { NewSourceControllerType } from '../_dataSource/NewSourceControllerType';
import { CalmTimerType } from '../_popup/CalmTimerType';
import { TSubMenuDirectionType } from '../_interface/TSubMenuDirectionType';
import { TAlignItemType } from '../_interface/TAlignItemType';

export const IMenuControlOptionsType = ObjectType.id(
    'Controls/meta:IMenuControlOptionsType'
).attributes<IMenuControlOptions>({
    ...IMenuBaseOptionsType.attributes(),
    ...ISourceOptionsType.attributes(),
    ...IBackgroundStyleOptionsType.attributes(),
    ...INavigationOptionsINavigationSourceConfigType.attributes(),
    ...IFilterOptionsType.attributes(),
    ...ISelectorDialogOptionsType.attributes(),

    items: RecordSetType.optional(),
    sourceProperty: StringType,
    nodeFooterTemplate: TemplateFunctionType.optional(),
    openSelectorCallback: FunctionType.optional(),
    itemActions: ArrayType.of(IItemActionType),
    itemActionVisibilityCallback: TItemActionVisibilityCallbackType.optional(),
    dataLoadCallback: FunctionType.optional(),
    dataLoadErrback: FunctionType.optional(),
    selectorDialogResult: FunctionType.optional(),
    sourceController: NewSourceControllerType.optional(),
    calmTimer: CalmTimerType.optional(),
    subMenuDirection: TSubMenuDirectionType.optional(),
    itemAlign: TAlignItemType.optional(),
    headingCaptionProperty: StringType.optional(),
    itemsSpacing: StringType.optional(),
    multiSelectAccessibilityProperty: StringType.optional(),
    focusable: BooleanType.optional(),

    '[Controls/_interface/IBackgroundStyle]': NullType,
});

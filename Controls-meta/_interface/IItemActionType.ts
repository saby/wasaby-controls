import { BooleanType, NumberType, ObjectType, StringType, UnionType } from 'Meta/types';
import { IItemAction } from 'Controls/interface';
import { TItemActionShowType } from './TItemActionShowType';
import { TButtonStyleTypeType } from './TButtonStyleType';
import { TIconStyleType } from './TIconStyleType';
import { TItemActionsSizeType } from './TItemActionsSizeType';
import { TItemActionViewModeType } from './TItemActionViewModeType';
import { TItemActionHandlerType } from './TItemActionHandlerType';
import { TActionDisplayModeType } from './TActionDisplayModeType';

export const IItemActionType = ObjectType.id(
    'Controls/meta:IItemActionType'
).attributes<IItemAction>({
    id: UnionType.of([StringType, NumberType]),
    title: StringType.optional(),
    icon: StringType,
    showType: TItemActionShowType.optional(),
    style: TButtonStyleTypeType.optional(),
    iconStyle: TIconStyleType.optional(),
    iconSize: TItemActionsSizeType.optional(),
    viewMode: TItemActionViewModeType.optional(),
    handler: TItemActionHandlerType.optional(),
    'parent@': BooleanType.optional(),
    displayMode: TActionDisplayModeType.optional(),
    tooltip: StringType.optional(),
    parent: UnionType.of([StringType, NumberType]).optional(),
    commandName: StringType.optional(),
    commandOptions: ObjectType.optional(),
});

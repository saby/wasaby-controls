import { BooleanType, ObjectType } from 'Types/meta';
import { INavigationButtonConfig } from 'Controls/interface';
import { TNavigationButtonPositionType } from './TNavigationButtonPositionType';
import { TNavigationButtonSizeType } from './TNavigationButtonSizeType';

export const INavigationButtonConfigType = ObjectType.id(
    'Controls/meta:INavigationButtonConfigType'
).attributes<INavigationButtonConfig>({
    buttonPosition: TNavigationButtonPositionType.optional(),
    size: TNavigationButtonSizeType.optional(),
    contrastBackground: BooleanType.optional(),
});

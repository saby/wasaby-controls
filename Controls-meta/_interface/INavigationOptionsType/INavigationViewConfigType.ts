import { BooleanType, NumberType, ObjectType } from 'Meta/types';
import { INavigationViewConfig } from 'Controls/interface';
import { TNavigationPagingModeType } from './TNavigationPagingModeType';
import { TNavigationTotalInfoType } from './TNavigationTotalInfoType';
import { TNavigationResetButtonModeType } from './TNavigationResetButtonModeType';
import { TNavigationPagingPaddingType } from './TNavigationPagingPaddingType';
import { TNavigationPagingPositionType } from './TNavigationPagingPositionType';
import { TNavigationButtonViewType } from './TNavigationButtonViewType';
import { INavigationButtonConfigType } from './INavigationButtonConfigType';

export const INavigationViewConfigType = ObjectType.id(
    'Controls/meta:INavigationViewConfigType'
).attributes<INavigationViewConfig>({
    pagingMode: TNavigationPagingModeType.optional(),
    totalInfo: TNavigationTotalInfoType.optional(),
    maxCountValue: NumberType.optional(),
    showEndButton: BooleanType.optional(),
    resetButtonMode: TNavigationResetButtonModeType.optional(),
    pagingPadding: TNavigationPagingPaddingType.optional(),
    pagingPosition: TNavigationPagingPositionType.optional(),
    buttonView: TNavigationButtonViewType.optional(),
    buttonConfig: INavigationButtonConfigType.optional(),
});

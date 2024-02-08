import { ObjectType, NullType } from 'Meta/types';
import { INumberInputOptions } from 'Controls/input';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';
import { IOnlyPositiveOptionsType } from './IOnlyPositiveOptionsType';
import { IUseGroupingOptionsType } from '../_interface/IUseGroupingOptionsType';
import { INumberLengthOptionsType } from './INumberLengthOptionsType';

export const INumberInputOptionsType = ObjectType.attributes<INumberInputOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...INumberLengthOptionsType.attributes(),
    ...IFieldTemplateOptionsType.attributes(),
    onlyPositive: IOnlyPositiveOptionsType,
    useGrouping: IUseGroupingOptionsType,
    value: NullType,
    showEmptyDecimals: NullType,
});

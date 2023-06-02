import { ObjectType } from 'Types/meta';
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
    value: null,
    showEmptyDecimals: null
});

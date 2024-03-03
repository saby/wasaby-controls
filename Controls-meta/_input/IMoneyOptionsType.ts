import { ObjectType } from 'Meta/types';
import { IMoneyOptions } from 'Controls/input';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';
import { INumberLengthOptionsType } from './INumberLengthOptionsType';
import { IOnlyPositiveOptionsType } from './IOnlyPositiveOptionsType';
import { IFieldTemplateOptionsType } from './IFieldTemplateOptionsType';

export const IMoneyOptionsType = ObjectType.id(
    'Controls/meta:IMoneyOptionsType'
).attributes<IMoneyOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...INumberLengthOptionsType.attributes(),
    ...IFieldTemplateOptionsType.attributes(),
    onlyPositive: IOnlyPositiveOptionsType.optional(),
});

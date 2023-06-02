import { ObjectType } from 'Types/meta';
import { IPhoneOptions } from 'Controls/input';
import { IBaseInputOptionsType } from './IBaseInputOptionsType';
import { IFlagType } from '../_interface/IFlagType';
import { IPhoneType } from '../_interface/IPhoneType';

export const IPhoneOptionsType = ObjectType.id(
    'Controls/meta:IPhoneOptionsType'
).attributes<IPhoneOptions>({
    ...IBaseInputOptionsType.attributes(),
    ...IFlagType.attributes(),
    onlyMobile: IPhoneType
});

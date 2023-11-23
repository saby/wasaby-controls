import { ObjectType } from 'Types/meta';
import { IBaseInputOptions } from 'Controls/input';
import { IBaseOptionsType } from './IBaseOptionsType';
import { IControlOptionsType } from '../_interface/IControlOptionsType';

export const IBaseInputOptionsType = ObjectType.attributes<IBaseInputOptions>({
    ...IBaseOptionsType.attributes(),
    ...IControlOptionsType.attributes(),
});

import { ObjectType, FunctionType } from 'Meta/types';

interface IActionOptions {
    validate: Function;
}

export const IValidateOptionsType = ObjectType.id('Controls/meta:IActionOptionsType')
    .attributes<IActionOptions>({
        validate: FunctionType
    })

import { ObjectType, FunctionType } from 'Types/meta';

interface IActionOptions {
    validate: Function;
}

export const IValidateOptionsType = ObjectType.id('Controls/meta:IActionOptionsType')
    .attributes<IActionOptions>({
        validate: FunctionType
    })

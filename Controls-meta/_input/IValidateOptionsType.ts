import { ObjectType, FunctionType } from 'Types/meta';

interface IActionOptions {
    validate: Function;
}

export const IValidateOptionsType = ObjectType.id('Controls/meta:IActionOptionsType')
    .attributes<IActionOptions>({
        validate: FunctionType.editor(() => {
            return import('Controls-editors/properties').then(({ ActionEditor }) => {
                return ActionEditor;
            });
        }, {}),
    })
    .editor(() => {
        return import('Controls-editors/properties').then(({ ActionEditor }) => {
            return ActionEditor;
        });
    }, {});

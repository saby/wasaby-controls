import { ObjectType, FunctionType } from 'Types/meta';

interface IActionOptions {
    onCLick: any;
}

export const IActionOptionsType = ObjectType.id('Controls/meta:IActionOptionsType')
    .attributes<IActionOptions>({
        onClick: FunctionType.editor(() => {
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

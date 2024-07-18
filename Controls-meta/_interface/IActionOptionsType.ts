import { ObjectType, FunctionType } from 'Meta/types';

interface IActionOptions {
    onCLick: any;
}

export const IActionOptionsType = ObjectType.id('Controls/meta:IActionOptionsType')
    .attributes<IActionOptions>({
        onClick: FunctionType.editor(() => {
            return import('Controls-Buttons-editors/ActionEditor').then((ActionEditor) => {
                return ActionEditor;
            });
        }, {}),
    })
    .editor(() => {
        return import('Controls-Buttons-editors/ActionEditor').then((ActionEditor) => {
            return ActionEditor;
        });
    }, {});

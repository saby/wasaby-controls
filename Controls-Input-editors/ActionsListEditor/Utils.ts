import { StackOpener } from 'Controls/popup';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import { Model } from 'Types/entity';
import { RefObject } from 'react';

export function getActionByModel(item: Model) {
    const type = item.get('type') || item.get('action')?.id;
    return {
        ...actions.find((action) => {
            return action.type === type;
        }),
    };
}

export function openStackPopupWithActions(
    openerRef: RefObject<HTMLElement>,
    onResultCallback: Function,
    props: unknown
): void {
    const stackOpener = new StackOpener();
    const resolvedActions: IActionConfig[] = [...actions];
    stackOpener.open({
        template: 'Controls-Input-editors/ActionEditor/ActionEditorPopup:ActionEditorPopup',
        templateOptions: { ...props, actions: resolvedActions },
        width: 400,
        opener: openerRef.current,
        topPopup: true,
        eventHandlers: {
            onResult: (item: Model) => {
                return onResultCallback(item);
            },
        },
    });
}

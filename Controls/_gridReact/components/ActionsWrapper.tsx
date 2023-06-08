import * as React from 'react';

import {
    IItemActionsHandler,
    ItemActionsTemplateSelector,
    CollectionItemContext,
} from 'Controls/baseList';
import type { TItemActionsVisibility } from 'Controls/itemActions';
import type { TBackgroundStyle } from 'Controls/interface';

interface IActionsWrapperProps {
    actionHandlers: IItemActionsHandler;
    hoverBackgroundStyle: TBackgroundStyle;
    actionsClassName: string;
    actionsVisibility: TItemActionsVisibility;
}

/*
   Не должно быть этого враппера и контекста. Нужно переписать экшины, чтобы они не использовали CollectionItem
   и чтобы они принимали опции по контексту от BaseControl-а.
   Тогда этот файл можно будет удалить и в месте использования заменить на новый ItemActionsTemplate
 */
function ActionsWrapper(props: IActionsWrapperProps): React.ReactElement {
    const collectionItem = React.useContext(CollectionItemContext);
    return (
        <ItemActionsTemplateSelector
            {...props.actionHandlers}
            item={collectionItem}
            highlightOnHover={props.hoverBackgroundStyle !== 'none'}
            itemActionsClass={props.actionsClassName}
            actionsVisibility={props.actionsVisibility}
        />
    );
}

export default React.memo(ActionsWrapper);

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
export default function ActionsWrapper(props: IActionsWrapperProps): React.ReactElement {
    const collectionItem = React.useContext(CollectionItemContext);
    const swipeAnimation = collectionItem.getSwipeAnimation();
    const render = React.useMemo(() => {
        return (
            <ItemActionsTemplateSelector
                {...props.actionHandlers}
                item={collectionItem}
                highlightOnHover={props.hoverBackgroundStyle !== 'none'}
                hoverBackgroundStyle={props.hoverBackgroundStyle}
                itemActionsClass={props.actionsClassName}
                actionsVisibility={props.actionsVisibility}
            />
        );
    }, [
        collectionItem,
        swipeAnimation,
        props.hoverBackgroundStyle,
        props.actionsClassName,
        props.actionsVisibility,
    ]);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{render}</>;
}

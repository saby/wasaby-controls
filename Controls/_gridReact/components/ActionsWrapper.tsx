/*
 * Файл содержит компонент-обертку над опциями действий записи и вспомогательные методы и компоненты
 */
import * as React from 'react';
import {
    IItemActionsHandler,
    ItemActionsTemplateSelector,
    CollectionItemContext,
} from 'Controls/baseList';
import type { TItemActionsVisibility } from 'Controls/itemActions';
import type { TBackgroundStyle } from 'Controls/interface';
import { ItemActionsComponent, ItemActionsContext } from 'Controls/itemActions';

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
    const itemActionsContext = React.useContext(ItemActionsContext);
    const collectionItem = React.useContext(CollectionItemContext);
    const swipeAnimation = collectionItem.getSwipeAnimation();
    const render = React.useMemo(() => {
        const actions = collectionItem?.getActions()?.all;
        if (actions && itemActionsContext && itemActionsContext.actionsInitialized) {
            return (
                <ItemActionsComponent
                    actions={actions}
                    hoverBackgroundStyle={props.hoverBackgroundStyle}
                    itemActionsClass={props.actionsClassName}
                    actionsVisibility={props.actionsVisibility}
                />
            );
        } else {
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
        }
    }, [
        collectionItem,
        swipeAnimation,
        props.hoverBackgroundStyle,
        props.actionsClassName,
        props.actionsVisibility,
        props.actionHandlers,
        itemActionsContext,
    ]);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{render}</>;
}

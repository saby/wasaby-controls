/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { ListContext } from './ListContext';
import { CollectionItemContext } from './CollectionItemContext';
import { HoverActionsTemplate } from './Render/ItemActions';
import { IItemActionsTemplateProps } from 'Controls/itemActions';
import { TBackgroundStyle } from 'Controls/interface';

// Публичные опции коннектед компонента
interface IProps extends TInternalProps, IItemActionsTemplateProps {
    className?: string;
    backgroundStyle?: TBackgroundStyle;
}

export default function ActionsConnectedComponent(props: IProps): React.ReactElement {
    const { actionHandlers } = React.useContext(ListContext);
    const item = React.useContext(CollectionItemContext);
    const [itemActions, setItemActions] = React.useState(item.getActions()?.showed || []);
    const highlightOnHover =
        props.hoverBackgroundStyle && props.hoverBackgroundStyle !== 'transparent';

    React.useLayoutEffect(() => {
        actionHandlers.itemActionsTemplateMountedCallback?.(item, setItemActions);
        return () => {
            actionHandlers.itemActionsTemplateUnmountedCallback?.(item);
        };
    }, [
        item,
        actionHandlers.itemActionsTemplateMountedCallback,
        actionHandlers.itemActionsTemplateUnmountedCallback,
    ]);

    return (
        <HoverActionsTemplate
            actionPadding={props.actionPadding}
            actionsVisibility={props.actionsVisibility}
            attrs={props.attrs}
            highlightOnHover={highlightOnHover}
            hoverBackgroundStyle={props.hoverBackgroundStyle}
            item={item}
            itemActionsBackgroundStyle={props.backgroundStyle}
            itemActionsClass={props.itemActionsClass}
            menuActionVisibility={props.menuActionVisibility}
            showedActions={itemActions}
            theme={props.theme}
            viewMode={props.viewMode}
            {...actionHandlers}
        />
    );
}

/**
 * Компонент, отображающий операции над записью списка в произвольном месте шаблона записи.
 * @demo Controls-demo/gridReact/ItemActionsPosition/Custom/Index
 * @class Controls/_baseList/ActionsConnectedComponent
 * @public
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#className
 * @cfg {String} className CSS-класс, внутри элемента.
 * @default controls-itemActionsV_position_bottomRight
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#backgroundStyle
 * @cfg {TBackgroundStyle} Цвет подложки операций над записью.
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#hoverBackgroundStyle
 * @cfg {TBackgroundStyle} Цвет подложки операций над записью при наведении мыши. Используется, если операции над записью отображаются постоянно.
 * @see actionsVisibility
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#actionsVisibility
 * @cfg {TItemActionsVisibility} Видимость операций (по ховеру / с задержкой / всегда)
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#viewMode
 * @cfg {TItemActionsViewMode} Преднастроенный режим отображения операций над записью
 */

/**
 * @name Controls/_baseList/ActionsConnectedComponent#menuActionVisibility
 * @cfg {'hidden' | 'visible' | 'adaptive'} Видимость кнопки открытия меню
 */

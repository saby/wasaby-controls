import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { IControlProps } from 'Controls/interface';
import { Button, IButtonOptions } from 'Controls/dropdown';

/**
 * Специализированный тип кнопки для добавления записей в список с возможностью открытия меню.
 *
 * @class Controls-Buttons/ListButton
 *
 * @implements Controls/interface:IControl
 * @demo Controls-Buttons-demo/ListButton/Index
 * @public
 */

export default React.memo(function ListButton(
    props: IListButton
): React.ReactElement {
    const getOptions = () => {
        return {
            ...props.menuOptions,
            caption: props.caption,
            viewMode: 'link',
            icon: 'icon-RoundPlus',
            iconStyle: 'unaccented',
            iconSize: '2xs',
            fontSize: 'xs',
            fontColorStyle: 'unaccented',
            menuPopupTrigger: 'click',
            contrastBackground: true,
        };
    };

    return createElement(
        Button,
        {
            ...getOptions(),
        },
        {
            ...props.attrs,
            title: props.tooltip,
        },
        {
            ...props._$events,
        }
    );
});

export interface IListButton extends IControlProps {
    /**
     * @name Controls-Buttons/ListButton#tooltip
     * @cfg {string} Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
     */
    tooltip?: string;
    /**
     * @name Controls-Buttons/ListButton#caption
     * @cfg {string} Определяет текст заголовка контрола.
     */
    caption: string;
    /**
     * @name Controls-Buttons/ListButton#menuOptions
     * @cfg {Controls/dropdown:IButtonOptions} Определяет набор опций для открытия меню.
     * @remark Подробнее {@link Controls/dropdown:IButtonOptions тут}
     */
    menuOptions: IButtonOptions;
}

import * as React from 'react';
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

export default React.memo(
    React.forwardRef(function ListButton(props: IListButton, ref): React.ReactElement {
        const onClickHandler = React.useCallback(() => {
            props.onClick?.();
        }, [props.onClick]);
        const dataQA = props['data-qa'] || 'controls-AddButton';
        return (
            <Button
                {...props.menuOptions}
                data-qa={dataQA}
                caption={props.caption}
                tooltip={props.tooltip}
                onClick={onClickHandler}
                className={props.className}
                style={props.style}
                ref={ref}
                viewMode="link"
                icon="icon-RoundPlus"
                iconStyle="unaccented"
                iconSize="2xs"
                fontSize="xs"
                fontColorStyle="unaccented"
                menuPopupTrigger="click"
                contrastBackground={true}
            />
        );
    })
);

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
    /**
     * @name Controls-Buttons/ListButton#onClick
     * @cfg {React.MouseEventHandler} Обработчик события клика по кнопке.
     */
    onClick?: React.MouseEventHandler;
    'data-qa'?: string;
}

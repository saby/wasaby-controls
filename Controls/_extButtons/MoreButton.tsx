/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IFontSizeOptions, IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom, clearEvent } from 'UICore/Jsx';
import rk = require('i18n!Controls');
import 'css!Controls/extButtons';

/**
 * Интерфейс для контрола Controls.extButtons:MoreButton
 * @public
 */
export interface IMoreButtonOptions extends IFontSizeOptions, IControlProps, TInternalProps {
    /**
     * @cfg {Boolean} Определяет контрастность фона кнопки по отношению к ее окружению.
     * @default true
     * @demo Controls-demo/Buttons/MoreButton/Index
     */
    contrastBackground?: boolean;
    /**
     * @cfg {Number} Значение счетчика.
     * @demo Controls-demo/Buttons/MoreButton/Index
     */
    count?: number;
    /**
     * @cfg {Function} Callback, который вызывается при нажатии не кнопку
     */
    onClick?: (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * Контрол служит для визуального ограничения записей.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FButtons%2FMoreButton%2FIndex демо-пример}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_buttons.less переменные тем оформления}
 *
 * @class Controls/_extButtons/MoreButton
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IFontSize
 * @implements Controls/_extButtons:IMoreButtonOptions
 *
 * @public
 *
 * @demo Controls-demo/Buttons/MoreButton/Index
 */
export default React.forwardRef(function MoreButton(
    props: IMoreButtonOptions,
    ref
): React.ReactElement {
    const { fontSize = 'm', contrastBackground = true } = props;
    clearEvent(props, ['onClick']);
    const clickHandler = (event: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
        if (props.readOnly) {
            event.stopPropagation();
        } else if (props.onClick) {
            props.onClick(event);
        }
    };

    const moreButtonClass =
        `controls-MoreButton-${props.readOnly ? 'readonly' : 'textContainer'}` +
        ` controls-MoreButton-container controls-MoreButton-container-size-${fontSize}` +
        ` ${contrastBackground ? 'controls-MoreButton-contrast' : 'controls-MoreButton-same'}`;
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div
            {...attrs}
            onClick={clickHandler}
            ref={ref}
            className={`controls-MoreButton ${attrs.className}`}
        >
            <div className={moreButtonClass}>
                <span className={`controls-text-label controls-MoreButton_text-label controls-fontsize-${fontSize}`}>
                    {rk('Еще')} {props.count}
                </span>
            </div>
        </div>
    );
});

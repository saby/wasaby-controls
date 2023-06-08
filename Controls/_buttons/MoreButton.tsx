/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { IFontSizeOptions, IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom, clearEvent } from 'UICore/Jsx';
import 'css!Controls/buttons';
import rk = require('i18n!Controls');

export interface IMoreButtonOptions
    extends IControlOptions,
        IFontSizeOptions,
        IControlProps {
    /**
     * Определяет контрастность фона кнопки по отношению к ее окружению.
     * @default true
     * @demo Controls-demo/Buttons/MoreButton/Index
     */
    contrastBackground?: boolean;
    /**
     * Значение счетчика.
     * @demo Controls-demo/Buttons/MoreButton/Index
     */
    count?: number;
}

interface MoreButtonOptions extends IMoreButtonOptions, TInternalProps {
    onClick: Function;
    _$events: unknown;
}

/**
 * Контрол служит для визуального ограничения записей.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FButtons%2FMoreButton%2FIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_buttons.less переменные тем оформления}
 *
 * @class Controls/_buttons/MoreButton
 * @implements Controls/interface:IControl
 * @implements Controls/buttons:IMoreButtonOptions
 *
 * @public
 *
 * @demo Controls-demo/Buttons/MoreButton/Index
 */
export default React.forwardRef(function MoreButton(
    props: MoreButtonOptions,
    _
): React.ReactElement {
    const { fontSize = 'm', contrastBackground = true } = props;
    clearEvent(props, ['onClick']);
    const clickHandler = (
        event: React.SyntheticEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (props.readOnly) {
            event.stopPropagation();
        } else if (props.onClick) {
            props.onClick(event);
        }
    };

    const moreButtonClass =
        `controls-MoreButton-${props.readOnly ? 'readonly' : 'textContainer'}` +
        ` controls-MoreButton-container controls-MoreButton-container-size-${fontSize}` +
        ` ${
            contrastBackground
                ? 'controls-MoreButton-contrast'
                : 'controls-MoreButton-same'
        }`;
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div
            {...attrs}
            onClick={clickHandler}
            ref={props.$wasabyRef}
            className={`controls-MoreButton ${attrs.className}`}
        >
            <div className={moreButtonClass}>
                <span
                    className={`controls-text-label controls-fontsize-${fontSize}`}
                >
                    {rk('Еще')} {props.count}
                </span>
            </div>
        </div>
    );
});

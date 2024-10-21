/**
 * @kaizen_zone 606e93b4-7c10-4c6e-aaed-4bb437c63038
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import * as Utils from 'Controls/_progress/Utils';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls/progress';

export interface IBarOptions extends IControlOptions {
    value?: number;
    barStyle: 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'info';
    blankAreaStyle?:
        | 'default'
        | 'none'
        | 'primary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'secondary'
        | 'info';
    size?: 's' | 'm';
}

interface IReactBarOptions extends IBarOptions, TInternalProps {}

function _getWidth(val: number): string {
    const maxPercentValue = 100;
    const value = Utils.isNumeric(val) ? val : 0;
    Utils.isValueInRange(value, 0, maxPercentValue, 'Bar', 'Value');
    return value > 0 ? Math.min(value, maxPercentValue) + '%' : '0px';
}

/**
 * Базовый индикатор выполнения процесса.
 * Отображает полосу прогресса выполнения.
 * @class Controls/_progress:Bar
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2fprogress%2fBar%2fIndex демо-пример}
 *
 * @implements Controls/interface:IControl
 * @implements Controls/progress:IBar
 *
 * @public
 *
 * @demo Controls-demo/progress/Bar/Base/Index
 *
 */
export default React.forwardRef(function Bar(props: IReactBarOptions, ref): React.ReactElement {
    const width = _getWidth(props.value || 0);

    const { barStyle = 'primary', blankAreaStyle = 'default', size = 's' } = props;
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div
            {...attrs}
            ref={props.$wasabyRef}
            className={`controls-ProgressBar controls-ProgressBar_size-${size} controls-ProgressBar_style-${blankAreaStyle} controls-ProgressBar_style-${barStyle}__filled ${attrs.className}`}
        >
            <div className="controls-ProgressBar_style__filled" style={{ width }} />
        </div>
    );
});

/**
 * @name Controls/_progress:Bar#value
 * @cfg {Number} Значение прогресса в процентах.
 * @remark
 * Целое число от 0 до 100.
 */

/*
 * @name Controls/_progress:Bar#value
 * @cfg {Number} Progress in percents (ratio of the filled part)
 * @remark
 * An integer from 1 to 100.
 */

/**
 * @name Controls/_progress:Bar#barStyle
 * @cfg {String} Стиль шкалы прогресс бара.
 * @variant primary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant secondary
 * @variant info
 * @default primary
 * @demo Controls-demo/progress/Bar/BarStyle/Index
 */

/**
 * @name Controls/_progress:Bar#blankAreaStyle
 * @cfg {String} Стиль шкалы не заполненной области прогресс бара.
 * @variant default
 * @variant none
 * @variant primary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant secondary
 * @variant info
 * @default default
 * @demo Controls-demo/progress/Bar/BlankAreaStyle/Index
 */

/**
 * @name Controls/_progress:Bar#size
 * @cfg {String} Определяет высоту шкалы.
 * @variant s
 * @variant m
 * @default s
 * @demo Controls-demo/progress/Bar/Size/Index
 */

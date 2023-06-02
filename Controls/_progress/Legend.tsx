/**
 * @kaizen_zone cd70f4c7-a658-45dc-aae3-71ffb9bc915d
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { IIndicatorCategory } from './StateIndicator';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls/progress';

/**
 * Интерфейс опций для {@link Controls/progress:Legend}.
 * @interface Controls/progress:ILegend
 * @public
 */
export interface ILegendOptions extends IControlProps {
    /**
     * @name Controls/progress:ILegend#data
     * @cfg {Array.<Controls/progress:IndicatorCategory>} Конфигурация элементов легенды.
     * @example
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:Legend data="{{[{value: 10, className: '', title: 'done'}]}}"/>
     * </pre>
     * @remark
     * Используется, если для диаграммы нужно установить несколько легенд. Количество элементов массива задает количество легенд диаграммы.
     */
    data?: IIndicatorCategory[];
}

interface IReactLegendOptions extends ILegendOptions, TInternalProps {}

/**
 * Контрол используют для создания легенды к диаграмме состояния процесса (см. {@link /docs/js/Controls/progress/StateIndicator/?v=20.2000 Controls/progress:StateIndicator}).
 * Отображение легенды можно настроить во всплывающем окне при наведении курсора мыши на диаграмму состояния процесса.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_progress.less переменные тем оформления}
 *
 * @implements Controls/progress:ILegend
 * @public
 */

/*
 * Legend for StateIndicator
 * @class Controls/_progress/Legend
 * @author Мочалов М.А.
 */

export default React.forwardRef(function Legend(
    props: IReactLegendOptions,
    ref
): React.ReactElement {
    const { data = [{ value: 0, className: '', title: '' }] } = props;
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div {...attrs} ref={props.$wasabyRef}>
            {data.map((val, i) => {
                /* eslint-disable react/no-array-index-key */
                return (
                    <div className="controls-legend-line" key={i}>
                        <div className="controls-legend-line_titleWrapper">
                            <div
                                className={`${
                                    val.className
                                        ? val.className
                                        : 'controls-StateIndicator__sector' +
                                          (i + 1)
                                } controls-legend-color`}
                            ></div>
                            <div className="controls-legend-title">
                                {val.title}
                            </div>
                        </div>
                        <div className="controls-legend-value">
                            {val.value}%
                        </div>
                    </div>
                );
                /* eslint-enable react/no-array-index-key */
            })}
        </div>
    );
});

/**
 * @kaizen_zone f295a416-c9d1-43de-b857-733429c5d388
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import * as Utils from 'Controls/_progress/Utils';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls/progress';

/**
 * Интерфейс конфигурации сектора.
 * @interface Controls/progress:IStateBarSector
 * @public
 */
export interface IStateBarSector {
    /**
     * @name Controls/progress:IStateBarSector#value
     * @cfg {Number} Определяет размер от 0 до 100 (процентное значение) сектора индикатора.
     * @remark Сумма значений секторов не должна превышать 100.
     */
    value: number;

    /**
     * @name Controls/progress:IStateBarSector#style
     * @cfg {string} Определяет цвет сектора индикатора.
     * @remark Если цвет не указан, будет использован цвет по умолчанию - 'secondary'.
     * @variant primary
     * @variant success
     * @variant warning
     * @variant danger
     * @variant info
     * @default secondary
     */
    style?: string;

    /**
     * @name Controls/progress:IStateBarSector#title
     * @cfg {string} Название сектора.
     * @default ''
     */
    title?: string;
}

/**
 * Интерфейс опций для {@link Controls/progress:StateBar}.
 * @interface Controls/progress:IStateBar
 * @public
 */
export interface IStateBarOptions extends IControlProps {
    /**
     * @name Controls/progress:IStateBarOptions#data
     * @cfg {Array.<Controls/progress:IStateBarSector>} Массив цветных секторов индикатора.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.progress:StateBar data="{{[{value: 10, style: 'success', title: 'Выполнено'}]}}"/>
     * </pre>
     * @remark
     * Количество элементов массива задает количество секторов индикатора.
     * @demo Controls-demo/progress/StateBar/Base/Index
     */
    data: IStateBarSector[];

    /**
     * @name Controls/progress:IStateBar#blankAreaStyle
     * @cfg {String} Определяет цвет незаполненной области индикатора.
     * @variant readonly
     * @variant primary
     * @variant success
     * @variant warning
     * @variant danger
     * @variant secondary
     * @variant info
     * @default none - Заливка отсутствует.
     * @example
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:StateBar blankAreaStyle="success"/>
     * </pre>
     * @demo Controls-demo/progress/StateBar/BlankAreaStyle/Index
     */
    blankAreaStyle?: string;

    /**
     * @name Controls/progress:IStateBar#align
     * @cfg {String} Направление отображения прогресса слева направо или справа налево.
     * @variant right - Отображение справа налево.
     * @default left - Отображение cлева направо.
     * @example
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:StateBar align="right"/>
     * </pre>
     * @demo Controls-demo/progress/StateBar/Align/Index
     */
    align?: string;

    /**
     * @name Controls/progress:IStateBar#size
     * @cfg {String} Определяет высоту шкалы.
     * @variant s
     * @variant m
     * @default s
     * @demo Controls-demo/progress/StateBar/Size/Index
     */
    size?: 's' | 'm';
}

interface IReactStateBarOptions extends IStateBarOptions, TInternalProps {}

/**
 * Проверяеит данные
 * @param opts {IStateBarOptions}
 * @private
 */
export function _applyNewState(opts: IStateBarOptions): IStateBarSector[] {
    let currSumValue = 0;
    const maxSumValue = 100;
    const data = opts.data || [{ value: 0 }];
    Utils.isSumInRange(data, maxSumValue, 'StateBar');

    return data.map((sector) => {
        let value = Number(sector.value);
        if (!Utils.isNumeric(value)) {
            value = 0;
        }

        // Проверяем, выходит ли значение за допустимы пределы
        if (!Utils.isValueInRange(value)) {
            value = value > 0 ? Math.min(value, maxSumValue) : 0;
        }

        // Если при добавлении очередного сектора, сумма секторов превышает ширину в 100%,
        // устанавливаем для сектора оставшуюся незадействованную ширину
        if (!Utils.isValueInRange(currSumValue + value)) {
            value = maxSumValue - currSumValue;
        }
        currSumValue += value;

        return {
            style: sector.style ? sector.style : 'secondary',
            title: sector.title ? sector.title : '',
            value,
        };
    });
}

/**
 * Многоцветный индикатор выполнения.
 * Контрол визуального отображения прогресса выполнения процесса по нескольким показателям.
 * @class Controls/progress:StateBar
 *
 * @remark
 * Полезные ссылки:
 * {@link /materials/DemoStand/app/Controls-demo%2fprogress%2fStateBar%2fIndex демо-пример}
 *
 * @implements Controls/interface:IControl
 * @implements Controls/progress:IStateBarOptions
 *
 * @public
 * @demo Controls-demo/progress/StateBar/Index
 */

export default React.forwardRef(function StateBar(
    props: IReactStateBarOptions,
    ref
): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const { size = 's', align = 'left' } = props;
    const sectors = _applyNewState(props);
    const stateBarClass =
        `controls-StateBar controls-StateBar_size-${size} controls-StateBar_align-${align}` +
        ` ${
            props.blankAreaStyle
                ? 'controls-StateBar_style-' + props.blankAreaStyle
                : ''
        } ${attrs.className}`;
    return (
        <div {...attrs} ref={props.$wasabyRef} className={stateBarClass}>
            {sectors.map((sector, index) => {
                /* eslint-disable react/no-array-index-key */
                return (
                    <div
                        className={
                            `controls-StateBar__sector controls-StateBar__sector_style-${sector.style}` +
                            ` controls-StateBar__sector_aligned-${align}`
                        }
                        style={{ width: sector.value + '%' }}
                        key={index}
                        title={sector.title}
                    />
                );
                /* eslint-enable react/no-array-index-key */
            })}
        </div>
    );
});

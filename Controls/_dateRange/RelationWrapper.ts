/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_dateRange/RelationWrapper/RelationWrapper';

/**
 * Обертка для контрола выбора периодов, с помощью которой периоды могут быть связаны.
 * Используется в сочетании с {@link Controls/_dateRange/RelationController RelationController}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_dateRange.less переменные тем оформления}
 *
 * @class Controls/_dateRange/RelationWrapper
 * @extends UI/Base:Control
 *
 *
 * @public
 * @demo Controls-demo/dateRange/RelationController
 *
 */

/*
 * A wrapper for the control of the choice of periods, so that they can be tied. Used in conjunction
 * with a {@link Controls/_dateRange/RelationController RelationController}.
 *
 * @class Controls/_dateRange/RelationWrapper
 * @extends UI/Base:Control
 *
 *
 * @public
 * @author Ковалев Г.Д.
 * @demo Controls-demo/dateRange/RelationController
 *
 */

interface IRelationWrapper extends IControlOptions {
    number: number;
    bindType: string;
}

class Component extends Control<IRelationWrapper> {
    protected _template: TemplateFunction = template;

    _onRangeChanged(event: Event, startValue: Date, endValue: Date): void {
        this._notify('rangeChanged', [startValue, endValue]);
        this._notify(
            'relationWrapperRangeChanged',
            [startValue, endValue, this._options.number, this._options.bindType],
            { bubbling: true }
        );
    }
}
/**
 * @name Controls/_dateRange/RelationWrapper#content
 * @cfg {Content} Содержимое контрола. Контрол реализует {@link Controls/_dateRange/interfaces/IDateRange}.
 * @example
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre class="brush: js">
 *    class MyControl extends Control<IControlOptions> {
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    }
 * </pre>
 */

/*
 * @name Controls/_dateRange/RelationWrapper#content
 * @cfg {Content} Control contents. Must be a control that implement {@link Controls/_dateRange/interfaces/IDateRange} interface.
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    }
 * </pre>
 */

/**
 * @typedef {String} bindType
 * @variant normal В этом режиме изменение одного периода всегда приводит к пересчету остальных периодов.
 * @variant byCapacity В этом режиме при изменении одного из периодов другие изменяются только в том случае, если изменился тип периода.
 */

/*
 * @typedef {String} bindType
 * @variant normal In this mode, changing one period always results to recalculation of the remaining periods.
 * @variant byCapacity In this mode, when one of the periods changes, the others change only if the type of the period has changed.
 */

/**
 * @name Controls/_dateRange/RelationWrapper#bindType
 * @cfg {bindType} Тип привязки.
 * @example
 * В этом примере изменение первого поля ввода только пересчитывает второе поле ввода, если тип периода изменяется или он становится после второго.
 * Но изменения во втором поле ввода всегда изменяют первое.
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}" bindType="byCapacity">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre class="brush: js">
 *    class MyControl extends Control<IControlOptions> {
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    }
 * </pre>
 */

/*
 * @name Controls/_dateRange/RelationWrapper#bindType
 * @cfg {bindType} Bind type
 * @example
 * In this example, changing the first input field only recalculates the second input field if type of the period changes
 * or it becomes after than the second one. But changes to the second input field always change the first one.
 * <pre>
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}" bindType="byCapacity">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:RangeShortSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    }
 * </pre>
 */
/**
 * @name Controls/_dateRange/RelationWrapper#number
 * @cfg {number} Порядковый номер компонента, определяющий его позицию внутри RelationController среди остальных RelationWrapper'ов.
 * @see Controls/_dateRange/RelationController
 */

/**
 * @name Controls/_dateRange/IRelationWrapper#ranges
 * @cfg {Array<[Date | null, Date | null]>} Принимает массив массивов, где каждый внутренний массив хранит startValue и endValue всех периодов.
 * @remark Также значение ranges можно получить из поля content.
 * <pre>
 *     <Controls.dateRange:RelationController
 *               name="dateRelation"
 *               bind:startValue0="_startValue0"
 *               bind:endValue0="_endValue0"
 *               bind:startValue1="_startValue1"
 *               bind:endValue1="_endValue1"
 *          <Controls.dateRange:RelationWrapper
 *                     number="{{0}}"
 *                     ranges="{{content.ranges}}">
 *                <Controls.dateRange:Selector
 *                        datePopupType="shortDatePicker" />
 *             </Controls.dateRange:RelationWrapper>
 *             <Controls.dateRange:RelationWrapper
 *                     number="{{1}}"
 *                     ranges="{{content.ranges}}"
 *             >
 *                <Controls.dateRange:Selector
 *                        datePopupType="shortDatePicker" />
 *             </Controls.dateRange:RelationWrapper>
 *      </Controls.dateRange:RelationController>
 * </pre>
 */
export default Component;

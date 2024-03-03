/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Model, { IModel } from './RelationController/Model';
import * as template from 'wml!Controls/_dateRange/RelationController/RelationController';
import { Date as WSDate } from 'Types/entity';

interface IRelationController extends IControlOptions, IModel {}

/**
 * Контроллер, который позволяет связать несколько контролов для ввода периода.
 *
 * @remark
 * Полезные ссылки:
 * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dateRange.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 *
 *
 * @public
 * @demo Controls-demo/dateRange/RelationController
 */

export default class RelationController extends Control<IRelationController> {
    protected _template: TemplateFunction = template;
    protected _model: Model;

    protected _beforeMount(options: IRelationController): void {
        this._model = new Model(options);
    }

    protected _beforeUpdate(options: IRelationController): void {
        this._model.update(options);
    }

    protected _beforeUnmount(): void {
        this._model = null;
    }

    protected _onRelationWrapperRangeChanged(
        event: Event,
        start: Date,
        end: Date,
        controlNumber: number,
        bindType: string
    ): void {
        const ranges = this._model.ranges;
        const oldBindType = this._model.bindType;
        this._model.updateRanges(start, end, controlNumber, bindType);
        this._notifyRangeChanged(this._model.ranges, ranges);
        if (oldBindType !== this._model.bindType) {
            this._notify('bindTypeChanged', [this._model.bindType]);
        }
    }

    protected _onRelationButtonBindTypeChanged(event: Event, bindType: string): void {
        if (bindType !== this._model.bindType) {
            this._model.bindType = bindType;
            this._notify('bindTypeChanged', [this._model.bindType]);
        }
    }

    shiftForward(): void {
        this._model.shiftForward();
        this._notifyRangeChanged(this._model.ranges);
    }

    shiftBackward(): void {
        this._model.shiftBackward();
        this._notifyRangeChanged(this._model.ranges);
    }

    private _notifyRangeChanged(newRanges: Date[][], ranges?: Date[][]): void {
        let changed = false;
        for (const index in newRanges) {
            if (newRanges.hasOwnProperty(index)) {
                if (!ranges || ranges[index][0] !== newRanges[index][0]) {
                    this._notify('startValue' + index + 'Changed', [newRanges[index][0]]);
                    changed = true;
                }
                if (!ranges || ranges[index][1] !== newRanges[index][1]) {
                    this._notify('endValue' + index + 'Changed', [newRanges[index][1]]);
                    changed = true;
                }
            }
        }
        if (changed) {
            this._notify('periodsChanged', [newRanges]);
        }
    }

    static getDefaultOptions(): object {
        return {
            bindType: 'normal',
            dateConstructor: WSDate,
            autoRangeChange: true,
        };
    }
}

/**
 * @name Controls/_dateRange/RelationController#startValue0
 * @cfg {Date} Начальное значение первого периода.
 * @remark
 * Вы можете привязать параметры startValue0, startValue1, startValue2 в количестве, равном количеству контролов, которые необходимо связать.
 * @example
 * В этом примере показано, как связать 2 диапазона контролов ввода.
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
 * @name Controls/_dateRange/RelationController#startValue0
 * @cfg {Date} Start value of the first period.
 * @remark
 * You can bind the options startValue0, startValue1, startValue2 in an amount equal to the number of controls you need to associate.
 * @example
 * This example shows how to bind 2 range input controls.
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
 * @name Controls/_dateRange/RelationController#endValue0
 * @cfg {Date} Конечное значение первого периода.
 * @remark
 * Вы можете привязать параметры endValue0, endValue1, endValue2 в количестве, равном количеству контролов, которые необходимо связать.
 * @example
 * В этом примере показано, как связать 2 диапазона контролов ввода.
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
 *   class MyControl extends Control<IControlOptions> {
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    }
 * </pre>
 */

/*
 * @name Controls/_dateRange/RelationController#endValue0
 * @cfg {Date} End value of the first period.
 * @remark
 * You can bind the options endValue0, endValue1, endValue2 in an amount equal to the number of controls you need to associate.
 * @example
 * This example shows how to bind 2 range input controls.
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
 * @typedef {String} BindType
 * @variant normal В этом режиме изменение одного периода всегда приводит к пересчету остальных периодов.
 * @variant byCapacity В этом режиме при изменении одного из периодов другие изменяются только в том случае, если изменился тип периода.
 */

/*
 * @typedef {String} BindType
 * @variant normal In this mode, changing one period always results to recalculation of the remaining periods.
 * @variant byCapacity In this mode, when one of the periods changes, the others change only if the type of the period has changed.
 */

/**
 * @name Controls/_dateRange/RelationController#autoRangeChange
 * @cfg {Boolean} Определяет, изменится ли соседний период, в случае если выбрать второй период раньше первого, и наоборот.
 * @remark
 * Если контрол состоит из двух периодов Февраль'21 и Март'21, то при смене Марта на Январь,
 * по умолчанию периоды сменятся на Декабрь'20 и Январь'21.
 * Опция позволяет оставлять выбор в таком виде, в котором выбрал пользователь, т.е. Февраль'21 и Январь'21.
 * @default true
 */

/**
 * @name Controls/_dateRange/RelationController#bindType
 * @cfg {BindType} Тип привязки.
 * @default normal
 * @example
 * В этом примере показано, как задать тип привязки.
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController bindType="{{_bindType}}">
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre class="brush: js">
 *    class MyControl extends Control<IControlOptions> {
 *       _bindType: 'normal'
 *    }
 * </pre>
 */

/*
 * @name Controls/_dateRange/RelationController#bindType
 * @cfg {BindType} Bind type
 * @default normal
 * @example
 * This example shows how to set the bind type.
 * <pre>
 *    <Controls.dateRange:RelationController bindType="{{_bindType}}">
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       _bindType: 'normal'
 *    }
 * </pre>
 */

/**
 * @name Controls/_dateRange/RelationController#content
 * @cfg {Content} Содержимое контрола. Контроллер устанавливает периоды и тип параметров связи в шаблоне.
 * Шаблон может содержать контролы выбора периода.
 * Каждый контрол выбора периода должен быть обернут в {@link Controls/_dateRange/RelationWrapper}. Также шаблон может содержать {@link Controls/_dateRange/RelationButton}.
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
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
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
 * @name Controls/_dateRange/RelationController#content
 * @cfg {Content} Control contents. The controller set the periods and type of relation options on the template.
 * An internal template can contain period selection controls. Each of the period selection control
 * must be wrapped in {@link Controls/_dateRange/RelationWrapper}. Also the template may contain a {@link Controls/_dateRange/RelationButton}.
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
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
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
 * @event bindTypeChanged Происходит при изменении типа привязки.
 * @name Controls/_dateRange/RelationController#bindTypeChanged
 * @param {BindType} bindType Новое значение типа привязки.
 * @example
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController on:bindTypeChanged="_bindTypeChangedHandler()"/>
 * </pre>
 * <pre class="brush: js">
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _bindTypeChangedHandler(bindType) {
 *          if (bindType === 'normal') {
 *              this._buttonStyle = 'primary'
 *          } else if (bindType === 'byCapacity') {
 *              this._buttonStyle = 'default';
 *          }
 *       },
 *       ...
 *    }
 * </pre>
 */

/*
 * @event Occurs when bind type was changed.
 * @name Controls/_dateRange/RelationController#bindTypeChanged
 * @param {BindType} bindType New bind type value.
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController on:bindTypeChanged="_bindTypeChangedHandler()"/>
 * </pre>
 * <pre>
 *   class MyControl extends Control<IControlOptions> {
 *       ...
 *       _bindTypeChangedHandler(bindType) {
 *          if (bindType === 'normal') {
 *              this._buttonStyle = 'primary'
 *          } else if (bindType === 'byCapacity') {
 *              this._buttonStyle = 'default';
 *          }
 *       },
 *       ...
 *    }
 * </pre>
 */

/**
 * @event periodsChanged Происходит при изменении хотя бы одного из периодов.
 * @name Controls/_dateRange/RelationController#periodsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array} value Массив с периодами.
 * @example
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController on:periodsChanged="_periodsChangedHandler()"/>
 * </pre>
 * <pre class="brush: js">
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _periodsChangedHandler(event, periods) {
 *          this._saveToDatabase(periods);
 *       },
 *       ...
 *    }
 * </pre>
 */

/*
 * @event Occurs when at least one of the periods has changed.
 * @name Controls/_dateRange/RelationController#periodsChanged
 * @param {Array} value Array with periods.
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController on:periodsChanged="_periodsChangedHandler()"/>
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       ...
 *       _periodsChangedHandler(periods) {
 *          this._saveToDatabase(periods);
 *       },
 *       ...
 *    }
 * </pre>
 */

/**
 * Сдвигает периоды вперед.
 * @name Controls/_dateRange/RelationController#shiftForward
 * @function
 * @example
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftForward()"/>
 * </pre>
 * @see shiftBackward
 */

/*
 * Shifts periods forward
 * @function
 * @name Controls/_dateRange/RelationController#shiftForward
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftForward()"/>
 * </pre>
 */

/**
 * Сдвигает периоды назад.
 * @name Controls/_dateRange/RelationController#shiftBackward
 * @function
 * @example
 * <pre class="brush: html">
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftBackward()"/>
 * </pre>
 * @see shiftForward
 */

/*
 * Shifts periods backward
 * @function Controls/_dateRange/RelationController#shiftBackward
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftBackward()"/>
 * </pre>
 */

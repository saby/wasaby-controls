/**
 * @kaizen_zone e70f3b9b-6c6a-45d0-9ec7-45891a58492c
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import * as Utils from 'Controls/_progress/Utils';
import 'css!Controls/progress';

const defaultColors = [
    'controls-StateIndicator__sector1',
    'controls-StateIndicator__sector2',
    'controls-StateIndicator__sector3',
];
const defaultScaleValue = 10;
const maxPercentValue = 100;
const defaultData = [{ value: 0, title: '', className: '' }];

/**
 * Интерфейс опций для конфигурации категорий.
 * @interface Controls/progress:IIndicatorCategory
 * @public
 */
export interface IIndicatorCategory {
    /**
     * @name Controls/progress:IIndicatorCategory#value
     * @cfg {Number} Процент от соответствующей категории.
     * @default 0
     */
    /* Percents of the corresponding category */
    value?: number;
    /**
     * @name Controls/progress:IIndicatorCategory#className
     * @cfg {String} Имя css-класса, который будет применяться к секторам этой категории. Если не указано, будет использоваться цвет по умолчанию.
     * @default ''
     */
    /* Name of css class, that will be applied to sectors of this category.
    If not specified, default color will be used */
    className?: string;
    /**
     * @name Controls/progress:IIndicatorCategory#title
     * @cfg {String} Название категории. Используется в {@link Controls/progress:Legend}
     * @default ''
     */
    /* category note */
    title?: string;

    /**
     * @name Controls/progress:IIndicatorCategory#tooltip
     * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении указателя мыши на категорию. Используется в {@link Controls/progress:StateIndicator}
     */
    tooltip?: string;
}

/**
 * Интерфейс опций для {@link Controls/progress:StateIndicator}.
 * @interface Controls/progress:IStateIndicator
 * @public
 */
export interface IStateIndicatorOptions
    extends IControlProps,
        React.HTMLAttributes<HTMLDivElement>,
        TInternalProps {
    /**
     * @name Controls/progress:IStateIndicator#scale
     * @cfg {Number} Определяет размер (процентное значение) одного сектора диаграммы.
     * @remark
     * Положительное число до 100.
     * @example
     * Шкала из 5 установит индикатор с 20-ю секторами.
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:StateIndicator scale="{{5}}"/>
     * </pre>
     */

    /*
     * @name Controls/progress:IStateIndicator#scale
     * @cfg {Number} Defines percent count shown by each sector.
     * @remark
     * A positive number up to 100.
     * @example
     * Scale of 5 will set indicator with 20 sectors
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:StateIndicator scale="{{5}}"/>
     * </pre>
     */
    scale?: number;
    /**
     * @name Controls/progress:IStateIndicator#data
     * @cfg {Array.<Controls/progress:IIndicatorCategory>} Массив категорий диаграммы.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.progress:StateIndicator data="{{[{value: 10, className: '', title: 'done'}]}}"/>
     * </pre>
     * @remark
     * Используется, если для диаграммы нужно установить несколько категорий. Количество элементов массива задает количество категорий диаграммы.
     */

    /*
     * @name Controls/progress:IStateIndicator#data
     * @cfg {Array.<Controls/progress:IIndicatorCategory>} Array of indicator categories
     * @example
     * <pre class="brush:html">
     * <!-- WML -->
     * <Controls.progress:StateIndicator data="{{[{value: 10, className: '', title: 'done'}]}}"/>
     * </pre>
     */
    data?: IIndicatorCategory[];
    sectorSize?: 's' | 'm' | 'l';
    horizontalPadding?: 'xs' | 'null';
}

/**
 * Диаграмма состояния процесса.
 * Позволяет получить наглядную информацию по состоянию выполнения некоторого процесса в разрезе нескольких категорий.
 *
 * @class Controls/_progress/StateIndicator
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2fprogress%2fStateIndicator%2fIndex демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_progress.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/progress:IStateIndicator
 *
 * @public
 * @demo Controls-demo/progress/StateIndicator/Base/Index
 */

/*
 * Progress state indicator
 * {@link /materials/DemoStand/app/Controls-demo%2fprogress%2fStateIndicator%2fIndex демо-пример}.
 * @class Controls/_progress/StateIndicator
 * @extends UI/Base:Control
 * @author Мочалов М.А.
 *
 * @public
 * @demo Controls-demo/progress/StateIndicator/Base/Index.ts
 */
export default class StateIndicator extends React.Component<IStateIndicatorOptions> {
    private _colorState: number[];
    private _colors: string[];
    private _numSectors: number = 10;
    private _percentageDifferences: number[] = [];

    private _checkData(
        data: IIndicatorCategory[],
        props: IStateIndicatorOptions
    ): void {
        Utils.isNumeric(props.scale, 'StateIndicator', 'Scale');
        Utils.isValueInRange(
            props.scale,
            1,
            maxPercentValue,
            'StateIndicator',
            'Scale'
        );
        Utils.isSumInRange(data, maxPercentValue, 'StateIndicator');
    }

    private _setColors(data: IIndicatorCategory[]): string[] {
        const colors: string[] = [];
        for (let i = 0; i < data.length; i++) {
            colors[i] = data[i].className
                ? data[i].className
                : defaultColors[i]
                ? defaultColors[i]
                : '';
        }
        return colors;
    }

    private _calculateColorState(
        props: IStateIndicatorOptions,
        data: IIndicatorCategory[],
        _colors: string[],
        _numSectors: number
    ): number[] {
        const colorValues = [];
        let correctScale: number = props.scale;
        let curSector = 0;
        let totalSectorsUsed = 0;
        let maxSectorsPerValue = 0;
        let longestValueStart;
        let itemValue;
        let itemNumSectors;
        let excess;
        this._percentageDifferences = [];

        if (!Utils.isValueInRange(props.scale, 1, maxPercentValue)) {
            correctScale = defaultScaleValue;
        }
        for (let i = 0; i < Math.min(data.length); i++) {
            // do not draw more colors, than we know
            if (i < _colors.length) {
                // convert to number, ignore negative ones
                itemValue = Math.max(0, +data[i].value || 0);
                itemNumSectors = Math.floor(itemValue / correctScale);
                const percentageDeviation =
                    itemValue - correctScale * itemNumSectors;
                this._percentageDifferences.push(percentageDeviation);
                if (itemValue > 0 && itemNumSectors === 0) {
                    // if state value is positive and corresponding sector number is 0, increase it by 1 (look specification)
                    itemNumSectors = 1;
                }
                if (itemNumSectors > maxSectorsPerValue) {
                    longestValueStart = curSector;
                    maxSectorsPerValue = itemNumSectors;
                }
                totalSectorsUsed += itemNumSectors;
                for (let j = 0; j < itemNumSectors; j++) {
                    colorValues[curSector++] = i + 1;
                }
            }
        }
        // if we count more sectors, than we have in indicator, trim the longest value
        if (totalSectorsUsed > _numSectors) {
            excess = totalSectorsUsed - _numSectors;
            totalSectorsUsed -= excess;
            colorValues.splice(longestValueStart, excess);
        }
        let sum: number = 0;
        data.forEach((item) => {
            sum += item.value;
        });
        // Если сумма значений равна 100%, но при этом мы получили меньше секторов, то будем
        // прибавлять сектор к такому элементу, у которого процентное отклонение больше остальных.
        if (totalSectorsUsed < _numSectors && sum === maxPercentValue) {
            while (totalSectorsUsed !== _numSectors) {
                this._normalizeSelector(colorValues, correctScale);
                totalSectorsUsed++;
            }
        } else if (
            sum !== maxPercentValue &&
            totalSectorsUsed === _numSectors
        ) {
            // При округлении в расчетах может быть ситуация, когда все сектора заполнены,
            // но сумма не равна максимальной, в этом случае 1 сектор оставляем пустым
            colorValues.splice(longestValueStart, 1);
        } else {
            const normalSectorCount = Math.floor(_numSectors/(maxPercentValue/sum));
            if (totalSectorsUsed < normalSectorCount) {
                while (totalSectorsUsed !== normalSectorCount) {
                    this._normalizeSelector(colorValues, correctScale);
                    totalSectorsUsed++;
                }
            }
        }
        return colorValues;
    }

    private _normalizeSelector(colorValues: unknown[], correctScale: number) {
        const maxDeviationIndex =
            this._getMaxPercentageDeviationIndex();
        colorValues.splice(
            colorValues.indexOf(maxDeviationIndex + 1),
            0,
            maxDeviationIndex + 1
        );
        this._percentageDifferences[maxDeviationIndex] -= correctScale;
    }

    private _getMaxPercentageDeviationIndex(): number {
        let maxDeviation = this._percentageDifferences[0];
        let maxDeviationIndex = 0;
        for (let i = 1; i < this._percentageDifferences.length; i++) {
            if (this._percentageDifferences[i] > maxDeviation) {
                maxDeviation = this._percentageDifferences[i];
                maxDeviationIndex = i;
            }
        }
        return maxDeviationIndex;
    }

    private _applyNewState(props: IStateIndicatorOptions): void {
        const data = props.data || defaultData;
        let correctScale: number = props.scale;

        this._checkData(data, props);
        if (!Utils.isValueInRange(props.scale, 1, maxPercentValue)) {
            correctScale = defaultScaleValue;
        }
        this._numSectors = Math.floor(maxPercentValue / correctScale);
        this._colors = this._setColors(data);
        this._colorState = this._calculateColorState(
            props,
            data,
            this._colors,
            this._numSectors
        );
    }

    protected _mouseEnterIndicatorHandler(e: React.MouseEvent): void {
        if (this.props.onItementer) {
            this.props.onItementer(e, e.target);
        }
    }

    protected constructor(props: IStateIndicatorOptions) {
        super(props);
        this._applyNewState(props);
        this._mouseEnterIndicatorHandler =
            this._mouseEnterIndicatorHandler.bind(this);
    }

    protected shouldComponentUpdate(props: IStateIndicatorOptions): boolean {
        if (
            props.data !== this.props.data ||
            props.scale !== this.props.scale
        ) {
            this._applyNewState(props);
        }

        return true;
    }

    render(): React.ReactElement {
        const attrs = this.props.attrs
            ? wasabyAttrsToReactDom(this.props.attrs) || {}
            : {};
        const contentData = [];

        for (let i = 0; i < this._numSectors; i++) {
            const className =
                'controls-StateIndicator__box' +
                ` ${
                    this._colorState[i]
                        ? this._colors[this._colorState[i] - 1]
                        : 'controls-StateIndicator__emptySector'
                }` +
                ` ${
                    this._colorState[i]
                        ? this._colors[this._colorState[i] - 1]
                        : 'controls-StateIndicator__emptySector'
                }` +
                ` controls-StateIndicator__box_sectorSize-${this.props.sectorSize}`;

            contentData.push(
                <span
                    className={className}
                    data-item={this._colorState[i] ? this._colorState[i] : -1}
                    title={
                        this.props.data[this._colorState[i] - 1]?.tooltip
                    }
                    key={i}
                    onMouseEnter={this._mouseEnterIndicatorHandler}
                ></span>
            );
        }

        return (
            <div
                {...attrs}
                ref={this.props.forwardedRef}
                className={this.props.className || attrs.className || ''}
                onClick={this.props.onClick}
                onTouchStart={this.props.onTouchStart}
                onMouseLeave={this.props.onMouseLeave}
                onMouseMove={this.props.onMouseMove}
            >
                <span
                    className={`controls-StateIndicator controls-StateIndicator_padding-${this.props.horizontalPadding}`}
                >
                    {contentData}
                </span>
            </div>
        );
    }

    static defaultProps: Partial<IStateIndicatorOptions> = {
        theme: 'default',
        scale: 10,
        data: null,
        sectorSize: 'l',
        horizontalPadding: 'xs',
    };
}

/**
 * @name Controls/_progress/StateIndicator#sectorSize
 * @cfg {String} Размер одного сектора диаграммы.
 * @variant s
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/progress/StateIndicator/SectorSize/Index
 */

/**
 * @name Controls/_progress/StateIndicator#itemEnter
 * @event Происходит при наведении курсора мыши на диаграмму.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Node} target Элемент, на котоорый навели курсор мыши
 */

/**
 * @name Controls/_progress/StateIndicator#horizontalPadding
 * @cfg {string} Определяет размер отступов контрола по горизонтали.
 * @variant xs
 * @variant null
 * @default xs
 */

/*
 * @event Occurs when mouse enters sectors of indicator
 * @name Controls/_progress/StateIndicator#itemEnter
 * @param {UI/Events:SyntheticEvent} eventObject event descriptor.
 *
 */

import * as template from 'wml!Controls-Wizard/_vertical/Layout/Layout';
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import IStep from '../IStep';
import {
    PROGRESSBAR_ITEM_STYLE,
    ILayoutOptions,
    IVerticalItem,
    MARKER_SIZES,
    MarkerViewMode,
} from 'Controls-Wizard/_vertical/ILayout';
import { TKey } from 'Controls/interface';
import 'css!Controls-Wizard/vertical';

enum STEP_STATUS {
    ACTIVE = 'active',
    FUTURE = 'future',
    COMPLETED = 'completed',
}

/**
 * Контрол для отображения процесса, состоящего из нескольких шагов.
 * @remark
 * * {@link /doc/platform/developmentapl/interface-development/controls/navigation/master/#vertical-layout Руководство разработчика}
 * @markdown
 * @extends UI/Base:Control
 * @implements Controls-Wizard/vertical:ILayout
 * @public
 * @demo Controls-Wizard-demo/demoVertical2/VerticalWithStack
 */
export default class Layout extends Control<ILayoutOptions> implements IStep {
    protected _template: TemplateFunction = template;
    readonly '[Controls-Wizard/IStep]': boolean = true;
    protected TITLE_COLOR_STYLE: object = {
        active: 'primary',
        future: 'default',
        completed: 'label',
    };
    protected selectedStepIndex: number;
    protected _maxSelectedIndex: number = 0;
    protected _markerSize: MARKER_SIZES;
    protected _dataOptions: Record<TKey, unknown>;
    protected _getDataOptionsCallback: Function;

    protected _beforeMount(options?: ILayoutOptions): void {
        this._getDataOptionsCallback = this._getConfigResults.bind(this);
        this._maxSelectedIndex = options.selectedStepIndex;
        this._updateMarkerSize(options);
        if (options._dataOptionsValue) {
            this._dataOptions = this._getDataOptions(options);
        }
    }

    protected _beforeUpdate(options?: ILayoutOptions): void {
        if (
            options.selectedStepIndex > this._maxSelectedIndex ||
            options.items !== this._options.items
        ) {
            this._maxSelectedIndex = options.selectedStepIndex;
        }
        this._updateMarkerSize(options);

        if (options.selectedStepIndex !== this._options.selectedStepIndex) {
            if (options._dataOptionsValue) {
                if (!!options._dataOptionsValue.results[options.selectedStepIndex]) {
                    this._dataOptions = this._getDataOptions(options);
                } else {
                    const loadResult = options._dataOptionsValue.load(
                        options._dataOptionsValue,
                        options.selectedStepIndex.toString()
                    );
                    if (loadResult instanceof Promise) {
                        loadResult.then((config) => {
                            this._dataOptions = config.results[options.selectedStepIndex] as Record<
                                TKey,
                                unknown
                            >;
                        });
                    } else {
                        this._dataOptions = options._dataOptionsValue.results[
                            options.selectedStepIndex
                        ] as Record<TKey, unknown>;
                    }
                }
            }
        }
    }

    protected _isFirstOnFeature(stepIndex: number): boolean {
        return this._options.selectedStepIndex + 1 === stepIndex;
    }

    protected _isLast(stepIndex: number): boolean {
        return stepIndex === this._options.items.length;
    }

    protected _getConfigResults(selectedIndex: number): object {
        return this._options._dataOptionsValue.results[selectedIndex] as object;
    }

    protected clickHandler(event: SyntheticEvent<MouseEvent>, index: number): void {
        this._notify('selectedStepIndexChanged', [index]);
    }

    protected getItemStatus(stepIndex: number): string {
        return Layout.getStepStatus(stepIndex, this._options.selectedStepIndex);
    }

    protected _getItemBackgroundStyle(item: IVerticalItem, stepStatus: STEP_STATUS): string {
        if (this._options.itemBackgroundStyle) {
            return this._options.itemBackgroundStyle[stepStatus] || 'default';
        } else if (item.contrastBackground && stepStatus === STEP_STATUS.ACTIVE) {
            return item.contrastBackground ? 'contrast' : 'notContrast';
        } else if (item.contrastBackgroundCompleted && stepStatus === STEP_STATUS.COMPLETED) {
            return item.contrastBackgroundCompleted ? 'contrast' : 'notContrast';
        }
    }

    protected _getTitleFontColorStyle(item: IVerticalItem, stepStatus: STEP_STATUS): string {
        let fontColorStyle = this.TITLE_COLOR_STYLE[stepStatus];
        if (stepStatus === STEP_STATUS.FUTURE) {
            fontColorStyle = 'readonly';
        } else if (stepStatus === STEP_STATUS.COMPLETED) {
            fontColorStyle =
                item.titleFontColorStyleCompleted || this.TITLE_COLOR_STYLE[stepStatus];
        }
        return fontColorStyle;
    }

    protected getProgressbarItemStatus(stepIndex: number, item: IVerticalItem): string {
        let itemStatus = Layout.getStepStatus(stepIndex, this._options.selectedStepIndex);

        const itemStatusFromCfg =
            item.progressbarItemStyle && item.progressbarItemStyle[itemStatus];
        if (itemStatusFromCfg && itemStatusFromCfg !== PROGRESSBAR_ITEM_STYLE.DEFAULT) {
            itemStatus = itemStatusFromCfg;
        }
        return itemStatus;
    }

    protected _shouldLoadInAsync(template: string | TemplateFunction): boolean {
        return typeof template === 'string';
    }

    protected _updateMarkerSize(options: ILayoutOptions): void {
        if (options.markerSize === MARKER_SIZES.DEFAULT) {
            const amountOfItems = 9;
            this._markerSize =
                options.items.length > amountOfItems ? MARKER_SIZES.M : MARKER_SIZES.S;
        } else {
            this._markerSize = options.markerSize;
        }
    }

    private _getDataOptions(options: ILayoutOptions): Record<TKey, unknown> {
        return options._dataOptionsValue?.results?.[options.selectedStepIndex] as Record<
            TKey,
            unknown
        >;
    }

    static defaultProps: Partial<ILayoutOptions> = {
        markerSize: MARKER_SIZES.DEFAULT,
        progressbarVisible: false,
        completedStepsIndexVisible: false,
        markerViewMode: MarkerViewMode.Arrow,
        leftPadding: true,
        itemBackgroundStyle: {
            active: 'default',
            completed: 'default',
            future: 'notContrast',
        },
        mode: 'edit',
        blockLayout: true,
    };

    /**
     * Функция возвращает текущее состояние шага в зависимости от отображаемого шага
     * @param {number} stepIndex
     * @param {number} selectedStepIndex
     * @returns {string}
     */
    protected static getStepStatus(stepIndex: number, selectedStepIndex: number): string {
        let stepStatus: string;

        if (stepIndex === selectedStepIndex) {
            stepStatus = 'active';
        } else if (stepIndex > selectedStepIndex) {
            stepStatus = 'future';
        } else if (stepIndex < selectedStepIndex) {
            stepStatus = 'completed';
        }

        return stepStatus;
    }
}

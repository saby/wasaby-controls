/**
 * @module
 * @public
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating/Smiles/Smiles';
import {getItemMargin, getItemSelected, IItem, IHash} from './utils/calcFunction';
import 'css!Controls-rating/Smiles';

/**
 *
 */
export type TSmilesIconSize = 'm' | 'l';

/**
 *
 */
export type TSmilesValue = 1 | 2 | 3;

/**
 * @public
 */
export interface ISmilesOptions extends IControlOptions {
    /**
     * Текущее значение рейтинга.
     * @remark Может принимать значение от 1 до 3.
     */
    value: TSmilesValue;
    /**
     * Размер иконок рейтинга.
     * @demo Controls-rating-demo/Smiles/IconSize/Index
     * @default m
     */
    iconSize: TSmilesIconSize;
}

const BASE_RATING: IHash = {
    smile: 3,
    neutral: 2,
    annoyed: 1,
};

/**
 * Компонент рейтинга, состоящий из иконок 'Смайлики'.
 * @demo Controls-rating-demo/Smiles/Index
 * @public
 */
export default class Smiles extends Control<ISmilesOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedValue: number;
    protected _configuration: IItem[] = [
        {
            name: 'smile',
            icon: 'EmoiconSmile',
            color: 'success',
        },
        {
            name: 'neutral',
            icon: 'EmoiconNeutral',
            color: 'warning',
        },
        {
            name: 'annoyed',
            icon: 'EmoiconAnnoyed',
            color: 'danger',
        },
    ];

    /**
     * Конструктор класса
     */
    constructor(options: ISmilesOptions, context?: object) {
        super(options, context);
    }

    protected _beforeMount(options: ISmilesOptions): void {
        this._selectedValue = options.value;
    }

    protected _beforeUpdate(options: ISmilesOptions): void {
        if (options.value !== this._options.value) {
            this._selectedValue = options.value;
        }
    }

    protected _getItemMargin(): string {
        return getItemMargin(this._options.iconSize);
    }

    protected _getItemSelected(item: IItem): string {
        return getItemSelected(this._selectedValue, item, BASE_RATING);
    }

    protected _mouseClickHandler(_: Event, type: string): void {
        const currentClickItemRating = BASE_RATING[type];
        if (this._selectedValue !== currentClickItemRating) {
            this._notify('valueChanged', [currentClickItemRating], {
                bubbling: true,
            });
        }
    }

    static defaultProps: Partial<ISmilesOptions> = {
        iconSize: 'm',
    };
}

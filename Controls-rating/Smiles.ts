import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating/Smiles/Smiles';
import { getItemMargin, getItemSelected, IItem } from './utils/calcFunction';
import 'css!Controls-rating/Smiles';

interface ISmilesOptions extends IControlOptions {
    /**
     * @name Controls-rating/Smiles#value
     * @cfg {Number|Null} Текущее значение рейтинга.
     * @remark Может принимать значение от 1 до 3.
     */
    value: TSmilesValue | null;
    /**
     * @name Controls-rating/Smiles#iconSize
     * @cfg {String} Размер иконок рейтинга.
     * @demo Controls-rating-demo/Smiles/IconSize/Index
     * @variant m
     * @variant l
     * @default m
     */
    iconSize: 'm' | 'l';
}

export type TSmilesValue = 1 | 2 | 3;

const BASE_RATING = {
    smile: 3,
    neutral: 2,
    annoyed: 1,
};

/**
 * Компонент рейтинга, состоящий из иконок 'Смайлики'.
 * @class Controls-rating/Smiles
 * @extends UI/Base:Control
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

    protected _mouseClickHandler(event: Event, type: string): void {
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

import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating/Thumbs/Thumbs';
import { getItemMargin, getItemSelected, IItem } from './utils/calcFunction';
import 'css!Controls-rating/Thumbs';

interface IThumbsOptions extends IControlOptions {
    /**
     * @name Controls-rating/Thumbs#value
     * @cfg {Number|Null} Текущее значение рейтинга.
     * @remark Может принимать значение от 1 до 2.
     */
    value: TThumbsValue | null;
    /**
     * @name Controls-rating/Thumbs#iconSize
     * @cfg {String} Размер иконок рейтинга.
     * @demo Controls-rating-demo/Thumbs/IconSize/Index
     * @variant m
     * @variant l
     * @default m
     */
    iconSize: 'm' | 'l';
}

export type TThumbsValue = 1 | 2;

const BASE_RATING = {
    thumbUp: 2,
    thumbDown: 1,
};

/**
 * Компонент рейтинга, состоящий из иконок 'большие пальцы'.
 * @class Controls-rating/Thumbs
 * @extends UI/Base:Control
 * @demo Controls-rating-demo/Thumbs/Index
 * @public
 */

export default class Thumbs extends Control<IThumbsOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedValue: number;
    protected _configuration: IItem[] = [
        {
            name: 'thumbUp',
            icon: 'ThumbUp2',
            color: 'success',
        },
        {
            name: 'thumbDown',
            icon: 'ThumbDownBig',
            color: 'danger',
        },
    ];

    protected _beforeMount(options: IThumbsOptions): void {
        this._selectedValue = options.value;
    }

    protected _beforeUpdate(options: IThumbsOptions): void {
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

    static defaultProps: Partial<IThumbsOptions> = {
        iconSize: 'm',
    };
}

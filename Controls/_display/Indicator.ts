/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import * as React from 'react';
import CollectionItem, {
    IOptions as ICollectionOptions,
} from './CollectionItem';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';

export type TIndicatorPosition = 'top' | 'bottom' | 'global';
export type TIndicatorState =
    | 'portioned-search'
    | 'continue-search'
    | 'loading'
    | 'hidden-loading';
export type TIndicatorSelector = 'js-controls-BaseControl__loadingIndicator';
export const IndicatorSelector: TIndicatorSelector =
    'js-controls-BaseControl__loadingIndicator';

export enum EIndicatorState {
    PortionedSearch = 'portioned-search',
    ContinueSearch = 'continue-search',
    Loading = 'loading',
    HiddenLoading = 'hidden-loading',
}

export interface IOptions extends ICollectionOptions<null> {
    position: TIndicatorPosition;
    state: TIndicatorState;
    visible: boolean;
    portionedSearchTemplate: TemplateFunction | string;
    continueSearchTemplate: TemplateFunction | string;
    loadingIndicatorTemplate: TemplateFunction | string;
}

export default class Indicator extends CollectionItem<null> {
    get Markable(): boolean {
        return false;
    }
    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly DisplaySearchValue: boolean = false;

    protected _$position: TIndicatorPosition;
    protected _$state: TIndicatorState;
    protected _$visible: boolean;
    /**
     * Вертикальная позиция глобального индикатора
     * @protected
     */
    protected _topOffset: number = 0;

    protected _$loadingIndicatorTemplate: TemplateFunction | string;
    protected _$portionedSearchTemplate: TemplateFunction | string;
    protected _$continueSearchTemplate: TemplateFunction | string;
    private _metaData: { results?: Model };

    get key(): string {
        return `${this._$state}-` + this._$position + this._instancePrefix;
    }

    readonly listElementName: string = 'indicator';

    display(state: TIndicatorState, topOffset?: number): boolean {
        const isHidden = !this._$visible;
        if (isHidden) {
            this._$visible = true;
        }

        const stateChanged = this._$state !== state;
        if (stateChanged) {
            this._$state = state;
        }

        if (topOffset !== undefined && this._topOffset !== topOffset) {
            this._topOffset = topOffset;
        }

        if (isHidden || stateChanged) {
            this._nextVersion();
        }

        return isHidden || stateChanged;
    }

    hide(): boolean {
        const isVisible = this._$visible;
        if (isVisible) {
            this._$visible = false;
            this._nextVersion();
        }
        return isVisible;
    }

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return 'Controls/baseList:IndicatorTemplate';
    }

    getContentTemplate(): TemplateFunction | string | void {
        switch (this._$state) {
            case 'loading':
            case 'hidden-loading':
                return this._$loadingIndicatorTemplate;
            case 'portioned-search':
                return this._$portionedSearchTemplate;
            case 'continue-search':
                return this._$continueSearchTemplate;
        }
    }

    getClasses(): string {
        let classes = `controls-BaseControl__loadingIndicator ${IndicatorSelector}`;
        classes += ` controls-BaseControl__loadingIndicator-${this._$position}`;

        switch (this._$state) {
            case 'hidden-loading':
            case 'loading':
                classes += ` controls-BaseControl__loadingIndicator__position-${this._$position}`;
                classes += ` controls-BaseControl__loadingIndicator__state-${this._$state}`;
                break;
            case 'portioned-search':
                classes += ` ${this._getPortionedSearchClasses()}`;
                break;
            case 'continue-search':
                classes += ' controls-BaseControl__continueSearch';
                classes += ` controls-BaseControl__continueSearch__state-${this._$position}`;
                break;
        }

        return classes;
    }

    getStyles(): React.CSSProperties {
        const styles: React.CSSProperties = {};
        if (!this._$visible) {
            styles.display = 'none';
        }
        if (this.isGlobalIndicator()) {
            styles.top = `${this._topOffset}px`;
        }

        return styles;
    }

    getState(): TIndicatorState {
        return this._$state;
    }

    getPosition(): TIndicatorPosition {
        return this._$position;
    }

    isTopIndicator(): boolean {
        return this._$position === 'top';
    }

    isBottomIndicator(): boolean {
        return this._$position === 'bottom';
    }

    isGlobalIndicator(): boolean {
        return this._$position === 'global';
    }

    isDisplayed(): boolean {
        return this._$visible;
    }

    /**
     * Перерисовывает индикатор.
     * В темплейтах Порционного поиска и Продолжить поиск, могут задать footerTemplate, в котором выводят доп информацию.
     * Обычно это используют для отрисовки кол-ва уже просмотренных данных, которые лежат в метаДанных.
     * Поэтому нам нужно перерисоваться при изменении метаДанных.
     */
    setMetaData(metaData: { results?: Model }): void {
        if (
            this.isDisplayed() &&
            (this._$state === 'portioned-search' ||
                this._$state === 'continue-search')
        ) {
            this._metaData = metaData;
            this._nextVersion();
        }
    }

    protected _getPortionedSearchClasses(): string {
        return `controls-BaseControl__portionedSearch controls-BaseControl__portionedSearch__state-${this._$position}`;
    }
}

Object.assign(Indicator.prototype, {
    'Controls/display:Indicator': true,
    _moduleName: 'Controls/display:Indicator',
    _instancePrefix: '-indicator',
    _$position: null,
    _$state: null,
    _$visible: false,
    _$portionedSearchTemplate: 'Controls/baseList:IterativeLoadingTemplate',
    _$continueSearchTemplate: 'Controls/baseList:ContinueSearchTemplate',
    _$loadingIndicatorTemplate: 'Controls/baseList:LoadingIndicatorTemplate',
});

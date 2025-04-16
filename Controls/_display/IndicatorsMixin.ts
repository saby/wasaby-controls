/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import Indicator, {
    EIndicatorState,
    IOptions as ILoadingIndicatorOptions,
    TIndicatorPosition,
    TIndicatorState,
} from './Indicator';
import { TemplateFunction } from 'UI/Base';

export default abstract class IndicatorsMixin<T extends Indicator = Indicator> {
    private _indicatorModule: string;

    protected _topIndicator: T = null;
    protected _bottomIndicator: T = null;
    protected _globalIndicator: T = null;

    protected _$portionedSearchTemplate: TemplateFunction | string;
    protected _$continueSearchTemplate: TemplateFunction | string;
    protected _$loadingIndicatorTemplate: TemplateFunction | string;

    hasIndicator(position: TIndicatorPosition): boolean {
        return !!this._getIndicator(position);
    }

    setLoadingIndicatorTemplate(
        loadingIndicatorTemplate: TemplateFunction | string,
        top: boolean,
        bottom: boolean
    ): void {
        if (this._$loadingIndicatorTemplate !== loadingIndicatorTemplate) {
            this._$loadingIndicatorTemplate = loadingIndicatorTemplate;

            if (this._bottomIndicator && bottom)
                this._bottomIndicator.updateLoadingIndicator(this._$loadingIndicatorTemplate);
            if (this._topIndicator && top)
                this._topIndicator.updateLoadingIndicator(this._$loadingIndicatorTemplate);
            this._nextVersion();
        }
    }

    setPortionedSearchTemplate(
        portionedSearchTemplate: TemplateFunction | string,
        top: boolean,
        bottom: boolean
    ): void {
        if (this._$portionedSearchTemplate !== portionedSearchTemplate) {
            this._$portionedSearchTemplate = portionedSearchTemplate;

            if (this._bottomIndicator && bottom)
                this._bottomIndicator.updatePortionedSearch(this._$portionedSearchTemplate);
            if (this._topIndicator && top)
                this._topIndicator.updatePortionedSearch(this._$portionedSearchTemplate);
            this._nextVersion();
        }
    }

    setContinueSearchTemplate(
        continueSearchTemplate: TemplateFunction | string,
        top: boolean,
        bottom: boolean
    ): void {
        if (this._$continueSearchTemplate !== continueSearchTemplate) {
            this._$continueSearchTemplate = continueSearchTemplate;

            if (this._bottomIndicator && bottom)
                this._bottomIndicator.updateContinueSearch(this._$continueSearchTemplate);
            if (this._topIndicator && top)
                this._topIndicator.updateContinueSearch(this._$continueSearchTemplate);
            this._nextVersion();
        }
    }

    getGlobalIndicator(): T {
        return this._globalIndicator;
    }

    getTopIndicator(): T {
        if (!this._topIndicator) {
            // сразу создаем верхний индикатор, он отображается с помощью display: none
            // это сделано только для того, чтобы можно было показывать индикатор при долгой отрисовке
            this._createIndicator('top', EIndicatorState.Loading);
        }
        return this._topIndicator;
    }

    getBottomIndicator(): T {
        if (!this._bottomIndicator) {
            // сразу создаем верхний индикатор, он отображается с помощью display: none
            // это сделано только для того, чтобы можно было показывать индикатор при долгой отрисовке
            this._createIndicator('bottom', EIndicatorState.Loading);
        }
        return this._bottomIndicator;
    }

    displayIndicator(
        position: TIndicatorPosition,
        state: TIndicatorState,
        topOffset?: number
    ): void {
        let indicator = this._getIndicator(position);
        if (indicator) {
            const changed = indicator.display(state, topOffset);
            if (changed) {
                this.notifyItemChange(indicator, 'displayIndicator');
                this._nextVersion();
            }
        } else {
            indicator = this._createIndicator(position, state);
            indicator.display(state, topOffset);
            this.notifyItemChange(indicator, 'displayIndicator');
            this._nextVersion();
        }
    }

    hideIndicator(position: TIndicatorPosition): void {
        const indicator = this._getIndicator(position);
        if (indicator) {
            if (position === 'global') {
                const indicatorName = this._getIndicatorName(position);
                this[indicatorName] = null;
                this.notifyItemChange(indicator, 'hideIndicator');
                this._nextVersion();
            } else {
                const changed = indicator.hide();
                if (changed) {
                    this.notifyItemChange(indicator, 'hideIndicator');
                    this._nextVersion();
                }
            }
        }
    }

    private _getIndicatorName(position: TIndicatorPosition): string {
        // Добавлять тут исключение - стрелять себе в ногу.
        // На сервере в принципе не должно быть обращения с индикатором.
        // Пока этого нет - всегда будет валиться ошибка.
        // https://online.sbis.ru/opendoc.html?guid=e6e28b8f-03c1-493c-a24b-d3ff5eed5436
        if (position === undefined) {
            return '';
        }

        return `_${position}Indicator`;
    }

    private _getIndicator(position: TIndicatorPosition): T {
        const indicatorName = this._getIndicatorName(position);
        return this[indicatorName];
    }

    private _createIndicator(position: TIndicatorPosition, state: TIndicatorState): T {
        const indicator = this.createItem({
            itemModule: this._indicatorModule,
            position,
            state,
            // только глобальный индикатор изначально показан, т.к. он при показе - создается, при скрытии - удаляется
            visible: position === 'global',
            portionedSearchTemplate: this._$portionedSearchTemplate,
            continueSearchTemplate: this._$continueSearchTemplate,
            loadingIndicatorTemplate: this._$loadingIndicatorTemplate,
        });

        const indicatorName = this._getIndicatorName(position);
        this[indicatorName] = indicator;
        return indicator;
    }

    abstract createItem(options: ILoadingIndicatorOptions): T;
    protected abstract notifyItemChange(item: T, properties: string): void;
    protected abstract _nextVersion(): void;
}

Object.assign(IndicatorsMixin.prototype, {
    'Controls/display:IndicatorsMixin': true,
    _indicatorModule: 'Controls/display:Indicator',
    _topIndicator: null,
    _bottomIndicator: null,
    _globalIndicator: null,
    _$portionedSearchTemplate: 'Controls/baseList:IterativeLoadingTemplate',
    _$continueSearchTemplate: 'Controls/baseList:ContinueSearchTemplate',
    _$loadingIndicatorTemplate: 'Controls/baseList:LoadingIndicatorTemplate',
});

/**
 * @kaizen_zone 0dfd0836-1f3e-405a-8fe0-cae88ef1bc44
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls-Graphs/_base/HighChartsLight/HighChartsLight');
import * as locales from 'Core/helpers/i18n/locales';
import cClone = require('Core/core-clone');
import cMerge = require('Core/core-merge');
import { detection, constants } from 'Env/Env';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import rk = require('i18n!Graphs');
import { throttle } from 'Types/function';
import 'css!Controls-Graphs/base';
import { LocalStorageNative } from 'Browser/Storage';
import IHighChartsBaseOptions from '../interfaces/IHighChartsBaseOptions';
import { IChartOptions } from '../interfaces/IChartOptions';

/**
 * Интерфейс инстансов диаграмм HighCharts.
 * @private
 */
export interface IChartInstance {
    reflow(): Function;
    update(config: object): Function;
    destroy(): Function;
}

interface ILocaleStorageParamsForGraphs {
    enabled?: boolean;
    animation?: boolean;
}

const UNIQ_KEY_FOR_GRAPHS = 'graphs';

export const getLocaleStorageParams = (): ILocaleStorageParamsForGraphs => {
    let result;
    try {
        result = JSON.parse(LocalStorageNative.getItem(UNIQ_KEY_FOR_GRAPHS)) || {};
    } catch (e) {
        result = {};
    }
    return result;
};

type THighChartsMethodArg = string | boolean | object | Function | number;

interface IOptions extends IControlOptions, IHighChartsBaseOptions {
    onRenderToChart?: Function;
}

const REFLOW_DELAY = 200;

const HIGH_CHARTS_VERSION = '9.0.1.1';

interface IHighCharts {
    setOptions: Function;
    Chart: new (...args: string[]) => IChartInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: any;
}

function getHighCharts(): Promise<IHighCharts> {
    return import(`browser!/cdn/Highcharts/${HIGH_CHARTS_VERSION}/highcharts.js`);
}

function getHighChartsMore(): Promise<object> {
    return import(`browser!/cdn/Highcharts/${HIGH_CHARTS_VERSION}/highcharts-more.js`);
}

/**
 * Загрузить модуль для отрисовки графика Воронка
 */
function getHighChartsFunnel(): Promise<object> {
    return getHighChartsModule('funnel');
}

/**
 * Загрузить модуль для отрисовки графика Sunburst
 */
function getHighChartsFlame(): Promise<object> {
    return getHighChartsModule('sunburst');
}

/**
 * Загрузить модуль для отрисовки графов
 */
function getHighChartsNetworkGraph(): Promise<object> {
    return getHighChartsModule('networkgraph');
}

/**
 * Загрузить модуль, который добавляет опции для установки закругленных углов
 * на гистограммах и столбчатых диаграммах
 */
function getHighChartsRoundedCorners(): Promise<object> {
    return getHighChartsModule('rounded-corners');
}

/**
 * Загрузить произвольный модуль Highcharts
 * @param moduleName Имя модуля
 */
function getHighChartsModule(moduleName: string): Promise<object> {
    return import(`browser!/cdn/Highcharts/${HIGH_CHARTS_VERSION}/modules/${moduleName}.js`);
}

export async function getHighChartsTrendline(): Promise<object> {
    const indicators = await import(
        `browser!/cdn/Highcharts/${HIGH_CHARTS_VERSION}/modules/stock/indicators/indicators.js`
    );
    const trendline = await import(
        `browser!/cdn/Highcharts/${HIGH_CHARTS_VERSION}/modules/stock/indicators/trendline.js`
    );
    return {
        indicators,
        trendline,
    };
}

/**
 * Компонент для отображения графиков с помощью библиотеки HighCharts.
 * @remark
 * По умолчанию в компоненте выключена анимация для первой отрисовки графика.
 * Для включения анимации настройте параметры chart.animation и plotOptions.series.animation через опцию chartOptions.
 * @extends UI/Base
 * @control
 * @public
 * @implements Controls-Graphs/interfaces/IHighChartsBase
 * @demo Engine-demo/Graphs/HighChartsLight/Index
 */

export default class HighChartsLight extends Control<IOptions> {
    readonly '[Graphs/interfaces/IHighChartsLight]': boolean;

    readonly _template: TemplateFunction = template;
    private _chartInstance: IChartInstance;
    private _isControlDestroyed: boolean = false;
    private _delayedCallbacks: Function[] = [];
    protected _resizeObserver: ResizeObserverUtil;
    private _throttledReflow: Function = throttle(
        () => {
            return this._reflow();
        },
        REFLOW_DELAY,
        true
    );
    private _needTryReloadLib: boolean = true;
    readonly _children: {
        chartContainer: HTMLElement;
    };
    protected _highCharts: IHighCharts;
    protected _graphMountedOnMac: boolean = false;
    protected _enabled: boolean = true;
    private _loadingPromise: Promise<unknown>;

    protected _beforeMount(options: IHighChartsBaseOptions): void {
        const { enabled = true } = getLocaleStorageParams();
        if (!enabled) {
            this._enabled = enabled;
            return;
        }
        this._loadingPromise = HighChartsLight._loadHighCharts(options, this._loadingPromise);
    }

    protected _afterMount(): void {
        if (this._enabled) {
            this._initHighCharts();

            this._resizeObserver = new ResizeObserverUtil(this, this._throttledReflow.bind(this));
            this._resizeObserver.observe(this._container);
            if (detection.isMac) {
                this._graphMountedOnMac = true;
            }
        }
    }

    protected _afterUpdate(oldOptions: IOptions): void {
        if (this._options.chartOptions !== oldOptions.chartOptions) {
            this._drawChart(HighChartsLight._getReRenderConfig(this._options.chartOptions));
        }
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['controlResize', this], { bubbling: true });

        /**
         * Уничтожение инстанса диаграммы через нативный HighCharts метод destroy приводит к тому,
         * что исчезновение диаграммы явно видно на фоне остальных компонентов - сначала пропадает диаграмма,
         * потом остальные компоненты, из-за этого интерфейс моргает.
         * Уничтожать необходимо, чтобы избежать утечки памяти.
         * Уничтожим инстанс только в том случае, если инстанс существует
         * (его может и не быть, так как график рисуется асинхронно в _afterMount)
         * и DOM нода контрола удалена из дерева.
         */
        const delay = 1000;

        /*
         Т.к. всё действо в setInterval может произойти после purify,
         то обращение к стейту будет вызывать ошибки + стейты будут пустыми,
         отдадим в обработчик в замыкании
      */
        const container = this._container;
        const chartInstance = this._chartInstance;
        const intervalID = setInterval(() => {
            if (document && !document.body.contains(container)) {
                // Если объект инстанса пустой, уничтожать его не надо.
                // На поле renderer завязана логика удаления инстанса. Если его нет, упадет ошибка.
                if (chartInstance && Object.keys(chartInstance).length !== 0) {
                    chartInstance.destroy();
                }
                clearInterval(intervalID);
            }
        }, delay);

        this._isControlDestroyed = true;
    }

    // В автотестах не стабильно работает тест отображение подсказки,поэтому в демке для тестов
    // используем библиотеку HighCharts, чтобы иметь возможность отображать подсказку через консоль
    static _loadHighCharts(
        options?: IHighChartsBaseOptions,
        loadingPromise?: Promise<unknown>
    ): Promise<unknown> {
        if (constants.isBrowserPlatform) {
            if (!loadingPromise) {
                const values = [getHighCharts(), getHighChartsMore()];
                // @ts-ignore
                switch (options?.chartOptions?.chart?.type) {
                    case 'column':
                        values.push(getHighChartsRoundedCorners());
                        break;
                    case 'flame':
                        values.push(getHighChartsFlame());
                        break;
                    case 'funnel':
                        values.push(getHighChartsFunnel());
                        break;
                    case 'networkgraph':
                        values.push(getHighChartsNetworkGraph());
                        break;
                }

                if (options?.modules) {
                    options.modules.forEach((moduleName) =>
                        values.push(getHighChartsModule(moduleName))
                    );
                }

                loadingPromise = Promise.all(values);
            }
            return loadingPromise;
        }
    }

    private _initHighCharts(): void {
        this._loadingPromise.then(([highCharts, more]) => {
            if (highCharts && more) {
                more(highCharts);
            }

            this._highCharts = highCharts;
            // В исключительных ситуациях загрузка данных может не выполниться из-за проблем с сетью.
            // Попробуем в таком случае перезагрузить библиотеку HighCharts.
            if (this._highCharts) {
                this._notify('highChartsLoaded', [true]);
                this._highCharts.setOptions(this._getGlobalOptions(this._options));
                this._notify('register', ['controlResize', this, this._throttledReflow], {
                    bubbling: true,
                });
                const delay: number = 10;
                setTimeout(() => {
                    if (!this._chartInstance) {
                        const config = HighChartsLight._getFirstRenderConfig(
                            this._options.chartOptions
                        );
                        this._drawChart(config);
                    }
                }, delay);
            } else if (this._needTryReloadLib) {
                this._needTryReloadLib = false;
                this._loadingPromise = null;
                this._loadingPromise = HighChartsLight._loadHighCharts(
                    this._options,
                    this._loadingPromise
                );
                this._initHighCharts();
            } else {
                this._notify('highChartsLoaded', [false]);
            }
        });
    }

    /**
     * Позволяет вызвать метод с базовой библиотеки HighCharts.
     * @param methodName Имя вызываемого метода.
     * @param args Аргументы вызываемого метода.
     * @returns {Promise<Object>}
     */
    callMethodOnChartInstance(
        methodName: string,
        args: THighChartsMethodArg[] = []
    ): Promise<object> {
        return new Promise((resolve, reject) => {
            const callback = () => {
                return resolve(this._chartInstance[methodName](...args));
            };
            if (this._chartInstance) {
                if (typeof methodName === 'string' && Array.isArray(args)) {
                    callback();
                } else {
                    reject('Invalid arguments.');
                }
            } else {
                this._delayedCallbacks.push(callback);
            }
        });
    }

    /**
     * Получение конфига для setOptions у highCharts
     * @param options
     * @private
     */
    private _getGlobalOptions(options: IOptions): object {
        return cMerge(cClone(HighChartsLight.globalConfig), {
            lang: options.langOptions || {},
        });
    }

    /**
     * Метод перерисовывает svg графика и подстраивает под ширину контейнера.
     * @private
     * @void
     */
    private _reflow(): void {
        if (this._chartInstance) {
            this._chartInstance.reflow();
        }
    }

    /**
     * Метод создает инстанс графика.
     * @param config
     * @void
     * @private
     */
    private _drawChart(config: object): void {
        // Перерисовка может быть вызвана асинхронным запросом, изменяющим конфигурацию.
        // В этот момент зависимость HighCharts может еще не загружаться.
        if (!this._isControlDestroyed && this._highCharts) {
            const tempConfig = cClone(config);
            tempConfig.chart.renderTo = this._children.chartContainer;
            if (this._chartInstance) {
                this._chartInstance.destroy();
            }

            this._chartInstance = new this._highCharts.Chart(tempConfig);
            if (this._options.onRenderToChart) {
                this._options.onRenderToChart();
            }
            this._delayedCallbacks.forEach((callback) => {
                return callback.call(this);
            });
        }
    }

    /**
     * Локальный конфиг с настройками для диаграммы.
     * По умолчанию анимация отключена для начальной отрисовки диаграммы для более быстрой загрузки страницы.
     * Анимация включена при последующей перерисовке диаграммы.
     * @private
     * @static
     */
    private static _localConfig: object = {
        tooltip: {
            dateTimeLabelFormats: {
                /*
               Переопределяем дефолтную подсказку тултипа по неделе
               "Week from Понедельник, Янв 16, 2020"
               "Неделя с Понедельник, Янв 16, 2020"
             */
                week: rk('Неделя с', 'Графики') + ' %A, %b %e, %Y',
            },
        },
        plotOptions: {
            series: {
                animation: 1000,
            },
        },
        title: {
            text: null,
        },
        chart: {
            renderTo: null,
            animation: false,
            style: {
                fontFamily: 'var(--font-family)',
            },
        },
    };

    /**
     * Глобальный конфиг с общими настройками для всех диаграмм HighCharts.
     * @private
     * @static
     */
    private static get globalConfig(): object {
        return {
            lang: {
                numericSymbols: ['', '', '', '', '', ''],
                months: locales.current.config.longMonths,
                shortMonths: locales.current.config.months,
                weekdays: locales.current.config.longDays,
                thousandsSep: ' ',
                resetZoom: rk('Сбросить масштабирование', 'Графики'),
                resetZoomTitle: rk('Сбросить масштабирование', 'Графики'),
            },
            credits: {
                enabled: false,
            },
        };
    }

    /**
     * Метод возвращает конфиг при перерисовке контрола.
     * @param userConfig
     * @private
     * @returns {object}
     */
    private static _getReRenderConfig(userConfig: IChartOptions): object {
        const { animation } = getLocaleStorageParams();
        const config = HighChartsLight._getInitialRenderConfig(userConfig);
        /* Отключение анимации при последующих перерисовках диаграммы в неподдерживаемых браузерах */
        config.plotOptions.series.animation = !(detection.isIE10 ||
        detection.isIE11 ||
        detection.isWinXP ||
        animation !== undefined
            ? !animation
            : false)
            ? config.plotOptions.series.animation
            : false;
        return config;
    }

    /**
     * Метод возвращает конфиг при первой отрисовке контрола.
     * @param userConfig
     * @private
     * @returns {IChartConfig}
     */
    private static _getFirstRenderConfig(userConfig: IChartOptions): IChartOptions {
        const config = HighChartsLight._getInitialRenderConfig(userConfig);
        /* Отключение анимации при первой отрисовке диаграммы */
        config.plotOptions.series.animation = false;
        return config;
    }

    /**
     * Метод возвращает сформированный конфиг для HighCharts с учетом пользовательских настроек.
     * @param userConfig
     * @private
     * @returns {object}
     */
    private static _getInitialRenderConfig(userConfig: IChartOptions): IChartOptions {
        let initialConfig;
        if (userConfig && Object.keys(userConfig).length) {
            initialConfig = cMerge(cClone(HighChartsLight._localConfig), userConfig);
        } else {
            initialConfig = HighChartsLight._localConfig;
        }
        return initialConfig;
    }
}

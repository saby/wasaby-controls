import { DependencyTimer } from 'Controls/popup';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { IContextMenuConfig } from 'Controls/_itemActions/interface/IContextMenuConfig';

interface IDependencyController {
    contextMenuConfig?: IContextMenuConfig;
    theme?: string;
}

export class MenuDependencyLoader {
    // Таймер для погрузки зависимостей
    private _dependenciesTimer: DependencyTimer | null = null;

    private _loadMenuTempPromise: Promise<unknown[]>;

    private _options: IDependencyController;

    private _isLoaded: boolean = false;

    constructor(options: IDependencyController) {
        this._options = options;
    }

    private _loadDependencies(): Promise<unknown[]> {
        if (!this._loadMenuTempPromise) {
            const templatesToLoad = ['Controls/menu'];
            if (this._options.contextMenuConfig) {
                const templates = [
                    'headerTemplate',
                    'footerTemplate',
                    'itemTemplate',
                    'groupTemplate',
                ];
                templates.forEach((template) => {
                    if (typeof this._options.contextMenuConfig[template] === 'string') {
                        templatesToLoad.push(this._options.contextMenuConfig[template]);
                    }
                });
            }
            const promises = templatesToLoad.map((template: string) => {
                return loadAsync(template);
            });

            this._loadMenuTempPromise = Promise.all(promises).then((loadedDeps) => {
                return loadedDeps[0].Control.loadCSS(this._options.theme || 'default');
            });
        }
        return this._loadMenuTempPromise.then((result) => {
            this._isLoaded = true;
            return result;
        });
    }

    /**
     * Стартует таймер загрузки зависимостей меню
     * @remark
     * Рендер контрола Controls/dropdown:Button намного дороже, поэтому вместо menuButton используем текущую вёрстку и таймеры
     */
    start(): void {
        if (this._isLoaded) {
            return;
        }
        if (!this._dependenciesTimer) {
            this._dependenciesTimer = new DependencyTimer();
        }
        this._dependenciesTimer.start(this._loadDependencies.bind(this));
    }

    /**
     * Останавливает таймер и фактически загружает все зависимости
     */
    stop(): void {
        if (this._isLoaded) {
            return;
        }
        this._dependenciesTimer?.stop();
    }
}

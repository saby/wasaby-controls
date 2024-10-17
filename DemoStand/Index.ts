import { Control, IControlOptions, TemplateFunction, UpdatePreventer } from 'UI/Base';
import { isInit } from 'Application/Initializer';
import { location } from 'Application/Env';
import { cookie, constants, detection } from 'Env/Env';
import { Controller } from 'Controls/popup';
import { LinkResolver } from 'UI/theme/controller';
import { IRouter } from 'Router/router';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { Loader } from 'Controls-DataEnv/dataLoader';
import template = require('wml!DemoStand/Index');
import { addPageDeps } from 'UI/Deps';
import getTemplateName from 'DemoStand/getTempaletName';

const DEFAULT_ID = 1000;

interface IDemoIndex {
    resourceRoot: string;
    pageConfig: any;
    Router: IRouter;
}

interface IDemoModule {
    getLoadConfig?: () => object;
}

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _title: string;

    protected _links: object[];

    protected _loadResult: any;

    protected _configs: object;

    protected _needToActivate: boolean = true;

    protected _hasLoadConfig: boolean = false;

    protected _settingsController: object;

    linkResolver: LinkResolver;

    changeTheme(event: unknown, theme: string): void {
        this._notify('themeChanged', [theme], { bubbling: true });
    }

    protected _beforeMount(options: IDemoIndex, ctx, receivedState: any): void | Promise<void> {
        const { traverse, activate } = options.Router.maskResolver.calculateUrlParams(
            'DemoStand/*traverse?activate=:activate',
            options.Router.url.getUrl()
        );

        const sourceUrl = getTemplateName(traverse);

        if (activate === 'false') {
            this._needToActivate = false;
        }

        const demoModule = loadSync(sourceUrl) as IDemoModule;

        this._hasLoadConfig = typeof demoModule.getLoadConfig === 'function';
        this._configs = this._hasLoadConfig ? demoModule.getLoadConfig() : {};
        this._links = this._prepareLinks(options.resourceRoot);
        this._title = this._getTitle();
        this._loadResult = options.pageConfig || receivedState;

        Controller.setRightPanelBottomTemplate('wml!DemoStand/RightPanel');

        this._settingsController = {
            getSettings(ids: string[]): Promise<object> {
                const storage =
                    (window && JSON.parse(window.localStorage.getItem('controlSettingsStorage'))) ||
                    {};
                const controlId = ids[0];

                if (!storage[controlId]) {
                    storage[controlId] = DEFAULT_ID;

                    if (controlId.indexOf('master') > -1) {
                        storage[controlId] = undefined;
                    }
                }

                return Promise.resolve(storage);
            },
            setSettings(settings: object): void {
                // 'Сохранили панель с шириной ' + settings['123']
                // 'Сохранили masterDetail с шириной ' + settings['master111']
                window.localStorage.setItem('controlSettingsStorage', JSON.stringify(settings));
            },
        };

        /**
         * Cервис декорирования ссылок доступен на всех боевыех сайтах [1].
         * Но на сайтах http://test-autotestХХ.unix.tensor.ru/ его нет.
         * Как результат: ссылки в БТР остаются ссылками. И автотесты проверяют именно это поведение. [2]
         *
         * Видение правильного результата обсуждается тут [3] с Головановым К.
         *
         * [1] https://online.sbis.ru/doc/6a058e2d-8997-4d0e-ba70-6f345fd6a608
         * [2] https://online.sbis.ru/opendoc.html?guid=0185eaf4-439f-464e-bc02-3ccd09765be1
         * [3] https://online.sbis.ru/opendoc.html?guid=3a6098ec-8f00-4c55-ab90-9b2f67847294
         */
        delete constants.decoratedLinkService;
        this.linkResolver = new LinkResolver(
            cookie.get('s3debug') === 'true',
            constants.buildnumber,
            constants.wsRoot,
            constants.appRoot,
            constants.resourceRoot
        );

        if (cookie.get('compatibleMode')) {
            return new Promise((resolve, reject) => {
                requirejs(
                    [
                        'Core/helpers/Hcontrol/makeInstanceCompatible',
                        'Lib/Control/LayerCompatible/LayerCompatible',
                    ],
                    (makeInstanceCompatible, LayerCompatible) => {
                        makeInstanceCompatible(this);
                        LayerCompatible.load([], true, false);
                        resolve();
                    },
                    reject
                );
            });
        }

        return this._loadResult;
    }

    protected _afterMount(): void {
        window.localStorage.setItem('controlSettingsStorage', JSON.stringify({}));

        // активация системы фокусов
        if (this._needToActivate && !detection.isMobilePlatform) {
            this.activate();
        }
    }

    _prepareLinks(resourceRoot: string): object[] {
        const fontsArray = [
            constants.tensorFont,
            constants.tensorFontBold,
            constants.interFont,
            constants.interFontBold,
            constants.cbucIcons,
            constants.cbucIcons24,
        ];
        const links = [];

        for (let i = 0; i < fontsArray.length; i++) {
            links.push({
                rel: 'preload',
                as: 'font',
                href: fontsArray[i],
                type: 'font/woff2',
                crossorigin: 'anonymous',
            });
        }

        links.push({
            rel: 'stylesheet',
            href: resourceRoot + 'DemoStand/Controls-demo.css?v1',
            type: 'text/css',
        });

        return links;
    }

    protected _onReloadStarted() {
        if (this._hasLoadConfig) {
            const router = this._options.Router as IRouter;

            getDataToRender(router.url.getUrl(), undefined, router).then((loadResult) => {
                this._loadResult = loadResult;
            });
        }
    }

    protected _getPopupHeaderTheme(theme: string): string {
        const retailHead = 'retail__';

        if (theme.indexOf(retailHead) !== -1) {
            return retailHead + 'header-' + theme.slice(retailHead.length);
        }

        return theme;
    }

    protected _getTitle(): string {
        const demoLocation = this._getLocation();

        if (demoLocation) {
            const splitter = '%2F';
            const index = demoLocation.pathname.lastIndexOf(splitter);

            if (index > -1) {
                const splittedName = demoLocation.pathname
                    .slice(index + splitter.length)
                    .split('/');

                return this._replaceLastChar(splittedName[0]);
            }
        }

        return 'Wasaby';
    }

    protected _replaceLastChar(controlName: string): string {
        if (controlName[controlName.length - 1] === '/') {
            return controlName.slice(0, -1);
        }

        return controlName;
    }

    protected _getLocation(): typeof location {
        if (isInit()) {
            return location;
        }

        if (typeof window !== 'undefined') {
            return window.location;
        }

        return null;
    }
}

export default UpdatePreventer(Index);

export function getDataToRender(url: string, params: any, Router: IRouter): Promise<unknown> {
    const { traverse } = Router.maskResolver.calculateUrlParams('DemoStand/*traverse', url);
    const demoModuleName = getTemplateName(traverse);

    if (demoModuleName) {
        return loadAsync(demoModuleName).then((demoModule: any) => {
            addPageDeps([demoModuleName]);

            const loadConfig = demoModule.getLoadConfig?.(url);

            if (loadConfig) {
                return Loader.load(loadConfig);
            }
        });
    }
}

/**
 * @kaizen_zone 0804ab53-4f1a-422d-8854-d9021b1bfd63
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { TIState } from 'UICommon/interfaces';
import * as template from 'wml!Controls/_dataSource/_error/Container';
import { constants } from 'Env/Env';
import { ErrorViewMode, Popup, ErrorViewConfig } from 'Controls/error';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
/**
 * Нужно загружать стили для показа диалога сразу.
 * При возникновении ошибки они могут не загрузиться (нет связи или сервис недоступен).
 */
import 'css!Controls/popupConfirmation';

interface IInlistTemplateOptions {
    listOptions: object;
}

type ContainerViewConfig<OptionsType = object> = ErrorViewConfig<OptionsType> & {
    isShown?: boolean;
} & ({ templateName?: string } | { template?: TemplateFunction });

/**
 * @interface Controls/_dataSource/_error/IErrorContainerOptions
 * @public
 */
export interface IErrorContainerOptions extends IControlOptions {
    /**
     * @name Controls/_dataSource/_error/Container#viewConfig
     * @cfg {Controls/error:ErrorViewConfig} Данные для отображения сообщения об ошибке.
     */
    viewConfig?: ErrorViewConfig;

    /**
     * @name Controls/_dataSource/_error/Container#isModalDialog
     * @cfg {Controls/error:ErrorViewConfig} Открывать ли диалог модальным, если ошибка отобразится в диалоговом окне.
     */
    isModalDialog?: boolean;
}

/**
 * Компонент для отображения сообщения об ошибки на основе данных, полученных от контроллера {@link Controls/_error/Controller}.
 * Может отображать сообщение об ошибке разными способами:
 * - в диалоговом окне – покажется единожды. Для множественного показа воспользуйтесь {@link Controls/_error/process};
 * - вместо своего содержимого;
 * - в заглушке, которая растягивается во всю страницу поверх всего остального.
 * @class Controls/_dataSource/_error/Container
 * @extends UI/Base:Control
 * @public
 *
 */
export default class Container<
    TOptions extends IErrorContainerOptions,
    TState extends TIState
> extends Control<TOptions, TState> {
    private _viewConfig: ContainerViewConfig;
    private _popupHelper: Popup = new Popup();
    protected _template: TemplateFunction = template;

    /**
     * Идентификатор текущего открытого диалога. Одновременно отображается только один диалог.
     */
    private _popupId: string;

    /**
     * @deprecated Метод является устаревшим
     * @function
     * @public
     */
    hide(): void {
        Logger.warn(
            'Метод hide будет удален в 21.6100. Вместо него следует использовать опцию viewConfig',
            this
        );
    }

    /**
     * @deprecated Метод является устаревшим
     * @param {Controls/_dataSource/_error/ViewConfig} viewConfig
     * @function
     * @public
     */
    show(viewConfig: ErrorViewConfig): void {
        Logger.warn(
            'Метод show будет удален в 21.6100. Вместо него следует использовать опцию viewConfig',
            this
        );
    }

    protected _beforeMount(options: IErrorContainerOptions): Promise<void> | void {
        this._updateConfig(options.viewConfig);
    }

    protected _beforeUpdate(options: IErrorContainerOptions): void {
        if (isEqual(this._options.viewConfig, options.viewConfig)) {
            return;
        }

        this._updateConfig(options.viewConfig);
        this._openDialog(this._viewConfig);

        // обновляем опции списка, чтобы он корректно обновлялся
        if (this._viewConfig?.mode === ErrorViewMode.inlist) {
            this._updateInlistOptions(options);
        }
    }

    protected _afterMount(): void {
        this._openDialog(this._viewConfig);
    }

    /**
     * Обработчик закрытия диалога.
     */
    private _onDialogClosed(): void {
        this._notify('dialogClosed', []);
        this._popupId = null;
    }

    /**
     * Открыть диалог.
     * Если есть незакрытый диалог, открытый этим контролом, то сначала он будет закрыт.
     * @param viewConfig Конфигурация с шаблоном диалога и опциями для этого шаблона.
     */
    private _openDialog(viewConfig: ErrorViewConfig): Promise<void> {
        if (viewConfig?.mode !== ErrorViewMode.dialog || !constants.isBrowserPlatform) {
            return;
        }

        return this._popupHelper
            .openDialog(viewConfig, {
                id: this._popupId,
                opener: this,
                modal: this._options.isModalDialog === true,
                eventHandlers: {
                    onClose: () => {
                        return this._onDialogClosed();
                    },
                },
            })
            .then((popupId) => {
                if (popupId) {
                    this._popupId = popupId;
                }
            });
    }

    private _updateConfig(viewConfig?: ContainerViewConfig): void {
        if (!viewConfig) {
            this._viewConfig = null;
            return;
        }

        this._viewConfig = {
            ...viewConfig,
            isShown: viewConfig.isShown || viewConfig.mode !== ErrorViewMode.dialog,
            templateName: typeof viewConfig.template === 'string' ? viewConfig.template : undefined,
        };
    }

    private _updateInlistOptions(options: IErrorContainerOptions): void {
        this._viewConfig.options = {
            ...this._viewConfig.options,
        };
        (this._viewConfig as ContainerViewConfig<IInlistTemplateOptions>).options.listOptions =
            options;
    }
}

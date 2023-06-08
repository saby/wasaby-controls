/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
import { constants } from 'Env/Env';
import { Confirmation, Dialog, IConfirmationOptions, IDialogPopupOptions } from 'Controls/popup';
import { ErrorViewConfig } from 'ErrorHandling/interface';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TemplateFunction } from 'UI/Base';

interface IPopupModule {
    Confirmation: typeof Confirmation;
    Dialog: typeof Dialog;
}

interface IViewConfigMessage {
    message: string;
    details?: string;
    bodyContentTemplate?: string;
}

export type PopupId = string;

export interface IPopupHelper {
    preloadPopup(): Promise<IPopupModule | void>;

    openConfirmation(options: IConfirmationOptions): Promise<boolean | void>;

    openDialog<T extends IViewConfigMessage>(
        config: ErrorViewConfig<T>,
        dialogOptions: IDialogPopupOptions
    ): Promise<PopupId | void>;

    closeDialog(popupId: string): Promise<void>;
}

/**
 * Загрузка и открытие диалогов.
 * В конструктор можно передать названия модулей, которые надо загружать дополнительно к модулям диалогов.
 * @private
 */
export default class Popup implements IPopupHelper {
    private preloadPromise: Promise<IPopupModule | void>;
    private readonly modules: string[];
    private readonly themes: string[];

    constructor(modules: string[] = [], themes: string[] = []) {
        this.modules = Popup.POPUP_MODULES.concat(modules);
        this.themes = themes;
    }

    /**
     * Загрузить всё необходимое для показа диалога.
     * @returns Промис с библиотекой Controls/popup, если все зависимости загрузились.
     * Если что-то не загрузилось, то промис завершится успешно с undefined.
     */
    preloadPopup(): Promise<IPopupModule | void> {
        if (!this.preloadPromise) {
            this.preloadPromise = Popup.preload(this.modules, this.themes).then(([popup]) => {
                return popup;
            });
        }

        return this.preloadPromise;
    }

    /**
     * Открыть уведомление. Если не удалось открыть платформенное диалоговое окно, будет показан браузерный alert.
     * @param options Конфигурация уведомления.
     */
    openConfirmation(options: IConfirmationOptions): Promise<boolean | void> {
        return this.preloadPopup().then((popup) => {
            if (!popup) {
                Popup.showDefaultDialog(options.message);
                return;
            }

            return popup.Confirmation.openPopup(options);
        });
    }

    /**
     * Открыть диалог. Если не удалось открыть платформенное диалоговое окно, будет показан браузерный alert.
     * @param config Конфигурация с шаблоном диалога и опциями для этого шаблона.
     * @param dialogOptions Опции для открытия диалога.
     * @returns Если диалог открылся, в промисе будет идентификатор окна, который надо использовать для закрытия
     * окна через {@link Controls/_popup/interface/IDialog#closePopup}.
     */
    openDialog<T extends IViewConfigMessage>(
        config: ErrorViewConfig<T>,
        dialogOptions: IDialogPopupOptions = {}
    ): Promise<PopupId | void> {
        const { template } = config;

        /*
         * Дружелюбные ошибки открываются в шаблоне Confirmation,
         * а такие окна не нужно открывать адаптивными.
         */
        dialogOptions.allowAdaptive = false;

        if (typeof template === 'undefined') {
            const { eventHandlers } = dialogOptions;
            const confirmationOptions: IConfirmationOptions = {
                type: 'ok',
                style: 'danger',
                message: config.options.message,
            };

            return this.openConfirmation(confirmationOptions).then((result) => {
                if (eventHandlers && typeof eventHandlers.onResult === 'function') {
                    eventHandlers.onResult(result);
                }

                if (eventHandlers && typeof eventHandlers.onClose === 'function') {
                    eventHandlers.onClose(result);
                }
            });
        }

        const preloadTemplate: Promise<void | TemplateFunction> =
            typeof template === 'string'
                ? (loadAsync(template) as Promise<void | TemplateFunction>).catch(() => {
                      return undefined;
                  })
                : Promise.resolve(template);

        return Promise.all([this.preloadPopup(), preloadTemplate]).then(
            ([popup, popupTemplate]) => {
                if (!popup || !popupTemplate) {
                    Popup.showDefaultDialog(config.options.message, config.options.details);
                    return;
                }

                return popup.Dialog.openPopup({
                    template: popupTemplate,
                    modal: true,
                    ...dialogOptions,
                    templateOptions: {
                        ...(dialogOptions.templateOptions as object),
                        ...config.options,
                    },
                });
            }
        );
    }

    /**
     * Закрыть диалог.
     * @param popupId Идентификатор окна.
     */
    closeDialog(popupId: string): Promise<void> {
        if (!popupId) {
            return Promise.resolve();
        }

        return this.preloadPopup().then((popup) => {
            return popup && popup.Dialog.closePopup(popupId);
        });
    }

    /**
     * Модули, которые нужны для отображения диалогов.
     */
    private static readonly POPUP_MODULES: string[] = [
        'Controls/popup',
        'Controls/popupConfirmation',
        'Controls/popupTemplate',
        'css!Controls/popup',
        'css!Controls/popupConfirmation',
        'css!Controls/buttons',
    ];

    /**
     * Загрузить указанные модули и темизированные стили.
     * @param modules Загружаемые модули.
     * @param themes Названия модулей, стили которых надо загрузить.
     * @returns Промис с массивом загруженных зависимостей.
     * В случае ошибки загрузки промис завершится успешно с пустым массивом.
     */
    private static preload(modules: string[], themes: string[]): Promise<(IPopupModule | void)[]> {
        return Promise.all([
            ...modules.map((module) => {
                return import(module);
            }),

            // Помимо библиотек нужно ещё загружать темизированные стили для диалога.
            // Без этого стили загружаются только в момент показа диалога.
            // Но когда потребуется показать сообщение о потере соединения, стили уже не смогут загрузиться.
            Popup.importThemes(themes),
        ]).catch(() => {
            return [];
        });
    }

    /**
     * Загрузить темизированные стили.
     * @param cssNames Названия модулей, стили которых надо загрузить.
     */
    private static importThemes(cssNames: string[] = []): Promise<void> {
        return import('UI/theme/controller').then(({ getThemeController }) => {
            const tc = getThemeController();
            cssNames.forEach((name) => {
                tc.get(name);
            });
        });
    }

    /**
     * Показать диалоговое окно средствами браузера.
     * @param message
     * @param details
     */
    private static showDefaultDialog(message: string, details?: string): void {
        if (!constants.isBrowserPlatform) {
            return;
        }

        let text = message;
        if (details) {
            text += `\n${details}`;
        }

        alert(text);
    }
}

/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { loadModule } from 'Controls/_popup/utils/moduleHelper';
import { Control } from 'UI/Base';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBasePopupOptions';
import {
    PageController as DSPageController,
    IPageConfig,
} from 'Controls/dataSource';

interface IPageTemplateOptions {
    pageTemplate: string;
    pageTemplateOptions: object;
    pageId: string;
    prefetchResult?: Promise<any>;
}

interface IPagePopupOptions extends IBasePopupOptions {
    templateOptions?: IPageTemplateOptions;
}

class PageController {
    private _pageTemplate: string;

    /**
     * Получение опций окна для открытия страницы
     * @param pageId
     * @param popupOptions
     */
    getPagePopupOptions(
        pageId: string,
        popupOptions: IBasePopupOptions
    ): Promise<IPagePopupOptions> {
        const resultPopupOptions = { ...popupOptions };
        if (!this._pageTemplate) {
            throw new Error(
                'На приложении не задан шаблон отображения страницы в окне'
            );
        }
        return DSPageController.getPageConfig(pageId)
            .then((pageData) => {
                const templateOptions = this._getTemplateOptions(
                    pageData,
                    resultPopupOptions
                );
                templateOptions.prefetchResult = DSPageController.loadData(
                    pageData,
                    templateOptions.pageTemplateOptions
                );
                resultPopupOptions.template = this._pageTemplate;
                resultPopupOptions.templateOptions = templateOptions;
                return resultPopupOptions;
            })
            .catch(() => {
                return popupOptions;
            });
    }

    /**
     * Предзагрузка статики необходимая для открытия страницы на панели
     * @param popupOptions
     */
    loadModules(template: string): Promise<Control> {
        return loadModule(template);
    }

    /**
     * Устанавливает шаблон отображения страницы на попапе
     * @param template
     */
    setPageTemplate(template: string): void {
        this._pageTemplate = template;
    }

    /**
     *
     * @param pageData
     * @param popupOptions
     * @private
     */
    private _getTemplateOptions(
        pageData: IPageConfig,
        popupOptions: IBasePopupOptions
    ): IPageTemplateOptions {
        const workspaceConfig = pageData?.templateOptions?.workspaceConfig;
        if (workspaceConfig?.templateName) {
            return {
                pageTemplate: workspaceConfig.templateName,
                pageTemplateOptions: {
                    ...workspaceConfig.templateOptions,
                    ...((popupOptions?.templateOptions as object) || {}),
                },
                pageId: popupOptions.pageId,
            };
        } else {
            const message = `
                Страница с указанным идентификатором имеет некорректное описание.
                В описании должен быть workspaceConfig с заданным templateName.
            `;
            import('Controls/popup').then((popupLib) => {
                popupLib.Confirmation.openPopup({
                    type: 'ok',
                    style: 'danger',
                    message,
                });
            });
            throw new Error(message);
        }
    }
}

export default new PageController();

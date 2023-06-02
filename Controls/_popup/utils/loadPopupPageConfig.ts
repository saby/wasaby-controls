/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import PageController from 'Controls/_popup/Page/Controller';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBasePopupOptions';

export default function loadPopupPageConfig(
    config: IBasePopupOptions
): Promise<IBasePopupOptions> {
    return new Promise((resolve, reject) => {
        PageController.getPagePopupOptions(config.pageId, config)
            .then((popupCfg) => {
                // Защита от старых страниц, где не задан загрузчик. в этом случае открываемся по старой схеме
                const template =
                    popupCfg.templateOptions.pageTemplate ||
                    (config.template as string);
                PageController.loadModules(template)
                    .then(() => {
                        resolve(popupCfg);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}

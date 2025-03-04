import { constants } from 'Env/Env';
import { logger } from 'Application/Env';
import { addPageDeps } from 'UICommon/Deps';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

/**
 * Загружаем редакторы темы
 * @param editors
 */
export async function loadEditors(editors: string[]): Promise<string[]> {
    const promises = editors.map((x) => addDependency(x));

    const result = await Promise.all(promises);

    return result.filter((x) => !!x) as string[];
}

/**
 * Функция загружает шаблон контрола на СП и возращает результат загрузки.
 * @param templateName
 * @public
 * @author Терентьев Е.С.
 */
async function addDependency(templateName: string): Promise<string | undefined> {
    let loadResult;
    try {
        loadResult = await loadAsync(templateName);
    } catch (e) {
        logger.warn(`Ошибка загрузки модуля "${templateName}"`, e);
        return;
    }

    if (loadResult) {
        if (constants.isServerSide) {
            addPageDeps([templateName]);
        }
        return templateName;
    }

    return undefined;
}

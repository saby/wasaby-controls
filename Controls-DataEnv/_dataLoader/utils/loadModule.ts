import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { logger as Logger } from 'Application/Env';

export default async function loadModule<TModule>(
    moduleName: string
): Promise<TModule | undefined> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error: unknown) {
        if (error instanceof Error) {
            Logger.error(
                `Controls-DataEnv/dataLoader::Ошибка при загрузке модуля ${moduleName}`,
                0,
                error
            );
        }
    }
}

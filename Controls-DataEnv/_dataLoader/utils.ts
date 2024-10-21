import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { logger as Logger } from 'Application/Env';
import { RPC } from 'Browser/Transport';

function resolveLogger(error: Error): typeof Logger.error | typeof Logger.warn {
    let logger = Logger.error;

    if (error instanceof RPC.Error) {
        logger = error.errType === 'warning' ? Logger.warn : Logger.error;
    }

    return logger;
}

export async function loadModule<TModule>(moduleName: string): Promise<TModule | undefined> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error: unknown) {
        loadErrorHandler(
            error,
            `Controls-DataEnv/dataLoader::Ошибка при загрузке модуля ${moduleName}`
        );
    }
}

export function loadErrorHandler(e: unknown, message: string): void {
    if (e instanceof Error) {
        const logger = resolveLogger(e);
        logger(`${message} ${e.message}`);
    }
}

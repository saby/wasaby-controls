import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';

/**
 *
 */
const atom = async <T>(path: string): Promise<T> => {
    // Можно не делать проверку, т.к. на клиенте addPageDeps - пустышка.
    addPageDeps([path]);
    return loadAsync<T>(path);
};

/**
 * Метод для загрузки зависимостей
 */
async function load<T = unknown>(path: string): Promise<T>;
async function load<T extends unknown[] = unknown[]>(paths: string[]): Promise<T>;
async function load<T extends unknown[] = unknown[]>(paths: string[] | string): Promise<T> {
    if (paths instanceof Array) {
        if (!paths.length) {
            return [] as unknown as T;
        }
        // @ts-ignore
        return Promise.all<T>(paths.map(atom));
    } else {
        return atom<T>(paths);
    }
}

export default load;

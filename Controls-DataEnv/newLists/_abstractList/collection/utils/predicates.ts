import type { Tree as ITreeCollection } from 'Controls/baseTreeDisplay';

const TREE_COLLECTION = '[Controls/_display/Tree]';

/**
 * Предикат для проверки на то, что коллекция является экземпляром класса Tree
 * */
export const instanceOfTreeCollection = (collection: unknown): collection is ITreeCollection => {
    return !!(
        collection && (collection as ITreeCollection)[TREE_COLLECTION as keyof ITreeCollection]
    );
};

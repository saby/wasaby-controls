import { Meta } from 'Meta/types';
import { FC } from 'react';

/**
 * Функция, которая возвращает по метатипу его редактор
 * @param meta Meta/types:Meta
 * @param defaultEditors объект загруженных редакторов
 * @returns Редактор
 * @private
 * @deprecated вместо данного метода нужно переходить на использование фабрики для PG
 */
export function getComponent(
    meta: Meta<unknown>,
    defaultEditors?: Record<string, FC<any>>
): FC<any> | null {
    if (!meta) {
        return null;
    }

    if (meta.getEditor().component) {
        return meta.getEditor().component as FC<any> | null;
    }

    if (defaultEditors?.[meta.getId()]) {
        return defaultEditors[meta.getId()];
    }

    const inheritsIds = meta.getInherits()?.reverse();
    let result: FC<any> | null = null;
    if (inheritsIds) {
        for (const id of inheritsIds) {
            if (defaultEditors?.[id]) {
                result = defaultEditors[id];
                break;
            }
        }
    }
    return result;
}

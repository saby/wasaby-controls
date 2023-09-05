
import {
    ObjectType,
} from 'Types/meta';
import StyleEditor from './editor';

/**
 * Метатип стилей
 */
export const StyleType = ObjectType.editor(() => Promise.resolve(StyleEditor));
StyleType.getEditor().load();

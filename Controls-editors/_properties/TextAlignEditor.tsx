import { ComponentProps, memo } from 'react';
import { StringEnumEditor } from './StringEnumEditor';

/**
 * Реакт компонент, редактор Высоты текста
 * @class Controls-editors/_properties/TextAlignEditor
 * @public
 */
export const TextAlignEditor = memo((props: ComponentProps<typeof StringEnumEditor>) => {
    return <StringEnumEditor {...props} />;
});

import { ComponentProps, memo } from 'react';
import { EnumStringEditor } from 'Controls-editors/dropdown';

/**
 * Реакт компонент, редактор Высоты текста
 * @class Controls-editors/_properties/TextAlignEditor
 * @public
 */
export const TextAlignEditor = memo((props: ComponentProps<typeof EnumStringEditor>) => {
    return <EnumStringEditor {...props} />;
});

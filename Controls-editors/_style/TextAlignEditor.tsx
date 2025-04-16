import { memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { TextAlignType } from 'Meta/types';
import { AlignEditor } from './AlignEditor';

interface ITextAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    dropdown?: boolean;
    dataQa?: string;
}

/**
 * Реакт компонент, редактор для настройки выравнивания текста
 * @class Controls-editors/_style/TextAlignEditor
 * @public
 */
export const TextAlignEditor = memo((props: ITextAlignEditorProps) => {
    return <AlignEditor {...props} alignMeta={TextAlignType} />;
});

import { memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { AlignEditor } from './AlignEditor';
import { VerticalAlignType } from 'Meta/types';

interface IVerticalAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    dropdown?: boolean;
    dataQa?: string;
}

/**
 * Реакт компонент, редактор для настройки выравнивания текста по вертикали
 * @class Controls-editors/_style/VerticalAlignEditor
 * @public
 */
export const VerticalAlignEditor = memo((props: IVerticalAlignEditorProps) => {
    return <AlignEditor {...props} alignMeta={VerticalAlignType} />;
});

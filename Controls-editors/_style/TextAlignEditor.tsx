import { memo } from 'react';
import { TumblerEditor } from 'Controls-editors/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { RecordSet } from 'Types/collection';

interface ITextAlignEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
}

const DEFAULT_ALIGN = 'left';
const TEXT_ALIGN = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 'left',
            icon: 'icon-AlignmentLeft',
        },
        {
            id: 'center',
            icon: 'icon-AlignmentCenter',
        },
        {
            id: 'right',
            icon: 'icon-AlignmentRight',
        },
        {
            id: 'justify',
            icon: 'icon-AlignmentWidth',
        },
    ],
});

/**
 * Реакт компонент, редактор для настройки выравнивания текста
 * @class Controls-editors/_style/TextAlignEditor
 * @public
 */
export const TextAlignEditor = memo((props: ITextAlignEditorProps) => {
    const value = props.value ?? DEFAULT_ALIGN;

    return <TumblerEditor options={TEXT_ALIGN} {...props} value={value} />;
});

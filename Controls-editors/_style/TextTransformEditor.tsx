import { memo } from 'react';
import { TumblerEditor } from 'Controls-editors/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { RecordSet } from 'Types/collection';

interface ITextTransformEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
}

const DEFAULT_TRANSFORM = 'none';
const TEXT_TRANSFORM = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 'none',
            icon: 'icon-Decline',
        },
        {
            id: 'uppercase',
            icon: 'icon-Agent',
        },
        {
            id: 'capitalize',
            icon: 'icon-TFCurtailRTE2',
        },
        {
            id: 'lowercase',
            icon: 'icon-AmoCrm',
        },
    ],
});

/**
 * Реакт компонент, редактор для настройки трансформации букв текста
 * @class Controls-editors/_style/TextTransformEditor
 * @public
 */
export const TextTransformEditor = memo((props: ITextTransformEditorProps) => {
    const value = props.value ?? DEFAULT_TRANSFORM;

    return <TumblerEditor options={TEXT_TRANSFORM} {...props} value={value} />;
});

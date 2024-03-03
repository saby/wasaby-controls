import { useReadonly } from 'UI/Contexts';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { IEditorProps } from './IEditor';
import { Constants } from 'Controls/propertyGrid';

const HIDDEN_LABEL_ON_READONLY_EDITORS = [
    Constants.DEFAULT_EDITORS.string,
    Constants.DEFAULT_EDITORS.text,
    Constants.DEFAULT_EDITORS.number,
];

interface IUseJumpingLabelResult {
    jumpingLabel: boolean;
    editorClasses: string;
}

/**
 * Хук для определения доступности прыгающей метки в редакторе
 * @param props опции редактора PropertyGrid
 */
export function useJumpingLabel(
    props: IEditorProps<string | number>,
    editorName: string
): IUseJumpingLabelResult {
    const readOnly = useReadonly(props);
    const { value } = usePropertyValue(props);
    const hasPropValue = value !== null && value !== undefined && value !== '';
    const jumpingLabel =
        props.jumpingLabel &&
        (!readOnly || !HIDDEN_LABEL_ON_READONLY_EDITORS.includes(editorName) || hasPropValue);

    return {
        jumpingLabel,
        editorClasses:
            props.jumpingLabel && !jumpingLabel
                ? ' controls-PropertyGridEditor__editor-withoutCaption'
                : '',
    };
}

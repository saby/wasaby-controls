import { useReadonly } from 'UI/Contexts';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { IEditorProps } from './IEditor';
import { DEFAULT_EDITORS } from './Constants';

const HIDDEN_LABEL_ON_READONLY_EDITORS = [
    DEFAULT_EDITORS.string,
    DEFAULT_EDITORS.text,
    DEFAULT_EDITORS.number,
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

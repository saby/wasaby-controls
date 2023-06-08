import { IEditorProps } from './IEditor';
import { delimitProps } from 'UICore/Jsx';

/**
 * Функция, объединяющая собственные классы редактора с классами из родительского wml-шаблона
 * @param className класс редактора
 * @param attrs атрибуты из wml-шаблона
 */

export function getMergedClasses(classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

interface IEditorAttributes {
    editorAttrs: object;
    editorWrapperAttrs: object;
}

/**
 * Функция, вычисляющая атрибуты для редактора PropertyGrid и его обертки
 * @remark
 * По-умолчанию атрибуты и классы, полученные от родителя, выставляются на ноде редактора.
 * Если активна опция jumpingLabel, то атрибуты и классы выставляются на обертке.
 * @param props
 */
export function getEditorClasses<T = unknown>(
    props: IEditorProps<T>,
    editorClasses: string[] = []
): IEditorAttributes {
    const attributes = { ...props.attrs };
    delete attributes.className;

    if (props.jumpingLabel) {
        return {
            editorAttrs: {
                className: getMergedClasses(editorClasses),
            },
            editorWrapperAttrs: {
                attrs: attributes,
                className: getMergedClasses([props.className, attributes?.className]),
            },
        };
    }
    return {
        editorAttrs: {
            attrs: attributes,
            className: getMergedClasses([props.className, attributes?.className, ...editorClasses]),
        },
        editorWrapperAttrs: {},
    };
}

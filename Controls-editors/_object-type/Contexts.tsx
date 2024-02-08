import { createContext, FC, memo, ReactNode, useContext, useMemo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';

export type IEditors = Record<string, IComponent<IPropertyEditorProps<any>>>;

interface IEditorsProviderProps {
    value: IEditors;
    children?: ReactNode;
}

interface IObjectTypeEditorRootContext<RuntimeInterface = any> {
    open(attributeName: string): void;
}

/**
 * Контекст, содержащий значение всех свойств виджета. Используется редакторами конкретных свойств виджета
 * для изменения своего поведения в зависимости от значения другого свойства.
 * @public
 * @see ObjectTypeEditor
 */
export const ObjectTypeEditorValueContext = createContext<any>({});

/**
 * Контекст, содержащий значение всех свойств виджета. Используется редакторами конкретных свойств виджета
 * для изменения своего поведения в зависимости от значения другого свойства.
 * @public
 * @see ObjectTypeEditor
 */
export const ObjectTypeEditorRootContext = createContext<IObjectTypeEditorRootContext>({
    open(): void {
        /**/
    },
});

/**
 * Контекст редакторов мета-описаний свойств виджета.
 */
export const EditorsContext = createContext<IEditors>({});

/**
 * Провайдер контекста редакторов мета-описаний свойств виджета.
 * @param {IEditorsProviderProps} props - Свойства провайдера.
 * @param {IEditors} props.value - Редакторы мета-описаний свойств виджета.
 * @param {ReactNode} props.children - Потребители контекста.
 */
export const EditorsProvider: FC<IEditorsProviderProps> = memo((props) => {
    const { value: editors, children } = props;
    const globalEditors = useContext(EditorsContext);
    const value = useMemo(() => {
        return { ...globalEditors, ...editors };
    }, [globalEditors, editors]);
    return <EditorsContext.Provider value={value}>{children}</EditorsContext.Provider>;
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ReactDevTool component name
EditorsProvider.displayName = 'ObjectTypeEditorProvider';

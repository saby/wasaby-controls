import type { BaseBindingFacade } from 'Frame/base';
import { ObjectTypeEditorValueContext } from 'Controls-editors/object-type';
import { useContext } from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Возвращает фасад привязки из редакторя поля связи
 * @param propName имя свойства, содержащего редактор привязки
 * @remark
 * Хук сначала в контексте ищет значение редактора привязки.
 * Если привязка найдена по его значению находит в контексте фасад над привязкой.
 * @example
 * 1. Опишем мета-тип виджета, который умеет привязываться к полю типа DataSet
 * <pre>
 * import { WidgetType } from "Types/meta";
 * import { FieldTypes, INameOptionsType } from "Controls-Input-meta/interface";
 *
 * const MyWidgetType = WidgetType
 *     .id("MyModule/MyWidgetType")
 *     .properties({
 *         // редактор привязки с фильтром по типу DataSet
 *         name: INameOptionsType.editorProps({ fieldTypes: FieldTypes.DataSet }),
 *     });
 * </pre>
 *
 * 2. Разместим свой кастомный редактор для привязки и укажем у него связь с платформенным редактором привязки
 * <pre>
 *     import { StringType, WidgetType } from "MetaTypes";
 * import { FieldTypes, INameOptionsType } from "Controls-Input-meta/interface";
 *
 * const MyWidgetType = WidgetType
 *     .id("MyModule/MyWidgetType")
 *     .properties({
 *         // редактор привязки с фильтром по типу DataSet
 *         name: INameOptionsType.editorProps({ fieldTypes: FieldTypes.DataSet }),
 *         // укажем свой редактор колонок
 *         someField: StringType.editor('MyModule/MyBindingColumnEditor').editorProps({
 *             // в опциях явно укажем, что привязка лежит в поле name
 *             connectedPropName: 'name'
 *         })
 *     });
 * </pre>
 *
 * 3. Напишем свой кастомный редактор выбранных колонок в привязке для PropertyGrid
 * <pre>
 * import * as React from 'react';
 * import {useBindingFacadeFromEditor, useDataSetColumns} from 'Controls-editors/properties';
 * import {DataSetBindingFacade} from 'Frame/base';
 *
 * function MyBindingColumnEditor(props: {connectedPropName: string}) {
 *     // получим фасад для редактирования привязки
 *     const [bindingFacade, setBindingFacade] = useBindingFacadeFromEditor<DataSetBindingFacade>(props.connectedPropName);
 *
 *     // получим описание колонок выборки при необходимости
 *     const dataSetColumns = useDataSetColumns(bindingFacade);
 *
 *     const onChange = React.useCallback(
 *         (selectedKeys: string[]) => {
 *             const fields = selectedKeys.map((name) => {
 *                 return {
 *                     name,
 *                 };
 *             });
 *
 *             // устанавливаем список выбранных колонок в привязку
 *             bindingFacade?.setFields(fields);
 *
 *             // сохраняем измененную привязку на фрейме
 *             setBindingFacade(bindingFacade);
 *         },
 *         [bindingFacade, setBindingFacade]
 *     );
 *
 *     const value = React.useMemo(() => {
 *         // получаем список выбранных колонок из привязки
 *         const frameFields = bindingFacade.getFields() || [];
 *         return frameFields.map((field) => {
 *             return field.name;
 *         });
 *     }, [bindingFacade]);
 *
 *     return <LayoutComponent><SomeEditor value={value} onChange={onChange}></LayoutComponent>
 * }
 * </pre>
 *
 */
function useBindingFacadeFromEditor<
    TBindingFacadeType extends BaseBindingFacade = BaseBindingFacade,
>(propName: string = 'name'): [TBindingFacadeType, (bindingFacade: TBindingFacadeType) => void] {
    const FrameEditorHooksModule = loadSync<typeof import('FrameEditor/dataContextSelector')>(
        'FrameEditor/dataContextSelector'
    );
    const values = useContext(ObjectTypeEditorValueContext);
    const bindingFacade = FrameEditorHooksModule.useBindingFacade<TBindingFacadeType>(
        values[propName]
    );

    return bindingFacade;
}

export { useBindingFacadeFromEditor };

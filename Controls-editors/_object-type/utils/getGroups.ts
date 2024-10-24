import { FC } from 'react';
import {
    BooleanType,
    IPropertyEditorProps,
    Meta,
    NumberType,
    ObjectMeta,
    ObjectMetaAttributes,
    ObjectType,
    StringType,
    getComponent,
} from 'Meta/types';
import { IEditors } from '../Contexts';
import { CheckboxEditor } from '../../CheckboxEditor';
import { NumberEditor, TextEditor } from '../../input';
import { logger } from 'Application/Env';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

interface IGroup {
    id: string;
    title: string;
    attributes: IAttribute[];
}

export interface IAttributeConverter<T = any> {
    input: (props: T) => any;
    output: (value: any) => Partial<T>;
}

export interface IAttribute<T = any> {
    metaType: Meta<T>;
    name: string;
    attributes?: ObjectMetaAttributes<any>;
    Component: FC<
        IPropertyEditorProps<T> & {
            attributes?: ObjectMetaAttributes<any>;
            metaType?: Meta<any>;
            name?: string;
        }
    >;
    converter: IAttributeConverter<T>;
}

interface IGetGroupsOptions {
    metaType: Meta<unknown>;
    attributes: ObjectMetaAttributes<any>;
    editors: IEditors;
    sort: (a: Meta<any>, b: Meta<any>) => number;
    category?: string;
    defaultGroupName?: string;
    defaultGroupId?: string;
    getEditor?(type: Meta): FC<any>;
}

interface IEditorParameters {
    attributes: ObjectMetaAttributes<any>;
    required: Record<string, boolean>;
    converterMap: {
        input: Record<string, string>;
        output: Record<string, string>;
    };
}

const defaultEditors = () => {
    const result = {
        [StringType.getId()]: TextEditor,
        [NumberType.getId()]: NumberEditor,
        [BooleanType.getId()]: CheckboxEditor,
    };

    // Во избежания циклических зависимостей ссылкаемся не редактор стилевого свойства по пути
    const styleEditor = 'Controls-editors/propertyGrid:PropertyGrid';
    if (isLoaded(styleEditor)) {
        result['.style'] = loadSync(styleEditor);
    }

    return result;
};

/**
 * Генерирует красивое название свойства на основе его имени в объекте.
 * @param attributeName
 */
export function getAttributeTitle(attributeName: string): string {
    const result = attributeName
        .replace(/_/g, ' ')
        .replace(/\s{2,}/, ' ')
        .trim()
        .replace(/([A-ZА-ЯЁы])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Группирует свойства виджета по категориям, скрывая те, что не должны быть видны.
 * @param options
 */
export function getGroups(options: IGetGroupsOptions): IGroup[] {
    const {
        metaType,
        attributes,
        category,
        editors,
        sort,
        defaultGroupName = '',
        defaultGroupId = 'ObjectEditorDefaultGroup',
        getEditor,
    } = options;

    const groups: IGroup[] = [];
    const editorGroups = new WeakMap<any, IGroup>();
    const editorParameters = new WeakMap<any, IEditorParameters>();

    const editorsMap = { ...defaultEditors(), ...editors };

    function getGroup(meta: Meta<any>): IGroup {
        const metaGroupName = meta.getGroup()?.name || defaultGroupName;
        const metaGroupId =
            meta.getGroup()?.uid === undefined ? defaultGroupId : meta.getGroup()?.uid;
        let group = groups.find(({ id }) => {
            return id === metaGroupId;
        });
        if (!group) {
            group = {
                id: metaGroupId,
                title: metaGroupName,
                headerVisible: metaGroupId !== null,
                attributes: [],
            };
            groups.push(group);
        }
        return group;
    }

    function handleCompoundMeta(name: string, meta: Meta<any>): void {
        const originKey = meta.getOrigin()?.key || '';
        const originMeta = meta.getOrigin()?.meta;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const Component: any = getEditor
            ? getEditor(originMeta)
            : getComponent(originMeta, editorsMap);

        const editorGroup = editorGroups.get(Component);
        const editorParams = editorParameters.get(Component);
        if (editorGroup && editorParams) {
            // Составной редактор уже был добавлен, поэтому:
            // - добавляем ещё одно поле в карту конвертера;
            // - обновляем список используемых ключей.
            editorParams.converterMap.input[originKey] = name;
            editorParams.converterMap.output[name] = originKey;
            editorParams.attributes[originKey] = meta;
            editorParams.required[name] = meta.isRequired();
            return;
        }

        const group = getGroup(meta);
        const params = {
            attributes: { [originKey]: meta },
            converterMap: {
                input: { [originKey]: name },
                output: { [name]: originKey },
            },
            required: { [name]: meta.isRequired() },
        };
        editorGroups.set(Component, group);
        editorParameters.set(Component, params);
        let previousInputConverterResult: any | undefined;
        const converter: IAttributeConverter = {
            input(value: any): any {
                const { converterMap } = editorParameters.get(Component) || {};
                const result = {} as any;
                // Для производительности: если все значения не изменились, возвращаем старое значение
                let changed = false;
                Object.entries(converterMap?.input || {}).forEach(([key, key2]) => {
                    if (value?.hasOwnProperty(key2)) {
                        result[key] = value[key2];
                    }
                    changed = changed || previousInputConverterResult?.[key] !== result[key];
                });
                if (!changed) {
                    return previousInputConverterResult;
                }
                previousInputConverterResult = result;
                return result;
            },
            output(value: any): any {
                const { converterMap, required } = editorParameters.get(Component) || {};
                const result = {} as any;
                Object.entries(converterMap?.output || {}).forEach(([key, key2]) => {
                    result[key] = value[key2] ?? (required?.[key] ? value[key2] : undefined);
                });
                return result;
            },
        };
        group.attributes.push({
            metaType: originMeta,
            name,
            converter,
            attributes: params.attributes,
            Component,
        });
    }

    function handleMeta(name: string, meta: Meta<any>): void {
        const originMeta = meta.getOrigin()?.meta;
        const originKey = meta.getOrigin()?.key;
        if (originMeta && originKey) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const originEditor: any = getEditor
                ? getEditor(originMeta)
                : getComponent(originMeta, editorsMap);
            if (originEditor) {
                return handleCompoundMeta(name, meta);
            }
        }

        const Component: any =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (getEditor ? getEditor(meta) : getComponent(meta, editorsMap)) ||
            (meta.is(ObjectType) ? editors[ObjectType.getId()] : null);
        if (!Component) {
            logger.error(
                `Controls-editors/object-type: Отсутствует компонент редактора для атрибута [${name}], указанного на мета-типе : `,
                metaType
            );
            return;
        }

        const group = getGroup(meta);
        const converter: IAttributeConverter = {
            input: (props: any) => {
                return props?.[name];
            },
            output: (value: any) => {
                return {
                    [name]: value,
                };
            },
        };
        group.attributes.push({
            metaType: meta,
            name,
            converter,
            Component,
        });
    }

    Object.entries((attributes || {}) as Record<string, ObjectMeta<any>>)
        .filter(([, meta]) => {
            if (!meta?.isVisible()) {
                return false;
            }
            // если все вложенные свойства скрыты, то создавать группу не надо
            if (meta.properties && Object.keys(meta.properties()).length) {
                const nestedProperties = Object.entries(meta.properties()).filter(
                    ([, meta]) => meta?.isVisible()
                );

                if (nestedProperties.length === 0) {
                    return false;
                }
            }
            if (category === undefined || category === null) {
                return true;
            }
            const metaCategoryName = meta.getCategory();
            if (!category) {
                return !metaCategoryName;
            }
            return category === metaCategoryName;
        })
        .map((entry) => {
            // Если название типа не указано, генерируем его на основе названия атрибута в объекте
            if (entry[1].getTitle() === undefined) {
                entry[1] = entry[1].title(getAttributeTitle(entry[0]));
            }
            return entry;
        })
        .sort(([, meta1], [, meta2]) => {
            return sort(meta1, meta2);
        })
        .forEach(([name, meta]) => {
            return handleMeta(name, meta);
        });

    return groups.filter((group) => {
        return group.attributes.length;
    });
}

import { Slice } from 'Controls-DataEnv/slice';
import { Meta, ObjectMeta } from 'Meta/types';
import type { IDataConfigLoader } from 'Controls-DataEnv/dataFactory';
import { Loader } from 'Controls-DataEnv/dataLoader';

async function loadEditorData(
    type: Meta<unknown>,
    props: object,
    dataContext: Record<string, Slice<unknown>>
): Promise<unknown> {
    if (!type) {
        return;
    }
    // генерируем конфиг для корневого редактора мета-типа
    const rootConfig = getEditorSourceConfig(type, props, dataContext);

    let attrsEditorsConfig;
    if (type instanceof ObjectMeta) {
        attrsEditorsConfig = Object.values(type.getAttributes()).reduce((acc, attrType) => {
            const config = getEditorSourceConfig(attrType, props, dataContext);
            if (config && !!attrType) {
                acc[attrType.getId()] = config;
            }
            return acc;
        }, {} as Record<string, unknown>);
    }

    return Loader.loadByConfigs({
        ...(!!rootConfig
            ? {
                  [type.getId()]: rootConfig,
              }
            : {}),
        ...attrsEditorsConfig,
    });
}

function getEditorSourceConfig(
    type: Meta<unknown> | null,
    props: object,
    dataContext?: Record<string, Slice<unknown>>
): Record<string, IDataConfigLoader> | undefined {
    const configGetter = type?.getEditor().component?.sourceConfigGetter;
    if (configGetter && typeof configGetter === 'string') {
        return {
            configGetter,
            configGetterArgumentsArray: [props, {}, {}, dataContext],
        };
    }
}

export { loadEditorData };

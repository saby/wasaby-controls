import { constants } from 'Env/Env';
import { TDataObjectMethodArgument } from 'Frame/base';
import {
    ObjectMeta,
    ObjectType,
    NumberType,
    Meta,
    StringType,
    DateType,
    ArrayType,
    BooleanType,
} from 'Meta/types';
import { adapter, Model } from 'Types/entity';
import { SbisService, Query } from 'Types/source';
import { Logger } from 'UI/Utils';
import { FieldListSource, IDataObjectFieldType } from 'Frame-DataEnv/dataLoader';
import {
    IDataObjectArgumentType,
    IDataObjectType,
    TArgumentsModelType,
    TReturnValueModelType,
    IReturnValueFieldDescription,
} from './dataTypes';
import { IFunctionCallMeta, RETURN_VALUE_FIELD, PARAMETERS_FIELD } from './types';
import { buildRecordTypeMeta } from './recordTypeMetaBuilder/recordTypeBuilder';

const moduleName = 'Controls-editors/properties/NameEditor:ArgumentsMetaFactory';
const DataObjectCache: Record<string, Model<IDataObjectType> | null> = {};

interface IFunctionDescription {
    arguments: IDataObjectArgumentType[];
    returnValue: IReturnValueFieldDescription[];
}

async function getArgumentsMeta(
    objectName: string,
    methodName: string,
    fieldId: string,
    source: FieldListSource
): Promise<IFunctionCallMeta> {
    const fieldType = await getFieldType(source, fieldId);

    const objectNamePrepared = fieldType ? fieldType.get('OriginalParentType') : objectName;

    const argumentType = await getArgumentsType(objectNamePrepared, methodName, objectName);

    return {
        arguments: buildArgumentMetaType(objectNamePrepared, methodName, argumentType.arguments),
        returnValue: null,
    };
}

function buildArgumentMetaType(
    objectName: string,
    methodName: string,
    argumentsType: IDataObjectArgumentType[]
): ObjectMeta | null {
    if (!argumentsType.length) {
        return null;
    }

    const properties = argumentsType.reduce<Record<string, Meta<unknown>>>((metas, desc) => {
        const id = desc.name;
        const meta = buildArgument(desc);

        if (meta !== undefined) {
            metas[id] = meta;
        }

        return metas;
    }, {});

    return ObjectType.id([objectName, methodName, PARAMETERS_FIELD].join('/'))
        .title(`Аргументы функции ${methodName}`)
        .properties(properties);
}

function buildReturnValueMetaType(
    objectName: string,
    methodName: string,
    returnValueType: IReturnValueFieldDescription[]
): ObjectMeta | null {
    if (!returnValueType.length) {
        return null;
    }

    return ObjectType.id([objectName, methodName, RETURN_VALUE_FIELD].join('/'))
        .title(`Возвращаемое значение функции ${methodName}`)
        .properties({
            [RETURN_VALUE_FIELD]: ArrayType.of(StringType)
                .title('Значение')
                .editor('Controls-editors/properties:DataObjectReturnValueEditor')
                .editorProps({ items: returnValueType }),
        });
}

function buildArgument(arg: IDataObjectArgumentType): Meta<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { type, name, description, is_required, is_array, fields } = arg;
    if (is_array) {
        // тип массив не поддерживаем
        return;
    }

    let meta: Meta<unknown> = null;
    switch (type) {
        case 'Integer':
        case 'Float':
        case 'Decimal':
        case 'Double':
            meta = NumberType.editor('Controls-editors/input:NumberEditor');
            break;
        case 'String':
            meta = StringType;
            break;
        case 'Date':
            meta = DateType.editor('Controls-editors/date:DateEditor');
            break;
        case 'Boolean':
            meta = BooleanType.editor('Controls-editors/toggle:SwitchEditor');
            break;
        case 'Period':
            meta = StringType.editor('Controls-editors/function:PeriodTypeEditor')
                .defaultValue('byFilter')
                .sampleData('byFilter');
            break;
        case 'Money':
            meta = NumberType.editor('Controls-editors/input:MoneyEditor');
            break;
        case 'Record':
            meta = buildRecordTypeMeta(fields);
            break;
        default:
            break;
    }

    if (!meta) {
        return;
    }

    meta.id(name).title(description).group('Аргументы');

    if (is_required) {
        meta.required();
    } else {
        meta.optional();
    }

    return meta;
}

async function getArgumentsType(
    objectName: string,
    methodName: string,
    objectNameAlias: string
): Promise<IFunctionDescription> {
    const objectType = await getObjectType(objectName, objectNameAlias);
    return _getArgumentsType(objectType, objectName, methodName);
}

function getArgumentsTypeSync(objectName: string, methodName: string): IFunctionDescription {
    const objectType = DataObjectCache[objectName] || null;
    return _getArgumentsType(objectType, objectName, methodName);
}

function _getArgumentsType(
    objectType: Model<IDataObjectType> | null,
    objectName: string,
    methodName: string
): IFunctionDescription {
    const EMPTY_DESC = {
        arguments: [],
        returnValue: [],
    };

    if (!objectType) {
        return EMPTY_DESC;
    }
    const propertiesRS = objectType.get('Properties');
    propertiesRS.setKeyProperty('Name');

    const methodType = propertiesRS.getRecordById(methodName);

    if (!methodType) {
        Logger.warn(
            `${moduleName}:: В сервисе мета-типов отсутствует описание функции ${methodName} на прикладном объекте ${objectName}`
        );
        return EMPTY_DESC;
    }

    const metaAttributesRs = methodType.get('MetaAttributes');
    metaAttributesRs.setKeyProperty('Name');
    const parametersFieldDesc = metaAttributesRs.getRecordById(
        PARAMETERS_FIELD
    ) as unknown as TArgumentsModelType;

    const returnValueDesc = metaAttributesRs.getRecordById(
        RETURN_VALUE_FIELD
    ) as unknown as TReturnValueModelType;

    if (!parametersFieldDesc) {
        Logger.warn(`${moduleName}:: У функции ${methodName} отсутствует описание аргументов`);
        return EMPTY_DESC;
    }

    return {
        arguments: parametersFieldDesc.get('Value').get('value') || [],
        returnValue: returnValueDesc.get('Value').get('fields') || [],
    };
}

async function getObjectType(
    objectName: string,
    objectNameAlias: string
): Promise<Model<IDataObjectType> | null> {
    if (objectName === null || objectName === undefined) {
        return null;
    }

    if (DataObjectCache[objectName] !== undefined) {
        return DataObjectCache[objectName];
    }

    return fetchDataObjectTypeByService(objectName, objectNameAlias);
}

async function fetchDataObjectTypeByService(
    objectName: string,
    objectNameAlias: string
): Promise<Model<IDataObjectType> | null> {
    const service = new SbisService({
        endpoint: {
            contract: 'Type',
            address: '/metadata-repository/service/',
        },
        binding: {
            format: 'Type.Get',
            read: 'Read',
        },
        options: {
            passAddFieldsFromMeta: true,
        },
    });

    const metaRecord = Model.fromObject(
        {
            MetaType: 'applicationobject',
            Version: constants.buildnumber,
        },
        new adapter.Sbis()
    );
    try {
        const serviceRecord = await service.read(objectName, metaRecord);

        DataObjectCache[objectName] = serviceRecord;
        DataObjectCache[objectNameAlias] = serviceRecord;

        return serviceRecord;
    } catch (e) {
        Logger.warn(
            `${moduleName}:: Ошибка загрузки описания прикладного объекта ${objectName}`,
            e
        );
        return null;
    }
}

function packArgumentValues(
    objectName: string,
    methodName: string,
    values: Record<string, unknown>
): Record<string, TDataObjectMethodArgument> {
    const argTypes = getArgumentsTypeSync(objectName, methodName).arguments;

    const typeMap = new Map<string, string>();
    argTypes.forEach((argType) => {
        typeMap.set(argType.name, argType.type);
    });

    const result: Record<string, TDataObjectMethodArgument> = {};

    Object.entries(values).forEach(([key, value]) => {
        result[key] = {
            value,
            type: typeMap.get(key),
        };
    });

    return result;
}

function unpackArgumentValues(
    values?: Record<string, TDataObjectMethodArgument>
): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (!values) {
        return {};
    }

    Object.entries(values).forEach(([key, typeValue]) => {
        result[key] = typeValue.value;
    });

    return result;
}

function getFieldType(
    source: FieldListSource,
    fieldId: string
): Promise<Model<IDataObjectFieldType> | undefined> {
    const query = new Query().where({
        ID: [fieldId],
    });

    return source.query(query).then((res) => {
        const rs = res.getAll();

        if (!rs) {
            return;
        }

        return rs.at(0);
    });
}

export { getArgumentsMeta, packArgumentValues, unpackArgumentValues };

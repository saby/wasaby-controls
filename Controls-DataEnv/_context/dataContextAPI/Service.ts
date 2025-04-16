import { DataSet, SbisService } from 'Types/source';
import { Model, Record as TypesRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IDataField, IDataContextField } from './interface';
import { factory } from 'Types/chain';
import DataContextLocalAPI from './Local';

export type ISerializedDataContext = RecordSet<IDataContextField>;

type IDataContextReadResult = DataSet<
    never,
    TypesRecord<{
        UnresolvedFields: RecordSet;
        Context: ISerializedDataContext;
    }>
>;

function serializeFields(rawFields: IDataField[]): RecordSet<IDataField> {
    const fields = new RecordSet<IDataField>({
        adapter: 'adapter.sbis',
    });

    rawFields.forEach((field) => {
        fields.add(
            TypesRecord.fromObject(
                {
                    contextName: field.contextName,
                    name: field.name,
                    type: field.type,
                    params:
                        field.params instanceof TypesRecord
                            ? field.params
                            : TypesRecord.fromObject(field.params || {}, 'adapter.sbis'),
                },
                'adapter.sbis'
            )
        );
    });

    return fields;
}

function addContextField(context: RecordSet, contextField: IDataContextField): void {
    context.add(
        new Model({
            adapter: 'adapter.sbis',
            format: [
                {
                    name: 'name',
                    type: 'string',
                    defaultValue: contextField.name,
                },
                {
                    name: 'value',
                    type: 'record',
                    defaultValue: contextField.value,
                },
            ],
        })
    );
}

function serializeContext(rawContext: IDataContextField[]): ISerializedDataContext {
    const serializedContext = new RecordSet<IDataContextField>({
        adapter: 'adapter.sbis',
    });

    rawContext.forEach((contextField) => {
        addContextField(serializedContext, contextField);
    });

    return serializedContext;
}

function deserializeContext(serializedContext: ISerializedDataContext): IDataContextField[] {
    return factory(serializedContext)
        .map((contextField) => {
            return factory(contextField).toObject();
        })
        .value<IDataContextField[]>();
}

export default class DataContextServiceAPI {
    protected readonly _context: IDataContextField[];

    constructor(context: IDataContextField[]) {
        this._context = context;
    }

    async fillContextFields(
        fields: IDataField[],
        context: IDataContextField[]
    ): Promise<IDataContextField[]> {
        const serializedContext = serializeContext(context);
        const readResult: IDataContextReadResult = await new SbisService().call(
            'DataContext.Execute',
            {
                Fields: serializeFields(fields),
                Context: serializeContext(context),
            }
        );

        const ctx = readResult.getRow()?.get('Context') || serializedContext;

        return deserializeContext(ctx);
    }

    async execute(method: string, methodArgs: Record<string, unknown> = {}): Promise<unknown> {
        const field: IDataField = {
            type: 'Function',
            params: methodArgs,
            name: method,
            contextName: `MethodResult.${method}`,
        };

        const resultContext = await this.fillContextFields([field], this._context);

        return new DataContextLocalAPI(resultContext).getByPath(`MethodResult.${method}`);
    }
}

import { Slice } from 'Controls-DataEnv/slice';

class TypeRepository extends Slice {
    protected _initState(): Record<string, object> {
        return {
            fieldTypeStore: [
                {
                    name: 'Data.EmptyField',
                    bind: ['Data', 'EmptyField'],
                    type: 'string',
                    title: 'Поле без значения',
                    titlePath: 'Данные.ПолеБезЗначения',
                    typeId: 'Data.EmptyField',
                },
                {
                    name: 'Data.TestGraphModel',
                    bind: ['Data', 'TestGraphModel'],
                    type: 'model',
                    title: 'Model',
                    titlePath: 'Данные.ПолеБезЗначения',
                    typeId: 'Data.TestGraphModel',
                },
            ],
        };
    }

    update(): void {
        this.setState({
            fieldTypeStore: [
                {
                    name: 'Data.EmptyField',
                    bind: ['Data', 'EmptyField'],
                    type: 'string',
                    title: 'Поле без значения',
                    titlePath: 'Данные.ПолеБезЗначения',
                    typeId: 'Data.EmptyField',
                },
                {
                    name: 'Data.TestGraphModel',
                    bind: ['Data', 'TestGraphModel'],
                    type: 'string',
                    title: 'Model',
                    titlePath: 'Данные.ПолеБезЗначения',
                    typeId: 'Data.TestGraphModel',
                },
            ],
        });
    }
}

export default {
    loadData(options: object): object {
        return {
            ...options,
        };
    },
    slice: TypeRepository,
};

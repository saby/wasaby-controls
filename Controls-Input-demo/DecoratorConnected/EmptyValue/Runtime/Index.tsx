import { forwardRef, useMemo } from 'react';
import { Record, adapter } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { DataSet } from 'Types/source';
import { Label } from 'Controls/input';
import {
    Date,
    Enum,
    Flags,
    Time,
    Checkbox,
    Money,
    MultilineText,
    Number,
} from 'Controls-Input/decoratorConnected';
import { getLoadConfig, getEmptyFieldBinding } from '../../../resources/_dataContextMock';
import type { IConstructorConfigFile } from 'Frame-DataEnv/constructorType';

const Index = forwardRef((_, ref) => {
    const emptyFieldBinding = useMemo<string[]>(() => {
        return getEmptyFieldBinding();
    }, []);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col"
        >
            <h1>Декораторы в рантайме</h1>
            <h2>(слайс есть, нет значения)</h2>
            <Label caption={'Декоратор текста'} />
            <MultilineText name={emptyFieldBinding} />
            <Label caption={'Декоратор числа'} />
            <Number name={emptyFieldBinding} />
            <Label caption={'Декоратор даты'} />
            <Date name={emptyFieldBinding} />
            <Label caption={'Декоратор времени'} />
            <Time name={emptyFieldBinding} />
            <Label caption={'Декоратор времени'} />
            <Money name={emptyFieldBinding} />
            <Label caption={'Декоратор чекбокса'} />
            <Checkbox name={emptyFieldBinding} />
            <Label caption={'Декоратор флагов'} />
            <Flags name={emptyFieldBinding} />
            <Label caption={'Декоратор перечисляемого'} />
            <Enum name={emptyFieldBinding} />
        </div>
    );
});

const demoConstructorType: IConstructorConfigFile = {
    id: 'DemoConstructorType',
    dataObjects: [
        {
            name: 'Data',
        },
    ],
    decoratorConfig: {
        renderPlaceholderOnEmpty: true,
    },
};

class MockTypeSource {
    query() {
        const recordSet = new RecordSet({
            adapter: new adapter.Sbis(),
        });

        recordSet.add(
            Record.fromObject(
                {
                    Id: 'Data.EmptyField',
                    Title: 'ПолеБезЗначения',
                    Tooltip: '',
                    NodeType: 'string',
                    Parent: 'Data',
                    'Parent@': null,
                    Parent$: false,
                    ChildNodeCount: 0,
                    ChildLeafCount: 0,
                    AdditionalInfo: {
                        MetaAttributes: {
                            TitlePath: 'Данные.ПолеБезЗначения',
                            DisplayText: 'Поле без значения',
                        },
                    },
                },
                new adapter.Sbis()
            )
        );

        return Promise.resolve(
            new DataSet({
                rawData: recordSet.getRawData(),
                adapter: recordSet.getAdapter(),
                model: 'FieldListSourceModel',
            })
        );
    }
}

Index.getLoadConfig = () => {
    return {
        ...getLoadConfig(),
        ConstructorSlice: {
            dataFactoryName: 'Frame-DataEnv/dataLoader:ConstructorSliceFactory',
            dataFactoryArguments: {
                data: demoConstructorType,
            },
        },
        TypeRepository: {
            dataFactoryName: 'Frame-DataEnv/dataLoader:TypeRepositoryFactory',
            dataFactoryArguments: {
                constructorId: demoConstructorType,
                source: MockTypeSource,
                fields: [['Data', 'EmptyField']],
            },
        },
    };
};

export default Index;

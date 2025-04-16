/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { ObjectType, NumberType } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { PropsValidation } from 'Controls-editors/object-type';
import { Record as EntityRecord } from 'Types/entity';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';

describe('Controls-editors/propertyGrid валидация', () => {
    let container: HTMLDivElement = null;

    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('Проверяем, что выводится предупреждение для свойства и вложенного свойства, а также что вызывается валидация', async () => {
        const widgetType = ObjectType.properties({
            height: NumberType.title('Высота'),
            width: NumberType.title('Ширина'),
            more: ObjectType.properties({
                depth: NumberType.title('Глубина'),
            }),
        });

        const validation: EntityRecord<PropsValidation> = new EntityRecord({
            rawData: {
                height: {
                    warning: 'Предупреждение высота',
                },
                width: {
                    error: 'Ошибка ширина',
                },
                more: {
                    nested: {
                        depth: {
                            warning: 'Предупреждение глубина',
                        },
                    },
                },
            },
        });

        const configs = {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: widgetType,
                },
            },
        };

        const loadResults = await Loader.load(configs);
        const value = {};

        const validate = jest.requireActual('Controls/validate');
        jest.spyOn(validate.Container.prototype, 'validate');

        const changeHandler = jest.fn();
        render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid
                    value={value}
                    validation={validation}
                    storeId={'MetaTypeEditors'}
                    onChange={changeHandler}
                />
            </Provider>,
            {
                container,
            }
        );

        await screen.findByText('Предупреждение высота');
        await screen.findByText('Предупреждение глубина');

        expect(validate.Container.prototype.validate).toHaveBeenCalledTimes(1);
    });
});

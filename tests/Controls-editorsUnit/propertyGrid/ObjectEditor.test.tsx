/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render, waitFor } from '@testing-library/react';
import { ObjectType, NumberType } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';

describe('Controls-editors/propertyGrid', () => {
    let container: HTMLDivElement;
    beforeEach(() => {
        container = document.createElement('div');
        container.className += 'container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
    });

    it('На типе задан редактор для нескольких свойств через origin. Результат: PG построился, появилось два обязательных свойства', async () => {
        const sizeProperties = ObjectType.editor(
            'Controls-editors/properties:ObjectEditor'
        ).properties({
            height: NumberType.title('Высота').required(),
            width: NumberType.title('Ширина').required(),
        });

        const widgetType = ObjectType.properties({
            ...sizeProperties.getProperties(),
        });

        const value = {};
        const { getByText, container: resultContainer } = render(
            <PropertyGrid metaType={widgetType} value={value} />,
            {
                container,
            }
        );

        await waitFor(() => getByText('Высота'));
        await waitFor(() => getByText('Ширина'));

        expect(resultContainer.getElementsByClassName('controls-Label__asterisk').length).toEqual(
            2
        );
    });

    it('На типе задан редактор для нескольких свойств через origin. работает через storeId. Результат: PG построился, появилось два обязательных свойства', async () => {
        const sizeProperties = ObjectType.editor(
            'Controls-editors/properties:ObjectEditor'
        ).properties({
            height: NumberType.title('Высота').required(),
            width: NumberType.title('Ширина').required(),
        });

        const widgetType = ObjectType.properties({
            ...sizeProperties.getProperties(),
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
        const changeHandler = jest.fn();
        const { getByText } = render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid value={value} storeId={'MetaTypeEditors'} onChange={changeHandler} />
            </Provider>,
            {
                container,
            }
        );

        await waitFor(() => getByText('Высота'));
        await waitFor(() => getByText('Ширина'));
        expect(container.getElementsByClassName('controls-Label__asterisk').length).toEqual(2);
    });

    it('На типе задан connected редактор. Результат: PG построился, редактор взял данные через контекст', async () => {
        const widgetType = ObjectType.properties({
            prop1: NumberType.editor('Controls-editorsUnit/propertyGrid/TestConnectedEditor'),
        });

        const value = {
            prop1: 'Данные',
        };

        const configs = {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType: widgetType,
                },
            },
        };

        const loadResults = await Loader.load(configs);

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid metaType={widgetType} value={value} storeId={'MetaTypeEditors'} />
            </Provider>,
            {
                container,
            }
        );

        const element = container.getElementsByClassName('test-data')[0] as HTMLDivElement;

        expect(element.textContent).toEqual(value.prop1);
    });
});

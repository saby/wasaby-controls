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
        const { getByText } = render(<PropertyGrid metaType={widgetType} value={value} />, {
            container,
        });

        await waitFor(() => getByText('Высота'));

        expect(container.getElementsByClassName('controls-Label__asterisk').length).toEqual(2);
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
        render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid metaType={widgetType} value={value} storeId={'MetaTypeEditors'} />
            </Provider>,
            {
                container,
            }
        );

        expect(container.getElementsByClassName('controls-Label__asterisk').length).toEqual(2);
    });
});

/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { ObjectType, NumberType, WidgetType } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

describe('Controls-editors/propertyGrid Виджет с стилевыми свойствами', () => {
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

    it('На виджете заданы два стилевых свойства (одно обязательное) с редактором ComplexSizeEditor. Результат: в PG только одно свойство отображается обязательным', async () => {
        const sizeProperties = ObjectType.editor(
            'Controls-editors/sizeEditor:ComplexSizeEditor'
        ).properties({
            height: NumberType.title('Высота').required(),
            width: NumberType.title('Ширина').optional(),
        });

        const widgetType = WidgetType.styles({
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
            { container }
        );

        expect(container.getElementsByClassName('controls-Label__asterisk').length).toEqual(1);
    });
});

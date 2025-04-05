/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { ObjectType, NumberType } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Provider } from 'Controls-DataEnv/context';
import { Loader } from 'Controls-DataEnv/dataLoader';

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

    it('Метатип с расширенным свойством и значением, меняем значение readonly. Результат: false - есть кнопка удаления свойства. true - нет кнопки удаления', async () => {
        const metaType = ObjectType.properties({
            height: NumberType.title('Высота'),
            width: NumberType.title('Ширина').extended(),
        });

        const configs = {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType,
                },
            },
        };

        const loadResults = await Loader.load(configs);

        const value = {
            width: 1,
        };
        const { rerender } = render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid
                    metaType={metaType}
                    value={value}
                    storeId={'MetaTypeEditors'}
                    readOnly={false}
                    showTooltip={true}
                />
            </Provider>,
            { container }
        );

        expect(
            container.querySelectorAll('[data-qa="propertygrid__hide-property"]').length
        ).toEqual(1);

        rerender(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid
                    metaType={metaType}
                    value={value}
                    storeId={'MetaTypeEditors'}
                    readOnly={true}
                    showTooltip={true}
                />
            </Provider>
        );

        expect(
            container.querySelectorAll('[data-qa="propertygrid__hide-property"]').length
        ).toEqual(0);
    });
});

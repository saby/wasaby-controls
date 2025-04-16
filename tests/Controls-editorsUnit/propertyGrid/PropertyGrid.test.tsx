/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { ObjectType, NumberType, StringType } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { IPipelineResult } from 'Controls-editors/object-type';
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

    it('На загрузчике типа указаны вложенные категории. Результат: PG выводит вложенные названия категорий', async () => {
        const metaType = ObjectType.properties<any>({
            prop1: StringType.title('prop1').order(1).optional().category('Category1'),
            prop2: StringType.title('prop2').optional().order(4).category('Category3'),
            prop3: StringType.title('prop3').optional().order(5).category('Category4'),
        });

        const configs = {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType,
                    _categories: {
                        Category1: {},
                        Category2: {},
                        Category3: {
                            parent: 'Category2',
                        },
                        Category4: {
                            parent: 'Category2',
                        },
                    },
                },
            },
        };

        const value = {};
        const onChange = jest.fn();
        const loadResults = await Loader.load(configs);

        expect((loadResults.MetaTypeEditors as IPipelineResult).navigation?.length).toEqual(4);

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid
                    metaType={metaType}
                    value={value}
                    storeId={'MetaTypeEditors'}
                    showTooltip={true}
                    groupType={'cloud'}
                    onChange={onChange}
                />
            </Provider>,
            { container }
        );

        expect(container.getElementsByClassName('controls__object-type__group').length).toEqual(4);
        expect(container.getElementsByClassName('PropertyGrid__group__Category2').length).toEqual(
            1
        );
        const category2Group = container
            .getElementsByClassName('PropertyGrid__group__Category2')
            .item(0);

        // Проверяем, что в группе Category2 находятся две подгруппы
        expect(
            category2Group?.getElementsByClassName('PropertyGrid__group__Category3').length
        ).toEqual(1);
        expect(
            category2Group?.getElementsByClassName('PropertyGrid__group__Category4').length
        ).toEqual(1);

        // Проверяем, что в подгруппах выводятся атрибуты
        const category3Group = category2Group
            ?.getElementsByClassName('PropertyGrid__group__Category3')
            .item(0);
        const category4Group = category2Group
            ?.getElementsByClassName('PropertyGrid__group__Category4')
            .item(0);
        expect(
            category3Group?.querySelectorAll('[data-qa="controls-PropertyGrid__editor_prop2"]')
                .length
        ).toEqual(1);
        expect(
            category4Group?.querySelectorAll('[data-qa="controls-PropertyGrid__editor_prop3"]')
                .length
        ).toEqual(1);
    });
});

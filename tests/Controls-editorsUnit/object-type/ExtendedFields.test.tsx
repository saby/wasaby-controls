/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { ObjectType, NumberType, ObjectMeta } from 'Meta/types';
import { getGroupsFromMeta } from 'Controls-editors/_object-type/utils/getGroupsFromMeta';
import { getExtendedAttributesHierarchy } from 'Controls-editors/_object-type/utils/getExtendedItems';
import { ObjectTypeFactory } from 'Controls-editors/_object-type/factory/Factory';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Loader, type TDataConfigs } from 'Controls-DataEnv/dataLoader';
import { Provider } from 'Controls-DataEnv/context';

describe('Controls-editors/object-type Расширенные свойства', () => {
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

    it('На типе две группы. В первой 6 расширенных свойств, во второй все 4. Результат: Группа 1 видима, не extended, Группа 2- не видима, extended.', async () => {
        const metaType = ObjectType.properties({
            prop1: NumberType.order(1).group('1'),
            prop2: NumberType.order(2).group('1'),
            prop3: NumberType.order(3).group('1').icon('icon3').extended(),
            prop4: NumberType.order(4).group('1').icon('icon4').extended(),
            prop5: NumberType.order(5).group('1').icon('icon5').extended(),
            prop6: NumberType.order(6).group('1').icon('icon6').extended(),
            prop7: NumberType.order(7).group('1').icon('icon7').extended(),
            prop8: NumberType.order(8).group('1').icon('icon8').extended(),
            prop11: NumberType.order(11).group('2').icon('icon11').extended(),
            prop12: NumberType.order(12).group('2').icon('icon12').extended(),
            prop13: NumberType.order(13).group('2').icon('icon13').extended(),
            prop14: NumberType.order(14).group('2').icon('icon14').extended(),
        }) as ObjectMeta;

        const loadedData = await ObjectTypeFactory.loadData({
            metaType,
        });
        const getEditorMock = jest.fn(() => {
            return {
                Component: 'test',
            };
        });

        const groups = getGroupsFromMeta(
            loadedData.metaType,
            getEditorMock,
            loadedData.navigation,
            false
        );

        const extendedFields = getExtendedAttributesHierarchy(groups, metaType, {});

        expect(extendedFields.length).toBe(2);
        expect(extendedFields[0].name).toBe('1');
        expect(extendedFields[0].extended).toBeFalsy();
        expect(extendedFields[0].visible).toBeTruthy();
        expect(extendedFields[0].attributes).toEqual([
            { icon: 'icon3', name: 'prop3', title: 'prop3', visible: false },
            { icon: 'icon4', name: 'prop4', title: 'prop4', visible: false },
            { icon: 'icon5', name: 'prop5', title: 'prop5', visible: false },
            { icon: 'icon6', name: 'prop6', title: 'prop6', visible: false },
            { icon: 'icon7', name: 'prop7', title: 'prop7', visible: false },
            { icon: 'icon8', name: 'prop8', title: 'prop8', visible: false },
        ]);

        expect(extendedFields[1].name).toBe('2');
        expect(extendedFields[1].extended).toBeTruthy();
        expect(extendedFields[1].visible).toBeFalsy();
        expect(extendedFields[1].attributes).toEqual([
            { icon: 'icon11', name: 'prop11', title: 'prop11', visible: false },
            { icon: 'icon12', name: 'prop12', title: 'prop12', visible: false },
            { icon: 'icon13', name: 'prop13', title: 'prop13', visible: false },
            { icon: 'icon14', name: 'prop14', title: 'prop14', visible: false },
        ]);
    });

    it('На типе две группы. В первой 6 расширенных свойств, во второй все 4. Результат: в группе 1 выводится 4 чипсы и кнопка Еще, Группа 2 выведена в виде чипсы', async () => {
        const metaType = ObjectType.properties({
            prop1: NumberType.order(1).group('1'),
            prop2: NumberType.order(2).group('1'),
            prop3: NumberType.order(3).group('1').icon('icon3').extended(),
            prop4: NumberType.order(4).group('1').icon('icon4').extended(),
            prop5: NumberType.order(5).group('1').icon('icon5').extended(),
            prop6: NumberType.order(6).group('1').icon('icon6').extended(),
            prop7: NumberType.order(7).group('1').icon('icon7').extended(),
            prop8: NumberType.order(8).group('1').icon('icon8').extended(),
            prop11: NumberType.order(11).group('2').icon('icon11').extended(),
            prop12: NumberType.order(12).group('2').icon('icon12').extended(),
            prop13: NumberType.order(13).group('2').icon('icon13').extended(),
            prop14: NumberType.order(14).group('2').icon('icon14').extended(),
        }) as ObjectMeta;

        const configs: TDataConfigs = {
            MetaTypeEditors: {
                dataFactoryName: 'Controls-editors/object-type:ObjectTypeFactory',
                dataFactoryArguments: {
                    metaType,
                } as any,
            },
        };

        const loadResults = await Loader.load(configs);

        const onChangeHandler = jest.fn();

        render(
            <Provider configs={configs} loadResults={loadResults}>
                <PropertyGrid value={{}} storeId={'MetaTypeEditors'} onChange={onChangeHandler} />
            </Provider>,
            {
                container,
            }
        );

        const containerGroup1 = container.getElementsByClassName('PropertyGrid__group__1')[0];
        // Группа 1 видна
        expect(containerGroup1).toBeDefined();

        // Выводится 4 чипсы с полями
        expect(
            containerGroup1.querySelectorAll('[data-qa^="controls-ObjectType__extended_field"]')
                .length
        ).toEqual(4);
        // В группе 1 выводится кнопка "Еще"
        expect(
            containerGroup1.querySelectorAll('[data-qa="controls-ObjectType__extended_group_more"]')
                .length
        ).toEqual(1);

        // Группа 2 полностью скрыта
        expect(container.getElementsByClassName('PropertyGrid__group__2').length).toBe(0);

        const globalExtendedFieldsContainers = container.getElementsByClassName(
            'controls-ObjectType__extended_fields__global'
        );
        // Количество контейнеров для вывода чипсы для всего PG равно 1, т.к. остальные контейнеры расположены в своих группах
        expect(globalExtendedFieldsContainers.length).toEqual(1);
        const globalExtendedFieldsContainer = globalExtendedFieldsContainers[0];

        // Выводится всего 1 чипса
        expect(
            globalExtendedFieldsContainer.querySelectorAll(
                '[data-qa^="controls-ObjectType__extended"]'
            ).length
        ).toEqual(1);
        expect(
            globalExtendedFieldsContainer.querySelectorAll(
                '[data-qa^="controls-ObjectType__extended"]'
            )[0].textContent
        ).toEqual('2');
    });
});

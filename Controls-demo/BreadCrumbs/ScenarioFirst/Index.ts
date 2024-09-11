import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import controlTemplate = require('wml!Controls-demo/BreadCrumbs/ScenarioFirst/ScenarioFirst');
import firstColumnTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/First/columnTemplate');
import secondColumnTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Second/columnTemplate');
import thirdColumnTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Third/columnTemplate');
import thirdResultTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Third/resultTemplate');
import fourthColumnTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Fourth/columnTemplate');
import fourthResultTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Fourth/resultTemplate');
import secondHeaderTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Second/headerTemplate');
import { scenariosImages } from '../Scenarios/images/Images';

import 'css!Controls-demo/BreadCrumbs/Scenarios/Scenarios';

const lists = [
    {
        data: [
            {
                id: 1,
                parent: null,
                'parent@': true,
                department: 'Разработка',
                head: 'Новиков Д.В.',
                icon: 'icon-16 icon-Company icon-disabled',
                countOfEmployees: 4,
                counterCaption: 4,
            },
            {
                id: 11,
                parent: 1,
                'parent@': null,
                name: 'Новиков Дмитрий',
                photo: scenariosImages.Novikov,
                position: 'Директор департамента разработки',
                phone: '2300',
            },
            {
                id: 12,
                parent: 1,
                'parent@': true,
                department: 'sbis.Communication',
                head: 'Боровиков К.С.',
                icon: 'icon-16 icon-Company icon-disabled',
                countOfEmployees: 3,
                counterCaption: 3,
            },
            {
                id: 121,
                parent: 12,
                'parent@': null,
                name: 'Боровиков Кирилл',
                photo: scenariosImages.Borovikov,
                position: 'Заместитель директора по информационным системам',
                phone: '2500',
            },
            {
                id: 122,
                parent: 12,
                'parent@': true,
                department: 'sbis.Communication и соц.сеть',
                head: 'Жукова О.В.',
                countOfEmployees: 2,
                counterCaption: 2,
            },
            {
                id: 1221,
                parent: 122,
                'parent@': null,
                name: 'Жукова Ольга',
                photo: scenariosImages.Zhukova,
                position: 'Менеджер проекта (2 категории)',
                phone: '2562',
            },
            {
                id: 1222,
                parent: 122,
                'parent@': true,
                department: 'Проектирование',
                head: 'Жукова О.В.',
                countOfEmployees: 1,
                counterCaption: 1,
            },
            {
                id: 12221,
                parent: 1222,
                'parent@': true,
                department: 'Проектирование мобильного приложения',
                countOfEmployees: 1,
                counterCaption: 1,
            },
            {
                id: 122211,
                parent: 12221,
                'parent@': null,
                name: 'Белоконь Дарья',
                photo: scenariosImages.Belokon,
                position: 'Проектировщик пользовательских интерфейсов (3+ категории)',
                phone: '6377',
            },
        ],
        columns: [
            {
                template: firstColumnTemplate,
                width: 'auto',
            },
        ],
        header: null,
    },
    {
        data: [
            {
                id: 1,
                parent: null,
                'parent@': true,
                title: '05. Торговое оборудование',
            },
            {
                id: 12,
                parent: 1,
                'parent@': true,
                title: '02. Онлайн-кассы для 54-ФЗ',
            },
            {
                id: 121,
                parent: 12,
                'parent@': true,
                title: '10. Комплекты модернизации',
            },
            {
                id: 1211,
                parent: 121,
                'parent@': true,
                title: 'Под заказ',
            },
            {
                id: 12111,
                parent: 1211,
                'parent@': true,
                title: '01. Фискальные регистраторы Viki Print',
            },
            {
                id: 121111,
                parent: 12111,
                'parent@': true,
                title: 'С фискальным накопителем на 36 мес.',
            },
            {
                id: 1211111,
                parent: 121111,
                'parent@': null,
                title: 'Фискальный регистратор Viki Print 57 Plus Ф',
                price: 28490,
                remainder: 43,
                free: 40,
                costPrice: 15795,
                amountOfBalance: 28490,
            },
        ],
        columns: [
            {
                displayProperty: 'title',
            },
            {
                displayProperty: 'price',
                align: 'right',
                template: secondColumnTemplate,
                width: '100px',
            },
            {
                displayProperty: 'remainder',
                align: 'right',
                template: secondColumnTemplate,
                width: '100px',
            },
            {
                displayProperty: 'free',
                align: 'right',
                template: secondColumnTemplate,
                width: '100px',
            },
            {
                displayProperty: 'costPrice',
                align: 'right',
                template: secondColumnTemplate,
                width: '100px',
            },
            {
                displayProperty: 'amountOfBalance',
                align: 'right',
                template: secondColumnTemplate,
                width: '150px',
            },
        ],
        header: [
            {
                title: '',
            },
            {
                title: 'Цена',
                align: 'right',
                template: secondHeaderTemplate,
            },
            {
                title: 'Остаток',
                align: 'right',
                template: secondHeaderTemplate,
            },
            {
                title: 'Свободно',
                align: 'right',
                template: secondHeaderTemplate,
            },
            {
                title: 'Себестоимость',
                align: 'right',
                template: secondHeaderTemplate,
            },
            {
                title: 'Сумма остатка',
                align: 'right',
                template: secondHeaderTemplate,
            },
        ],
    },
    {
        data: [
            {
                id: 1,
                parent: null,
                'parent@': true,
                department: 'Технологи',
                overdueStart: 374,
                start: 2226,
                received: 24952,
                overdueCompleted: 2016,
                completed: 24799,
                overdueLeft: 199,
                left: 2379,
            },
            {
                id: 2,
                parent: null,
                'parent@': true,
                department: 'Разработка',
                overdueStart: 5288,
                start: 36544,
                received: 554261,
                overdueCompleted: 24261,
                completed: 553587,
                overdueLeft: 2126,
                left: 37218,
            },
            {
                id: 21,
                parent: 2,
                'parent@': true,
                department: 'Платформа',
                overdueStart: 562,
                start: 2664,
                received: 18513,
                overdueCompleted: 1581,
                completed: 18526,
                overdueLeft: 251,
                left: 2651,
            },
            {
                id: 211,
                parent: 21,
                'parent@': true,
                department: 'Интерфейсный фреймворк',
                overdueStart: 242,
                start: 1234,
                received: 8072,
                overdueCompleted: 528,
                completed: 8038,
                overdueLeft: 134,
                left: 1268,
            },
            {
                id: 2111,
                parent: 211,
                'parent@': true,
                department: 'Контролы',
                overdueStart: 85,
                start: 755,
                received: 5722,
                overdueCompleted: 350,
                completed: 5744,
                overdueLeft: 17,
                left: 733,
            },
            {
                id: 21111,
                parent: 2111,
                'parent@': true,
                department: 'Расширенный набор контролов',
                overdueStart: 22,
                start: 329,
                received: 1484,
                overdueCompleted: 107,
                completed: 1685,
                overdueLeft: 3,
                left: 128,
            },
            {
                id: 211111,
                parent: 21111,
                'parent@': null,
                name: 'Баранов М.А.',
                position: 'Инженер-программист (2 категории)',
                photo: scenariosImages.Baranov,
                start: 35,
                received: 170,
                overdueCompleted: 12,
                completed: 170,
                left: 35,
            },
            {
                id: 211112,
                parent: 21111,
                'parent@': null,
                name: 'Белоконь Д.Д.',
                position: 'Проектировщик пользовательских интерфейсов',
                photo: scenariosImages.Belokon,
                start: 22,
                received: 190,
                overdueCompleted: 6,
                completed: 155,
                left: 35,
            },
            {
                id: 211113,
                parent: 21111,
                'parent@': null,
                name: 'Боровиков К.К.',
                position: 'аместитель директора по информационным системам',
                photo: scenariosImages.Borovikov,
                start: 345,
                received: 234,
                overdueCompleted: 34,
                completed: 342,
                left: 35,
            },
        ],
        columns: [
            {
                displayProperty: 'department',
                template: firstColumnTemplate,
            },
            {
                displayProperty: 'overdueStart',
                template: thirdColumnTemplate,
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 5662,
                width: '100px',
            },
            {
                displayProperty: 'start',
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 38770,
                width: '100px',
            },
            {
                displayProperty: 'received',
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 579213,
                width: '100px',
            },
            {
                displayProperty: 'overdueCompleted',
                template: thirdColumnTemplate,
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 26277,
                width: '100px',
            },
            {
                displayProperty: 'completed',
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 578386,
                width: '100px',
            },
            {
                displayProperty: 'overdueLeft',
                template: thirdColumnTemplate,
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 2325,
                width: '100px',
            },
            {
                displayProperty: 'left',
                align: 'right',
                resultTemplate: thirdResultTemplate,
                result: 39597,
                width: '150px',
            },
        ],
        header: [
            {
                title: '',
            },
            {
                title: '',
            },
            {
                title: 'На начало',
                align: 'right',
            },
            {
                title: 'Получено',
                align: 'right',
            },
            {
                title: '',
            },
            {
                title: 'Выполнено',
                align: 'right',
            },
            {
                title: '',
            },
            {
                title: 'Осталось',
                align: 'right',
            },
        ],
    },
    {
        data: [
            {
                id: 1,
                parent: null,
                'parent@': true,
                title: '05. Торговое оборудование',
                amount: 3611.25,
                price: 3592,
                sum: 12974827.5,
            },
            {
                id: 11,
                parent: 1,
                'parent@': true,
                title: '01. Онлайн-кассы для 54-ФЗ',
                amount: 925,
                price: 10198,
                sum: 9433770,
            },
            {
                id: 111,
                parent: 11,
                'parent@': true,
                title: '01. Фискальные регистраторы',
                amount: 97,
                price: 17090,
                sum: 1656750.0,
            },
            {
                id: 1111,
                parent: 111,
                'parent@': true,
                title: 'С ФН на 36 мес.',
                amount: 25,
                price: 21514,
                sum: 537850.0,
            },
            {
                id: 11111,
                parent: 1111,
                'parent@': null,
                title: 'Фискальный регистратор Viki Print 57Ф (36 мес.)',
                amount: 5,
                price: 16700.0,
                sum: 83500.0,
            },
        ],
        columns: [
            {
                displayProperty: 'title',
                resultTemplate: thirdResultTemplate,
            },
            {
                displayProperty: 'amount',
                align: 'right',
                template: fourthColumnTemplate,
                resultTemplate: fourthResultTemplate,
                result: 317814.01,
                width: '100px',
            },
            {
                displayProperty: 'price',
                align: 'right',
                template: fourthColumnTemplate,
                resultTemplate: fourthResultTemplate,
                result: 311,
                width: '100px',
            },
            {
                displayProperty: 'sum',
                align: 'right',
                template: fourthColumnTemplate,
                resultTemplate: fourthResultTemplate,
                result: 99088195.46,
                width: '100px',
            },
        ],
        header: [
            {
                title: '',
            },
            {
                title: 'Кол-во',
                align: 'right',
            },
            {
                title: 'Ср. цена',
                align: 'right',
            },
            {
                title: 'Сумма',
                align: 'right',
                template: secondHeaderTemplate,
            },
        ],
    },
];

export default class ScenarioFirst extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _columns = lists[0].columns;
    protected _columns1 = lists[1].columns;
    protected _columns2 = lists[2].columns;
    protected _columns3 = lists[3].columns;
    protected _header1 = lists[1].header;
    protected _header2 = lists[2].header;
    protected _header3 = lists[3].header;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BreadCrumbsScenarioFirst0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'department',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[0].data,
                    }),
                    root: 12221,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
            BreadCrumbsScenarioFirst1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[1].data,
                    }),
                    root: 121111,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
            BreadCrumbsScenarioFirst2: {
                dataFactoryName: 'Controls-demo/BreadCrumbs/ScenarioFirst/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'department',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[2].data,
                    }),
                    root: 21111,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
            BreadCrumbsScenarioFirst3: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[3].data,
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}

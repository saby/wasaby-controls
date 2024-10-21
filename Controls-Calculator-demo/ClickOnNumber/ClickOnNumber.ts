import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Calculator-demo/ClickOnNumber/ClickOnNumber';
import 'css!Controls-Calculator-demo/ClickOnNumber/ClickOnNumber';
import { Memory } from 'Types/source';

export default class ClickOnNumber extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = new Memory({
        keyProperty: 'id',
        data: [
            {
                id: 0,
                number: 1,
                country: 'Россия',
                capital: 'Москва',
                population: 143420300,
                square: 17075200,
                populationDensity: 8,
            },
            {
                id: 1,
                number: 2,
                country: 'Канада',
                capital: 'Оттава',
                population: 32805000,
                square: 9976140,
                populationDensity: 3,
            },
            {
                id: 2,
                number: 3,
                country: 'США',
                capital: 'Вашингтон',
                population: 295734100,
                square: 9629091,
                populationDensity: 30.71,
            },
        ],
    });
}

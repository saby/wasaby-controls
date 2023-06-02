import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/CaptionOptions/Hierarchy/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = {
            firstParentChild: 'Значение ребенка первого родителя',
            secondParentChild: 'Значение ребенка второго родителя',
            thirdParentFirstChild: 'Значение первого ребенка третьего родителя',
            thirdParentSecondChild:
                'Значение второго ребенка третьего родителя',
        };

        this._typeDescription = [
            {
                name: 'firstParent',
                caption: 'Первый родитель',
                '@parent': true,
                parent: null,
            },
            {
                name: 'secondParent',
                caption: 'Второй родитель',
                '@parent': true,
                parent: null,
            },
            {
                name: 'thirdParent',
                caption: 'Третий родитель',
                '@parent': true,
                parent: null,
            },
            {
                name: 'firstParentChild',
                caption: 'Ребенок первого родителя',
                '@parent': null,
                parent: 'firstParent',
                captionOptions: {
                    fontSize: 'xl',
                    fontColorStyle: 'label',
                },
            },
            {
                name: 'secondParentChild',
                caption: 'Ребенок второго родителя',
                '@parent': null,
                parent: 'secondParent',
            },
            {
                name: 'thirdParentFirstChild',
                caption: 'Ребенок второго родителя',
                '@parent': null,
                parent: 'thirdParent',
            },
            {
                name: 'thirdParentSecondChild',
                caption: 'Ребенок второго родителя',
                '@parent': null,
                parent: 'thirdParent',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}

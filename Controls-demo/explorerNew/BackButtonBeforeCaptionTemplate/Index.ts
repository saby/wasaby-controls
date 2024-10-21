import { HierarchicalMemory } from 'Types/source';
import { PersonsImages } from 'Controls-demo/DemoData';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as indexTemplate from 'wml!Controls-demo/explorerNew/BackButtonBeforeCaptionTemplate/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = indexTemplate;

    protected _root: number = null;

    protected _source: HierarchicalMemory;

    protected _beforeMount(): void {
        this._source = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [
                {
                    id: 1,
                    node: true,
                    parent: null,
                    title: 'папки с иконками',
                    icon: 'icon-TFFavorite',
                    image: null,
                },
                {
                    id: 11,
                    node: true,
                    parent: 1,
                    title: 'Actor',
                    icon: 'icon-Actor',
                    image: null,
                },
                {
                    id: 111,
                    node: true,
                    parent: 11,
                    title: 'Android',
                    icon: 'icon-Android',
                    image: null,
                },
                {
                    id: 2,
                    node: true,
                    parent: null,
                    title: 'папки с карниками',
                    icon: null,
                    image: PersonsImages.Baranov,
                },
                {
                    id: 21,
                    node: true,
                    parent: 2,
                    title: 'папка 1',
                    icon: null,
                    image: PersonsImages.Belokon,
                },
                {
                    id: 211,
                    node: true,
                    parent: 21,
                    title: 'папка 2',
                    icon: null,
                    image: PersonsImages.Novikov,
                },
            ],
        });
    }
}

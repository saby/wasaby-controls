import { Enum } from 'Types/collection';
import { IProperty } from 'Controls/propertyGrid';

function getEditingObject(): object {
    return {
        description: 'This is http://mysite.com',
        tileView: true,
        showBackgroundImage: true,
        siteUrl: 'http://mysite.com',
        videoSource: 'http://youtube.com/video',
        backgroundType: new Enum({
            dictionary: ['Фоновое изображение', 'Заливка цветом'],
            index: 0,
        }),
    };
}

function getSource(): IProperty[] {
    return [
        {
            name: 'description',
            caption: 'Описание',
            editorOptions: {
                minLines: 3,
            },
            editorClass: 'controls-demo-pg-text-editor',
            group: 'text',
            type: 'text',
        },
        {
            name: 'tileView',
            caption: 'Список плиткой',
            group: 'boolean',
        },
        {
            name: 'showBackgroundImage',
            caption: 'Показывать изображение',
            group: 'boolean',
        },
        {
            caption: 'URL',
            name: 'siteUrl',
            group: 'string',
        },
        {
            name: 'videoSource',
            group: 'string',
        },
        {
            caption: 'Тип фона',
            name: 'backgroundType',
            group: 'enum',
            editorClass: 'controls-demo-pg-enum-editor',
        },
    ];
}

export { getEditingObject, getSource };

import { Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/News/News';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Images } from './Images';

const itemActions: IItemAction[] = [
    {
        id: 'read',
        icon: 'icon-PhoneNull',
        title: 'Прочитано',
        showType: 2,
    },
    {
        id: 2,
        icon: 'icon-Picture',
        title: 'Картинки',
        handler: () => {
            this._isPhotoVisible = !this._isPhotoVisible;
        },
        showType: 2,
    },
    {
        id: 3,
        icon: 'icon-Erase',
        title: 'Удалить',
        iconStyle: 'danger',
        showType: 2,
    },
    {
        id: 4,
        icon: 'icon-Favorite',
        title: 'В избранные',
        showType: 2,
    },
    {
        id: 5,
        icon: 'icon-EmptyMessage',
        title: 'В избранные2',
        showType: 2,
    },
];

function getData() {
    return [
        {
            id: 0,
            authorPhoto: Images.groups.mili,
            author: '"Мили"',
            date: 'сегодня 15:00',
            title: 'Бизнес-ланч',
            text: 'Соскучились по чему - то новенькому? Приглашаем Вас на обед - сегодня в "Мили" паста по - флорентийски, картофельный суп с сырными шариками и лёгкий салат с редисом и сельдереем - специально для тех, кто следит за фигурой. 😊',
            photo: Images.groups.menu,
            isNew: true,
        },
        {
            id: 1,
            authorPhoto: Images.groups.development,
            author: 'Чиркова В.',
            orgName: 'Организация разработки',
            date: 'сегодня 13:48',
            title: 'Предварительный план выпуска 3.18.600',
            text: '09.11.18 - Пятница\nВыпускающий - Рескайс А\nОбновление окружения\nИ ещё текст',
            isNew: true,
        },
        {
            id: 2,
            authorPhoto: Images.groups.development,
            author: 'Суконина М.',
            orgName: 'Организация разработки',
            date: 'сегодня 12:31',
            title: 'Опубликован план выпуска на ноябрь 2018',
            text: 'ссылка\nв две строки',
            isNew: true,
        },
        {
            id: 3,
            authorPhoto: Images.groups.development,
            author: 'Суконина М.',
            orgName: 'Организация разработки',
            date: 'сегодня 12:33',
            title: 'Маленькая новость',
            text: '',
            isNew: true,
        },
        {
            id: 4,
            authorPhoto: Images.groups.development,
            author: 'Суконина М.',
            orgName: 'Организация разработки',
            date: 'сегодня 12:30',
            title: 'Опубликован план выпуска на ноябрь 2017',
            text: 'текст\nв\nцелых\nпять\nстрок',
            isNew: true,
        },
        {
            id: 5,
            authorPhoto: Images.staff.golubev,
            author: 'Голубев А.',
            orgName: 'HL/HA',
            date: 'сегодня 11:08',
            title: 'HL/HA: Гороскоп на неделю',
            text: 'Всегда с вами, любящая вас, группа HL/HA',
            banner: Images.groups.banner,
            isNew: false,
        },
        {
            id: 6,
            authorPhoto: Images.groups.sbis,
            author: 'Гребенкина А.',
            orgName: 'Тензор Ярославль',
            date: '1 ноя 14:37',
            text: 'Ваша машина мешает',
            isNew: false,
        },
    ];
}

export default class News extends Control {
    protected _template: Function = template;
    protected _itemActions: IItemAction[];
    protected _source: Memory;
    protected _isPhotoVisible: boolean = true;

    _beforeMount(): void {
        this._itemActions = itemActions;
    }

    protected _visibilityCallback(action: IItemAction, item: Model): boolean {
        if (item.getKey() === 2) {
            return action.id === 3;
        }
        if (action.title === 'Прочитано') {
            return item.get('isNew');
        }
        return true;
    }

    static _styles: string[] = ['Controls-demo/List/Swipe/Scenarios/News/News'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SwipeNews: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    markerVisibility: 'hidden',
                },
            },
        };
    }
}

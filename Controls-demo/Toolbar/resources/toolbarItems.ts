import { showType } from 'Controls/toolbars';

export const data = {
    getDefaultItems: () => {
        return [
            {
                id: '1',
                showType: showType.TOOLBAR,
                icon: 'icon-Time',
                '@parent': false,
                parent: null,
                viewMode: 'iconToolbar',
            },
            {
                id: '3',
                icon: 'icon-Print',
                title: 'Распечатать',
                caption: 'Распечатать',
                viewMode: 'link',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                icon: 'icon-Linked',
                fontColorStyle: 'secondary',
                viewMode: 'ghost',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Связанные документы',
                '@parent': true,
                parent: null,
            },
            {
                id: '5',
                viewMode: 'link',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null,
            },
            {
                id: '6',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
                readOnly: true,
            },
            {
                id: '7',
                showType: showType.MENU_TOOLBAR,
                title: 'Проекту',
                caption: 'Проекту',
                viewMode: 'link',
                '@parent': false,
                parent: '4',
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '4',
            },
            {
                id: '9',
                showType: showType.MENU,
                title: 'Согласование',
                '@parent': false,
                parent: '2',
            },
            {
                id: '10',
                showType: showType.MENU,
                title: 'Задача',
                '@parent': false,
                parent: '2',
            },
            {
                id: '11',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
                readOnly: true,
            },
            {
                id: '12',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '11',
            },
            {
                id: '13',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '11',
            },
            {
                id: '14',
                showType: showType.MENU,
                icon: 'icon-Groups',
                fontColorStyle: 'secondary',
                title: 'Совещания',
                '@parent': false,
                parent: null,
                additional: true,
            },
            {
                id: '2',
                showType: showType.MENU,
                icon: 'icon-Report',
                fontColorStyle: 'secondary',
                title: 'Список задач',
                '@parent': true,
                parent: null,
                additional: true,
            },
        ];
    },
    getDefaultItemsWithoutToolButton: () => {
        return [
            {
                id: '1',
                icon: 'icon-Print',
                title: 'Распечатать',
                caption: 'Распечатать',
                viewMode: 'link',
                readOnly: false,
                '@parent': false,
                parent: null,
            },
            {
                id: '2',
                viewMode: 'link',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null,
            },
            {
                id: '3',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                showType: showType.MENU,
                title: 'Проекту',
                '@parent': false,
                parent: '3',
            },
            {
                id: '5',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '3',
            },
            {
                id: '6',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
            },
            {
                id: '7',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '6',
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '6',
            },
        ];
    },
    getItemsWithReadOnly: () => {
        return [
            {
                id: '1',
                icon: 'icon-Print',
                title: 'Распечатать',
                readOnly: true,
                '@parent': false,
                parent: null,
                viewMode: 'iconToolbar',
            },
            {
                id: '2',
                viewMode: 'link',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null,
            },
            {
                id: '3',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                showType: showType.MENU,
                title: 'Проекту',
                '@parent': false,
                parent: '3',
            },
            {
                id: '5',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '3',
            },
            {
                id: '6',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
            },
            {
                id: '7',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '6',
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '6',
            },
        ];
    },
    getFlatItems: () => {
        return [
            {
                id: '1',
                showType: showType.TOOLBAR,
                icon: 'icon-Time',
                fontColorStyle: 'secondary',
                viewMode: 'ghost',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Время',
                '@parent': true,
                parent: null,
            },
            {
                id: '2',
                showType: showType.TOOLBAR,
                icon: 'icon-Linked',
                fontColorStyle: 'secondary',
                viewMode: 'ghost',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Связанные документы',
            },
            {
                id: '3',
                showType: showType.TOOLBAR,
                icon: 'icon-Author',
                fontColorStyle: 'secondary',
                viewMode: 'ghost',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Автор',
            },
            {
                id: '4',
                showType: showType.TOOLBAR,
                icon: 'icon-RoundPlus',
                fontColorStyle: 'secondary',
                viewMode: 'filled',
                iconStyle: 'contrast',
                title: 'Добавить',
                '@parent': true,
                parent: null,
            },
        ];
    },
    getGroupedItems: () => {
        return [
            {
                id: '1',
                showType: showType.TOOLBAR,
                icon: 'icon-Time',
                '@parent': false,
                group: 'group1',
                parent: null,
            },
            {
                id: '3',
                icon: 'icon-Print',
                title: 'Распечатать',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                icon: 'icon-Linked',
                fontColorStyle: 'secondary',
                viewMode: 'ghost',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Связанные документы',
                '@parent': true,
                group: 'group1',
                parent: null,
            },
            {
                id: '5',
                viewMode: 'link',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                group: 'group2',
                parent: null,
            },
            {
                id: '6',
                showType: showType.MENU,
                title: 'Прикрепить к',
                '@parent': false,
                parent: null,
                group: 'group2',
                readOnly: true,
            },
            {
                id: '7',
                showType: showType.MENU,
                title: 'Проекту',
                '@parent': false,
                group: 'group4',
                parent: '4',
            },
            {
                id: '8',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                group: 'group5',
                parent: '4',
            },
            {
                id: '9',
                showType: showType.MENU,
                title: 'Согласование',
                '@parent': false,
                group: 'group3',
                parent: '2',
            },
            {
                id: '10',
                showType: showType.MENU,
                title: 'Задача',
                '@parent': false,
                group: 'group3',
                parent: '2',
            },
            {
                id: '11',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                group: 'group3',
                parent: null,
                readOnly: true,
            },
            {
                id: '12',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                group: 'group3',
                parent: '11',
            },
            {
                id: '13',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                group: 'group3',
                parent: '11',
            },
            {
                id: '14',
                showType: showType.MENU,
                icon: 'icon-Groups',
                fontColorStyle: 'secondary',
                title: 'Совещания',
                '@parent': false,
                group: 'group3',
                parent: null,
                additional: true,
            },
            {
                id: '2',
                showType: showType.MENU,
                icon: 'icon-Report',
                fontColorStyle: 'secondary',
                title: 'Список задач',
                '@parent': true,
                parent: null,
                group: 'group3',
                additional: true,
            },
        ];
    },
    getItemsWithDirection: () => {
        return [
            {
                id: '1',
                icon: 'icon-Time',
                viewMode: 'filled',
                buttonStyle: 'pale',
                inlineHeight: 'l',
                '@parent': false,
                title: 'Отметить время',
                parent: null,
            },
            {
                id: '2',
                icon: 'icon-Linked',
                fontColorStyle: 'secondary',
                viewMode: 'filled',
                buttonStyle: 'pale',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Связанные документы',
                '@parent': true,
                parent: null,
            },
            {
                id: '3',
                viewMode: 'link',
                icon: 'icon-Link',
                title: 'Скопировать в буфер',
                '@parent': false,
                parent: null,
            },
            {
                id: '4',
                icon: 'icon-EmptyMessage',
                fontColorStyle: 'secondary',
                showHeader: true,
                viewMode: 'link',
                iconStyle: 'secondary',
                contrastBackground: true,
                title: 'Обсудить',
                '@parent': true,
                parent: null,
                readOnly: true,
            },
            {
                id: '5',
                showType: showType.MENU,
                title: 'Видеозвонок',
                '@parent': false,
                parent: '7',
            },
            {
                id: '6',
                showType: showType.MENU,
                title: 'Сообщение',
                '@parent': false,
                parent: '7',
            },
            {
                id: '7',
                showType: showType.MENU,
                icon: 'icon-Groups',
                fontColorStyle: 'secondary',
                title: 'Совещания',
                '@parent': null,
                parent: null,
                additional: true,
            },
            {
                id: '8',
                showType: showType.MENU,
                icon: 'icon-Report',
                fontColorStyle: 'secondary',
                title: 'Список задач',
                '@parent': true,
                parent: null,
                additional: true,
            },
            {
                id: '21',
                showType: showType.MENU,
                title: 'Проекту',
                viewMode: 'link',
                '@parent': false,
                parent: '2',
            },
            {
                id: '22',
                showType: showType.MENU,
                title: 'Этапу',
                '@parent': false,
                parent: '2',
            },
            {
                id: '81',
                showType: showType.MENU,
                title: 'Согласование',
                '@parent': true,
                parent: '8',
            },
            {
                id: '811',
                showType: showType.MENU,
                title: 'Срок',
                '@parent': false,
                parent: '81',
            },
            {
                id: '812',
                showType: showType.MENU,
                title: 'План',
                '@parent': false,
                parent: '81',
            },
            {
                id: '82',
                showType: showType.MENU,
                title: 'Задача',
                '@parent': false,
                parent: '8',
            },
            {
                id: '9',
                viewMode: 'link',
                icon: 'icon-ArrangePreview',
                title: 'Вид',
                '@parent': true,
                parent: null,
            },
            {
                id: '91',
                showType: showType.MENU,
                icon: 'icon-ArrangePreview',
                isUpdateIcon: true,
                title: 'Плитка',
                '@parent': false,
                parent: '9',
            },
            {
                id: '92',
                showType: showType.MENU,
                icon: 'icon-Burger',
                isUpdateIcon: true,
                title: 'Список',
                '@parent': false,
                parent: '9',
            },
        ];
    },
};

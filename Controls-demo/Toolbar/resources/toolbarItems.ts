import {showType} from 'Controls/toolbars';

export const data = {
    getDefaultItems: () => ([
        {
            id: '1',
            showType: showType.TOOLBAR,
            icon: 'icon-Time',
            '@parent': false,
            parent: null
        }, {
            id: '3',
            icon: 'icon-Print',
            title: 'Распечатать',
            '@parent': false,
            parent: null
        }, {
            id: '4',
            icon: 'icon-Linked',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы',
            '@parent': true,
            parent: null
        }, {
            id: '5',
            viewMode: 'icon',
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null
        }, {
            id: '6',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null,
            readOnly: true
        }, {
            id: '7',
            showType: showType.MENU_TOOLBAR,
            title: 'Проекту',
            '@parent': false,
            parent: '4'
        }, {
            id: '8',
            showType: showType.MENU,
            title: 'Этапу',
            '@parent': false,
            parent: '4'
        }, {
            id: '9',
            showType: showType.MENU,
            title: 'Согласование',
            '@parent': false,
            parent: '2'
        }, {
            id: '10',
            showType: showType.MENU,
            title: 'Задача',
            '@parent': false,
            parent: '2'
        }, {
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
            readOnly: true
        }, {
            id: '12',
            showType: showType.MENU,
            title: 'Видеозвонок',
            '@parent': false,
            parent: '11'
        }, {
            id: '13',
            showType: showType.MENU,
            title: 'Сообщение',
            '@parent': false,
            parent: '11'
        }, {
            id: '14',
            showType: showType.MENU,
            icon: 'icon-Groups',
            fontColorStyle: 'secondary',
            title: 'Совещания',
            '@parent': false,
            parent: null,
            additional: true
        }, {
            id: '2',
            showType: showType.MENU,
            icon: 'icon-Report',
            fontColorStyle: 'secondary',
            title: 'Список задач',
            '@parent': true,
            parent: null,
            additional: true
        }
    ]),
    getDefaultItemsWithoutToolButton: () => ([
        {
            id: '1',
            icon: 'icon-Print',
            title: 'Распечатать',
            readOnly: false,
            '@parent': false,
            parent: null
        }, {
            id: '2',
            viewMode: 'icon',
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null
        }, {
            id: '3',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null
        }, {
            id: '4',
            showType: showType.MENU,
            title: 'Проекту',
            '@parent': false,
            parent: '3'
        }, {
            id: '5',
            showType: showType.MENU,
            title: 'Этапу',
            '@parent': false,
            parent: '3'
        }, {
            id: '6',
            icon: 'icon-EmptyMessage',
            fontColorStyle: 'secondary',
            showHeader: true,
            viewMode: 'link',
            contrastBackground: true,
            title: 'Обсудить',
            '@parent': true,
            parent: null,
        }, {
            id: '7',
            showType: showType.MENU,
            title: 'Видеозвонок',
            '@parent': false,
            parent: '6'
        }, {
            id: '8',
            showType: showType.MENU,
            title: 'Сообщение',
            '@parent': false,
            parent: '6'
        }
    ]),
    getItemsWithReadOnly: () => ([
        {
            id: '1',
            icon: 'icon-Print',
            title: 'Распечатать',
            readOnly: true,
            '@parent': false,
            parent: null
        }, {
            id: '2',
            viewMode: 'icon',
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null
        }, {
            id: '3',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null
        }, {
            id: '4',
            showType: showType.MENU,
            title: 'Проекту',
            '@parent': false,
            parent: '3'
        }, {
            id: '5',
            showType: showType.MENU,
            title: 'Этапу',
            '@parent': false,
            parent: '3'
        }, {
            id: '6',
            icon: 'icon-EmptyMessage',
            fontColorStyle: 'secondary',
            showHeader: true,
            viewMode: 'link',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Обсудить',
            '@parent': true,
            parent: null
        }, {
            id: '7',
            showType: showType.MENU,
            title: 'Видеозвонок',
            '@parent': false,
            parent: '6'
        }, {
            id: '8',
            showType: showType.MENU,
            title: 'Сообщение',
            '@parent': false,
            parent: '6'
        }
    ]),
    getFlatItems: () => ([
        {
            id: '1',
            showType: showType.TOOLBAR,
            icon: 'icon-Time',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Время',
            '@parent': true,
            parent: null
        }, {
            id: '2',
            showType: showType.TOOLBAR,
            icon: 'icon-Linked',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы'
        }, {
            id: '3',
            showType: showType.TOOLBAR,
            icon: 'icon-Author',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Автор'
        }, {
            id: '4',
            showType: showType.TOOLBAR,
            icon: 'icon-RoundPlus',
            fontColorStyle: 'secondary',
            viewMode: 'functionalButton',
            iconStyle: 'contrast',
            title: 'Добавить',
            '@parent': true,
            parent: null
        }
    ]),
    getGroupedItems: () => ([
        {
            id: '1',
            showType: showType.TOOLBAR,
            icon: 'icon-Time',
            '@parent': false,
            group: 'group1',
            parent: null
        }, {
            id: '3',
            icon: 'icon-Print',
            title: 'Распечатать',
            '@parent': false,
            group: 'group1',
            parent: null
        }, {
            id: '4',
            icon: 'icon-Linked',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы',
            '@parent': true,
            group: 'group1',
            parent: null
        }, {
            id: '5',
            viewMode: 'icon',
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            group: 'group2',
            parent: null
        }, {
            id: '6',
            showType: showType.MENU,
            title: 'Прикрепить к',
            '@parent': false,
            parent: null,
            group: 'group2',
            readOnly: true
        }, {
            id: '7',
            showType: showType.MENU_TOOLBAR,
            title: 'Проекту',
            '@parent': false,
            group: 'group2',
            parent: '4'
        }, {
            id: '8',
            showType: showType.MENU,
            title: 'Этапу',
            '@parent': false,
            group: 'group3',
            parent: '4'
        }, {
            id: '9',
            showType: showType.MENU,
            title: 'Согласование',
            '@parent': false,
            group: 'group3',
            parent: '2'
        }, {
            id: '10',
            showType: showType.MENU,
            title: 'Задача',
            '@parent': false,
            group: 'group3',
            parent: '2'
        }, {
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
            readOnly: true
        }, {
            id: '12',
            showType: showType.MENU,
            title: 'Видеозвонок',
            '@parent': false,
            group: 'group3',
            parent: '11'
        }, {
            id: '13',
            showType: showType.MENU,
            title: 'Сообщение',
            '@parent': false,
            group: 'group3',
            parent: '11'
        }, {
            id: '14',
            showType: showType.MENU,
            icon: 'icon-Groups',
            fontColorStyle: 'secondary',
            title: 'Совещания',
            '@parent': false,
            group: 'group3',
            parent: null,
            additional: true
        }, {
            id: '2',
            showType: showType.MENU,
            icon: 'icon-Report',
            fontColorStyle: 'secondary',
            title: 'Список задач',
            '@parent': true,
            parent: null,
            group: 'group3',
            additional: true
        }
    ]),
    getItemsWithDirection: () => ([
        {
            id: '1',
            showType: showType.TOOLBAR,
            icon: 'icon-Time',
            viewMode: 'functionalButton',
            buttonStyle: 'pale',
            inlineHeight: 'l',
            '@parent': false,
            parent: null
        }, {
            id: '2',
            icon: 'icon-Linked',
            fontColorStyle: 'secondary',
            viewMode: 'toolButton',
            iconStyle: 'secondary',
            contrastBackground: true,
            title: 'Связанные документы',
            '@parent': true,
            parent: null
        }, {
            id: '3',
            viewMode: 'icon',
            icon: 'icon-Link',
            title: 'Скопировать в буфер',
            '@parent': false,
            parent: null
        }, {
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
            readOnly: true
        }, {
            id: '5',
            showType: showType.MENU,
            title: 'Видеозвонок',
            '@parent': false,
            parent: '7'
        }, {
            id: '6',
            showType: showType.MENU,
            title: 'Сообщение',
            '@parent': false,
            parent: '7'
        }, {
            id: '7',
            showType: showType.MENU,
            icon: 'icon-Groups',
            fontColorStyle: 'secondary',
            title: 'Совещания',
            '@parent': false,
            parent: null,
            additional: true
        }, {
            id: '8',
            showType: showType.MENU,
            icon: 'icon-Report',
            fontColorStyle: 'secondary',
            title: 'Список задач',
            '@parent': true,
            parent: null,
            additional: true
        }
    ]),
};

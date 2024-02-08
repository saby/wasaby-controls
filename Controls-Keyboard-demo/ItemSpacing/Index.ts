import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { IKeyboardItem } from 'Controls-Keyboard/View';
import * as template from 'wml!Controls-Keyboard-demo/ItemSpacing/Template';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: IKeyboardItem[][] = [
        [
            {
                type: 'input',
                value: '1',
                caption: '1',
                tooltip: 'number one (1)',
            },
            {
                type: 'input',
                value: '2',
                caption: '2',
            },
            {
                type: 'input',
                value: '3',
                caption: '3',
            },
            {
                type: 'action',
                value: 'mute',
                icon: 'icon-MicrophoneOff',
                buttonStyle: 'pale',
                iconSize: 's',
            },
        ],
        [
            {
                type: 'input',
                value: '4',
                caption: '4',
            },
            {
                type: 'input',
                value: '5',
                caption: '5',
            },
            {
                type: 'input',
                value: '6',
                caption: '6',
            },
            {
                type: 'action',
                value: 'share',
                icon: 'icon-Publish2',
                buttonStyle: 'pale',
                iconSize: 's',
            },
        ],
        [
            {
                type: 'input',
                value: '7',
                caption: '7',
            },
            {
                type: 'input',
                value: '8',
                caption: '8',
            },
            {
                type: 'input',
                value: '9',
                caption: '9',
            },
            {
                type: 'action',
                value: 'hold',
                icon: 'icon-Pause',
                iconSize: 's',
                buttonStyle: 'pale',
                tooltip: 'hold the call to call someone else',
            },
        ],
        [
            {
                type: 'action',
                value: 'asterisk',
                icon: 'icon-Asterisk',
                iconSize: 's',
                fontColorStyle: 'unaccented',
                buttonStyle: 'unaccented',
            },
            {
                type: 'input',
                value: '0',
                caption: '0',
            },
            {
                type: 'action',
                value: 'sharp',
                caption: '#',
                fontColorStyle: 'unaccented',
                buttonStyle: 'unaccented',
            },
            {
                type: 'mainAction',
                value: 'call',
                icon: 'icon-Call',
                buttonStyle: 'translucent',
                iconSize: 's',
            },
        ],
    ];
}
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import controlTemplate = require('wml!Controls-demo/Application/Zoom/Index');
import 'css!Controls-demo/Application/Zoom/Index';
import { HierarchicalMemory, Memory } from 'Types/source';
import { DialogOpener, StackOpener, StickyOpener } from 'Controls/popup';
import { Controller } from 'Controls/popup';
const ZOOM_SIZES = [0.75, 0.85, 1, 1.15, 1.3].map((key) => {
    return { key };
});

export default class Stack extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _zoom: number[] = [1];
    protected _zoomDdlSource: Memory = new Memory({
        keyProperty: 'key',
        data: ZOOM_SIZES,
    });
    protected _hierarchySource: Memory = new Memory({
        data: [
            { key: 1, title: 'Task', '@parent': true, parent: null },
            {
                key: 2,
                title: 'Error in the development',
                '@parent': false,
                parent: null,
            },
            { key: 3, title: 'Commission', parent: 1 },
            { key: 4, title: 'Coordination', parent: 1, '@parent': true },
            { key: 5, title: 'Application', parent: 1 },
            { key: 6, title: 'Development', parent: 1 },
            { key: 7, title: 'Exploitation', parent: 1 },
            { key: 8, title: 'Coordination', parent: 4 },
            { key: 9, title: 'Negotiate the discount', parent: 4 },
            {
                key: 10,
                title: 'Coordination of change prices',
                parent: 4,
                '@parent': true,
            },
            { key: 11, title: 'Matching new dish', parent: 4 },
            { key: 12, title: 'New level', parent: 10 },
            { key: 13, title: 'New level record 2', parent: 10 },
            {
                key: 14,
                title: 'New level record 3',
                parent: 10,
                '@parent': true,
            },
            { key: 15, title: 'Very long hierarchy', parent: 14 },
            {
                key: 16,
                title: 'Very long hierarchy 2',
                parent: 14,
                '@parent': true,
            },
            { key: 17, title: 'Very long hierarchy 3', parent: 14 },
            { key: 18, title: 'It is last level', parent: 16 },
            { key: 19, title: 'It is last level 2', parent: 16 },
            { key: 20, title: 'It is last level 3', parent: 16 },
        ],
        keyProperty: 'key',
    });
    protected _openStack(): void {
        new StackOpener().open({
            opener: this,
            minimizedWidth: 600,
            minWidth: 600,
            width: 600,
            maxWidth: 800,
            template: 'Controls-demo/Popup/Opener/resources/StackTemplate',
            templateOptions: {
                maximized: true,
                maximizedButtonVisibility: true,
            },
        });
    }
    protected _openDialog(): void {
        new DialogOpener().open({
            opener: this,
            closeOnOutsideClick: true,
            templateOptions: {
                canTemplateDrag: true,
            },
            propStorageId: 'draggableDialog',
            maxHeight: 700,
            width: 600,
            template: 'Controls-demo/Popup/Opener/resources/DialogTpl',
            minWidth: 500,
        });
    }
    protected _contextMenuHandler(event: SyntheticEvent<MouseEvent>): void {
        event.preventDefault();
        new StickyOpener().open({
            opener: this,
            nativeEvent: event.nativeEvent,
            closeOnOutsideClick: true,
            maxHeight: 700,
            width: 600,
            template: 'Controls-demo/Popup/Opener/resources/DialogTpl',
            minWidth: 500,
        });
    }

    protected _selectedKeysChangedHandler(): void {
        this._notify('workspaceResize', [], { bubbling: true });
    }
}

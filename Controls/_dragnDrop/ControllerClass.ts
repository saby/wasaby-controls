/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
import { RegisterClass } from 'Controls/event';
import { DialogOpener } from 'Controls/popup';
import { IDragObject } from './Container';
import { Control, TemplateFunction } from 'UI/Base';
import { DimensionsMeasurer } from 'Controls/sizeUtils';

interface IRegisters {
    [name: string]: RegisterClass;
}

class ControllerClass {
    _registers: IRegisters = {};
    _draggingTemplateOptions: object;
    _draggingTemplate: object;
    _dialogOpener: DialogOpener;
    _dragObject: IDragObject;

    constructor() {
        this.createRegisters();
        this._dialogOpener = new DialogOpener();
    }

    createRegisters(): void {
        const registers = ['documentDragEnd', 'documentDragStart'];
        registers.forEach((register) => {
            this._registers[register] = new RegisterClass({ register });
        });
    }

    registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void | IDragObject {
        if (this._registers[registerType]) {
            const registered = this._registers[registerType].register(
                event,
                registerType,
                component,
                callback,
                config
            );
            // Возвращаем объект, чтобы списки которые замаунтились после начала ДнД могли об этом узнать.
            if (registered && registerType === 'documentDragStart') {
                return this._dragObject;
            }
        }
    }

    unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        config: object
    ): void {
        if (this._registers[registerType]) {
            this._registers[registerType].unregister(event, registerType, component, config);
        }
    }

    destroy(): void {
        for (const register in this._registers) {
            if (this._registers[register]) {
                this._registers[register].destroy();
            }
        }
        this._dialogOpener.destroy();
        this._dialogOpener = null;
    }

    documentDragStart(dragObject: IDragObject): void {
        this._dragObject = dragObject;
        this._registers.documentDragStart.start(dragObject);
    }

    documentDragEnd(dragObject: IDragObject): void {
        this._dragObject = null;
        this._registers.documentDragEnd.start(dragObject);
        this._dialogOpener.close();
    }

    updateDraggingTemplate(
        draggingTemplateOptions: IDragObject,
        draggingTpl: TemplateFunction
    ): void {
        const zoomValue = DimensionsMeasurer.getZoomValue() || 1;
        this._dialogOpener.open({
            topPopup: true,
            fittingMode: 'overflow',
            opener: null,
            autofocus: false,
            template: 'Controls/dragnDrop:DraggingTemplateWrapper',
            className: 'controls-DragNDrop__draggingTemplatePopup',
            templateOptions: {
                draggingTemplateOptions,
                draggingTemplate: draggingTpl,
            },
            top:
                (draggingTemplateOptions.position.y +
                    draggingTemplateOptions.draggingTemplateOffset) /
                zoomValue,
            left:
                (draggingTemplateOptions.position.x +
                    draggingTemplateOptions.draggingTemplateOffset) /
                zoomValue,
            restrictiveContainer: 'body',
        });
    }

    removeDraggingTemplate(): void {
        this._dialogOpener.close();
    }
    private static _isDragging: boolean;

    static _dragStart(): void {
        this._isDragging = true;
    }

    static _dragEnd(): void {
        this._isDragging = false;
    }

    static isDragging(): boolean {
        return this._isDragging;
    }
}

export default ControllerClass;

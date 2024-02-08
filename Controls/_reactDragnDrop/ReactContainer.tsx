/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor } from 'Types/entity';
import { detection } from 'Env/Env';
import { Bus as EventBus } from 'Env/Event';
import { ControllerClass } from 'Controls/dragnDrop';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { Guid } from 'Types/entity';
import 'css!Controls/dragnDrop';

interface IReactContainerProps {
    resetTextSelection?: boolean;
    draggingTemplateOffset?: number;
    draggingTemplate?: React.Component;
    registerMouseMove: (onMouseMove: Function, onTouchMove: Function, container: object) => void;
    unregisterMouseMove: (container: object) => void;
    registerMouseUp: (onMouseUp: Function, container: object) => void;
    unregisterMouseUp: (container: object) => void;
    registerDocumentDrag: (
        documentDragStart: Function,
        documentDragEnd: Function,
        container: object
    ) => void;
    unregisterDocumentDrag: (container: object) => void;
    documentDragStart: (dragObject: object) => void;
    documentDragEnd: (args: object[]) => void;
    updateDraggingTemplate: (dragObject: object, draggingTemplate: React.Component) => void;
    onDragStart?: (dragObject: object, draggedKey: string) => void;
    onDragEnd?: (dragObject: object) => void;
    onDragMove?: (dragObject: object) => void;
    onDragEnter?: (dragObject: object) => void;
    onDragLeave?: (dragObject: object) => void;
    onDocumentDragEnd?: (eventName: string, args: unknown[]) => void;
    onDocumentDragStart?: (eventName: string, args: unknown[]) => void;
}

interface IStartDragOptions {
    immediately: boolean;
}

interface ICords {
    x: number;
    y: number;
}

interface IDragObject<T = object> {
    domEvent: MouseEvent;
    position: ICords;
    offset: ICords;
    entity: T;
    draggingTemplateOffset: number;
}

export const DragNDropContext = React.createContext({});

class ReactContainer extends React.Component<IReactContainerProps> {
    /**
     * Хранит список перетаскиваемых элементов и ключ элемента, за который потащили (draggedKey)
     */
    private _dragEntity: object = null;
    private _startEvent: MouseEvent = null;
    private _currentEvent: MouseEvent = null;
    private _startImmediately: boolean = null;
    private _documentDragging: boolean = false;
    private _insideDragging: boolean = false;
    private _endDragNDropTimer: number = null;
    private _draggedKey: string = null;
    private _instanceId: string = 'inst_' + Guid.create();

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div onMouseEnter={this._mouseEnter} onMouseLeave={this._mouseLeave}>
                {this.props.children}
            </div>
        );
    }

    private _registerMouseMove(): void {
        this.context.registerMouseMove(this._onMouseMove, this._onTouchMove, this);
    }

    private _unregisterMouseMove(): void {
        this.context.unregisterMouseMove(this);
    }

    private _registerMouseUp(): void {
        this.context.registerMouseUp(this._onMouseUp, this);
    }

    private _unregisterMouseUp(): void {
        this.context.unregisterMouseUp(this);
    }

    private _onMouseMove(event: SyntheticEvent<MouseEvent>): void {
        /**
         * В яндекс браузере каким то образом пришел nativeEvent === null, после чего
         * упала ошибка в коде ниже и страница стала некликабельной. Повторить ошибку не получилось
         * добавляем защиту на всякий случай.
         */
        if (event.nativeEvent) {
            if (detection.isIE) {
                this._onMouseMoveIEFix(event);
            } else {
                // Check if the button is pressed while moving.
                if (!event.nativeEvent.buttons) {
                    this._dragNDropEnded(event);
                }
            }

            // Не надо вызывать onMove если не нажата кнопка мыши.
            // Кнопка мыши может быть не нажата в 2 случаях:
            // 1) Мышь увели за пределы браузера, там отпустили и вернули в браузер
            // 2) Баг IE, который подробнее описан в методе _onMouseMoveIEFix
            if (event.nativeEvent.buttons) {
                this._onMove(event.nativeEvent);
            }
        }
    }

    private _onMouseMoveIEFix(event: SyntheticEvent<MouseEvent>): void {
        /**
         * In IE strange bug, the cause of which could not be found. During redrawing of the table the MouseMove
         * event at which buttons = 0 shoots. In 10 milliseconds we will check that the button is not pressed.
         */
        if (!event.nativeEvent.buttons && !this._endDragNDropTimer) {
            this._endDragNDropTimer = setTimeout(() => {
                this._dragNDropEnded(event);
            }, ReactContainer.IE_MOUSEMOVE_FIX_DELAY);
        } else {
            clearTimeout(this._endDragNDropTimer);
            this._endDragNDropTimer = null;
        }
    }

    private _onTouchMove(event: SyntheticEvent<TouchEvent>): void {
        this._onMove(event.nativeEvent);
    }

    private _onMouseUp(event: SyntheticEvent<MouseEvent>): void {
        if (this._startEvent) {
            this._dragNDropEnded(event);
        }
    }

    private _onMove(nativeEvent: MouseEvent): void {
        if (this._startEvent) {
            const dragObject: IDragObject = this._getDragObject(nativeEvent, this._startEvent);
            const dragStarted: boolean = ReactContainer._isDragStarted(
                this._startEvent,
                nativeEvent,
                this._startImmediately
            );
            if (!this._documentDragging && dragStarted) {
                this._insideDragging = true;
                this.context.documentDragStart(dragObject);
            }
            if (this._documentDragging) {
                this._currentEvent = nativeEvent;
                if (this.props.onDragMove) {
                    this.props.onDragMove(dragObject);
                }
                if (this.props.draggingTemplate) {
                    this.context.updateDraggingTemplate(dragObject, this.props.draggingTemplate);
                }
            }
        }
    }

    private _documentDragStart(dragObject: IDragObject): void {
        if (this._insideDragging) {
            if (this.props.onDragStart) {
                this.props.onDragStart(dragObject, this._draggedKey);
            }
        } else {
            this._dragEntity = dragObject.entity;
        }
        this._documentDragging = true;
        this._notifyDragEvent('documentDragStart', [dragObject]);
        ControllerClass._dragStart();
    }

    private _documentDragEnd(dragObject: IDragObject): void {
        if (this._insideDragging && this.props.onDragEnd) {
            this.props.onDragEnd(dragObject);
        }

        this._insideDragging = false;
        this._documentDragging = false;
        ControllerClass._dragEnd();
        this._notifyDragEvent('documentDragEnd', [dragObject]);
    }

    private _notifyDragEvent(eventName: string, args: unknown[]): void {
        if (eventName === 'documentDragEnd' && this.props.onDocumentDragEnd) {
            this.props.onDocumentDragEnd(eventName, ...args);
        } else if (this.props.onDocumentDragStart) {
            this.props.onDocumentDragStart(eventName, ...args);
        }

        EventBus.channel('dragnDrop').notify(eventName, ...args);
    }

    private _getDragObject(
        mouseEvent?: MouseEvent,
        startEvent?: SyntheticEvent<MouseEvent>
    ): IDragObject {
        const dragObject: IDragObject = {
            entity: this._dragEntity,
            domEvent: null,
            position: null,
            offset: null,
            draggingTemplateOffset: null,
        };
        if (mouseEvent && startEvent) {
            dragObject.domEvent = mouseEvent;
            dragObject.position = ReactContainer._getPageXY(mouseEvent);
            dragObject.offset = ReactContainer._getDragOffset(mouseEvent, startEvent);
            dragObject.draggingTemplateOffset = this.props.draggingTemplateOffset;
        }
        return dragObject;
    }

    private _dragNDropEnded(event: SyntheticEvent<MouseEvent>): void {
        if (this._documentDragging) {
            const args = [this._getDragObject(event.nativeEvent, this._startEvent)];
            this.context.documentDragEnd(args);
        }
        if (this._startEvent && this._startEvent.target) {
            this._startEvent.target.classList.remove('controls-DragNDrop__dragTarget');
        }
        this._unregisterMouseMove();
        this._unregisterMouseUp();
        this._dragEntity = null;
        this._startEvent = null;
        this._currentEvent = null;
    }

    componentDidMount(): void {
        this.context.registerDocumentDrag(this._documentDragStart, this._documentDragEnd, this);
    }

    componentWillUnmount(): void {
        /**
         * Когда контрол находится в режиме перемещения, и его уничтожили, тогда нужно завершенить перемещение.
         * Это делается по событию mouseup. Вызовем обработчик этого события.
         */
        const event: MouseEvent = this._startEvent || this._currentEvent;
        if (event) {
            this._onMouseUp(new SyntheticEvent<MouseEvent>(event));
        }
        this.context.unregisterDocumentDrag(this);
    }

    protected _mouseEnter = (event: SyntheticEvent<MouseEvent>): void => {
        if (this._documentDragging) {
            this._insideDragging = true;
            if (this.props.onDragEnter) {
                this.props.onDragEnter(this._getDragObject());
            }
        }
    };

    protected _mouseLeave = (event: SyntheticEvent<MouseEvent>): void => {
        /**
         * Если было инициализировано перемещение, но оно ещё не началось, и мышь покинула свой контейнер,
         * то начинаем перемещение сразу, не дожидаясь минимального смещения мыши.
         */
        if (this._dragEntity && !this._documentDragging) {
            this._startImmediately = true;
            this._onMove(event.nativeEvent);
        }
        if (this._documentDragging) {
            this._insideDragging = false;
            if (this.props.onDragLeave) {
                this.props.onDragLeave(this._getDragObject());
            }
        }
    };

    startDragNDrop(
        entity: object,
        mouseDownEvent: SyntheticEvent<MouseEvent>,
        options: IStartDragOptions = { immediately: false },
        draggedKey?: string
    ): void {
        if ((mouseDownEvent.target as HTMLElement).closest('.controls-DragNDrop__notDraggable')) {
            return;
        }

        this._dragEntity = entity;
        this._draggedKey = draggedKey;
        this._startEvent = mouseDownEvent.nativeEvent;
        this._startImmediately = options.immediately;

        if (this.props.resetTextSelection) {
            ReactContainer._clearSelection(this._startEvent);
        }

        const target: Element = this._startEvent.target as Element;
        if (this._startEvent && target) {
            target.classList.add('controls-DragNDrop__dragTarget');
        }

        this._registerMouseMove();
        this._registerMouseUp();
    }

    getInstanceId() {
        return this._instanceId;
    }
    static contextType = DragNDropContext;

    private static SHIFT_LIMIT: number = 4;
    private static IE_MOUSEMOVE_FIX_DELAY: number = 50;

    private static _getPageXY(event: MouseEvent | TouchEvent): ICords {
        return DimensionsMeasurer.getRelativeMouseCoordsByMouseEvent(event);
    }

    private static _isDragStarted(
        startEvent: MouseEvent,
        moveEvent: MouseEvent,
        immediately: boolean
    ): boolean {
        if (immediately) {
            return true;
        }

        const offset: ICords = ReactContainer._getDragOffset(moveEvent, startEvent);
        return (
            Math.abs(offset.x) > ReactContainer.SHIFT_LIMIT ||
            Math.abs(offset.y) > ReactContainer.SHIFT_LIMIT
        );
    }

    private static _getSelection(): Selection {
        return window.getSelection();
    }

    private static _clearSelection(event: MouseEvent): void {
        if (event.type === 'mousedown') {
            /**
             * Снимаем выделение с текста иначе не будут работать клики а выделение не будет сниматься по клику из за preventDefault
             */
            const selection = ReactContainer._getSelection();
            if (selection.removeAllRanges) {
                selection.removeAllRanges();
            } else if (selection.empty) {
                selection.empty();
            }
        }
    }

    private static _getDragOffset(moveEvent: MouseEvent, startEvent: MouseEvent): ICords {
        const moveEventXY = ReactContainer._getPageXY(moveEvent);
        const startEventXY = ReactContainer._getPageXY(startEvent);

        return {
            y: moveEventXY.y - startEventXY.y,
            x: moveEventXY.x - startEventXY.x,
        };
    }

    static getDefaultOptions(): Partial<IReactContainerProps> {
        return {
            draggingTemplateOffset: 10,
            resetTextSelection: true,
        };
    }

    static getOptionTypes(): object {
        return {
            /**
             * resetTextSelection = false используется только в scrollContainer
             */
            resetTextSelection: descriptor(Boolean),
            draggingTemplateOffset: descriptor(Number),
        };
    }
}

export default ReactContainer;

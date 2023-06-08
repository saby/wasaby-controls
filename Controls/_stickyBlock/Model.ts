/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { Logger } from 'UI/Utils';
import simpleExtend = require('Core/core-simpleExtend');

/**
 * @extends Core/core-simpleExtend
 * @class Controls/_stickyBlock/Model
 * @private
 */

/**
 * @typedef {Object} Intersection
 * @property {Boolean} top Determines whether the upper boundary of content is crossed.
 * @property {Boolean} bottom Determines whether the lower boundary of content is crossed.
 */

/**
 * The name of the intersection target.
 * @typedef {String} Controls/_stickyBlock/Model/TrackedTarget
 * @variant top Top target.
 * @variant bottom Bottom target.
 */

export = simpleExtend.extend({
    /*
     * @cfg {Intersection|null} Determines whether the boundaries of content crossed.
     * @private
     */
    _intersection: null,

    /*
     * @cfg {String} Determines whether the content is fixed.
     * @private
     */
    _fixedPosition: '',

    _intersectingBottomLeft: null,
    _intersectingBottomRight: null,
    _intersectingTop2: null,
    _intersectingTop2Right: null,

    _setFixedPositionCallback: null,

    get fixedPosition() {
        return this._fixedPosition;
    },

    set fixedPosition(value: string) {
        this._fixedPosition = value;
        this._setFixedPositionCallback(value);
    },

    isFixed(): boolean {
        return !!this._fixedPosition;
    },

    /**
     * @param {Object} config
     * @param {Object} config.topTarget DOM element
     * @param {Object} config.bottomTarget DOM element
     * @param {String} config.position Sticky position
     */
    constructor(config) {
        this._intersection = {
            top2: true,
        };
        this._topTarget = config.topTarget;
        // top2Target необходим для IsolatedGroup. Когда один стики блок уезжает вместе с родительским контейнером, нужно
        // перекинуть тень на стики блок выше, который еще не уехал.
        this._top2Target = config.top2Target;
        this._top2RightTarget = config.top2RightTarget;
        // Необходимость двух нижних обсёрверов описана в методе _updateStateIntersection.
        this._bottomLeftTarget = config.bottomLeftTarget;
        this._bottomRightTarget = config.bottomRightTarget;
        this._rightTarget = config.rightTarget;
        this._leftTarget = config.leftTarget;

        this._position = config.position;
        this._setFixedPositionCallback = config.setFixedPositionCallback;
        this._updateStateIntersection =
            this._updateStateIntersection.bind(this);
    },

    update(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            if (entry.target === this._bottomLeftTarget) {
                this._intersectingBottomLeft = entry.isIntersecting;
            }
            if (entry.target === this._bottomRightTarget) {
                this._intersectingBottomRight = entry.isIntersecting;
            }

            if (entry.target === this._top2Target) {
                this._intersectingTop2 = entry.isIntersecting;
            }
            if (entry.target === this._top2RightTarget) {
                this._intersectingTop2Right = entry.isIntersecting;
            }
        });

        entries.forEach((entry) => {
            this._updateStateIntersection(entry);
        });

        this._fixedPosition = this._getFixedPosition();
        this._setFixedPositionCallback(this._fixedPosition);
    },

    destroy() {
        this._updateStateIntersection = undefined;
    },

    /**
     * @param {IntersectionObserverEntry} entry
     * @private
     */
    _updateStateIntersection(entry: IntersectionObserverEntry): void {
        const position = this._getTarget(entry);
        let isIntersecting = entry.isIntersecting;
        // Будем обновлять состояние зафиксированности для observerBottom по левому и правому обсёрверу.
        // Таким образом, исключим состояние зафиксированности сверху/снизу при горизонтальном скролле.
        if (position === 'bottom') {
            isIntersecting =
                this._intersectingBottomLeft || this._intersectingBottomRight;
        }
        if (position === 'top2') {
            isIntersecting =
                this._intersectingTop2 || this._intersectingTop2Right;
        }
        this._intersection[position] = isIntersecting;
    },

    /**
     * Get the name of the intersection target.
     * @param {IntersectionObserverEntry} entry The intersection between the target element and its root container at a specific moment of transition.
     * @returns {TrackedTarget} The name of the intersection target.
     * @private
     */
    _getTarget(entry) {
        switch (entry.target) {
            case this._topTarget:
                return 'top';
            case this._top2Target:
            case this._top2RightTarget:
                return 'top2';
            case this._bottomLeftTarget:
            case this._bottomRightTarget:
                return 'bottom';
            case this._leftTarget:
                return 'left';
            case this._rightTarget:
                return 'right';
            default:
                Logger.error('Controls/_stickyBlock/Model: Unexpected target');
                return 'bottom';
        }
    },

    /**
     * Checks the content is fixed.
     * @returns {String} Determines whether the content is fixed.
     * @private
     */
    _getFixedPosition(): string {
        let result = '';
        let hasVertical = false;

        if (
            this._position.vertical &&
            this._position.vertical?.indexOf('top') !== -1 &&
            !this._intersection.top &&
            this._intersection.top2 &&
            this._intersection.bottom
        ) {
            result = 'top';
            hasVertical = true;
        } else if (
            this._position.vertical &&
            this._position.vertical?.toLowerCase().indexOf('bottom') !== -1 &&
            !this._intersection.bottom &&
            this._intersection.top
        ) {
            result = 'bottom';
            hasVertical = true;
        }

        if (
            this._position.horizontal &&
            this._position.horizontal?.indexOf('left') !== -1 &&
            !this._intersection.left &&
            this._intersection.right
        ) {
            result += hasVertical ? 'Left' : 'left';
        } else if (
            this._position.horizontal &&
            this._position.horizontal?.toLowerCase().indexOf('right') !== -1 &&
            !this._intersection.right &&
            this._intersection.left
        ) {
            result += hasVertical ? 'Right' : 'right';
        }

        return result;
    },
});

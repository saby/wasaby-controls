export default function initIntersectionObserverPolyfill(window, document) {
    const registry = [];

    function IntersectionObserverEntry(entry) {
        this.time = entry.time;
        this.target = entry.target;
        this.rootBounds = entry.rootBounds;
        this.boundingClientRect = entry.boundingClientRect;
        this.intersectionRect = entry.intersectionRect || getEmptyRect();
        this.isIntersecting = !!entry.intersectionRect;

        const targetRect = this.boundingClientRect;
        const targetArea = targetRect.width * targetRect.height;
        const intersectionRect = this.intersectionRect;
        const intersectionArea = intersectionRect.width * intersectionRect.height;

        if (targetArea) {
            this.intersectionRatio = intersectionArea / targetArea;
        } else {
            this.intersectionRatio = this.isIntersecting ? 1 : 0;
        }
    }

    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    function IntersectionObserver(callback, optOptions) {
        const options = optOptions || {};

        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        if (options.root && options.root.nodeType !== 1) {
            throw new Error('root must be an Element');
        }

        this._checkForIntersections = throttle(
            this._checkForIntersections.bind(this),
            this.THROTTLE_TIMEOUT
        );

        this._callback = callback;
        this._observationTargets = [];
        this._queuedEntries = [];
        this._rootMarginValues = this._parseRootMargin(options.rootMargin);

        // Public properties.
        this.thresholds = this._initThresholds(options.threshold);
        this.root = options.root || null;
        this.rootMargin = this._rootMarginValues
            .map((margin) => {
                return margin.value + margin.unit;
            })
            .join(' ');
    }

    IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;

    IntersectionObserver.prototype.POLL_INTERVAL = null;

    IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;

    IntersectionObserver.prototype.observe = function (target) {
        const isTargetAlreadyObserved = this._observationTargets.some((item) => {
            return item.element === target;
        });

        if (isTargetAlreadyObserved) {
            return;
        }

        if (!(target && target.nodeType === 1)) {
            throw new Error('target must be an Element');
        }

        this._registerInstance();
        this._observationTargets.push({ element: target, entry: null });
        this._monitorIntersections();
        this._checkForIntersections();
    };

    IntersectionObserver.prototype.unobserve = function (target) {
        this._observationTargets = this._observationTargets.filter((item) => {
            return item.element !== target;
        });
        if (!this._observationTargets.length) {
            this._unmonitorIntersections();
            this._unregisterInstance();
        }
    };

    IntersectionObserver.prototype.disconnect = function () {
        this._observationTargets = [];
        this._unmonitorIntersections();
        this._unregisterInstance();
    };

    IntersectionObserver.prototype.takeRecords = function () {
        const records = this._queuedEntries.slice();
        this._queuedEntries = [];
        return records;
    };

    IntersectionObserver.prototype._initThresholds = (optThreshold) => {
        let threshold = optThreshold || [0];
        if (!Array.isArray(threshold)) {
            threshold = [threshold];
        }

        return threshold.sort().filter((t, i, a) => {
            if (typeof t !== 'number' || isNaN(t) || t < 0 || t > 1) {
                throw new Error('threshold must be a number between 0 and 1 inclusively');
            }
            return t !== a[i - 1];
        });
    };

    IntersectionObserver.prototype._parseRootMargin = (optRootMargin) => {
        const marginString = optRootMargin || '0px';
        const margins = marginString.split(/\s+/).map((margin) => {
            const parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
            if (!parts) {
                throw new Error('rootMargin must be specified in pixels or percent');
            }
            return { value: parseFloat(parts[1]), unit: parts[2] };
        });

        margins[1] = margins[1] || margins[0];
        margins[2] = margins[2] || margins[0];
        margins[3] = margins[3] || margins[1];

        return margins;
    };

    IntersectionObserver.prototype._monitorIntersections = function () {
        if (!this._monitoringIntersections) {
            this._monitoringIntersections = true;
            if (this.POLL_INTERVAL) {
                this._monitoringInterval = setInterval(
                    this._checkForIntersections,
                    this.POLL_INTERVAL
                );
            } else {
                addEvent(window, 'resize', this._checkForIntersections, true);
                addEvent(document, 'scroll', this._checkForIntersections, true);

                if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
                    this._domObserver = new MutationObserver(this._checkForIntersections);
                    this._domObserver.observe(document, {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true,
                    });
                }
            }
        }
    };

    IntersectionObserver.prototype._unmonitorIntersections = function () {
        if (this._monitoringIntersections) {
            this._monitoringIntersections = false;

            clearInterval(this._monitoringInterval);
            this._monitoringInterval = null;

            removeEvent(window, 'resize', this._checkForIntersections, true);
            removeEvent(document, 'scroll', this._checkForIntersections, true);

            if (this._domObserver) {
                this._domObserver.disconnect();
                this._domObserver = null;
            }
        }
    };

    IntersectionObserver.prototype._checkForIntersections = function () {
        const rootIsInDom = this._rootIsInDom();
        const rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

        this._observationTargets.forEach(function (item) {
            const target = item.element;
            const targetRect = getBoundingClientRect(target);
            const rootContainsTarget = this._rootContainsTarget(target);
            const oldEntry = item.entry;
            const intersectionRect =
                rootIsInDom &&
                rootContainsTarget &&
                this._computeTargetAndRootIntersection(target, rootRect);

            const newEntry = (item.entry = new IntersectionObserverEntry({
                time: now(),
                target,
                boundingClientRect: targetRect,
                rootBounds: rootRect,
                intersectionRect,
            }));

            if (!oldEntry) {
                this._queuedEntries.push(newEntry);
            } else if (rootIsInDom && rootContainsTarget) {
                if (this._hasCrossedThreshold(oldEntry, newEntry)) {
                    this._queuedEntries.push(newEntry);
                }
            } else {
                if (oldEntry && oldEntry.isIntersecting) {
                    this._queuedEntries.push(newEntry);
                }
            }
        }, this);

        if (this._queuedEntries.length) {
            this._callback(this.takeRecords(), this);
        }
    };

    IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, rootRect) {
        if (window.getComputedStyle(target).display === 'none') {
            return;
        }

        const targetRect = getBoundingClientRect(target);
        let intersectionRect = targetRect;
        let parent = getParentNode(target);
        let atRoot = false;

        while (!atRoot) {
            let parentRect = null;
            const parentComputedStyle =
                parent.nodeType === 1 ? window.getComputedStyle(parent) : {};

            // If the parent isn't displayed, an intersection can't happen.
            if (parentComputedStyle.display === 'none') {
                return;
            }

            if (parent === this.root || parent === document) {
                atRoot = true;
                parentRect = rootRect;
            } else {
                if (
                    parent !== document.body &&
                    parent !== document.documentElement &&
                    parentComputedStyle.overflow !== 'visible'
                ) {
                    parentRect = getBoundingClientRect(parent);
                }
            }

            if (parentRect) {
                intersectionRect = computeRectIntersection(parentRect, intersectionRect);

                if (!intersectionRect) {
                    break;
                }
            }
            parent = getParentNode(parent);
        }

        if (intersectionRect) {
            while (parent && parent !== document.body) {
                // Если какой-то из родителей скрыт, выходим и не сообщаем о пересечении
                // (как нативный IntersectionObserver)
                if (window.getComputedStyle(parent).display === 'none') {
                    return;
                }
                parent = getParentNode(parent);
            }
        }

        return intersectionRect;
    };

    IntersectionObserver.prototype._getRootRect = function () {
        let rootRect;
        if (this.root) {
            rootRect = getBoundingClientRect(this.root);
        } else {
            const html = document.documentElement;
            const body = document.body;
            rootRect = {
                top: 0,
                left: 0,
                right: html.clientWidth || body.clientWidth,
                width: html.clientWidth || body.clientWidth,
                bottom: html.clientHeight || body.clientHeight,
                height: html.clientHeight || body.clientHeight,
            };
        }
        return this._expandRectByRootMargin(rootRect);
    };

    IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
        const margins = this._rootMarginValues.map((margin, i) => {
            return margin.unit === 'px'
                ? margin.value
                : (margin.value * (i % 2 ? rect.width : rect.height)) / 100;
        });
        const newRect = {
            top: rect.top - margins[0],
            right: rect.right + margins[1],
            bottom: rect.bottom + margins[2],
            left: rect.left - margins[3],
        };
        newRect.width = newRect.right - newRect.left;
        newRect.height = newRect.bottom - newRect.top;

        return newRect;
    };

    IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {
        const oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
        const newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;

        if (oldRatio === newRatio) {
            return;
        }

        for (let i = 0; i < this.thresholds.length; i++) {
            const threshold = this.thresholds[i];
            if (
                threshold === oldRatio ||
                threshold === newRatio ||
                threshold < oldRatio !== threshold < newRatio
            ) {
                return true;
            }
        }
    };

    IntersectionObserver.prototype._rootIsInDom = function () {
        return !this.root || containsDeep(document, this.root);
    };

    IntersectionObserver.prototype._rootContainsTarget = function (target) {
        return containsDeep(this.root || document, target);
    };

    IntersectionObserver.prototype._registerInstance = function () {
        if (registry.indexOf(this) < 0) {
            registry.push(this);
        }
    };

    IntersectionObserver.prototype._unregisterInstance = function () {
        const index = registry.indexOf(this);
        if (index !== -1) {
            registry.splice(index, 1);
        }
    };

    function now() {
        return window.performance && performance.now && performance.now();
    }

    function throttle(fn, timeout) {
        let timer = null;
        return () => {
            if (!timer) {
                timer = setTimeout(() => {
                    fn();
                    timer = null;
                }, timeout);
            }
        };
    }

    function addEvent(node, event, fn, optUseCapture) {
        if (typeof node.addEventListener === 'function') {
            node.addEventListener(event, fn, optUseCapture || false);
        } else if (typeof node.attachEvent === 'function') {
            node.attachEvent('on' + event, fn);
        }
    }

    function removeEvent(node, event, fn, optUseCapture) {
        if (typeof node.removeEventListener === 'function') {
            node.removeEventListener(event, fn, optUseCapture || false);
        } else if (typeof node.detatchEvent === 'function') {
            node.detatchEvent('on' + event, fn);
        }
    }

    function computeRectIntersection(rect1, rect2) {
        const top = Math.max(rect1.top, rect2.top);
        const bottom = Math.min(rect1.bottom, rect2.bottom);
        const left = Math.max(rect1.left, rect2.left);
        const right = Math.min(rect1.right, rect2.right);
        const width = right - left;
        const height = bottom - top;

        return (
            width >= 0 &&
            height >= 0 && {
                top,
                bottom,
                left,
                right,
                width,
                height,
            }
        );
    }

    function getBoundingClientRect(el) {
        let rect;

        try {
            rect = el.getBoundingClientRect();
        } catch (err) {
            // Ignore Windows 7 IE11 "Unspecified error"
            // https://github.com/w3c/IntersectionObserver/pull/205
        }

        if (!rect) {
            return getEmptyRect();
        }

        // Older IE
        if (!(rect.width && rect.height)) {
            rect = {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top,
            };
        }
        return rect;
    }

    function getEmptyRect() {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        };
    }

    function containsDeep(parent, child) {
        let node = child;
        while (node) {
            if (node === parent) {
                return true;
            }

            node = getParentNode(node);
        }
        return false;
    }

    function getParentNode(node) {
        const parent = node.parentNode;

        if (parent && parent.nodeType === 11 && parent.host) {
            return parent.host;
        }
        return parent;
    }

    // Exposes the constructors globally.
    window.IntersectionObserver = IntersectionObserver;
    window.IntersectionObserverEntry = IntersectionObserverEntry;
}

(function (window, document) {
    initIntersectionObserverPolyfill(window, document);
})(window, document);

import { IPointData } from './Utils';

export default class DragNDropEntity {
    protected point: IPointData;

    constructor(point) {
        this.point = point;
    }

    setPoint(point) {
        this.point = point;
    }
}

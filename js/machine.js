class Machine {
    constructor(type) {
        this.x = 0;
        this.y = 0;
        this.type = type;
        this.direction = 0;
    }
    isAt(x, y) {
        return ((x==this.x) && (y==this.y));
    }
    rotateClockwise() {
        this.direction += 90;
        this.direction %= 360;
    }
}
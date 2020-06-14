class MachineSprite {
    constructor(type, direction) {
        this.type = type;
        this.direction = direction;

        this.node = new SpriteNode();
        this.node.clear();

        let sprite = shipyard.findTypeByName(this.type).sprite;
        
        sprite(this.node, this.direction);
        let arrow = this.node.addChild(new SpriteOrientation());
        arrow.rotation = direction;
    }
    draw(ctx, x, y) {
        this.node.x = x;
        this.node.y = y;

        this.node._draw(ctx);
    }
}
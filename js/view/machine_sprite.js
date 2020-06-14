class MachineSprite {
    constructor(type, direction) {
        this.type = type;
        this.direction = direction;

        this.node = new SpriteNode();
        this.node.clear();

        let type_data = shipyard.findTypeByName(this.type);
        let sprite = type_data.sprite;
        
        sprite(this.node, this.direction);

        if (type_data.has_direction_arrows) {
            let arrow = this.node.addChild(new SpriteOrientation());
            arrow.rotation = direction;    
        }
    }
    draw(ctx, x, y) {
        this.node.x = x;
        this.node.y = y;

        this.node._draw(ctx);
    }
}
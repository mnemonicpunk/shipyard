class MachineSelector extends mnWidget {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.selected_type = MACHINE_TYPES[0].type;

        let _Instance = this;
        for (let i=0; i<MACHINE_TYPES.length; i++) {
            let ix = 10+((i%4)*75);
            let iy = 10+(Math.floor(i/4)*75);
            let item = new MachineSelectorItem(ix, iy, 75, 75, MACHINE_TYPES[i].type);
            item.label = MACHINE_TYPES[i].name;
            this.children.push(item);
            
            item.on('machine_selected', function(event) {
                _Instance.select(event.item);
            }); 
        }

        this.select(this.children[0]);
    }
    draw(ctx) {
        ctx.fillStyle = "#444";
        ctx.globalAlpha = 0.75;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = 1;
    }
    onClick(x, y) {
        //console.log("I was clicked: " +(x-this.x)+ "/"+(y-this.y));
        return true;
    }
    select(item) {
        for (let i=0; i<this.children.length; i++) {
            this.children[i].selected = (this.children[i]==item);
        }
        this.fireEvent('selected', {
            type: item.type
        });
    }
}

class MachineSelectorItem extends mnWidget {
    constructor(x, y, w, h, type) {
        super(x, y, w, h);
        this.type = type;
        this.label = "TestLabel";
        this.selected = false;
        this.machine_sprite = new MachineSprite(this.type, 0);
    }
    draw(ctx) {
        ctx.fillStyle = this.selected?"#888":"#666";
        ctx.fillRect(0, 0, this.width, this.height);
        
        let mt = shipyard.findTypeByName(this.type);

        this.machine_sprite.node.scale_x = 0.25 / mt.width;
        this.machine_sprite.node.scale_y = 0.25 / mt.height;
        this.machine_sprite.draw(ctx, this.width/2, this.height/2);

        let t = ctx.measureText(this.label);
        ctx.fillStyle = "#fff";
        ctx.fillText(this.label, Math.floor(this.width/2 - t.width/2), this.height - 10);
    }
    onClick(e) {
        this.fireEvent('machine_selected', {
            item: this,
            type: this.type
        });
    }
}
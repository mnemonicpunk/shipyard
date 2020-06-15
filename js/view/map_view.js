const MAP_TILE_WIDTH = 130;
const MAP_TILE_HEIGHT = 130;

class MapView extends mnWidget {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.map_data = null;
        this.map_canvas = document.createElement('canvas');
        this.map_dirty = false;

        this.ui_mode = "edit";

        this.hovered_tile = {
            x: 0,
            y: 0
        }

        this.selected_type = MACHINE_TYPES[0].type;
    }
    setMap(map) {
        this.map_data = map;
        this.map_dirty = true;
    }
    draw(ctx) {
        if (this.map_dirty == true) {
            this.drawMap();
            this.map_dirty = false;
        }
        ctx.drawImage(this.map_canvas, 0, 0);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(this.hovered_tile.x * MAP_TILE_WIDTH, this.hovered_tile.y * MAP_TILE_HEIGHT, MAP_TILE_WIDTH, MAP_TILE_HEIGHT);
    }
    dirtyMap() {
        this.map_dirty = true;
    }
    drawMap() {
        if (this.map_data == null) { return; }
        this.map_canvas.width = this.map_data.width*MAP_TILE_WIDTH;
        this.map_canvas.height = this.map_data.height*MAP_TILE_HEIGHT;

        let ctx = this.map_canvas.getContext('2d');

        ctx.strokeStyle = "#fff";
        ctx.strokeRect(0,0,this.map_canvas.width, this.map_canvas.height);

        let fr = [518, 379, 130, 130];
        let fr_sheet = document.getElementById('gameatlas6');

        for (let x = 0; x<this.map_data.width; x++) {
            for (let y = 0; y<this.map_data.height; y++) {
                ctx.drawImage(fr_sheet, fr[0], fr[1], fr[2], fr[3], x*MAP_TILE_WIDTH, y*MAP_TILE_HEIGHT, MAP_TILE_WIDTH, MAP_TILE_HEIGHT);
            }
        }

        this.map_data.sort();

        for (let i=0; i<this.map_data.machines.length; i++) {
            let m = this.map_data.machines[i];
            let context = {
                north: this.map_data.findMachineAt(m.x, m.y-1),
                south: this.map_data.findMachineAt(m.x, m.y+1),
                west: this.map_data.findMachineAt(m.x-1, m.y),
                east: this.map_data.findMachineAt(m.x+1, m.y)
            }
            let sprite = new MachineSprite(m.type, m.direction, context);
            sprite.draw(ctx, (m.x+0.5) * MAP_TILE_WIDTH, (m.y+0.5) * MAP_TILE_HEIGHT);
        }

        this.fireEvent('map_changed', null);
    }
    mouseMove(x, y) {
        let s = {
            x: Math.floor((x - this.x) / MAP_TILE_WIDTH),
            y: Math.floor((y - this.y) / MAP_TILE_HEIGHT)
        };

        if (s.x < 0) { s.x = 0; }
        if (s.y < 0) { s.y = 0; }
        if (s.x >= this.map_data.width ) { s.x = this.map_data.width-1; }
        if (s.y >= this.map_data.height ) { s.y = this.map_data.height-1; }

        this.hovered_tile = s;
    }
    onClick(x, y, button) {
        let m = this.map_data.findMachineAt(this.hovered_tile.x, this.hovered_tile.y);
        if (button == 0) {
            this.drag_origin = this.mouse;

            if (this.ui_mode == "edit") {
                if (m != null) {
                    m.rotateClockwise();
                }
            }

            if (this.ui_mode == "place") {
                if (m == null) {
                    // place the selected type of machine here
                    let m = new Machine(this.selected_type);
                    m.x = this.hovered_tile.x;
                    m.y = this.hovered_tile.y;
                    this.map_data.addMachine(m);
                }
            }

            if (this.ui_mode == "delete") {
                if (m != null) {
                    this.map_data.removeMachine(m);
                    this.dirtyMap();
                }
            }

            this.dirtyMap();
        }
        if (button == 2) {
            if (m != null) {
                this.map_data.removeMachine(m);
                this.dirtyMap();
            }
        }
    }
    setUIMode(mode) {
        this.ui_mode = mode;
    }
}
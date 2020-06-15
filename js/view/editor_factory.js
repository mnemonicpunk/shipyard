class EditorFactory extends mnUI {
    constructor(x,y,w,h) {
        super(x,y,w,h);

        // ui elements
        this.map_view = new MapView();
        this.machine_selector = new MachineSelector();
        this.splashscreen = new SplashScreen();

        // data elements
        this.map_data = new MapData(12, 12);
        this.map_view.setMap(this.map_data);

        this.cam = {
            x: 0,
            y: 0
        };
        
        this.children.push(this.map_view);
        this.children.push(this.machine_selector);
        this.children.push(this.splashscreen);

        let _Instance = this;
        this.on('key', function(data) {
            let speed = 16;
            if (data.name == "left") {
                _Instance.cam.x += speed;
            }
            if (data.name == "right") {
                _Instance.cam.x -= speed;
            }
            if (data.name == "up") {
                _Instance.cam.y += speed;
            }
            if (data.name == "down") {
                _Instance.cam.y -= speed;
            }

            _Instance.map_view.x = _Instance.cam.x;
            _Instance.map_view.y = _Instance.cam.y;
        });
        this.machine_selector.on('selected', function(event) {
            _Instance.map_view.selected_type = event.type;
        });
    }
    resize(x, y, width, height) {
        super.resize(x, y, width, height);
        this.map_view.resize(this.cam.x, this.cam.y, this.map_data.width*MAP_TILE_WIDTH, this.map_data.height*MAP_TILE_HEIGHT);
        this.machine_selector.resize(width-320, 0, 320, height);
        this.splashscreen.resize(0, 0, width, height);
    }
    updateMap() {
        this.map_view.setMap(this.map_data);
    }
    draw(ctx) {
        super.draw(ctx);        
    }
}
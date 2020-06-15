class EditorFactory extends mnUI {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        let _Instance = this;

        this.ui_mode = "edit";

        // ui elements
        this.map_view = new MapView();
        this.machine_selector = new MachineSelector();
        this.splashscreen = new SplashScreen();
        
        this.ui_manipulate = new ControlButton();
        this.ui_scroll = new ControlButton();
        this.ui_place = new ControlButton();
        this.ui_delete = new ControlButton();

        this.ui_manipulate.title = "Edit";
        this.ui_scroll.title = "Scroll";
        this.ui_place.title = "Place";
        this.ui_delete.title = "Delete";

        // data elements
        this.map_data = new MapData(12, 12);
        this.map_view.setMap(this.map_data);

        this.cam = {
            x: 0,
            y: 0
        };
        this.cam_origin = {
            x: 0,
            y: 0
        }

        this.mouse = {
            x: 0,
            y: 0
        }

        this.drag_active = false;
        this.drag_origin = {
            x: 0,
            y: 0
        }        
        
        this.children.push(this.map_view);
        this.children.push(this.machine_selector);
        this.children.push(this.ui_manipulate);
        this.children.push(this.ui_scroll);
        this.children.push(this.ui_place);
        this.children.push(this.ui_delete);
        this.children.push(this.splashscreen);

        this.ui_manipulate.on('click', function(event) {
            _Instance.setUIMode("edit");
        });
        this.ui_scroll.on('click', function(event) {
            _Instance.setUIMode("scroll");
        });
        this.ui_place.on('click', function(event) {
            _Instance.setUIMode("place");
        });        
        this.ui_delete.on('click', function(event) {
            _Instance.setUIMode("delete");
        });        

        this.on('key', function(data) {
            let speed = 16;
            if (data.name == "left") {
                _Instance.scroll(-speed, 0);
            }
            if (data.name == "right") {
                _Instance.scroll(+speed, 0);
            }
            if (data.name == "up") {
                _Instance.scroll(0, -speed);
            }
            if (data.name == "down") {
                _Instance.scroll(0, +speed);
            }

            if (data.name == "one") {
                _Instance.setUIMode("edit");
            }

            if (data.name == "two") {
                _Instance.setUIMode("scroll");
            }            

            if (data.name == "three") {
                _Instance.setUIMode("place");
            }            

            if (data.name == "four") {
                _Instance.setUIMode("delete");
            }            
        });
        this.machine_selector.on('selected', function(event) {
            _Instance.map_view.selected_type = event.type;
        });

        this.setUIMode("edit");
    }
    resize(x, y, width, height) {
        super.resize(x, y, width, height);
        this.map_view.resize(this.cam.x, this.cam.y, this.map_data.width*MAP_TILE_WIDTH, this.map_data.height*MAP_TILE_HEIGHT);
        this.machine_selector.resize(width-320, 0, 320, height);

        this.ui_manipulate.resize(20, height-100, 80, 80);
        this.ui_scroll.resize(110, height-100, 80, 80);
        this.ui_place.resize(200, height-100, 80, 80);
        this.ui_delete.resize(290, height-100, 80, 80);

        this.splashscreen.resize(0, 0, width, height);
    }
    updateMap() {
        this.map_view.setMap(this.map_data);
    }
    scroll(x, y) {
        this.cam.x -= x;
        this.cam.y -= y;

        this.map_view.x = this.cam.x;
        this.map_view.y = this.cam.y;
    }
    setUIMode(mode) {
        this.ui_manipulate.selected = false;
        this.ui_scroll.selected = false;
        this.ui_place.selected = false;
        this.ui_delete.selected = false;

        this.machine_selector.active = false;

        switch(mode) {
            case "edit":
                this.ui_manipulate.selected = true;
                break;
            case "scroll":
                this.ui_scroll.selected = true;
                break;
            case "place":
                this.ui_place.selected = true;
                this.machine_selector.active = true;
                break;
            case "delete":
                this.ui_delete.selected = true;
                break;            
        }

        this.ui_mode = mode;
        this.map_view.setUIMode(mode);
    }
    mouseMove(x, y) {
        this.mouse = {
            x: x,
            y: y
        };

        if (this.ui_mode == "scroll") {
            if (this.drag_active) {
                let diff = {
                    x: this.mouse.x- this.drag_origin.x,
                    y: this.mouse.y- this.drag_origin.y
                };

                this.cam.x = this.cam_origin.x + diff.x;
                this.cam.y = this.cam_origin.y + diff.y;

                this.map_view.x = this.cam.x;
                this.map_view.y = this.cam.y;                      
            }
        }
    }
    onClick(x, y, button) {
        if (button == 0) {
            if (this.ui_mode == "scroll") {
                this.drag_origin = {
                    x: this.mouse.x,
                    y: this.mouse.y
                }                
                this.drag_active = true;
            }
            this.cam_origin = {
                x: this.cam.x,
                y: this.cam.y
            };
        }
    }
    onMouseUp(x, y, button) {
        if (button == 0) {
            if (this.ui_mode == "scroll") {
                this.drag_active = false;
            }
        }
    }    
}
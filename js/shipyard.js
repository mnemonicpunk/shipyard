const KEYCODES = {
    'up': [87, 38],
    'down': [83, 40],
    'left': [65, 37],
    'right': [68, 39]
};

class Shipyard {
    constructor(texture_atlas_data) {
        let _Instance = this;
        shipyard = this;
        this.canvas = document.getElementById('app_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.atlas = new TextureAtlas(texture_atlas_data);

        this.loadImageFiles();

        this.width = 0;
        this.height = 0;
        this.current_editor = new EditorFactory(0,0,this.width,this.height);

        if (window.location.hash) {
            try {
                let map_data = this.current_editor.map_data;
                let map_view = this.current_editor.map_view;

                let data = map_data.fromEncodedData(window.location.hash.slice(1));
                map_data = new MapData(data.width, data.height);
                map_data.fromData(data.data);
                map_view.setMap(map_data);
            } catch(e) {
                console.dir(e);
                window.location.hash = "";
            }
        }

        this.current_editor.map_view.on('map_changed', function(event) {
            //console.dir();
            window.location.hash = _Instance.current_editor.map_data.getEncodedData();
        });

        let _draw = function() {
            _Instance.draw();
            window.requestAnimationFrame(_draw);
        }
        _draw();

        window.addEventListener('resize', function() {
            _Instance.resize();
        });
        this.resize();

        window.addEventListener('mousemove', function(e) {
            _Instance.current_editor._mouseMove(e.clientX, e.clientY);
        });
        window.addEventListener('mousedown', function(e) {
            _Instance.current_editor._onClick(e.clientX, e.clientY, e.button);
        });
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        window.addEventListener('keydown', function(e) {
            let key = e.keyCode;
            let key_name = "";
            for (let k in KEYCODES) {
                if ((key == KEYCODES[k][0]) || (key == KEYCODES[k][1])) {
                    key_name = k;
                }
            }
            if (key_name != "") {
                _Instance.current_editor.fireEvent('key', {
                    name: key_name
                });
            }
        });
    }
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.current_editor.resize(0, 0, this.width, this.height);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.current_editor._draw(this.ctx);
    }
    findTypeByName(type) {
        for (let i=0; i<MACHINE_TYPES.length; i++) {
            if (MACHINE_TYPES[i].type == type) {
                return MACHINE_TYPES[i];
            }
        }
    }
    loadImageFiles() {
        let files = this.atlas.filenames;
        let imgs = [];

        let loaded = 0;
        let load_total = files.length;

        let _Instance = this;
        for (let i=0; i<files.length; i++) {
            let img = document.createElement('img');
            img.src = "img/" + files[i];
            img.style = "display: none;";
            img.id = files[i].slice(0, files[i].length - 4);

            img.addEventListener('load', function() {
                loaded++;
                let percent = (loaded/load_total) * 100;
                //console.log("Percentage loaded: " + percent + "%");
                _Instance.current_editor.splashscreen.loading = percent;

                if (loaded == load_total) {
                    _Instance.current_editor.map_view.dirtyMap();
                    _Instance.current_editor.splashscreen.active = false;
                }
            });

            imgs.push(img);
        }

        let b = document.body;
        for (let i=0; i<imgs.length; i++) {
            b.appendChild(imgs[i]);
        }
    }
}

let shipyard = null;

window.addEventListener('load', function() {
    var client = new XMLHttpRequest();
    client.open('GET', './img/gameatlas.atlas');
    client.onload = function() {
        let status = client.status;
        if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            shipyard = new Shipyard(client.responseText);
        }        
    }
    client.send();
});

function query(query_text) {
    let res = shipyard.atlas.findAll(query_text);
    ret = [];
    for (let i=0; i<res.length; i++) {
        ret.push(res[i].texture.name + " -> " + res[i].sheet);
    }
    console.dir(ret);
}
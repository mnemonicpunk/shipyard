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

        this.width = 0;
        this.height = 0;
        this.current_editor = new EditorFactory(0,0,this.width,this.height);

        if (window.location.hash) {
            try {
                this.current_editor.map_data.fromData(this.fromEncodedData(window.location.hash.slice(1)));
            } catch(e) {
                console.dir(e);
                window.location.hash = "";
            }
        }

        this.current_editor.map_view.on('map_changed', function(event) {
            //console.dir();
            window.location.hash = _Instance.getEncodedData();
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
    getEncodedData() {
        let raw = this.current_editor.map_data.getData();
        let enc = [];
        let rle_counter = 0;

        for (let i=0; i<raw.length; i++) {
            if (raw[i] == null) {
                rle_counter++;
                if (rle_counter == 3) {
                    enc.push(-1);
                    enc.push(rle_counter);

                    rle_counter = 0;
                }
            } else {
                if (rle_counter > 0) {
                    enc.push(-1);
                    enc.push(rle_counter);

                    rle_counter = 0;
                }
                enc.push(raw[i].type_num);
                enc.push(Math.floor(raw[i].direction/90));
            }
        }
        if (rle_counter > 0) {
            enc.push(-1);
            enc.push(rle_counter);
        }

        // encode tightly
        let buffer = new ArrayBuffer(enc.length/2);
        let view = new Uint8Array(buffer);

        for (let i=0; i<buffer.byteLength; i++) {
            view[i] = enc[i*2]+1;
            view[i] |= enc[(i*2)+1] << 6;
        }
        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));

        return base64String;
    }
    fromEncodedData(enc) {
        let data = [];
        
        let binary_string = atob(enc);
        let bytes = new Uint8Array(binary_string.length);
        for (let i=0; i<binary_string.length; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        for (let i=0; i<bytes.length; i++) {
            let dev = (bytes[i] & 63) -1;
            let param = bytes[i] >> 6;

            if (dev == -1) {
                for (let i=0; i<param; i++) {
                    data.push(null);
                }
            } else {
                data.push({
                    type_num: dev,
                    direction: param * 90
                });
            }
        }
        return data;
    }
}

let shipyard = null;

window.addEventListener('load', function() {
    var client = new XMLHttpRequest();
    client.open('GET', './gameatlas.atlas');
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
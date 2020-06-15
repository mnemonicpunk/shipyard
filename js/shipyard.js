const KEYCODES = {
    'up': [87, 38],
    'down': [83, 40],
    'left': [65, 37],
    'right': [68, 39],
    'one': [49],
    'two': [50],
    'three': [51],
    'four': [52]
};

window.isMobile = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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
            console.log("map changed");
            window.location.hash = _Instance.current_editor.map_view.map_data.getEncodedData();
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
            e.preventDefault();
            _Instance.current_editor._mouseMove(e.clientX, e.clientY);
        });
        window.addEventListener('mousedown', function(e) {
            e.preventDefault();
            _Instance.current_editor._onClick(e.clientX, e.clientY, e.button);
        });
        window.addEventListener('mouseup', function(e) {
            e.preventDefault();
            _Instance.current_editor._onMouseUp(e.clientX, e.clientY, e.button);
        });
        this.canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            let touches = e.changedTouches;
            _Instance.current_editor._mouseMove(touches[0].clientX, touches[0].clientY);
        });        
        this.canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            let touches = e.changedTouches;
            _Instance.current_editor._mouseMove(touches[0].clientX, touches[0].clientY);
            _Instance.current_editor._onClick(touches[0].clientX, touches[0].clientY, 0);
        });
        this.canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            let touches = e.changedTouches;
            _Instance.current_editor._onMouseUp(touches[0].clientX, touches[0].clientY, 0);
        });
        /*window.addEventListener('mousewheel', function(e) {
            e.preventDefault();
            _Instance.current_editor.scroll(e.deltaX, e.deltaY);
        });     */         
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
class TextureAtlas {
    constructor(raw_data) {
        let d = this.parse(raw_data);
        this.data = d.data;
        this.filenames = d.files;
    }
    parse(data) {
        // got the data, now let's make it usable
        let lines = data.split('\n');
    
        let atlas_raw = [];
        let current_atlas = [];
        let filenames = [];
    
        for (let i=0; i<lines.length; i++) {
            let nl = lines[i];
            if (nl == "") {
                if (current_atlas.length > 0) {
                    atlas_raw.push(current_atlas);
                    current_atlas = [];    
                }
            } else {
                current_atlas.push(nl);
            }
        }
    
        function parseLine(line) {
            let parts = line.trim().split(": ")
    
            if (parts.length < 2) {
                return {
                    property: parts,
                    values: []
                };
            }
    
            let property_name = parts[0];
            let property_contents = parts[1].split(", ");
            if (parts[1].split(", ").length == 1) {
                property_contents = parts[1];
            }
    
            return {
                property: property_name,
                values: property_contents
            };
        }
    
        function parseAtlas(raw) {
            let atlas = {
                file: "",
                size: [],
                format: [],
                repeat: "",
                textures: []
            };
    
            atlas.file = raw[0];
            for (let i=0; i<4; i++) {
                let line = parseLine(raw[1+i]);
                atlas[line.property] = line.values; 
            }
    
            let parsed_objs = [];
            let current_obj = null;
    
            for (let i=6; i<lines.length; i++) {
                let parsed = parseLine(lines[i]);
                if (parsed.values.length < 1) {
                    if (parsed.property != '') {
                        if (current_obj != null) {
                            parsed_objs.push(current_obj);
                        }
                        current_obj = {
                            name: parsed.property[0]
                        };
                    }
                } else {
                    current_obj[parsed.property] = parsed.values;
                }
            }
    
            atlas.textures = parsed_objs;
    
            return atlas;
        }
    
        let parsed_atlas = [];
    
        for (let i=0; i<atlas_raw.length; i++) {
            parsed_atlas.push(parseAtlas(atlas_raw[i]));
            filenames.push(parsed_atlas[i].file);
        }

        return {
            data: parsed_atlas,
            files: filenames
        };
    
    }
    getTexture(atlas_name, texture_name) {
        let atlas = null;
        for (let i=0; i<this.data.length; i++) {
            if (this.data[i].file == atlas_name) {
                
                atlas = this.data[i];
            }
        }
        if (atlas == null) {
            return null;
        }
        for (let i=0; i<atlas.textures.length; i++) {
            let t = atlas.textures[i];
            if (t.name == texture_name) {
                return {
                    sheet: atlas_name.slice(0, atlas_name.length-4),
                    data: t
                }
            }
        }
    }
    findAll(query) {
        let result = [];
        for (let i=0; i<this.data.length; i++) {
            let a = this.data[i];
            for (let j=0; j<a.textures.length; j++) {
                let t = a.textures[j];
                if (t.name.includes(query)) {
                    result.push({
                        sheet: a.file,
                        texture: t
                    });
                }
            }
        }
        return result;
    }
}
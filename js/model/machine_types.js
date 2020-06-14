const DIRECTIONS = {
    right: 0,
    up: 90,
    left: 180,
    down: 270
};

const MACHINE_TYPES = [
    {
        name: "Belt (straight)",
        type: "belt_straight",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            let part = null;
            let part_arrow = null;
    
            switch (direction) {
                case (DIRECTIONS.up):
                    part = node.addPart("gameatlas4.png", "south-straight", -75, -75);
                    part_arrow = node.addPart("gameatlas4.png", "south-straight-arrow", -75, -85);
                    break;
                case (DIRECTIONS.down):                
                    part = node.addPart("gameatlas3.png", "north-straight", -65, -75);
                    part_arrow = node.addPart("gameatlas4.png", "north-straight-arrow", -65, -65);
                    break;
                case (DIRECTIONS.left):
                    part = node.addPart("gameatlas4.png", "west-straight", -75, -48);
                    part_arrow = node.addPart("gameatlas4.png", "west-straight-arrow", -75, -75);
                    break;
                case (DIRECTIONS.right):
                    part = node.addPart("gameatlas3.png", "east-straight", -75, -43);
                    part_arrow = node.addPart("gameatlas4.png", "east-straight-arrow", -75, -70);
                    break;                    
            }
    
            part.scale_x = 1.5;
            part.scale_y = 1.5;
            part_arrow.scale_x = 1.5;
            part_arrow.scale_y = 1.5;            
        }
    },
    {
        name: "Belt (curved)",
        type: "belt_curved",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            let part = null;
            let part_arrow = null;
    
            switch (direction) {
                case (DIRECTIONS.up):
                    part = node.addPart("gameatlas4.png", "south-CCW", -75, -35);
                    part_arrow = node.addPart("gameatlas4.png", "south-CCW-arrow", -75, -75);
                    break;
                case (DIRECTIONS.down):                
                    part = node.addPart("gameatlas3.png", "north-CCW", -65, -90);
                    part_arrow = node.addPart("gameatlas4.png", "north-CCW-arrow", -65, -70);
                    break;
                case (DIRECTIONS.left):
                    part = node.addPart("gameatlas5.png", "west-CCW", -65, -38);
                    part_arrow = node.addPart("gameatlas4.png", "west-CCW-arrow", -65, -75);
                    break;                    
                case (DIRECTIONS.right):
                    part = node.addPart("gameatlas4.png", "east-CCW", -75, -88);
                    part_arrow = node.addPart("gameatlas3.png", "east-CCW-arrow", -75, -68);
                    break;                                        

            }
    
            part.scale_x = 1.5;
            part.scale_y = 1.5;
            part_arrow.scale_x = 1.5;
            part_arrow.scale_y = 1.5;            
        }
    },
    {
        name: "Belt (t-shape)",
        type: "belt_t",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            let part = null;
    
            switch (direction) {
                case (DIRECTIONS.up):
                    part = node.addPart("gameatlas3.png", "north-straight", 0, -75);
                    break;
                case (DIRECTIONS.down):                
                    part = node.addPart("gameatlas4.png", "south-straight", 0, -75);
                    break;
                case (DIRECTIONS.left):
                    part = node.addPart("gameatlas4.png", "west-straight", -75, -48);
                    break;
                case (DIRECTIONS.right):
                    part = node.addPart("gameatlas3.png", "east-straight", -75, -48);
                    break;                    
            }
    
            part.scale_x = 1.5;
            part.scale_y = 1.5;
        }
    },        
    {
        name: "Heater",
        type: "heater",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-melter", -64, -112);
        }
    },
    {
        name: "Exporter",
        type: "exporter",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-claimer-export", -64, -96);
        }
    },    
    {
        name: "Press",
        type: "press",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-press-body", 0, -40);
            let n = node.addPart("gameatlas3.png", "device-press-body", 0, -40);
            n.scale_x = -1;
            node.addPart("gameatlas3.png", "device-press-middle", -48, -40);
            node.addPart("gameatlas3.png", "device-press-back", -48, -56);
        }
    },
    {
        name: "Synthesizer",
        type: "synthesizer",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-substance", -64, -96);
        }
    },  
    {
        name: "Cutter",
        type: "cutter",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-saw-cutter-body", -60, -64);
        }
    },    
    {
        name: "Grabber",
        type: "grabber",
        width: 1,
        height: 1,
        sprite: function(node, direction) {
            node.addPart("gameatlas4.png", "device-grabber-base", -36, -36);
            a = node.addPart("gameatlas3.png", "device-grabber-arm-part-1", 0, -22);
            a.image_data.x_off = -6;
            a.image_data.y_off = -20;
            a.rotation = direction;

            a = a.addPart("gameatlas5.png", "device-grabber-arm-part-2", 55, -20);
            a.image_data.x_off = 0;
            a.image_data.y_off = 0;

            let arm = a;

            a = arm.addPart("gameatlas5.png", "device-grabber-finger", 85, 35);
            a.image_data.x_off = 0;
            a.image_data.y_off = 0;
            a.rotation = 180;

            a = arm.addPart("gameatlas5.png", "device-grabber-finger", 85, -15);
            a.image_data.x_off = 0;
            a.image_data.y_off = 0;
            a.scale_y = -1;
            a.rotation = 180;
        }
    },   
    {
        name: "Extruder",
        type: "extruder",
        width: 1,
        height: 1,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-extruder-body", -60, -124);
            node.addPart("gameatlas3.png", "device-extruder-front-part", -22, -44);
            node.addPart("gameatlas4.png", "extruder-3d-part", -60, -124);
        }
    },     
    {
        name: "Caster",
        type: "caster",
        width: 1,
        height: 1,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-caster", -64, -96);
        }
    },  
    {
        name: "Splitter",
        type: "splitter",
        width: 2,
        height: 1,
        sprite: function(node, direction) {
            //node.addPart("gameatlas3.png", "device-splitter-body-horizontal-down", -54, -82);
            switch (direction) {
                case (DIRECTIONS.up):
                    part = node.addPart("gameatlas3.png", "device-splitter-body-horizontal-down", -54, -82);
                    break;
                case (DIRECTIONS.down):                
                    part = node.addPart("gameatlas3.png", "device-splitter-body-horizontal-up", -54, -82);
                    break;
                case (DIRECTIONS.left):
                    part = node.addPart("gameatlas3.png", "device-splitter-body-horizontal-vertical", 54, -82);
                    part.scale_x = -1;
                    break;
                case (DIRECTIONS.right):
                    part = node.addPart("gameatlas3.png", "device-splitter-body-horizontal-vertical", -54, -82);
                    break;                    
            }
        },
    },   
    {
        name: "Obstacle",
        type: "obstacle",
        width: 1,
        height: 1,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-obstacle-1", -64, -82);
        },
    },    
    {
        name: "Recycler",
        type: "recycler",
        width: 3,
        height: 3,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-recycler-body", -54, -62);
        },
    },         
    {
        name: "Mixer",
        type: "mixer",
        width: 1,
        height: 1,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-mixer", -64, -112);
        },
    },           
    {
        name: "Importer",
        type: "importer",
        width: 1,
        height: 1,        
        sprite: function(node, direction) {
            node.addPart("gameatlas3.png", "device-claimer-import", -64, -96);
        }
    },      
]
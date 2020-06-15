class mnWidget {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.children = [];
        this.active = true;

        this.hovered = false;

        this._callbacks = {};
    }
    _draw(ctx) {
        if (!this.active) { return; }
        ctx.save();
        ctx.translate(this.x, this.y);
        this.draw(ctx);
        this.withChildren(function(parent, self) {
            self._draw(ctx);
        });
        ctx.restore();
    }
    draw(ctx) {

    }
    withChildren(callback) {
        let ret = false;
        for (let i=0; i < this.children.length; i++) {
            if (ret) { continue; }
            ret |= (callback(this, this.children[i]));
        }
        return ret;
    }
    withChildrenInverted(callback) {
        let ret = false;
        for (let i=0; i < this.children.length; i++) {
            if (ret) { continue; }
            ret |= (callback(this, this.children[this.children.length-1-i]));
        }
        return ret;
    }
    isUnderMouse(x, y) {
        if ((x >= this.x) && (x <= this.x+this.width) && (y >= this.y) && (y <= this.y+this.height)) {
            return true;
        }
        return false;
    }
    _mouseMove(x, y) {
        if (!this.active) { return false; }

        let consumed = this.withChildrenInverted(function(parent, self) {
            return self._mouseMove(x - parent.x, y - parent.y);
        }); 
        if (!consumed) {
            this.mouseMove(x, y);       
            if (this.isUnderMouse(x, y)) {
                consumed |= this.onHover(x, y);
            }    
        }
        return consumed;
    }
    _onClick(x, y, button) {
        if (!this.active) { return false; }

        let consumed = this.withChildrenInverted(function(parent, self) {
            return self._onClick(x - parent.x, y - parent.y, button);
        });             
        if (!consumed) {
            if (this.isUnderMouse(x, y)) {
                consumed |= this.onClick(x, y, button);
            }    
        }
        return consumed;
    }
    _onMouseUp(x, y, button) {
        if (!this.active) { return false; }

        let consumed = this.withChildrenInverted(function(parent, self) {
            return self._onMouseUp(x - parent.x, y - parent.y, button);
        });             
        if (!consumed) {
            if (this.isUnderMouse(x, y)) {
                consumed |= this.onMouseUp(x, y, button);
            }    
        }
        return consumed;
    }    
    mouseMove(x, y) {

    }
    onHover(x, y) {
        
    }
    onClick(button) {

    }
    onMouseUp(button) {

    }    
    resize(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;        
    }
    on(event_name, callback) {
        if (!this._callbacks[event_name]) {
            this._callbacks[event_name] = [];
        }
        this._callbacks[event_name].push(callback);
    }
    fireEvent(event_name, data) {
        if (!this._callbacks[event_name]) {
            this._callbacks[event_name] = [];
        }

        let consumed = this.withChildren(function(parent, self) {
            return self.fireEvent(event_name, data);
        });

        if (!consumed) {
            for (let i=0; i<this._callbacks[event_name].length; i++) {
                consumed |= this._callbacks[event_name][i](data);
            }
        }

        return consumed;
    }
}

class mnUI extends mnWidget {}
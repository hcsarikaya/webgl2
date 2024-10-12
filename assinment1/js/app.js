"use strict";


window.onload = function init() {
    // This code runs after the page is fully loaded
    main();
};

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    const gl = canvas.getContext("webgl2");
    
    if(!gl) {
        alert("Unable to initialize Webgl. Your browser or machine may not support it.");
        return ;
    }
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }


    const program = initShaderProgram(gl, vsSource, fsSource);
    
    const positions = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5];
    
    const buffer = initBuffer(gl, positions);
    
    const numOfComponents = 2;
    const type  = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    const vertexCount = 3;
    
    gl.useProgram(program);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "a_position"), numOfComponents, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
}



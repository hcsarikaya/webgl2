"use strict";


window.onload = function init() {

    main();
};

function main() {
    const canvas = document.getElementById( "gl-canvas" );
    const gl = canvas.getContext("webgl2");
    
    if(!gl) {
        alert("Unable to initialize Webgl. Your browser or machine may not support it.");
        return ;
    }
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }


    const program = initShaderProgram(gl, vsSource, fsSource);


    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);


    const colorLocation = gl.getUniformLocation(program, "u_color");

    let scale = 3;
    draw();


    const slider = document.getElementById('slider');
    slider.addEventListener('input', (event) => {
        scale = event.target.value;
        draw();
    });

    function draw(){
        let umbrella = new Umbrella();


        umbrella.handle = umbrella.calculateHandle();

        const triangulator = new PolygonTriangulation();
        let triangleVertices = triangulator.triangulate(umbrella.handle);
        let vertexCount = triangulator.getVertexCount();


        const triangleBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.uniform4f(colorLocation, 0.2, 0.1, 0.1, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);


        umbrella.fabric = umbrella.calculateFabric(100, [-1, 0.4], [1, 0.4],[0, 1.1],0.5, scale)

        triangleVertices = triangulator.triangulate(umbrella.fabric);
        vertexCount = triangulator.getVertexCount();



        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.uniform4f(colorLocation, 1, 1, 0, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
}




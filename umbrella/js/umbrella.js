class Umbrella {
    constructor() {
        this.handle = [];
        this.fabric = [];
    }
    static getQuadraticBezierPoint(t, P0, P1, P2) {
        const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
        const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
        return [x, y];
    }
    static calculateCurvePoints(numpoint, P0, P1, P2){
        const CurvePoints = [];
        for (let i = 0; i <= numpoint; i++) {
            const t = i / numpoint;
            CurvePoints.push(this.getQuadraticBezierPoint(t, P0, P1, P2));
        }
        return CurvePoints;
    }


    calculateFabric(numpoint, P0, P1, C0, C1, numlow= 2){
        let upperCurvePoints = Umbrella.calculateCurvePoints(numpoint, P0, C0, P1);


        let asd = [];

        let k = (P1[0] - (P0[0])) /numlow;

        for (let i = 0; i <= numlow; i++) {
            asd.push([(P0[0]+(k * i)),P0[1]]);
        }

        for (let i = numlow ; i > 0; i--) {
            let co = (asd[i][0] + asd[i-1][0])/ 2;
            let lower = Umbrella.calculateCurvePoints(numpoint, asd[i], [(asd[i][0] + asd[i-1][0])/ 2,C1], asd[i-1]).slice(1);

            upperCurvePoints = upperCurvePoints.concat(lower);
        }

        this.fabric = upperCurvePoints;
        return this.fabric;
    }

    calculateHandle(){

        let uppercurver = Umbrella.calculateCurvePoints(30, [-0.05,0.8], [0,0.9],[0.05,0.8]);
        this.handle = this.handle.concat(uppercurver);
        let lowcurve1 = Umbrella.calculateCurvePoints(30, [0.05,-0.5], [-0.15,-0.8], [-0.35, -0.5]).slice(1);
        this.handle = this.handle.concat(lowcurve1);
        let lowcurve2 = Umbrella.calculateCurvePoints(30, [-0.25,-0.5], [-0.15,-0.65], [-0.05, -0.5]).slice(1);
        this.handle = this.handle.concat(lowcurve2);

        return this.handle;
    }


}
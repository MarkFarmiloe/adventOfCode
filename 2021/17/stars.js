'use strict';

const highest = ([xn, xx, yn, yx]) => {
    const checkTrajectory = (vx, vy) => {
        let maxH = 0;
        let x = 0, y = 0;
        do {
            x += vx; y += vy;
            maxH = maxH > y ? maxH : y;
            vy--;
            vx = vx > 0 ? vx - 1 : 0;
            if (x >= xn && x <= xx && y >= yn && y <= yx) {
                return maxH;
            }
        } while (x <= xx && y >= yn);
        return -1;
    };
    let maxH = 0, count = 0;
    const minX = Math.floor(Math.sqrt(2 * xn));
    for (let vx = minX; vx <= xx; vx++) {
        for (let vy = yn; vy <= 100; vy++) {
            const h = checkTrajectory(vx, vy);
            if (h >= 0) count++;
            maxH = maxH > h ? maxH : h;
        }       
    }
    return [maxH, count];
};

const process = () => {
    // const target = [20, 30, -10, -5];
    const target = [209, 238, -86, -59];
    console.log(highest(target));
}
process();

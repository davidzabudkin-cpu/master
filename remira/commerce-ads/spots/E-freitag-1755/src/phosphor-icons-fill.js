// Phosphor Icons (https://phosphoricons.com), MIT License, Copyright (c) 2023 Phosphor Icons
// Gewicht: fill, Version 2.1.1, viewBox 0 0 256 256, Flächen (fill), nicht Striche.
export const PHOSPHOR = {
 "star": [
  "M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"
 ]
};
export const phosphorPathFill = name => { const p = new Path2D(); for (const d of PHOSPHOR[name]) p.addPath(new Path2D(d)); return p; };

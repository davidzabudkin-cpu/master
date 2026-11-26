// Phosphor Icons (https://phosphoricons.com), MIT License, Copyright (c) 2023 Phosphor Icons
// Gewicht: bold, Version 2.1.1, viewBox 0 0 256 256, Flächen (fill), nicht Striche.
export const PHOSPHOR = {
 "check": [
  "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
 ],
 "x": [
  "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
 ]
};
export const phosphorPathBold = name => { const p = new Path2D(); for (const d of PHOSPHOR[name]) p.addPath(new Path2D(d)); return p; };

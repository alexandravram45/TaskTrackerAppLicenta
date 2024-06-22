import React from 'react'

const Wave = () => (
    <svg
    id="wave"
    style={{ transform: 'rotate(180deg)', transition: '0.3s', width: '100%', height: 'auto' }}
    viewBox="0 0 1440 110"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
        <stop stopColor="rgba(255, 255, 255, 1)" offset="0%" />
        <stop stopColor="rgba(255, 255, 255, 1)" offset="100%" />
      </linearGradient>
    </defs>
    <path
      style={{ transform: 'translate(0, 0px)', opacity: 1 }}
      fill="url(#sw-gradient-0)"
      d="M0,0L21.8,9.2C43.6,18,87,37,131,36.7C174.5,37,218,18,262,20.2C305.5,22,349,44,393,56.8C436.4,70,480,73,524,71.5C567.3,70,611,62,655,53.2C698.2,44,742,33,785,23.8C829.1,15,873,7,916,18.3C960,29,1004,59,1047,58.7C1090.9,59,1135,29,1178,25.7C1221.8,22,1265,44,1309,51.3C1352.7,59,1396,51,1440,45.8C1483.6,40,1527,37,1571,29.3C1614.5,22,1658,11,1702,7.3C1745.5,4,1789,7,1833,16.5C1876.4,26,1920,40,1964,45.8C2007.3,51,2051,48,2095,42.2C2138.2,37,2182,29,2225,25.7C2269.1,22,2313,22,2356,20.2C2400,18,2444,15,2487,12.8C2530.9,11,2575,11,2618,22C2661.8,33,2705,55,2749,69.7C2792.7,84,2836,92,2880,88C2923.6,84,2967,70,3011,55C3054.5,40,3098,26,3120,18.3L3141.8,11L3141.8,110L3120,110C3098.2,110,3055,110,3011,110C2967.3,110,2924,110,2880,110C2836.4,110,2793,110,2749,110C2705.5,110,2662,110,2618,110C2574.5,110,2531,110,2487,110C2443.6,110,2400,110,2356,110C2312.7,110,2269,110,2225,110C2181.8,110,2138,110,2095,110C2050.9,110,2007,110,1964,110C1920,110,1876,110,1833,110C1789.1,110,1745,110,1702,110C1658.2,110,1615,110,1571,110C1527.3,110,1484,110,1440,110C1396.4,110,1353,110,1309,110C1265.5,110,1222,110,1178,110C1134.5,110,1091,110,1047,110C1003.6,110,960,110,916,110C872.7,110,829,110,785,110C741.8,110,698,110,655,110C610.9,110,567,110,524,110C480,110,436,110,393,110C349.1,110,305,110,262,110C218.2,110,175,110,131,110C87.3,110,44,110,22,110L0,110Z"
    ></path>
  </svg>
);

export default Wave;

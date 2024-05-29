export const COLORS = {
    pinky: '#FFDEE9',
    cyan: '#B5FFFC',
    gray: '#f6f7fb',
}

export const backgroundColors = [
    'linear-gradient(23deg, rgba(186,173,242,1) 0%, rgba(255,212,82,0.768032212885154) 100%)',
    'linear-gradient(23deg, rgba(145,167,244,0.6811974789915967) 0%, rgba(255,77,157,1) 100%)',
    'linear-gradient(23deg, rgba(249,161,60,1) 0%, rgba(227,73,53,1) 100%)',
    'linear-gradient(23deg, rgba(191,79,153,1) 0%, rgba(14,51,109,1) 100%)',
    'linear-gradient(23deg, rgba(12,100,225,1) 0%, rgba(9,54,116,1) 100%)',
    'linear-gradient(23deg, rgba(24,24,24,1) 0%, rgba(0,29,92,1) 100%)',

]
export const formats = ["header","bold","italic","underline","strike","blockquote",
    "list","bullet","indent","link","image","color","clean",
  ];

export const quillColors = [
    "purple",
    "#785412",
    "#452632",
    "#856325",  
    "#963254",
    "#254563",
    "white"
  ];

  export const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ]
    },
    clipboard: {
      matchVisual: true,
    },
  }

  export const taskColors = [
    '#FF5733', // Portocaliu
    '#33FF57', // Verde luminos
    '#3399FF', // Albastru luminos
    '#FF33E9', // Roz
    '#FFD133', // Galben
    '#8A2BE2', // Mov
    '#33FFDD', // Turcoaz
    '#FF3366', // Roșu
    '#33FF33', // Verde neon
    '#33FFFF', // Albastru neon
  ];
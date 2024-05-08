export const COLORS = {
    pinky: '#FFDEE9',
    cyan: '#B5FFFC',
    gray: '#f6f7fb',
}

export const backgroundColors = [
    'linear-gradient(23deg, rgba(145,167,244,0.6811974789915967) 0%, rgba(255,77,157,1) 100%)',
    'linear-gradient(23deg, rgba(255,133,39,0.6811974789915967) 0%, rgba(21,96,255,1) 100%)',
    'linear-gradient(23deg, rgba(186,173,242,1) 0%, rgba(255,212,82,0.768032212885154) 100%)',
    'linear-gradient(23deg,  rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2% )',
    'linear-gradient(23deg, rgba(42,117,162,1) 0%, rgba(226,235,240,1) 100%)',

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
const order: any = {
    "type": "dual",
    "orientation": "horizontal",
    "ratio": "3:120",
    "first": {
        "type": "final",
        "name": "CTopBar",
        "options": {
            "color": "#FFF",
            "background": "#2D2D2D"    
        }
    },
    "second": {
        "type": "dual",
        "orientation": "vertical",
        "ratio": "7:93",
        "first": {
            "type": "final",
            "name": "CLeftBar",
            "options": {
                "color": "#FFF",
                "background": "#1E1E1E",
            }
        },
        "second": {
            "type": "final",
            "name": "CText",
            "options": {
                "background": "#1E1E1E",
                "cursorColor": "#FF0000"
            }
        }
    }
};

// "second": {
//     "type": "final",
//     "name": "CText"
// }

/*
# types
"type": "dual"
    Has to have
        "orientation": "vertical" / "horizontal"
        "first": CChunk item
        "second": CChunk item
"type": "final"
    Has to have
        "name": ...
*/

export default order;

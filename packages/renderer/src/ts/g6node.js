import G6 from "@antv/g6";

const ICON_MAP = {
    0: '/images/runner.png',
    1: '/images/trigger.png',
};

const fittingString = (str, maxWidth, fontSize) => {
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth) return;
        if (pattern.test(letter)) {
            // Chinese charactors
            currentWidth += fontSize;
        } else {
            // get the width of single letter according to the fontSize
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth) {
            res = `${str.substr(0, i)}\n${str.substr(i)}`;
        }
    });
    return res;
};

G6.registerNode(
    'card-node',
    {
        drawShape: function drawShape(cfg, group) {
            let color;
            if(cfg.status===0){
                color = '#c5c4c4'
            }else if(cfg.status===1){
                color = '#007afa'
            }else if(cfg.status === 2){
                color = '#f10d0d'
            }else if(cfg.status ===3){
                color = '#16d003'
            } else{
                color = '#fff'
            }
            const r = 2;
            const shape = group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    width: 240,
                    height: 80,
                    stroke: color,
                    radius: r,
                },
                name: 'main-box',
                // draggable: true,
            });

            group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    width: 240,
                    height: 36,
                    fill: color,
                    radius: [r, r, 0, 0],
                },
                name: 'title-box',
                draggable: true,
            });
            group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 36,
                    width: 240,
                    height: 44,
                    fill: '#fff',
                    opacity: 0,
                    radius: [r, r, 0, 0],
                },
                name: 'title-box',
                draggable: true,
            });

            // left icon
            group.addShape('image', {
                attrs: {
                    x: 6,
                    y: 6,
                    height: 24,
                    width: 24,
                    cursor: 'pointer',
                    img: ICON_MAP[cfg.taskType || 0],
                },
                name: 'node-icon',
            });
            // title text
            const titleText = cfg.title && cfg.title!=='unTitled' ? cfg.title : cfg.taskLabel
            group.addShape('text', {
                attrs: {
                    textBaseline: 'top',
                    y: 2,
                    x: 36,
                    lineHeight: 20,
                    text: titleText,
                    fill: '#fff',
                },
                name: 'title',
            });

            group.addShape('text', {
                attrs: {
                    textBaseline: 'top',
                    y: 20,
                    x: 36,
                    lineHeight: 15,
                    text: cfg.name,
                    fill: 'rgba(255,255,255,0.65)',
                },
                name: 'title',
            });

            if (cfg.nodeLevel > 0) {
                group.addShape('marker', {
                    attrs: {
                        x: 184,
                        y: 30,
                        r: 6,
                        cursor: 'pointer',
                        symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
                        stroke: '#666',
                        lineWidth: 1,
                    },
                    name: 'collapse-icon',
                });
            }

            group.addShape('text', {
                attrs: {
                    textBaseline: 'top',
                    x: 24,
                    y: 40,
                    lineHeight: 20,
                    text: fittingString(cfg.description, 150, 12),
                    fill: 'rgba(0,0,0,0.4)'
                },
                name: 'text-describe'
            })
            if (cfg.id !== 'header') {
                group.addShape('circle', {
                    attrs: {
                        r: 5,
                        x: 0,
                        y: 40,
                        fill: '#fff',
                        stroke: '#5F95FF'
                    },
                    name: `anchor-point-left`, // the name, for searching by group.find(ele => ele.get('name') === 'anchor-point')
                    anchorPointIdx: 0, // flag the idx of the anchor-point circle
                    links: 0, // cache the number of edges connected to this shape
                    visible: false, // invisible by default, shows up when links > 1 or the node is in showAnchors state
                    draggable: true // allow to catch the drag events on this shape
                })
            }
            group.addShape('circle', {
                attrs: {
                    r: 5,
                    x: 240,
                    y: 40,
                    fill: '#fff',
                    stroke: '#5F95FF'
                },
                name: `anchor-point-right`, // the name, for searching by group.find(ele => ele.get('name') === 'anchor-point')
                anchorPointIdx: 1, // flag the idx of the anchor-point circle
                links: 0, // cache the number of edges connected to this shape
                visible: false, // invisible by default, shows up when links > 1 or the node is in showAnchors state
                draggable: true // allow to catch the drag events on this shape
            })

            return shape;
        },

        getAnchorPoints() {
            return [
                [0, 0.5],
                [1, 0.5]
            ]
        },

        update: undefined,

        setState(name, value, item) {
            if (name === 'showAnchors') {
                const anchorPoints = item.getContainer().findAll(ele => ele.get('name').includes('anchor-point'));
                anchorPoints.forEach(point => {
                    if (value || point.get('links') > 0) point.show()
                    else point.hide()
                })
            }
            const group = item.getContainer()
            const shape = group.getChildren()[0]
            if (name === 'active' && !item.getStates().includes('selected')) {
                if (value) {
                    shape.attr('shadowBlur', 5)
                    shape.attr('shadowColor', '#0655ff')
                } else {
                    shape.attr('shadowBlur', 0)
                }
            } else if (name === 'selected') {
                if (value) {
                    shape.attr('shadowOffsetX', 0)
                    shape.attr('shadowOffsetY', 0)
                    shape.attr('shadowBlur', 5)
                    shape.attr('shadowColor', '#ff7606')
                } else {
                    shape.attr('shadowBlur', 0)
                }
            }
        }
    },
    'single-node',
);

export {fittingString}
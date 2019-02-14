'use strict';

const fs = require('fs');

let sprite = {};


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

var meta = {};
readline.question(`Set Meta Data \n Image File Path (relative to json)?`, (fileName) => {
    meta.image = fileName;
    readline.question(`Your app name?`, (appName) => {
        meta.app = appName;
        var versioNo = "1.0";
        readline.question(`Version (default 1.0.0)?`, (version) => {
            if (version) {
                versioNo = version;
            }
            meta.version = versioNo;
            var format = "RGBA8888";
            readline.question(`Format (default RGBA8888)?`, (formatNo) => {
                if (formatNo) {
                    format = formatNo;
                }
                meta.format = format;
                var scale = "1";
                readline.question(`Scale (default 1)?`, (scaleNo) => {
                    if (scaleNo) {
                        scale = scaleNo;
                    }
                    meta.scale = scale;
                    readline.question(`Width?`, (width) => {
                        meta.size = {};
                        meta.size.w = width;
                        readline.question(`Height?`, (height) => {
                            meta.size.h = height;
                            sprite.meta = meta;
                            var frames = {};
                            readline.question(`Frames: image prefix name? `, (prefix) => {
                                readline.question(`image ending (png, jpeg etc.)? `, (ending) => {
                                    readline.question(`How many rows?`, (rows) => {
                                        readline.question(`How many columns?`, (columns) => {
                                            readline.question(`row height`, (rowHeight) => {
                                                readline.question(`column width?`, (columnWidth) => {
                                                    readline.question(`rotated (0 = false)?`, (rotated) => {
                                                        readline.question(`trimmed (0 = false)?`, (trimmed) => {
                                                            readline.question(`margin (0 = false)?`, (margin) => {
                                                                for (let i = 0; i < rows; i++) {
                                                                    for (let j = 0; j < columns; j++) {
                                                                        var frameObj = {};
                                                                        var key = prefix + "_" + i + "_" + j + "." + ending;
                                                                        let newMargin = margin;
                                                                        if (j == 0) {
                                                                            newMargin = 0;
                                                                        }
                                                                        frameObj.x = (j * parseInt(columnWidth)) + parseInt(newMargin);
                                                                        if (i == 0) {
                                                                            newMargin = 0;
                                                                        }
                                                                        frameObj.y = (i * parseInt(rowHeight)) + parseInt(newMargin);
                                                                        frameObj.w = columnWidth;
                                                                        frameObj.h = rowHeight;
                                                                        var spriteSourceSize = {};
                                                                        spriteSourceSize.x = 0;
                                                                        spriteSourceSize.y = 0;
                                                                        spriteSourceSize.w = columnWidth;
                                                                        spriteSourceSize.h = rowHeight;
                                                                        var sourceSize = {};
                                                                        sourceSize.w = columnWidth;
                                                                        sourceSize.h = rowHeight;
                                                                        frames[key] = {};
                                                                        frames[key].frame = frameObj;
                                                                        frames[key].sourceSize = sourceSize;
                                                                        frames[key].spriteSourceSize = spriteSourceSize;
                                                                        frames[key].rotated = rotated != 0;
                                                                        frames[key].trimmed = trimmed != 0;
                                                                        sprite.frames = frames;
                                                                        let data = JSON.stringify(sprite);
                                                                        fs.writeFileSync('default.json', data);
                                                                        readline.close()
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        })
                                    })
                                })
                            });
                        });
                    });
                });
            })
        })
    })
});
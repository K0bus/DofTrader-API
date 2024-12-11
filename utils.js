const readdir = require("fs/promises").readdir;

const getDirectories = async source =>
    (await readdir(source, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

module.exports = {
    getDirectories
}
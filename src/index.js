// Simple Node.js MOSS Submit Script

// MIT License

// Copyright (c) 2021 Rushnett

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const moss = require('moss-node-client')
const recursive_read = require('recursive-readdir')
const path = require('path')
const { readdir } = require('fs')
const { language } = require('../config/config.js')

let config
try {
    config = require('../config/config.js')
  } catch (e) {
    console.log(`a config.js file has not been created. ${e.stack}`)
    process.exit()
}
if (language) config.language = language

const moss_client = new moss(config.language, config.user_id)

// get list of files in directory
function get_files (dir) {
    return new Promise((resolve, reject) => {
        recursive_read(path.join(config.base_dir, dir))
            .then(files => resolve(files))
            .catch(err => reject(err))
    })
}

// get list of top level directories in base directory
function get_directories (base_dir) {
    return new Promise((resolve, reject) => {
        readdir(base_dir, { withFileTypes: true }, (err, files) => {
            if (err) reject(err)
            else resolve(files.filter(dir_path => dir_path.isDirectory()).map(dir_path => dir_path.name))
        })
    })
}

// add files to moss session from directory
async function add_files(dir, base_files=false) {
    const files = await get_files(dir)
    for (const file_path of files) {
        const file_name = path.basename(file_path).toLowerCase()
        if (!config.ignored_files.includes(file_name))
            if (base_files) await moss_client.addBaseFile(file_path, `base.${file_name}`)
            else await moss_client.addFile(file_path, `${dir}__${file_name}`)
    }
}

async function main () {
    console.log(`Submission directory: ${config.base_dir}`)
    moss_client.setComment(config.base_dir)

    let dirs = await get_directories(config.base_dir)

    // submit default files (starter code)
    if (!dirs.includes(config.default_dir)) {
        console.warn(`WARNING: Default folder '${config.default_dir}' not present in submission directory`)
    } else {
        console.log(`Adding default files from folder '${config.default_dir}'`)
        await add_files(config.default_dir, true)
        dirs = dirs.filter(dir => dir != config.default_dir)
    }

    console.log('Adding submission folders...')
    for (const dir of dirs) await add_files(dir)

    console.log(('Submitting to MOSS...'))
    await moss_client.process()
    
}

main()
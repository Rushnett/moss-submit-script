# Moss Submit Script
Simple MOSS Submit Script written in Node.js. Made for people who just want to submit a batch of submissions to MOSS locally via terminal with Node.js. It is built on top of [moss-node-client](https://github.com/Keiaxx/moss.js).

## Getting Started
### Requirements
Node.js 16+ is recommended
[Register for MOSS](https://theory.stanford.edu/~aiken/moss/)

### Setup
Once you have a MOSS account ID, you can set up a `config.js` file in the [config](config/) folder.
```
module.exports = {
    "user_id": "12345678",
    "language": "python",
    "base_dir": "./submissions",
    "default_dir": "starter",
    "ignored_files": ["tester.py"]
}
```
Info on each property is located in [config.js.example](config/config.js.example).

### Submission Directory
Place each individual submission inside the submission directory (above example has it as `./submissions`). Add a default code directory (example uses `starter/`) for base file comparison.
```
./submissions
|-- person1
|   |-- project1.py
|-- person2
|   |-- project1.py
|-- starter
|   |-- project1.py
```
When the script submits to MOSS, different submission files will be marked as `submissionfolder_filename`. Above example on moss would show `person1__project1.py` and `person2__project1.py`.

### Running the project
Use `npm install` to download dependencies.
Use `npm start` to run the project.
You can also overwrite the language in the config with `npm start --language=javascript`. See [config.js.example](config/config.js.example) for valid language strings.

## License
This work is licenced under the MIT license.
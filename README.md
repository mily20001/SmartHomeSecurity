# Smart Home Security

Repository contains frontend code for Electron app, build with ReactJS. It allows to display sensor values, and show current system status.
There is also source code written with Arduino IDE, which actually gathers data from sensors and sends them to backend.

Project created for Internet of Things classes.

## Developer notes
To disable git tracking of config files run:
```
git update-index --skip-worktree src/constStrings.json firmware/const_strings.h 
```

### Installation
```
npm install
```
### Launching dev version
```
npm start
```
# VSCode todo list:

* install TSLint extension
* open Command Palette and serach for the `TSLint: Manage workspace library execution"` then select `enable workspace library execution`
* be happy with tslint errors showing not only during compilation


# Start db & api containers
```
docker-compose up -d
```

# How to start:

* `npm run build` - build typescript files
* `npm run start` - build typescript files and starts node js server
* `npm run quick` - starts node js server without compiling typescript sources
* `npm run dev:server` - starts dev server in watch mode

# How to start database:
```
docker-compose up -d mongo
```

# Project Startup

## Build the Docker Files

### Navigate to \social-media-assistant\promotebackend

```bash
cd promotebackend
```

### Build the Dockerfile
```bash
docker build -t promote-backend .
```

### Navigate to social-media-assistant\promotefrontend

```bash
cd promotefrontend
```
### Build the Dockerfile
```bash
docker build -t promote-frontend .
```

## Launch the Docker Containers
### Naviagte to social-media-assistant\

```bash
cd ..
```
### Launch the Docker Containers\
```bash
docker-compose up -d
```
## Usage
The application is accessible under: http://localhost:12202/


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

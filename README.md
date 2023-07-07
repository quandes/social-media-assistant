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
application is accessible under: http://localhost:12202/

## License

[MIT](https://choosealicense.com/licenses/mit/)

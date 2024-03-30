
```shell
docker build -t stockfish-api .
docker run -itd --name stockfish stockfish-api
docker exec -it stockfish bash
```
db-clean:
	./bin/db_clean.sh

docker-clean:
	./bin/docker_clean.sh

clean: db-clean docker-clean

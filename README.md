# 🚕 Ride-Hailing 🚕

This is a repository with the application of the knowledge I acquired in the Clean Code and Clean Architecture course by Rodrigo Branas

### Database
- Create database in docker with command:

```
docker run --name cccat16-postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=postgres --restart always -p 5432:5432 -d postgres:latest
```

After run docker command run the script in the repository.

### RabbitMQ
- Crate rabbitmq in docker with command:

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
```

To use RabbitMQ management UI access, go to: http://localhost:15672 and use username: guest and password: guest.

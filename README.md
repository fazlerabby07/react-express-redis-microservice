# react-express-redis-microservice

A simple project to demonstrate microservice architecture

#### System Design

![alt text](https://github.com/fazlerabby07/virtual-classroom/blob/master/system-design.png?raw=true)

#### System Requirements (Dev):

-   Docker (v20+)
-   Docker Compose (2+)
-   A real Development computer (Running Linux or Mac)

#### Folder Architecture

-   fontend-server
-   backend-server
-   worker-server

#### Config Files

Configurations are in the `.env.copy` file. Need to create `.env` file from `.env.copy` and make change as your configaration.

##### Run Project

Use `docker-compose up --build` build and run the project locally with port `4000`. After running the project a dummy data insert into the database.

After running the project go to `http://localhost:4000` from the browser.
From the browser you can create and get data
![alt text](https://github.com/fazlerabby07/virtual-classroom/blob/master/ui.png?raw=true)

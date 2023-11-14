## GCP - Production
##### Setup GCP
1. Create a VM instance on GCP, if you need free tier look at the free tier VM zones and choose that zone.  
2. Create network tags and for these network tags you can specify which ports and which types of connections are allowed.  
    - Since by default no ports are open other than 80, you should create these tags and apply tags to your VM  
    - If your backend is running on `8000` then create a tag called `allow8000`, to do this go to **Network Security** > **Firewall policies** > **Create a firewall rule**  
    - Name this rule as `allow8000` and choose the network-tag name as `allow8000` and for IPv4 ranges write 0.0.0.0/0, and the checkt TCP and TCP ports as `8000`  
    - Now go back to VM instances, choose your VM instance and select 'EDIT' and and the network-tag `allow8000`  
    - Now your VM will allow external traffic to communicate with the instance on port *8000* through it's *external ip*

##### Using Docker
1. First use docker-compose because frontend and backend run on separate containers  
2. Project's root folder will have `docker-compose.yml` file  
3. And backend's root folder will have `Dockerfile` that is the configuration of backend container  
4. Similarly `Dockerfile` inside frontend project's root folder is the frontend container config  

###### Dockerfile
1. choose the image (python for backend, node for front end)  
2. set the workdir. when you use /app/backend it will crete `app` folder in root, then creates backend folder and further operations are done inside this folder  
3. COPY . .  first dot is the from the current folder to the containers current folder, since we set the workdir in previous step, that becomes the current folder  
4. `EXPOSE 8000` will expose this port **8000** on the container 
5. `CMD ["command" "line" "args" "here"]` you should use CMD because you don't want docker to be hung once it runs this command, say if this command will start the FastAPI app, we want it to start this and then move on to next line or next DockerFile as mentioned in **docker-compose.yml** file

##### Environment setup and Variables
This section is about how you have to make sure that all the environment variables are set up in this project, for prodcution/dev/testing environments to work properly
###### Backend
- In FastAPI there are 3 separate environment files namely `.env.dev` `.env.prod` `.env.test` which are inside the fastapi app's root folder
- In FastAPI backend/app/settings/config.py it looks for an environment variable called `APP_ENV` according to this piece of code:  
```python
 # Determine the environment and set the appropriate .env.prod file
env = os.getenv("APP_ENV", "development")
print("env=", env)
if env == "production":
    settings = Settings(_env_file="./.env.prod")
elif env == "test":
    settings = Settings(_env_file="./.env.test")
elif env == "dev":
    settings = Settings(_env_file="./.env.dev")
```
- and to set environment variables for a container in the docker-compose.yml file add the following for the **backend service**
```
    environment:
      - APP_ENV=dev
```
- and it explicitly checks for this environment variable, to make sure to not start the app if this variable is not set.
- At this point the important variables in the .env file's is the `DATABASE_NAME` that tells which database to use in the mongodb account
- For FastAPI to accept the requests from frontend, in the backend_root/app/main.py, make sure to include it in the origins list
```python
origins = [
    "http://localhost:8000",
    "http://localhost",
    "http://<external-ip-of-gcp-vm>:8000/",
    "http://<external-ip-of-gcp-vm>",
    "http://<your-domain.com>:8000",
    "http://<your-domain.com>",
]
# and of course this array is assigned to app.middle_ware(allow_origins=origins, ...other config here)
```

###### Frontend
- The only environment file the react app relies on is the `.env` file which should be inside the react-app's root directory.
- 


#### Specific notes  
> **To allow ssh from alacritty into GCP VM shell add the following in .bashrc**
export TERM=xterm-256color


## How to Develop locally

1. Create .env file and paste all required env variables. Use .env.example file as an example.
2. Run `npm run start:watch` command.

## How to Develop Locally with Docker Compose

> **Note:** Make sure you have Docker installed and running on your machine before following this instruction.

1. For local develop, use file **docker-compose.yml**, which is located in the ./docker/local folder put it in the root.
2. Create .env file and paste all required env variables. Use .env.example file as an example.
3. In the **docker-compose.yml** file, set `target: development` and uncomment this line `command: npm run start:dev` .
4. At your choice, you can run the application in a container with a proxy server, or you can run it without. To do this, you need to comment it out in the **docker-compose.yml** file.
5. Run this command `docker-compose build` to build and then run `docker-compose up -d` .

## How to deploy application on AWS:

**Olympus Project Tags**:
The tags are automatically selected in the commands. If the tags have changed, change them in the **package.json file**.
Back-End: `0.1.0`
Front-End: `0.2.0`

1. For deployment, use file **docker-compose.yml** & **global-bundle.per**, which is located in the ./docker/deploy folder put it in the root.
2. Environment variables and other important files are already on EC2.
3. You need to authorize local in your AWS account, get access keys in the project account, and enter Access key ID,Secret access key in the console. `aws configure`
4. Retrieve an authentication token and authenticate your Docker client to your registry. `npm run aws:login`
5. Build your Docker image using the following command. `npm run docker:build`
6. After the build completes, tag your image so you can push the image to AWS ECR repository `npm run docker:tag`
7. Run the following command to push image to your AWS repository `npm run docker:push`
8. You need to authorize on EC2 instance in AWS account. Step 2 and 3 are required.
   Run the following command: `sudo aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 391617323320.dkr.ecr.us-east-1.amazonaws.com`.
9. Then, stop the old containers `sudo docker-compose down`, and delete the algo-peak image `sudo docker rmi <id>`.
10. Then pull the new image `sudo docker-compose up -d`.
# og

/*
  This is the main file, together with app.module.ts. It is the entry point of the
  application, it attaches the 'AppModule' and creates an instance of 'NestApplication'.
*/

import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app/app.module';
import { JwtService } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/guards/auth.guard';
import cookieParser from 'cookie-parser';
import * as express from 'express';


async function main() {
  console.log('[BACKEND LOG] main');

  // const cors = require("cors");

  const app = await NestFactory.create(AppModule);

  // Enable CORS for all routes (this app will turn on port 3001 (backend), but the frontend and database
  // will run on a different port, so it's good to add all other origin ports running (i.e.: that will
  // try to access/send requests to the backend) as a Cors option).
  app.enableCors({
    // origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:5432'],// TODO: change for a macro or from .env
    // allowedHeaders: ['content-type'],
    // origin: [`${process.env.DOMAIN}`],
    origin: [`${process.env.FRONTEND}`, `${process.env.BACKEND}`, `${process.env.DATABASE}`, `${process.env.DOMAIN}`],//, 'https://api.intra.42.fr'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],   // add 'HEAD', 'PUT', 'PATCH', 'POST', 'OPTIONS' ?
    credentials: true,
  });
  
  // To enable backend server to serve static files from the folder where uploaded images are stored
  app.use('/uploads', express.static('uploads'));
  app.use('/uploadsDummies', express.static('uploadsDummies'));

  // app.use(cors());
  // app.get('/', (req, res) => {
  //   res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   res.send({"msg": "This has Cors enabled"})
  // });

  // this allows the AuthGuard to be used globally so that we don't have to add the decorator to every single controller
  app.useGlobalGuards(new AuthGuard(new JwtService, new Reflector));
	app.use(cookieParser());

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', ['http://localhost:3000/','http://localhost:3001/', 'http://localhost:5432'] );
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   next();
  // });

  await app.listen(`${process.env.BACKEND_PORT}`);
}
main();
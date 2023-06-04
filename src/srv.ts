import { application } from "express";
import { appConfig } from "./config/app";

application.listen(appConfig.port, () => console.log("listenning on port "+appConfig.port))

import mongoose from "mongoose";
import { db } from "../config";
import Logger from "../core/Logger";

const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}?authSource=admin`;

mongoose
  .connect(dbURI)
  .then(() => Logger.info("momgoDb connected"))
  .catch((err) => console.error(err));

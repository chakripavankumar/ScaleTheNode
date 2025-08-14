import mongoose from "mongoose";
import { db } from "../../config";

const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}?authSource=admin`;

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

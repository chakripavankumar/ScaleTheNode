import mongoose from "mongoose";
import { db } from "../config";
import Logger from "../core/Logger";

const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}?authSource=admin`;

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize,
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

if (process.env.NODE_ENV === "development") {
  Logger.debug(`Connecting to MongoDB at: ${dbURI}`);
}

function setRunValidators() {
  return { runValidators: true };
}

mongoose.set("strictQuery", true);

mongoose.plugin((schema: any) => {
  schema.pre("findOneAndUpdate", setRunValidators);
  schema.pre("updateMany", setRunValidators);
  schema.pre("updateOne", setRunValidators);
  schema.pre("update", setRunValidators);
});

mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info("✅ Mongoose connection established");
  })
  .catch((err) => {
    Logger.error("❌ Mongoose connection error", err);
  });

mongoose.connection.on("connected", () => {
  Logger.debug(`Mongoose default connection open to ${dbURI}`);
});

mongoose.connection.on("error", (err) => {
  Logger.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close().finally(() => {
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

export const connection = mongoose.connection;

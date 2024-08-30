import { ConnectionStates, connect, connection, disconnect } from "mongoose"

import { DATABASE_URL } from "../const/api"

const CONNECTION_STATE = {
  isConnected: ConnectionStates.uninitialized,
}

export const $connect = async () => {
  if (CONNECTION_STATE.isConnected === ConnectionStates.connected) return

  const db = await connect(DATABASE_URL as string, { dbName: "dolar-api" })
  CONNECTION_STATE.isConnected = db.connection.readyState
}

export const $disconnect = async () => {
  if (CONNECTION_STATE.isConnected === ConnectionStates.disconnected) return

  await disconnect()
  CONNECTION_STATE.isConnected = ConnectionStates.disconnected
}

connection.on("connected", () => console.log("Connected to MongoDB ✅"))
connection.on("error", () => console.log("Error to connect to MongoDB ❌"))

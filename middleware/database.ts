import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { DefaultMessageResponse } from "../types/DefaultMessageResponse";

export const connectToDB =
  (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse>) => {
      console.log(
        "Mongo está conectado",
        mongoose.connections[0].readyState === 1 ? "Sim" : "Não"
      );

      if (mongoose.connections[0].readyState === 1) {
        return handler(req, res);
      }

      const { DB_CONNECTION_STRING } = process.env;
      if (!DB_CONNECTION_STRING) {
        return res
          .status(500)
          .json({ error: "Env DB_CONNECTION_STRING não informado" });
      }

      mongoose.connection.on("connected", () =>
        console.log("Conectado com sucesso")
      );
      mongoose.connection.on("connected", (error) =>
        console.log("Ocorreu um erro ao conectar com o banco de dados: ", error)
      );

      await mongoose.connect(
        "mongodb://localhost:27017/gerenciador-tarefas-2aojr"
      );

      return handler(req, res);
    };

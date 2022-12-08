import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { DefaultMessageResponse } from "../types/DefaultMessageResponse";
import jwt from "jsonwebtoken";

export const jwtValidator =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse>) => {
    const { MY_SECRET_KEY } = process.env;
    if (!MY_SECRET_KEY) {
      return res.status(500).json({ error: "Env MY_SECRET_KEY não informado" });
    }

    const message = "Não foi possivel validar o token de acesso";
    if (!req || !req.headers) {
      return res.status(401).json({ error: message });
    }

    if (req.method !== "OPTION") {
      const authorization = req.headers["authorization"];
      if (!authorization) {
        return res.status(401).json({ error: message });
      }

      const token = authorization.substring(7);
      if (!token) {
        return res.status(401).json({ error: message });
      }

      try {
        const decoded = jwt.verify(token, MY_SECRET_KEY) as jwt.JwtPayload;

        if (!decoded) {
          return res.status(401).json({ error: message });
        }

        if (req.body) {
          req.body.userId = decoded._id;
        } else if (req.query) {
          req.query.userId = decoded._id;
        }
      } catch (error) {
        console.log("Não foi possivel validar o token de acesso", error);
      }
    }

    return handler(req, res);
  };

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../middleware/database";
import { UserModel } from "../../models/UserModel";
import { DefaultMessageResponse } from "../../types/DefaultMessageResponse";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const login = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultMessageResponse | object>
) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ error: "O Método HTTP informado não existe" });
    }

    const { MY_SECRET_KEY } = process.env;
    if (!MY_SECRET_KEY) {
      return res.status(500).json({ error: "Env MY_SECRET_KEY não informado" });
    }

    const { login, password } = req.body;
    if (!login || !password) {
      return res
        .status(400)
        .json({ error: "Favor informar os dados para login, Login e senha" });
    }

    const user = await UserModel.findOne({
      email: login,
    });

    if (!user) {
      return res.status(400).json({ error: "Usuário/Senha incorretos" });
    }

    const passwordCrypted = CryptoJS.AES.decrypt(user.password, MY_SECRET_KEY);
    const savedPassword = passwordCrypted.toString(CryptoJS.enc.Utf8);

    if (savedPassword !== password) {
      return res.status(400).json({ error: "Usuário/Senha incorretos" });
    }

    const token = jwt.sign({ _id: user._id }, MY_SECRET_KEY);

    const result = {
      token,
      name: user.name,
      email: user.email,
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Ocorreu erro ao efetuar login: ", error);
    res
      .status(500)
      .json({ error: "Ocorreu erro ao efetuar o login, tente novamente." });
  }
};

export default connectToDB(login);

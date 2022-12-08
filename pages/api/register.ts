import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../middleware/database";
import { UserModel } from "../../models/UserModel";
import { DefaultMessageResponse } from "../../types/DefaultMessageResponse";
import { User } from "../../types/User";
import CryptoJS from "crypto-js";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultMessageResponse>
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

    const { name, email, password } = req.body as User;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Nome inválido" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    if (!password || password.length < 6 || !password.includes("@")) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const emailAlreadyExists = await UserModel.findOne({ email });
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ error: "Já existe uma conta com esse email" });
    }

    const passwordCrypted = CryptoJS.AES.encrypt(password, MY_SECRET_KEY);
    const user = { name, email, password: passwordCrypted };
    await UserModel.create(user);

    res.status(200).json({ message: "Cadastro com sucesso" });
  } catch (error) {
    console.log("Ocorreu erro ao efetuar login: ", error);
    res
      .status(500)
      .json({ error: "Ocorreu erro ao efetuar o login, tente novamente." });
  }
};

export default connectToDB(handler);

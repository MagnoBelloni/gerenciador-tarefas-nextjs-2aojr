import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../middleware/database";
import { DefaultMessageResponse } from "../../types/DefaultMessageResponse";
import { TaskModel } from "../../models/TaskModel";
import { jwtValidator } from "../../middleware/jwt";

const login = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultMessageResponse | object>
) => {
  try {
    const userId = req.body?.userId ? req.body.userId : req.query.userId;
    switch (req.method) {
      case "GET":
        await getTasks(req, res, userId);
        break;
      case "POST":
        await postTasks(req, res, userId);
        break;
      default:
        return res
          .status(405)
          .json({ error: "O Método HTTP informado não existe" });
    }
  } catch (error) {
    console.log("Ocorreu um erro ao utilizar tarefa: ", error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao utilizar tarefa, tente novamente." });
  }
};

const getTasks = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultMessageResponse | object>,
  userId: string
) => {
  const result = await TaskModel.find({ userId });
  return res.status(200).json(result);
};

const postTasks = async (
  req: NextApiRequest,
  res: NextApiResponse<DefaultMessageResponse | object>,
  userId: string
) => {
  const { name, finishPrevisionDate } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Nome inválido" });
  }

  if (!finishPrevisionDate) {
    return res.status(400).json({ error: "Previsão de finalização inválida" });
  }

  const task = { name, finishPrevisionDate, userId };
  await TaskModel.create(task);
  return res.status(200).json({ message: "Cadastrado com sucesso" });
};

export default connectToDB(jwtValidator(login));

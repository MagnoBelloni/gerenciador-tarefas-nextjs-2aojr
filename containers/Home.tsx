/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { executeRequest } from "../services/api";
import { Task } from "../types/Task";

type HomeProps = {
    setToken(s: string): void
}

export const Home: NextPage<HomeProps> = ({ setToken }) => {
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const getTasks = async () => {
            const result = await executeRequest(`task?finishPrevisionStart=${previsionDateStart}&finishPrevisionEnd=${previsionDateEnd}&status=${status}`, 'get');
            setTasks(result.data);
        }

        getTasks();
    }, [previsionDateStart, previsionDateEnd, status]);

    const sair = () => {
        localStorage.clear();
        setToken('');
    }

    return (
        <>
            <Header sair={sair} />
            <Filter
                previsionDateStart={previsionDateStart}
                previsionDateEnd={previsionDateEnd}
                status={status}
                setPrevisionDateStart={setPrevisionDateStart}
                setPrevisionDateEnd={setPrevisionDateEnd}
                setStatus={setStatus}
            />


            {
                tasks.length < 1
                    ? (
                        <div>
                            <img src="/task-not-found.svg" alt="Nenhuma Task encontrada" />
                            {/* <p onClick={getTasks}>Você ainda não possui tarefas cadastradas</p> */}
                            <p>Você ainda não possui tarefas cadastradas</p>
                        </div>
                    )
                    :
                    tasks.map(task => {
                        return (
                            <div key={task._id}>
                                <div >
                                    <p>{task.name}</p>
                                    <p>{task.finishPrevisionDate}</p>
                                </div>
                            </div>
                        );

                    })
            }

            <Footer />
        </>
    )
}
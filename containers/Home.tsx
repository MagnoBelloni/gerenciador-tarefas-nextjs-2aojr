/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { executeRequest } from "../services/api";
import { Task } from "../types/Task";
import Modal from 'react-bootstrap/Modal';

type HomeProps = {
    setToken(s: string): void
}

export const Home: NextPage<HomeProps> = ({ setToken }) => {
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getTasks = async () => {
        const result = await executeRequest(`task?finishPrevisionStart=${previsionDateStart}&finishPrevisionEnd=${previsionDateEnd}&status=${status}`, 'get');
        result.data.map((task: Task) => {
            const finishPrevisionDateDateTime = new Date(task.finishPrevisionDate);
            task.finishPrevisionDate = `${finishPrevisionDateDateTime.getDate()}/${finishPrevisionDateDateTime.getMonth()}/${finishPrevisionDateDateTime.getFullYear()}`;

            const finishDateDateTime = new Date(task.finishDate);
            task.finishDate = !task.finishDate ? '-' : `${finishDateDateTime.getDate()}/${finishDateDateTime.getMonth()}/${finishDateDateTime.getFullYear()}`;
        });
        setTasks(result.data);
    }

    useEffect(() => {
        getTasks();
    }, [previsionDateStart, previsionDateEnd, status]);

    const sair = () => {
        localStorage.clear();
        setToken('');
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const submitAddForm = async () => {
        try {
            setError('');
            if (!name || !finishPrevisionDate) {
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate
            };

            const result = await executeRequest('task', 'post', body);
            if (result && result.data) {
                getTasks();
            }
        } catch (e: any) {
            console.log(`Erro ao efetuar cadastro de tasks: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao cadastro de tasks, tente novamente.`);
            }
        }

        setName('');
        setFinishPrevisionDate('');
        setLoading(false);
        handleClose();
    }

    const markTaskAsDone = async (task: Task, done: Boolean) => {
        try {
            const body = {
                done
            };

            const result = await executeRequest(`task?id=${task._id}`, 'patch', body);
            if (result && result.data) {
                getTasks();
            }
        } catch (e: any) {
            console.log(`Erro ao marcar a tarefa como concluida: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao marcar a task como concluida, tente novamente.`);
            }
        }
    }

    return (
        <>
            <Header sair={sair} openAddModal={handleShow} />
            <Filter
                previsionDateStart={previsionDateStart}
                previsionDateEnd={previsionDateEnd}
                status={status}
                setPrevisionDateStart={setPrevisionDateStart}
                setPrevisionDateEnd={setPrevisionDateEnd}
                setStatus={setStatus}
            />
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Adiconar uma tarefa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form">
                        {error && <p className="error">{error}</p>}
                        <div className="input">
                            <input type='text' placeholder="Adicionar uma tarefa"
                                value={name}
                                onChange={evento => setName(evento.target.value)}
                            />
                        </div>
                        <div className="input">
                            <input type='date' placeholder="Data de conclusão"
                                value={finishPrevisionDate}
                                onChange={evento => setFinishPrevisionDate(evento.target.value)}
                            />
                        </div>
                        <button onClick={submitAddForm} disabled={loading}>{loading ? '...Carregando' : 'Salvar'}</button>
                        <button onClick={handleClose}>Cancelar</button>
                    </div>
                </Modal.Body>
            </Modal>

            {
                tasks.length < 1
                    ? (
                        <div>
                            <img src="/task-not-found.svg" alt="Nenhuma Task encontrada" />
                            <p>Você ainda não possui tarefas cadastradas</p>
                        </div>
                    )
                    :
                    tasks.map(task => {
                        return (
                            <div key={task._id} className="container-filters">
                                <div className="task">
                                    <div className="checkbox">
                                        <input type="checkbox" checked={task.finishDate !== '-'} onChange={e => markTaskAsDone(task, e.target.checked)} />
                                    </div>
                                    <div>
                                        <p>{task.name}</p>
                                        <p>Data prevista para conclusão: {task.finishPrevisionDate} - Conclusão em {task.finishDate}</p>
                                    </div>
                                </div>

                            </div>
                        );

                    })
            }

            <Footer openAddModal={handleShow} />
        </>
    )
}
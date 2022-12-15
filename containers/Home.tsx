import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { executeRequest } from "../services/api";
import Modal from 'react-bootstrap/Modal';
import { List } from "../components/List";

type HomeProps = {
    setToken(s: string): void
}

export const Home: NextPage<HomeProps> = ({ setToken }) => {
    const ref = useRef();

    // STATES FILTER
    const [list, setList] = useState([]);
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);

    // STATES MODAL
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [finishPrevisionDate, setFinishPrevisionDate] = useState('');

    useEffect(() => {
        getFilteredData();
    }, [previsionDateStart, previsionDateEnd, status]);

    const sair = () => {
        localStorage.clear();
        setToken('');
    }

    const getFilteredData = async () => {
        try {
            let query = '?status=' + status;

            if (previsionDateStart) {
                query += '&finishPrevisionStart=' + previsionDateStart;
            }

            if (previsionDateEnd) {
                query += '&finishPrevisionEnd=' + previsionDateEnd;
            }

            const result = await executeRequest('task' + query, 'GET');
            if (result && result.data) {
                setList(result.data);
            }
        } catch (e) {
            console.log('Ocorreu erro ao buscar dados das tarefas:', e);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setErrorMsg('');
        setName('');
        setFinishPrevisionDate('');
    }

    const createTask = async () => {
        try {
            setErrorMsg('');
            if (!name || !finishPrevisionDate) {
                return setErrorMsg('Favor preencher os campos');
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate
            }

            await executeRequest('task', 'POST', body);
            await getFilteredData();
            closeModal();
        } catch (e: any) {
            console.log('Ocorreu erro ao cadastrar tarefa:', e);
            if (e?.response?.data?.error) {
                setErrorMsg(e?.response?.data?.error);
            } else {
                setErrorMsg('Ocorreu erro ao cadastrar tarefa');
            }
        }

        setLoading(false);
    }

    // const markTaskAsDone = async (task: Task, done: Boolean) => {
    //     try {
    //         const body = {
    //             done
    //         };

    //         const result = await executeRequest(`task?id=${task._id}`, 'patch', body);
    //         if (result && result.data) {
    //             getTasks();
    //         }
    //     } catch (e: any) {
    //         console.log(`Erro ao marcar a tarefa como concluida: ${e}`);
    //         if (e?.response?.data?.error) {
    //             setError(e.response.data.error);
    //         } else {
    //             setError(`Erro ao marcar a task como concluida, tente novamente.`);
    //         }
    //     }
    // }

    return (
        <>
            <Header sair={sair} toggleModal={() => setShowModal(!showModal)} />
            <Filter
                previsionDateStart={previsionDateStart}
                previsionDateEnd={previsionDateEnd}
                status={status}
                setPrevisionDateStart={setPrevisionDateStart}
                setPrevisionDateEnd={setPrevisionDateEnd}
                setStatus={setStatus}
            />
            <List tasks={list} getFilteredData={getFilteredData} />

            <Footer toggleModal={() => setShowModal(!showModal)} />

            <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                    <p>Adicionar uma tarefa</p>
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <input type="text" placeholder="Nome da tarefa"
                        value={name} onChange={e => setName(e.target.value)} />
                    <input type="text" placeholder="Previsão de conclusão" onFocus={e => e.target.type = "date"} onBlur={e => e.target.type = 'text'}
                        value={finishPrevisionDate} onChange={e => setFinishPrevisionDate(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button disabled={loading} onClick={createTask}>
                            {loading ? '...Carregando' : 'Salvar'}
                        </button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}
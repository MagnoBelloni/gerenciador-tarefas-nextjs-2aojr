import { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";

type RegisterProps = {
    setRegister(s: Boolean): void
}

export const Register: NextPage<RegisterProps> = ({ setRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const doRegister = async () => {
        try {
            setError('');
            if (!name || !email || !password || !confirmPassword) {
                setError('Favor preencher os campos!');
                return
            }

            if (password != confirmPassword) {
                setError('As senhas não conferem!');
                return
            }

            setLoading(true);

            const body = {
                name,
                email,
                password
            };

            const result = await executeRequest('register', 'post', body);
            if (result && result.data) {
                setSuccess('Cadastro realizado com sucesso, aguarde para fazer login.');
                setTimeout(() => {
                    setRegister(false);
                }, 3000)
            }
        } catch (e: any) {
            console.log(`Erro ao efetuar cadastrar: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao efetuar cadastrar, tente novamente.`);
            }
        }

        setLoading(false);
    }

    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo FIAP" className="logo" />
            <div className="form">
                {success && <p className="text-success">{success}</p>}
                {error && <p className="error">{error}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Nome" />
                    <input type='text' placeholder="Nome"
                        value={name}
                        onChange={evento => setName(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/mail.svg" alt="Emal" />
                    <input type='email' placeholder="Email"
                        value={email}
                        onChange={evento => setEmail(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha" />
                    <input type='password' placeholder="Confirme a senha"
                        value={confirmPassword}
                        onChange={evento => setConfirmPassword(evento.target.value)}
                    />
                </div>
                <button onClick={doRegister} disabled={loading}>{loading ? '...Carregando' : 'Cadastrar'}</button>
                <a onClick={() => setRegister(false)} >Voltar para o Login</a>
            </div>
        </div>
    );
}
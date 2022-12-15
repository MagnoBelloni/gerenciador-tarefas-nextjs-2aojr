import { NextPage } from "next";
type FooterProps = {
    toggleModal(): void
}
export const Footer: NextPage<FooterProps> = ({ toggleModal }) => {
    return (
        <div className="container-footer">
            <span>© Copyright {new Date().getFullYear()}. Todos os direitos reservados.</span>
            <button onClick={toggleModal}><img src="/add.svg" alt="Adicionar tarefa" />Adicionar uma tarefa</button>
        </div>
    );
}
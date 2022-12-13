/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
type FooterProps = {
    openAddModal(): void
}

export const Footer: NextPage<FooterProps> = ({ openAddModal }) => {
    return (
        <div className="container-footer">
            <button onClick={openAddModal}><img src="/add.svg" />Adicionar uma tarefa</button>
            <span>© Copyright {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </div>
    );
}
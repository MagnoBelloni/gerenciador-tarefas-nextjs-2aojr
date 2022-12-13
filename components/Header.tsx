/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";

type HeaderProps = {
    sair(): void,
    openAddModal(): void
}
export const Header: NextPage<HeaderProps> = ({ sair, openAddModal }) => {
    const fullName = localStorage.getItem('name');
    const firstName = fullName?.split(' ')[0].trim() || '';

    return (
        <div className="container-header">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <button onClick={openAddModal}><span>+</span>Adicionar Tarefa</button>
            <div className="mobile">
                <span>Olá, {firstName}</span>
                <img src="/exit-mobile.svg" alt="Sair" onClick={sair} />
            </div>
            <div className="desktop">
                <span>Olá, {firstName}</span>
                <img src="/exit-desktop.svg" alt="Sair" onClick={sair} />
            </div>
        </div>
    );
}
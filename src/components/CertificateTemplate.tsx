'use client';

import { Montserrat, Playfair_Display } from 'next/font/google';
import Image from 'next/image';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
});

interface Module {
    id: string;
    title: string;
}

interface CertificateProps {
    userName: string;
    courseName: string;
    cpf?: string;
    date: string;
    code: string;
    duration: number;
    modules: Module[];
}

export default function CertificateTemplate({ userName, courseName, cpf, date, code, duration, modules }: CertificateProps) {
    return (
        <div className={`certificate-container ${montserrat.className}`}>

            {/* --- FRENTE --- */}
            <div className="certificate frente">
                <header className="topo">
                    <div className="logo-central">
                        <div style={{ position: 'relative', width: '300px', height: '100px' }}>
                            <Image src="/logo-really-final.png" alt="IEB Logo" fill style={{ objectFit: 'contain' }} />
                        </div>
                    </div>

                    <div className="logo-direita">
                        <div style={{ position: 'relative', width: '150px', height: '80px', marginBottom: '5px' }}>
                            <Image src="/logo-mec.png" alt="MEC Logo" fill style={{ objectFit: 'contain', objectPosition: 'right' }} />
                        </div>
                        {/* <small>
                            Autorização conforme Lei Federal nº 9.394/96<br />
                            Decreto nº 5.154/04
                        </small> */}
                    </div>
                </header>

                <h1 className={playfair.className}>CERTIFICADO</h1>

                <p className="texto">
                    A diretoria do <strong>INSTITUTO EDUCAÇÃO BRASIL</strong>, no uso de suas atribuições,
                    confere a
                </p>

                <h2 className="nome">{userName.toUpperCase()}</h2>

                <p className="texto">
                    portador(a) do RG/CPF nº <strong>{cpf || '000.000.000-00'}</strong>, o presente certificado por haver concluído
                    o Curso de Qualificação Profissional em:
                </p>

                <h3 className="curso">{courseName.toUpperCase()} – {duration || 80} HORAS</h3>

                <p className="texto">
                    realizado na plataforma online, concluído em <strong>{date}</strong>.
                </p>

                <footer className="assinaturas">
                    <div style={{ position: 'relative', width: '180px', height: '100px' }}>
                        <Image src="/signature-augusto-final.png" alt="Augusto Lima - Diretor Geral" fill style={{ objectFit: 'contain', objectPosition: 'top' }} />
                    </div>

                    <div>
                        <div className="linha"></div>
                        <span>Aluno(a)</span>
                    </div>
                </footer>
            </div>

            {/* --- VERSO --- */}
            <div className="certificate verso">
                <div className="box">
                    <strong>I.E.B INSTITUTO EDUCAÇÃO BRASIL</strong><br />
                    Criado conforme Lei nº 9.394/96 e Decreto nº 5.154/04<br />
                    <span className="valido">✔ Válido em todo território nacional</span>
                </div>

                <div className="box">
                    Certificado registrado sob nº <strong>{code ? code.substring(0, 4) : '0000'}</strong><br />
                    Livro nº <strong>{code ? code.substring(4, 6) : '00'}</strong> – Fls nº <strong>{code ? code.substring(6, 8) : '00'}</strong><br />
                    Em <strong>{date}</strong>
                </div>

                <div className="conteudo">
                    <h3>Conteúdo Programático</h3>
                    <ul>
                        {modules && modules.length > 0 ? (
                            modules.map(m => <li key={m.id}>{m.title}</li>)
                        ) : (
                            // Fallback if no modules found
                            <>
                                <li>Introdução ao curso</li>
                                <li>Fundamentos teóricos</li>
                                <li>Aplicações práticas</li>
                                <li>Avaliação final</li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="cnpj">
                    I.E.B INSTITUTO EDUCAÇÃO BRASIL<br />
                    CNPJ: 32.975.228/0001-93<br />
                    <small style={{ fontWeight: 'normal', marginTop: '10px', display: 'block' }}>ID Verificador: {code}</small>
                </div>
            </div>

            <style jsx global>{`
                body {
                    background: #eee;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 100vh;
                }

                .certificate-container {
                    padding: 40px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 40px;
                }

                .certificate {
                    width: 1123px; /* A4 Landscape */
                    height: 794px;
                    background: #fff;
                    padding: 40px;
                    box-sizing: border-box;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    flex-shrink: 0;
                }

                /* FRENTE Styles */
                .certificate.frente {
                    border: 8px solid #b00000;
                }

                .topo {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    width: 100%;
                    height: 120px;
                }

                .logo-central {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .logo-direita {
                    position: absolute;
                    right: 0;
                    top: 0;
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 5px;
                }

                h1 {
                    text-align: center;
                    color: #b00000;
                    font-size: 48px;
                    margin: 40px 0;
                    font-weight: 700;
                    letter-spacing: 2px;
                }

                .texto {
                    text-align: center;
                    font-size: 16px;
                    margin: 20px 60px;
                    line-height: 1.5;
                    color: #333;
                }

                .nome {
                    text-align: center;
                    font-size: 32px;
                    font-weight: 700;
                    margin: 30px 0;
                    border-bottom: 2px solid #ccc;
                    padding-bottom: 5px;
                    display: inline-block;
                    min-width: 60%;
                    margin-left: auto;
                    margin-right: auto;
                    display: block;
                }

                .curso {
                    text-align: center;
                    font-size: 22px;
                    font-weight: 700;
                    margin: 30px 0;
                    color: #000;
                }

                .assinaturas {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 80px;
                }

                .assinaturas div {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .linha {
                    width: 260px;
                    height: 1px;
                    background: #000;
                    margin-bottom: 8px;
                }

                /* VERSO Styles */
                .certificate.verso {
                    border: 8px solid #000;
                    display: flex;
                    flex-direction: column;
                }

                .box {
                    border: 1px solid #000;
                    padding: 15px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 14px;
                }

                .box strong {
                    font-weight: 700;
                }

                .valido {
                    color: #b00000;
                    font-weight: bold;
                    display: block;
                    margin-top: 5px;
                }

                .conteudo {
                    flex-grow: 1;
                    padding: 0 40px;
                }

                .conteudo h3 {
                    color: #b00000;
                    border-bottom: 2px solid #b00000;
                    padding-bottom: 5px;
                    display: inline-block;
                    font-size: 18px;
                    text-transform: uppercase;
                }

                .conteudo ul {
                    margin-top: 15px;
                    padding-left: 20px;
                    columns: 2; /* Split layout if many modules */
                    column-gap: 40px;
                }
                
                .conteudo li {
                    margin-bottom: 5px;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .cnpj {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ccc;
                    text-align: center;
                    font-weight: bold;
                    font-size: 12px;
                }

                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background: none;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        display: block;
                    }
                    .certificate-container {
                        padding: 0;
                        display: block;
                    }
                    .certificate {
                        box-shadow: none;
                        margin: 0;
                        page-break-after: always; /* Force page break after each certificate page */
                    }
                    .certificate:last-child {
                        page-break-after: auto;
                    }
                }
            `}</style>
        </div>
    );
}

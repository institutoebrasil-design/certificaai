'use client';

import { Montserrat, Playfair_Display, Pinyon_Script } from 'next/font/google';
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

const pinyon = Pinyon_Script({
    subsets: ['latin'],
    weight: ['400'],
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

export default function CertificateModern({ userName, courseName, cpf, date, code, duration, modules }: CertificateProps) {
    return (
        <div className={`certificate-container ${montserrat.className}`}>

            {/* --- FRENTE --- */}
            <div className="certificate frente">
                {/* Background Pattern */}
                <div className="watermark">
                    <Image src="/logo-really-final.png" alt="Watermark" width={500} height={500} style={{ opacity: 0.03 }} />
                </div>

                <div className="border-pattern"></div>

                <header className="topo">
                    <div className="logo-central">
                        <div style={{ position: 'relative', width: '250px', height: '90px' }}>
                            <Image src="/logo-really-final.png" alt="IEB Logo" fill style={{ objectFit: 'contain' }} />
                        </div>
                    </div>

                    <div className="logo-direita">
                        <div style={{ position: 'relative', width: '130px', height: '70px' }}>
                            <Image src="/logo-mec.png" alt="MEC Logo" fill style={{ objectFit: 'contain', objectPosition: 'right' }} />
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className={playfair.className}>CERTIFICADO</h1>
                    <div className="gold-line"></div>

                    <p className="texto small">
                        A diretoria do <strong>INSTITUTO EDUCAÇÃO BRASIL</strong>, no uso de suas atribuições, confere a
                    </p>

                    <h2 className={`nome ${pinyon.className}`}>{userName}</h2>

                    <p className="texto">
                        portador(a) do RG/CPF nº <strong>{cpf || '000.000.000-00'}</strong>, o presente certificado por haver concluído<br />
                        o Curso de Qualificação Profissional em:
                    </p>

                    <h3 className="curso">{courseName}</h3>
                    <p className="carga-horaria">{duration || 80} HORAS</p>

                    <p className="texto small">
                        realizado na plataforma online, concluído em <strong>{date}</strong>.
                    </p>
                </div>

                <footer className="assinaturas">
                    <div className="assinatura-block">
                        <div style={{ position: 'relative', width: '180px', height: '80px' }}>
                            <Image src="/signature-augusto-final.png" alt="Augusto Lima" fill style={{ objectFit: 'contain', objectPosition: 'bottom' }} />
                        </div>
                        <div className="linha"></div>
                        <span className="cargo">Augusto Lima<br />Diretor Geral</span>
                    </div>

                    <div className="seal-container">
                        <div className="seal">
                            <div className="seal-inner">
                                <span>MEC</span>
                                <small>Auth</small>
                            </div>
                        </div>
                    </div>

                    <div className="assinatura-block">
                        <div className="linha empty"></div>
                        <span>Aluno(a)</span>
                    </div>
                </footer>
            </div>

            {/* --- VERSO --- */}
            <div className="certificate verso">
                <div className="watermark-verso">
                    <Image src="/logo-really-final.png" alt="Watermark" width={300} height={300} style={{ opacity: 0.03 }} />
                </div>

                <div className="verso-content">
                    <div className="box header-box">
                        <strong>I.E.B INSTITUTO EDUCAÇÃO BRASIL</strong><br />
                        <span className="legal">Criado conforme Lei nº 9.394/96 e Decreto nº 5.154/04</span><br />
                        <span className="valido">✔ Válido em todo território nacional</span>
                    </div>

                    <div className="box info-box">
                        <div className="info-row">
                            <span>Registro nº: <strong>{code ? code.substring(0, 4) : '0000'}</strong></span>
                            <span>Livro: <strong>{code ? code.substring(4, 6) : '00'}</strong></span>
                            <span>Folha: <strong>{code ? code.substring(6, 8) : '00'}</strong></span>
                        </div>
                        <div className="info-date">Emissão: <strong>{date}</strong></div>
                    </div>

                    <div className="conteudo">
                        <h3>Conteúdo Programático</h3>
                        <div className="modules-grid">
                            <ul>
                                {modules && modules.length > 0 ? (
                                    modules.map(m => <li key={m.id}>{m.title}</li>)
                                ) : (
                                    <>
                                        <li>Introdução ao curso</li>
                                        <li>Fundamentos teóricos e Prática</li>
                                        <li>Avaliação de Competências</li>
                                        <li>Projeto Final e Conclusão</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="cnpj">
                        <strong>I.E.B INSTITUTO EDUCAÇÃO BRASIL</strong><br />
                        CNPJ: 32.975.228/0001-93<br />
                        <span className="hash">ID Verificador: {code}</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                body {
                    background: #333; /* Dark background to see the paper effect */
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
                    background: #ffffff; /* White paper */
                    padding: 0; /* Managed by relative elems */
                    box-sizing: border-box;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    flex-shrink: 0;
                    overflow: hidden;
                    color: #1a1a1a;
                }

                /* BACKGROUND & BORDERS */
                .border-pattern {
                    position: absolute;
                    top: 15px; left: 15px; right: 15px; bottom: 15px;
                    border: 2px solid #b49b57; /* Gold border inner */
                    outline: 10px solid #ffffff;
                    box-shadow: inset 0 0 0 4px #1a1a1a, inset 0 0 0 8px #b49b57;
                    z-index: 10;
                    pointer-events: none;
                }
                
                .certificate::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: 
                        radial-gradient(#b49b57 0.5px, transparent 0.5px), 
                        radial-gradient(#b49b57 0.5px, #ffffff 0.5px);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                    opacity: 0.1;
                    z-index: 0;
                }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                    filter: grayscale(100%);
                }
                
                .watermark-verso {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 0;
                }

                /* FRENTE CONTENT */
                .topo {
                    position: relative;
                    z-index: 20;
                    display: flex;
                    justify-content: space-between;
                    padding: 50px 80px 0 80px;
                }

                .content-wrapper {
                    position: relative;
                    z-index: 20;
                    text-align: center;
                    margin-top: 10px;
                }

                h1 {
                    color: #1a1a1a;
                    font-size: 56px;
                    margin: 10px 0 5px 0;
                    font-weight: 700;
                    letter-spacing: 4px;
                }
                
                .gold-line {
                    width: 100px;
                    height: 3px;
                    background: #b49b57;
                    margin: 0 auto 30px auto;
                }

                .texto {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #444;
                    margin: 10px 0;
                }
                .texto.small {
                    font-size: 14px;
                    color: #666;
                }

                .nome {
                    font-size: 58px;
                    color: #b49b57; /* Gold */
                    margin: 20px 0;
                    line-height: 1.2;
                    text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
                }

                .curso {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 10px 0 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .carga-horaria {
                    font-size: 18px;
                    font-weight: 600;
                    color: #666;
                    margin-bottom: 30px;
                }

                .assinaturas {
                    position: relative;
                    z-index: 20;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 0 100px;
                    margin-top: 60px;
                }

                .assinatura-block {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 250px;
                }

                .linha {
                    width: 100%;
                    height: 1px;
                    background: #1a1a1a;
                    margin-bottom: 5px;
                }
                .linha.empty {
                    margin-top: 80px; /* Space for signature if missing */
                }

                .cargo {
                    font-size: 12px;
                    color: #666;
                    font-weight: 600;
                }

                /* SEAL */
                .seal-container {
                    margin-bottom: 20px;
                }
                .seal {
                    width: 100px;
                    height: 100px;
                    background: #b49b57;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    position: relative;
                    border: 4px double #fff;
                }
                 .seal::before {
                    content: "";
                    position: absolute;
                    top: 5px; left: 5px; right: 5px; bottom: 5px;
                    border: 1px dashed #fff;
                    border-radius: 50%;
                }
                .seal-inner {
                    text-align: center;
                    color: #fff;
                    transform: rotate(-5deg);
                }
                .seal-inner span {
                    font-family: serif;
                    font-weight: bold;
                    font-size: 24px;
                    display: block;
                }

                /* VERSO */
                .certificate.verso {
                    background: #fff;
                    padding: 60px;
                    display: flex;
                    flex-direction: column;
                }
                
                .verso-content {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .box {
                    border: 2px solid #e5e7eb;
                    padding: 20px;
                    margin-bottom: 20px;
                    text-align: center;
                    background: #f9fafb;
                }
                .header-box strong { font-size: 18px; color: #1a1a1a; }
                .legal { font-size: 12px; color: #666; }
                .valido { color: #15803d; font-weight: bold; margin-top: 5px; display: block; }
                
                .info-box {
                    display: flex;
                    justify-content: space-between;
                    background: #fff;
                    border: 1px solid #1a1a1a;
                }
                .info-row span { margin-right: 20px; }
                
                .conteudo {
                    flex-grow: 1;
                    margin: 20px 0;
                }
                .conteudo h3 {
                    border-bottom: 3px solid #b49b57;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    color: #1a1a1a;
                }
                .modules-grid ul {
                    columns: 2;
                    column-gap: 60px;
                    list-style-position: inside;
                }
                .modules-grid li {
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .cnpj {
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                    font-size: 12px;
                    color: #666;
                }
                .hash {
                    font-family: monospace;
                    background: #f3f4f6;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                @media print {
                    @page { size: landscape; margin: 0; }
                    body { background: none; }
                    .certificate { box-shadow: none; margin: 0; page-break-after: always; }
                    .certificate-container { padding: 0; }
                }
            `}</style>
        </div>
    );
}

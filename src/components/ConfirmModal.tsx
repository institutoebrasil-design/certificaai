'use client';

import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, description, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

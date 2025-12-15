'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Award, Plus, Heart } from 'lucide-react';
import Link from 'next/link';
import { addCourse } from '../actions/addCourse';
import styles from './dashboard.module.css';

interface Course {
    id: string;
    title: string;
    description: string | null;
    duration: number;
}

export default function DashboardClient({ initialCourses }: { initialCourses: Course[] }) {
    const [courses, setCourses] = useState(initialCourses);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCert, setNewCert] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('favorites');
        if (saved) setFavorites(JSON.parse(saved));
        setMounted(true);
    }, []);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let newFavs;
        if (favorites.includes(id)) {
            newFavs = favorites.filter(f => f !== id);
        } else {
            newFavs = [...favorites, id];
        }
        setFavorites(newFavs);
        localStorage.setItem('favorites', JSON.stringify(newFavs));
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const favoriteCourses = courses.filter(course => favorites.includes(course.id));

    const handleAddCert = async () => {
        if (!newCert.trim()) return;

        // Optimistic update
        const tempId = Math.random().toString();
        const newCourse: Course = {
            id: tempId,
            title: newCert,
            description: `Certificação profissional em ${newCert}.`,
            duration: 60
        };

        setCourses([...courses, newCourse]);
        setNewCert('');

        // Server action
        const formData = new FormData();
        formData.append('title', newCert);
        await addCourse(formData);
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className={styles.content}>
            <div className={styles.controlsRow}>
                <div className={styles.addSection}>
                    <input
                        type="text"
                        placeholder="Incluir nova certificação..."
                        className={styles.addInput}
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                    />
                    <button className={styles.addButton} onClick={handleAddCert}>
                        <Plus size={40} /> Incluir
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar certificação..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className={styles.spacer}></div>
                </div>
            </div>

            {favoriteCourses.length > 0 && (
                <section className={styles.favoritesSection}>
                    <h2 className={styles.sectionTitle}> <Heart className={styles.heartIcon} size={24} fill="#ef4444" color="#ef4444" /> Favoritos</h2>
                    <div className={styles.grid}>
                        {favoriteCourses.map((course) => (
                            <CourseCard key={course.id} course={course} isFav={true} onToggleFav={toggleFavorite} />
                        ))}
                    </div>
                </section>
            )}

            <h2 className={styles.sectionTitle}>Todas as Certificações ({filteredCourses.length})</h2>

            <div className={styles.grid}>
                {filteredCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        isFav={favorites.includes(course.id)}
                        onToggleFav={toggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
}

function CourseCard({ course, isFav, onToggleFav }: { course: Course, isFav: boolean, onToggleFav: (id: string, e: any) => void }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    <BookOpen color="white" size={24} />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h3 className={styles.cardTitle}>{course.title}</h3>
                </div>
                <button className={styles.favButton} onClick={(e) => onToggleFav(course.id, e)}>
                    <Heart size={20} fill={isFav ? "#ef4444" : "none"} color={isFav ? "#ef4444" : "#94a3b8"} />
                </button>
            </div>

            <p className={styles.cardDescription}>
                {course.description || `Certificação profissional em ${course.title}.`}
            </p>

            <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                    <Clock size={16} /> {course.duration}h
                </span>
                <span className={styles.metaItem}>
                    <Award size={16} /> Certificado
                </span>
            </div>

            <Link href={`/exam/${course.id}`} className={styles.cardButton}>
                Iniciar Prova
            </Link>
        </div>
    );
}

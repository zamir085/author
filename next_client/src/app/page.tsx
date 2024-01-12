/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { getAllAutors } from '@/api_url';
import { Carousel } from 'antd';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type Author = {
  _id: string;
  fullName: string;
  birthYear: number;
  bio: string;
  imgURL: string;
  genre: string;
  gender: string;
  isDead: boolean;
};

const Home: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllAutors();
        setAuthors(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (index: number) => {
    console.log('Mouse enter on slide:', index);
  };
  const onChange = (currentSlide: number) => {
    console.log('Slide changed to:', currentSlide);
  };

  return (
    <Carousel afterChange={onChange} autoplay waitForAnimate autoplaySpeed={2000}>
      {authors.map((author: Author, index: number) => (
        <div key={author._id} className={styles.carouselItem} onMouseEnter={() => handleMouseEnter(index)}>
          <img src={author.imgURL} alt={author.fullName} className={styles.carouselImage} />
          <div style={{ cursor: 'pointer', fontSize: '48px' }} onClick={() => router.push(`/autors/${author._id}`)} className={styles.authorTitle}>{author.fullName}</div>
        </div>
      ))}
    </Carousel>
  );
};

export default Home;

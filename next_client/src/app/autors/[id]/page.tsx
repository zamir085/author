/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAutor, getBooksByAuthor } from '@/api_url';
import { Button, Table, Space } from 'antd';

type Autor = {
  _id: string;
  fullName: string;
  birthYear: number;
  bio: string;
  imgURL: string;
  genre: string;
  gender: string;
  isDead: boolean;
};

type Book = {
  _id: string;
  authorId: string;
  coverImg: string;
  name: string;
  year: number;
  genre: string;
  desc: string;
  bookFile: string;
};

type Params = {
  id: string;
};

interface AutorDetailsProps {
  params: Params;
}

const AutorDetails: React.FC<AutorDetailsProps> = ({ params }) => {
  const router = useRouter();
  const [autor, setAutor] = useState<Autor | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
        if (id && typeof id === 'string') {
          const [autorResponse, booksResponse] = await Promise.all([getAutor(id), getBooksByAuthor(id)]);
          setAutor(autorResponse);
          setBooks(booksResponse);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params, router]);

  if (!autor) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: 'Book Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Download',
      key: 'download',
      render: (text: any, record: Book) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleDownload(record)}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  const handleDownload = async (book: Book) => {
    try {
      const response = await fetch(book.bookFile);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.download = book.name;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };
  

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Autor Details</h1>
      <Button style={{ margin: '10px 40px' }} onClick={() => router.push('/')} type="primary">
        Home
      </Button>
      <div style={{ display: 'flex', gap: '40px', margin: '0 40px' }}>
        <img
          alt={autor.fullName}
          src={autor.imgURL}
          style={{ width: '300px', height: '400px', objectFit: 'cover' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <p>{`Full Name: ${autor.fullName}`}</p>
          <p>{`Genre: ${autor.genre}`}</p>
          <p>{`Gender: ${autor.gender}`}</p>
          <p>{`Age: ${new Date().getFullYear() - autor.birthYear}`}</p>
          <p>{`Bio: ${autor.bio}`}</p>
          <Button
            type="primary"
            style={{ backgroundColor: 'green' }}
            onClick={() => router.push(`/autors/${autor._id}/edit`)}
          >
            Edit
          </Button>
          <Button type="primary" onClick={() => router.push(`/autors/${autor._id}/book`)}>
            Add Book
          </Button>
        </div>
      </div>
      <div style={{ margin: '20px 40px' }}>
        <h2>Books by {autor.fullName}</h2>
        {books.length > 0 ? (
          <Table dataSource={books} columns={columns} />
        ) : (
          <p>No books available for this author.</p>
        )}
      </div>
    </div>
  );
};

export default AutorDetails;

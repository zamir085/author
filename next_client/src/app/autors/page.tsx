/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import { deleteAutor, getAllAutors } from '@/api_url';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


const { Meta } = Card;
const { Text } = Typography;

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

const Autors: React.FC = () => {
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

    const deleteAuthor = async (id: string) => {
        try {
            await deleteAutor(id);
            const updatedAuthors = await getAllAutors();
            setAuthors(updatedAuthors);
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    };

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAuthor(id);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    };



    console.log(authors)

    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Authors</h1>
            <Row gutter={[16, 16]} style={{ margin: '20px 40px' }}>
                {authors.map((author) => (
                    <Col key={author._id} xs={24} sm={12} md={6} lg={6} xl={6}>
                        <Card style={{ width: '100%' }}>
                            <img alt={author.fullName} src={author.imgURL} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '20px' }} />

                            <div style={{ marginBottom: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }} onClick={() => router.push(`/autors/${author._id}`)} >{author.fullName} </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Text>{`Genre: ${author.genre}`}</Text>
                                <Text>{`Gender: ${author.gender}`}</Text>
                                <Text>{`Age: ${new Date().getFullYear() - author.birthYear}`}</Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                                <Button onClick={() => handleDelete(author._id)} type="primary" danger>Delete</Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Autors;

/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAutor } from '@/api_url';
import { Button } from 'antd';

type Autor = {
  _id: string;
  fullName: string;
  birthYear: number;
  bio: string;
  imgURL: string;
  genre: string;
  gender: string;
  isDead:boolean;
};

type Params = {
  id:string
}
interface AutorDetailsProps {
  params: Params;
}

const AutorDetails: React.FC<AutorDetailsProps> = ({ params }) => {
  const router = useRouter();
  const [autor, setAutor] = useState<Autor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params 
        if (id && typeof id === 'string') {
          const response = await getAutor(id);
          setAutor(response);
        } else {
          router.push('/'); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params,router])

  if (!autor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{textAlign:'center',margin:'20px 0'}}>Autor Details</h1>
      <Button style={{margin:'10px 40px'}} onClick={()=>router.push('/')} type='primary'>Home</Button>
      <div style={{display:'flex',gap:'40px',margin:'0 40px'}}>
        <img alt={autor.fullName} src={autor.imgURL} style={{ width: '300px', height: '400px', objectFit: 'cover' }} />
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px'}}>
        <p>{`Full Name: ${autor.fullName}`}</p>
        <p>{`Genre: ${autor.genre}`}</p>
        <p>{`Gender: ${autor.gender}`}</p>
        <p>{`Age: ${new Date().getFullYear() - autor.birthYear}`}</p>
        <p>{`Bio: ${autor.bio}`}</p>
        <Button type='primary' style={{backgroundColor:'green'}}  onClick={() => router.push(`/autors/${autor._id}/edit`)}>Edit</Button>
        <Button type='primary' onClick={() => router.push(`/autors/${autor._id}/book`)}>Add Book</Button>
        </div>
      </div>
    </div>
  );
};

export default AutorDetails;

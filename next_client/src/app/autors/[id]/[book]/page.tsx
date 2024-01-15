/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { getAutor, postBook } from '@/api_url';
import { Button, Col, Input, Row, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface AddBookFormValues {
  name: string;
  year: number;
  genre: string;
  desc: string;
  coverImg: File | null;
  bookFile: File | null;
}

interface AutorDetailsProps {
  params: {
    id: string;
  };
}

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

const AddBook: React.FC<AutorDetailsProps> = ({ params }) => {
  const [autor, setAutor] = useState<Autor | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
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
  }, [params, router]);

  const handleSubmit = async (values: AddBookFormValues, formikHelpers: any) => {
    const { setSubmitting } = formikHelpers;

    try {
      const formData = new FormData();
      formData.append('authorId', autor?._id || '');
      formData.append('name', values.name);
      formData.append('year', String(values.year));
      formData.append('genre', values.genre);
      formData.append('desc', values.desc);
      formData.append('coverImg', values.coverImg!);
      formData.append('bookFile', values.bookFile!);

      await postBook(formData);
      router.push(`/autors/${autor?._id}`);
      message.success('Book added successfully');
    } catch (error) {
      console.error('Error adding book:', error);
      message.error('Error adding book');
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<AddBookFormValues>({
    initialValues: {
      name: '',
      year: 0,
      genre: '',
      desc: '',
      coverImg: null,
      bookFile: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      year: Yup.number().required('Year is required').integer('Year must be an integer'),
      genre: Yup.string().required('Genre is required'),
      desc: Yup.string().required('Description is required'),
      coverImg: Yup.mixed().required('Cover Image is required'),
      bookFile: Yup.mixed().required('Book File is required'),
    }),
    onSubmit: handleSubmit,
  });

  const handleCoverImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      formik.setFieldValue('coverImg', selectedFile);
    }
  };

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      formik.setFieldValue('bookFile', selectedFile);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '20px 0', textAlign: 'center' }}>Add Book</h2>
      <Row justify="center" align="middle">
      <Col span={8}>
      <form onSubmit={formik.handleSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
        <div>
          <label htmlFor="name">Name:</label>
          <Input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} />
          {formik.errors.name && <div>{formik.errors.name}</div>}
        </div>

        <div>
          <label htmlFor="year">Year:</label>
          <Input type="number" name="year" onChange={formik.handleChange} value={formik.values.year} />
          {formik.errors.year && <div>{formik.errors.year}</div>}
        </div>

        <div>
          <label htmlFor="genre">Genre:</label>
          <Input type="text" name="genre" onChange={formik.handleChange} value={formik.values.genre} />
          {formik.errors.genre && <div>{formik.errors.genre}</div>}
        </div>

        <div>
          <label htmlFor="desc">Description:</label>
          <TextArea name="desc" onChange={formik.handleChange} value={formik.values.desc} />
          {formik.errors.desc && <div>{formik.errors.desc}</div>}
        </div>

        <div>
          <label htmlFor="coverImg">Cover Image:</label>
          <Input type="file" accept="image/*" name="coverImg" onChange={handleCoverImgChange} />
          {formik.errors.coverImg && <div>{formik.errors.coverImg}</div>}
        </div>

        <div>
          <label htmlFor="bookFile">Book File (PDF):</label>
          <Input type="file" accept=".pdf" name="bookFile" onChange={handleBookFileChange} />
          {formik.errors.bookFile && <div>{formik.errors.bookFile}</div>}
        </div>

        <div>
          <Button type="primary" htmlType="submit" disabled={formik.isSubmitting}>
            Add Book
          </Button>
        </div>
      </form>
      </Col>
     </Row>
    </div>
  );
};

export default AddBook;
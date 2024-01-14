/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { getAutor, postBook } from '@/api_url';

interface AddBookFormValues {
  name: string;
  year: number;
  genre: string;
  desc: string;
  coverImg: File | null;
  bookFile: File | null;
}

const AddBookSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  year: Yup.number().required('Required'),
  genre: Yup.string().required('Required'),
  desc: Yup.string().required('Required'),
  coverImg: Yup.mixed()
  .required('Required')
  .test('fileFormat', 'Invalid file format', function (value) {
    if (value && typeof value === 'object' && 'type' in value) {
      const fileType = value as { type: string };
      return ['image/jpeg', 'image/png', 'image/gif'].includes(fileType.type);
    }
    return true;
  }),
bookFile: Yup.mixed()
  .required('Required')
  .test('fileFormat', 'Invalid file format', function (value) {
    if (value && typeof value === 'object' && 'type' in value) {
      const fileType = value as { type: string };
      return fileType.type === 'application/pdf';
    }
    return true;
  }),
});

type Params = {
  id:string
}
interface AutorDetailsProps {
  params: Params;
}
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

const AddBook: React.FC<AutorDetailsProps> = ({ params }) => {
  const [autor, setAutor] = useState<Autor | null>(null);
  const router = useRouter();

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

  const formik = useFormik<AddBookFormValues>({
    initialValues: {
      name: '',
      year: 0,
      genre: '',
      desc: '',
      coverImg: null,
      bookFile: null,
    },
    validationSchema: AddBookSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append('authorId', autor?._id || '');
        formData.append('name', values.name);
        formData.append('year', String(values.year));
        formData.append('genre', values.genre);
        formData.append('desc', values.desc);
        formData.append('coverImg', values.coverImg!);
        formData.append('bookFile', values.bookFile!);

        await postBook({
          authorId: autor?._id || '',
          name: values.name,
          year: values.year,
          genre: values.genre,
          desc: values.desc,
          coverImg: values.coverImg!,
          bookFile: values.bookFile!,
        });
        router.push(`/autors/${autor?._id}`); 
      } catch (error) {
        console.error('Error adding book:', error);
      } finally {
        setSubmitting(false);
      }
    },
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
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} />
          {formik.errors.name && formik.touched.name && <div>{formik.errors.name}</div>}
        </div>

        <div>
          <label>Year:</label>
          <input type="number" name="year" onChange={formik.handleChange} value={formik.values.year} />
          {formik.errors.year && formik.touched.year && <div>{formik.errors.year}</div>}
        </div>

        <div>
          <label>Genre:</label>
          <input type="text" name="genre" onChange={formik.handleChange} value={formik.values.genre} />
          {formik.errors.genre && formik.touched.genre && <div>{formik.errors.genre}</div>}
        </div>

        <div>
          <label>Description:</label>
          <textarea name="desc" onChange={formik.handleChange} value={formik.values.desc} />
          {formik.errors.desc && formik.touched.desc && <div>{formik.errors.desc}</div>}
        </div>

        <div>
          <label>Cover Image:</label>
          <input type="file" accept="image/*" name="coverImg" onChange={handleCoverImgChange} />
          {formik.errors.coverImg && formik.touched.coverImg && <div>{formik.errors.coverImg}</div>}
        </div>

        <div>
          <label>Book File (PDF):</label>
          <input type="file" accept=".pdf" name="bookFile" onChange={handleBookFileChange} />
          {formik.errors.bookFile && formik.touched.bookFile && <div>{formik.errors.bookFile}</div>}
        </div>

        <div>
          <button type="submit" disabled={formik.isSubmitting}>
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
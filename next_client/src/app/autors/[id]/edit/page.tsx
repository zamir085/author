'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAutor, updateAutor } from '@/api_url';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import { Input, Checkbox, Select, Button, message, Row, Col } from 'antd';
import * as Yup from 'yup';

const { Option } = Select;

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

type Params = {
  id: string;
};

interface AutorDetailsProps {
  params: Params;
}

const Edit: React.FC<AutorDetailsProps> = ({ params }) => {
  const router = useRouter();
  const [autor, setAutor] = useState<Autor | null>(null);

  const isFile = (value: any): value is File => {
    return value instanceof File;
  };

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

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    birthYear: Yup.number().required('Birth Year is required').positive('Birth Year must be a positive number'),
    bio: Yup.string().required('Bio is required'),
    genre: Yup.string().required('Genre is required'),
    isDead: Yup.boolean(),
    imgURL: Yup.string().required('Image URL is required'),
  });

  const handleSubmit = async (values: Autor & { imgURL: File | string }, { setSubmitting, setFieldValue }: FormikHelpers<Autor>) => {
    try {
      const { _id, ...updatedData } = values;
  
      if (isFile(values.imgURL)) {
        const formData = new FormData();
        formData.append('fullName', updatedData.fullName);
        formData.append('birthYear', String(updatedData.birthYear));
        formData.append('bio', updatedData.bio);
        formData.append('genre', updatedData.genre);
        formData.append('isDead', String(updatedData.isDead));
  
        formData.append('imgFile', values.imgURL);
  
        await updateAutor(_id, updatedData);
      } else {
        await updateAutor(_id, updatedData);
      }
  
      router.push('..');
    message.success('Author updated successfully');
  } catch (error) {
    console.error('Error updating author:', error);
    message.error('Error updating author');
  } finally {
    setSubmitting(false);
  };
  };
  
  

  if (!autor) {
    return <div>Loading...</div>;
  }

  function setFieldValue(arg0: string, selectedFile: File) {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      <h2 style={{ margin: '20px 0', textAlign: 'center' }}>Edit Author</h2>
      <Formik
        initialValues={autor}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
         <Row justify="center" align="middle">
              <Col span={8}>
        <Form>
          <div style={{ marginBottom: '16px' }}>
            <label>Full Name:</label>
            <Field name="fullName" as={Input} />
            <ErrorMessage name="fullName" component="div" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Birth Year:</label>
            <Field name="birthYear" type="number" as={Input} />
            <ErrorMessage name="birthYear" component="div" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Bio:</label>
            <Field name="bio" as="textarea" style={{ width: '100%' }} />
            <ErrorMessage name="bio" component="div" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Genre:</label>
            <Field name="genre" as={Input} style={{ width: '100%' }}>
             
            </Field>
            <ErrorMessage name="genre" component="div" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Is Dead:</label>
            <Field name="isDead" type="checkbox" as={Checkbox} />
          </div>

          {/* <div style={{ marginBottom: '16px' }}>
            <label>Image:</label>
            <input
              type="file"
              name="imgURL"
              id="imgURL"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.currentTarget.files?.[0];
                if (selectedFile) {
                  setFieldValue('imgURL', selectedFile);
                }
              }}
            />
            <ErrorMessage name="imgURL" component="div" />
          </div> */}

          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" htmlType="submit">
              Update Author
            </Button>
          </div>
        </Form>
        </Col>
        </Row>

      </Formik>
    </div>
  );
};

export default Edit;

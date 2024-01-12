/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Input, Checkbox, Select, Button, message, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import { postAutor } from '@/api_url';
import { FormikHelpers } from 'formik';
import { useFormik } from 'formik';

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
  __v: number;
};

const initialValues: Autor = {
  _id: '',
  fullName: '',
  birthYear: 0,
  bio: '',
  isDead: false,
  genre: '',
  gender: 'male',
  imgURL: '',
  __v: 0,
};

const Add = () => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (values: Autor, { setSubmitting }: FormikHelpers<Autor>) => {
    try {
      if (!file) {
        message.error('Please upload an image');
        return;
      }

      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('birthYear', String(values.birthYear));
      formData.append('bio', values.bio);
      formData.append('isDead', String(values.isDead));
      formData.append('gender', values.gender);
      formData.append('genre', values.genre);
      formData.append('imgFile', file);

      await postAutor(formData);
      router.push('/autors');
      message.success('Author added successfully');
    } catch (error) {
      console.error('Error adding author:', error);
      message.error('Error adding author');
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imgUrl = URL.createObjectURL(selectedFile);
      formik.setFieldValue('imgURL', imgUrl);
    }
  };


  return (
    <div>
      <h2 style={{margin:'20px 0',textAlign:'center'}}>Add Author</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
  {({ setFieldValue }) => (
    <Form>
      <Row justify="center" align="middle">
        <Col span={8}>
          <div style={{ marginBottom: '16px' }}>
            <label>Full Name:</label>
            <Field name="fullName" as={Input} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Birth Year:</label>
            <Field name="birthYear" type="number" as={Input} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Genre:</label>
            <Field name="genre" as={Input} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Bio:</label>
            <Field name="bio" as="textarea" style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Is Dead:</label>
            <Field name="isDead" type="checkbox" as={Checkbox} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Gender:</label>
            <Field name="gender" as={Select} style={{ width: '100%' }}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Field>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Image URL:</label>
            <input
              type="file"
              name="imgURL"
              id="imgURL"
              accept="image/*"
              onChange={handleFileChange}
            />
            {file && <img src={URL.createObjectURL(file)} alt="Preview" style={{ marginTop: '10px', maxWidth: '100%' }} />}
            <ErrorMessage name="imgURL" component="div" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" htmlType="submit">
              Add Author
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  )}
</Formik>
    </div>
  );
};

export default Add;



import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api';

interface AutorType {
  _id: string;
  fullName: string;
  birthYear: number;
  bio: string;
  imgURL: string;
  genre: string;
  gender: string;
  isDead: boolean;
  __v: number;
}

interface BookType {
  _id: string;
  authorId: string;
  coverImg: string;
  name: string;
  year: number;
  genre: string;
  desc: string;
  bookFile: string;
  __v: number;
}

export const getAllAutors = async (): Promise<AutorType[]> => {
  try {
    const response = await axios.get<AutorType[]>(`${API_URL}/autors`);
    return response.data;
  } catch (error) {
    throw new Error('Yazicilar tapilmadi.');
  }
};

export const getAutor = async (autorId: string): Promise<AutorType> => {
  try {
    const response = await axios.get<AutorType>(`${API_URL}/autors/${autorId}`);
    return response.data;
  } catch (error) {
    throw new Error('Yazici tapilmadi.');
  }
};

export const postAutor = async (formData: FormData): Promise<AutorType> => {
  try {
    const response: AxiosResponse<AutorType> = await axios.post(`${API_URL}/autors`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && 'message' in error.response.data) {
        throw new Error(`Server responded with error: ${error.response.data.message}`);
      }
    }
    throw new Error('Yazici əlavə edilmədi.');
  }
};


export const updateAutor = async (autorId: string, updatedAuthorData: Partial<AutorType>): Promise<AutorType> => {
  try {
    const response = await axios.patch<AutorType>(`${API_URL}/autors/${autorId}`, updatedAuthorData);
    return response.data;
  } catch (error) {
    throw new Error('Yazici yenilənmədi.');
  }
};


export const deleteAutor = async (autorId: string): Promise<void> => {
  try {
    const response = await axios.delete<void>(`${API_URL}/autors/${autorId}`);
    return response.data;
  } catch (error) {
    throw new Error('Yazici silinmədi.');
  }
};



export const getAllBooks = async (): Promise<BookType[]> => {
  try {
    const response = await axios.get<BookType[]>(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    throw new Error('Kitablar tapilmadi.');
  }
};

export const getBook = async (bookId: string): Promise<BookType> => {
  try {
    const response = await axios.get<BookType>(`${API_URL}/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw new Error('Kitab tapilmadi.');
  }
};

export const getBooksByAuthor = async (authorId: string): Promise<BookType[]> => {
  try {
    const response = await axios.get<BookType[]>(`${API_URL}/books/author/${authorId}`);
    return response.data;
  } catch (error) {
    throw new Error('Yaziciya uygun kitablar tapilmadi.');
  }
};

export const postBook = async (formData: FormData): Promise<BookType> => {
  try {
      const response: AxiosResponse<BookType> = await axios.post(`${API_URL}/books`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && 'message' in error.response.data) {
        throw new Error(`Server responded with error: ${error.response.data.message}`);
      }
    }
    throw new Error('Kitab əlavə edilmədi.');
  }
};

export const updateBook = async (bookId: string, updatedBookData: Partial<BookType>): Promise<BookType> => {
  try {
    const response = await axios.patch<BookType>(`${API_URL}/books/${bookId}`, updatedBookData);
    return response.data;
  } catch (error) {
    throw new Error('Kitab yenilənmədi.');
  }
};

export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const response = await axios.delete<void>(`${API_URL}/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw new Error('Kitab silinmədi.');
  }
};



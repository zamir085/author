import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api/autors';

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

export const getAllAutors = async (): Promise<AutorType[]> => {
  try {
    const response = await axios.get<AutorType[]>(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Yazicilar tapilmadi.');
  }
};

export const getAutor = async (autorId: string): Promise<AutorType> => {
  try {
    const response = await axios.get<AutorType>(`${API_URL}/${autorId}`);
    return response.data;
  } catch (error) {
    throw new Error('Yazici tapilmadi.');
  }
};

export const postAutor = async (formData: FormData): Promise<AutorType> => {
  try {
    const response: AxiosResponse<AutorType> = await axios.post(API_URL, formData, {
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


export const updateAutor = async (autorId: string, updatedNewsData: Partial<AutorType>): Promise<AutorType> => {
  try {
    const response = await axios.patch<AutorType>(`${API_URL}/${autorId}`, updatedNewsData);
    return response.data;
  } catch (error) {
    throw new Error('Yazici yenilənmədi.');
  }
};

export const deleteAutor = async (autorId: string): Promise<void> => {
  try {
    const response = await axios.delete<void>(`${API_URL}/${autorId}`);
    return response.data;
  } catch (error) {
    throw new Error('Yazici silinmədi.');
  }
};
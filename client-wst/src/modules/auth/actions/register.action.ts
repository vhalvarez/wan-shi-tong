
import { wstApi } from '@/api/wstApi';
import type { AuthResponse, User } from '../interfaces';

interface RegisterError {
  ok: false;
  message: string;
}

interface RegisterSuccess {
  ok: true;
  user: User;
  token: string;
}

export const registerAction = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterError | RegisterSuccess> => {
  try {
    const { data } = await wstApi.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};
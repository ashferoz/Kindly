export interface DelRequestBody {
    uuid: number;
}

export interface AddNewUserBody {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    bio?: string,
    role: string,
}

export interface UpdateUserBody {
    uuid: string,
    first_name?: string,
    last_name?: string,
    username?: string,
    email?: string,
    password?: string,
    bio?: string,
}

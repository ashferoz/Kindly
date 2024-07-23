export interface DelRequestBody {
    uuid: number;
}

export interface AddNewUserBody {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    hashed_password: string,
    bio?: string,
    location_id?: string,
    role_id: string,
}

export interface UpdateUserBody {
    uuid: string,
    firstname?: string,
    lastname?: string,
    username?: string,
    email?: string,
    hashed_password?: string,
    bio?: string,
    location_id?: string,
}
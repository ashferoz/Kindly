export interface GetMessagesByIdParams {
    connection_id: number
}

export interface DelMessageByIdParams {
    id: number
}

export interface AddMessageToConnectionIdBody {
    content: string,
    volunteer_uuid: string,
    beneficiary_uuid: string,
    connection_id: number
}
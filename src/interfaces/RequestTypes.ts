export interface AddRequestBody {
  beneficiary_uuid: string;
  title: string;
  details: string;
  category: string;
  urgency: string;
  location: string;
}

export interface GetRequestBody {
  beneficiary_uuid: string;
}

export interface DelRequestParams {
  request_id: string;
}

export interface UpdateRequestBody {
  title?: string;
  details?: string;
  category?: string;
  urgency?: string;
  location?: string;
 status?: string;
}

export interface UpdateRequestParams {
  request_id: string;
}

export interface ConnectToRequestBody {
  volunteer_uuid: string;
}

export interface ConnectToRequestParams {
  connect_request_id: string;
}

import axios, { AxiosResponse } from "axios";

axios.defaults.withCredentials = true;

interface User {
	id: number;
	name: string;
	loginName: string;
	profileName: string;
	profileImage: string;
  }

interface CheckResponse {
	exists: boolean;
	user?: User;	// ?: Optional (it may not exists)
}

export const checkIfUserExistsInDB = async (loginName: string | undefined): Promise<CheckResponse> => {
	console.log("................ CheckifUserExistsinDB: arg: loginName", loginName);
	try {
		const response:AxiosResponse< CheckResponse > = await axios.get< CheckResponse >("http://localhost:3001/manage_curr_user_data/check_if_user_in_db", {
			params: {
				loginName: loginName
			}
		});
		console.log("................ CheckifUserExistsinDB: response: ", response);
		console.log("................ CheckifUserExistsinDB: response.data: ", response.data);
		return response.data;
	} catch (error) {
		console.error("Check: Error checking if user exists in DB", error);
    	throw error;
	}
}
 
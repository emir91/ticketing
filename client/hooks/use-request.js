import { useState } from "react";
import axios from "axios";

const useRequest = ({url, method, body}) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async () => {
        try {
            setErrors([])
            const response = await axios[method](url, body)
            return response.data

        } catch (error) {
            setErrors(error.response.data.errors)
        }
    }
    return {doRequest, errors}
}

export default useRequest

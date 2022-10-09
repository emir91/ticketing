import { useState } from "react"
import axios from "axios"

const SignupForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if(errors.length >= 1) {
                setErrors([])
            }
            const response = await axios.post("/api/users/signup", { email, password} )
            console.log('form submitted!', response.data);

        } catch (error) {
            setErrors(error.response.data.errors)
            console.log('Error', error.response.data.errors);        
        }
    }
    

    return (
        <form onSubmit={submitHandler}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" onChange={e => setEmail(e.target.value)}/>
                <p className="text-danger">
                    {(errors.some(e => e.field === 'email') || !errors[0]?.hasOwnProperty('field')) && errors[0]?.message}
                </p>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                <p className="text-danger">
                    {
                     ((errors.some(e => e.field === 'password') && errors.length > 1) && errors[1].message) || 
                     (((errors.some(e => e.field === 'password') && errors.length === 1) && errors[0].message))
                    }
                </p>
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignupForm
import { useState } from "react"
import Router from "next/router"
import useRequest from "../../hooks/use-request"

const SignupForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {doRequest, errors} = useRequest({
        url: "/api/users/signin", 
        method: 'post', 
        body: {email, password},
        onSuccess: () => Router.push('/')
    })

    const submitHandler =  async (e) => {
        e.preventDefault()
        await doRequest()
    }
    
    return (
        <form onSubmit={submitHandler}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" onChange={e => setEmail(e.target.value)}/>
                <p className="text-danger">
                    {
                      (errors?.some(e => e.field === 'email') || 
                      (errors?.length > 0 && !errors[0]?.hasOwnProperty('field'))) && 
                      errors[0]?.message
                    }
                </p>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
                <p className="text-danger">
                    {
                     ((errors?.some(e => e.field === 'password') && errors.length > 1) && errors[1].message) || 
                     (((errors?.some(e => e.field === 'password') && errors.length === 1) && errors[0].message))
                    }
                </p>
            </div>
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
}

export default SignupForm

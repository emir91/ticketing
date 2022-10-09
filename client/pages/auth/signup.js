import { useState } from "react"

const SignupForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = e => {
        e.preventDefault()

        console.log('form submitted!', {
           email, password 
        });
    }

    return (
        <form onSubmit={submitHandler}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignupForm
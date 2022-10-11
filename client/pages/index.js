import buildCient from "../api/build-client"

const Home = () => {
    return (
        <h1>Home Page</h1>
    )
}

Home.getInitialProps = async (context) => {
    const client = buildCient(context)
    const { data } = await client .get('/api/users/currentuser')

   return data
}

export default Home 

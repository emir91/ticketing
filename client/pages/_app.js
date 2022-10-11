import 'bootstrap/dist/css/bootstrap.css'
import buildCient from '../api/build-client'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <h1>Header {currentUser?.email}</h1>
            <Component {...pageProps}/>
        </div>
    )
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildCient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser')

    let pageProps = {}
    
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    return {
        pageProps,
        ...data
    }
}

export default AppComponent
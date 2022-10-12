import 'bootstrap/dist/css/bootstrap.css'
import buildCient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
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
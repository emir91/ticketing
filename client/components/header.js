import Link from 'next/link'

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && {label: 'Sign up', href: '/auth/signup'},
        !currentUser && {label: 'Sign in', href: '/auth/signin'},
        currentUser && {label: 'Sign out', href: '/auth/signout'}
    ]
    .filter((link) => link)
    .map(({ label, href }) => {
        return (
            <li key={href} className='nav-item'>
                <Link href={href}>
                    <a className='nav-link'>{label}</a>
                </Link>
            </li>
        )
    })

    return (
        <nav className='navbar navbar-light bg-light'>
            <Link href='/'>
                <a className='navbar-brand'>BuyTicket</a>
            </Link>
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    )
}

export default Header
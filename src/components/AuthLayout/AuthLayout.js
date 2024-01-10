import "./auth-layout.scss"
import Header from "../Header/Header"

function AuthLayout({ socket, children }) {
    return <div id="auth-layout">

        <Header socket={socket}/>
        <main id="auth-main">
            {children}
        </main>

    </div>
}

export default AuthLayout
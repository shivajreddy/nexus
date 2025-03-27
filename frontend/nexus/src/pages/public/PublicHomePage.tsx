import { Link } from "react-router-dom";
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";
import '@assets/pages/public/PublicHomePage.css'
import HeaderLogo from "@pages/public/HeaderLogo.tsx";


function PublicHomePage() {
    return (
        <BaseThemeContainer>
            <div id="public-home-page">

                <div id="public-nav-top-container"
                    className="
                     sticky top-0
                     backdrop-filter backdrop-blur-lg bg-opacity-30 border-b"
                >
                    <nav id="public-nav-top"
                        className="justify-between items-center mx-auto w-3/5 h-14">
                        <div className="flex items-center">
                            <Link to="/" className="justify-self-end">Nexus</Link>
                        </div>
                        <div className="flex items-center">
                            {/* <Link to="/updates">Updates</Link> */}
                            <Link to="/user">Account</Link>
                        </div>
                    </nav>
                </div>

                <main id="public-home-page-body">

                    <HeaderLogo />

                    <section className="section py-6">
                        <p className="text-3xl font-mono py-2">Active Features</p>
                        <ul>
                            <li>EPC</li>
                            <li>FOSC</li>
                            <li>Sales COR</li>
                        </ul>
                    </section>
                    <section className="section py-6">
                        <p className="text-3xl font-mono py-2">Under Development</p>
                        <ul>
                            <li>Pre-Con Dashboard</li>
                        </ul>
                    </section>

                    <section className="section py-6">
                        <p className="text-3xl font-mono py-2">Future Plans</p>
                        <ul>
                            <li>User Persistant Page Views</li>
                            <li>Real time live updates</li>
                            <li>Tasks</li>
                        </ul>
                    </section>
                </main>

            </div>
        </BaseThemeContainer>
    )
}


export default PublicHomePage

